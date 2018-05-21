import { Injectable, NgZone } from '@angular/core';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/mergeMap';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { ApiService } from './api.service';
import { CipherProvider } from './cipher.provider';
import { Address, Output, Transaction, TransactionInput, TransactionOutput,
  Wallet, TotalBalance, GetOutputsRequestOutput, Balance } from '../app.datatypes';

@Injectable()
export class WalletService {
  wallets: BehaviorSubject<Wallet[]> = new BehaviorSubject<Wallet[]>([]);
  addressesTemp: Address[];
  timeSinceLastBalancesUpdate: BehaviorSubject<number> = new BehaviorSubject<number>(null);
  totalBalance: BehaviorSubject<TotalBalance> = new BehaviorSubject<TotalBalance>(null);

  private updateBalancesTimer: any;
  private lastBalancesUpdateTime: Date;
  private readonly intervalTime = 60 * 1000;
  private readonly refreshBalancesTime = 5;

  private readonly allocationRatio = 0.25;
  private readonly unburnedHoursRatio = 0.5;

  constructor(
    private apiService: ApiService,
    private cipherProvider: CipherProvider,
    private _ngZone: NgZone
  ) {
    this.loadWallets();
  }

  get addresses(): Observable<any[]> {
    return this.all.map(wallets => wallets.reduce((array, wallet) => array.concat(wallet.addresses), []));
  }

  get all(): Observable<Wallet[]> {
    return this.wallets.asObservable().map(wallets => wallets ? wallets : []);
  }

  addAddress(wallet: Wallet) {
    if (!wallet.seed || !wallet.addresses[wallet.addresses.length - 1].next_seed) {
      throw new Error('trying to generate address without seed!');
    }
    const lastSeed = wallet.addresses[wallet.addresses.length - 1].next_seed;
    wallet.addresses.push(this.cipherProvider.generateAddress(lastSeed));
    this.updateWallet(wallet);
    this.loadBalances();
  }

  create(label: string, seed: string) {
    const wallet = {
      label: label,
      seed: seed,
      addresses: [this.cipherProvider.generateAddress(this.ascii_to_hexa(seed))]
    };
    this.addWallet(wallet);
    this.loadBalances();
  }

  sendSkycoin(wallet: Wallet, address: string, amount: number) {
    const addresses = wallet.addresses.map(a => a.address).join(',');

    return this.apiService.getOutputs(addresses).flatMap((outputs: Output[]) => {
      const minRequiredOutputs =  this.getMinRequiredOutputs(amount, outputs);
      const totalCoins = parseInt((minRequiredOutputs.reduce((count, output) =>
        count + output.coins, 0) * 1000000) + '', 10);

      if (totalCoins < parseInt(amount * 1000000 + '', 10)) {
        throw new Error('Not enough available SKY Hours to perform transaction!');
      }

      const totalHours = parseInt((minRequiredOutputs.reduce((count, output) =>
        count + output.calculated_hours, 0)) + '', 10);
      const changeCoins = totalCoins - parseInt(amount * 1000000 + '', 10);
      let hoursToSend = parseInt((totalHours * this.allocationRatio) + '', 10);

      const txOutputs: TransactionOutput[] = [];
      const txInputs: TransactionInput[] = [];
      const calculatedHours = parseInt((totalHours * this.unburnedHoursRatio) + '', 10);

      if (changeCoins > 0) {
        txOutputs.push({
          address: wallet.addresses[0].address,
          coins: changeCoins,
          hours: calculatedHours - hoursToSend
        });
      } else {
        hoursToSend = calculatedHours;
      }

      txOutputs.push({ address: address, coins: parseInt(amount * 1000000 + '', 10), hours: hoursToSend });

      minRequiredOutputs.forEach(input => {
        txInputs.push({
          hash: input.hash,
          secret: wallet.addresses.find(a => a.address === input.address).secret_key,
        });
      });

      const rawTransaction = this.cipherProvider.prepareTransaction(txInputs, txOutputs);

      return this.apiService.postTransaction(rawTransaction);
    });
  }

  updateWallet(wallet: Wallet) {
    this.all.first().subscribe(wallets => {
      const index = wallets.findIndex(w => w.addresses[0].address === wallet.addresses[0].address);
      if (index === -1) {
        throw new Error('trying to update the wallet with unknown address!');
      }
      wallets[index] = wallet;
      this.saveWallets(wallets);
    });
  }

  unlockWallet(wallet: Wallet, seed: string): Promise<void> {
    return new Promise<void>((resolve) => {
      let currentSeed = this.ascii_to_hexa(seed);
      wallet.addresses.forEach(address => {
        const fullAddress = this.cipherProvider.generateAddress(currentSeed);
        if (fullAddress.address !== address.address) {
          throw new Error('Wrong seed');
        }
        address.next_seed = fullAddress.next_seed;
        address.secret_key = fullAddress.secret_key;
        address.public_key = fullAddress.public_key;
        currentSeed = fullAddress.next_seed;
      });

      wallet.seed = seed;
      this.updateWallet(wallet);
      return resolve();
    });
  }

  transactions(): Observable<any[]> {
    return this.addresses
      .filter(addresses => !!addresses.length)
      .first()
      .flatMap(addresses => {
        this.addressesTemp = addresses;
        return Observable.forkJoin(addresses.map(address => this.retrieveAddressTransactions(address)));
      })
      .map(transactions => [].concat.apply([], transactions).sort((a, b) =>  b.timestamp - a.timestamp))
      .map(transactions => transactions.reduce((array, item) => {
        if (!array.find(trans => trans.txid === item.txid)) {
          array.push(item);
        }
        return array;
      }, []))
      .map(transactions => transactions.map(transaction => {
        const outgoing = !!this.addressesTemp.find(address => transaction.inputs[0].owner === address.address);
        transaction.outputs.forEach(output => {
          if (outgoing && !this.addressesTemp.find(address => output.dst === address.address)) {
            transaction.addresses.push(output.dst);
            transaction.balance = transaction.balance - parseFloat(output.coins);
          }
          if (!outgoing && this.addressesTemp.find(address => output.dst === address.address)) {
            transaction.addresses.push(output.dst);
            transaction.balance = transaction.balance + parseFloat(output.coins);
          }
          return transaction;
        });

        return transaction;
      }));
  }

  retrieveAddressTransactions(address: Address): Observable<Transaction[]> {
    return this.apiService.get('explorer/address', { address: address.address })
      .map(transactions => transactions.map(transaction => ({
        addresses: [],
        balance: 0,
        block: transaction.status.block_seq,
        confirmed: transaction.status.confirmed,
        timestamp: transaction.timestamp,
        txid: transaction.txid,
        inputs: transaction.inputs,
        outputs: transaction.outputs,
      })));
  }
  /*
 Legacy
  */

  outputs(): Observable<GetOutputsRequestOutput[]> {
    return this.getAddressesAsString()
      .filter(addresses => !!addresses)
      .flatMap(addresses => this.apiService.get('outputs', { addrs: addresses }))
      .map(response => response.head_outputs);
  }

  pendingTransactions(): Observable<any> {
    return this.apiService.get('pendingTxs');
  }

  sum(): Observable<number> {
    return this.all.map(wallets => wallets.map(wallet => wallet.balance >= 0 ? wallet.balance : 0)
      .reduce((a , b) => a + b, 0));
  }

  loadBalances() {
    this.addresses.first().subscribe((addresses: Address[]) => {
      this.retrieveAddressesBalance(addresses)
        .subscribe((balance: Balance) => {
          this.wallets.first().subscribe(wallets => {
            if (balance.addresses) {
              wallets.map((wallet: Wallet) => {
                wallet.addresses.map((address: Address) => {
                  if (balance.addresses[address.address]) {
                    address.balance = balance.addresses[address.address].confirmed.coins / 1000000;
                    address.hours = balance.addresses[address.address].confirmed.hours;
                  }
                });

                wallet.balance = wallet.addresses.map(address => address.balance >= 0 ? address.balance : 0).reduce((a , b) => a + b, 0);
                wallet.hours = wallet.addresses.map(address => address.hours >= 0 ? address.hours : 0).reduce((a , b) => a + b, 0);
              });
            }

            this.calculateTotalBalance(wallets);
            this.resetBalancesUpdateTime();
          });
        });
    });
  }

  private calculateTotalBalance(wallets: Wallet[]) {
    const totalBalance: TotalBalance = {
      coins: wallets.map(wallet => wallet.balance >= 0 ? wallet.balance : 0).reduce((a , b) => a + b, 0),
      hours: wallets.map(wallet => wallet.hours >= 0 ? wallet.hours : 0).reduce((a , b) => a + b, 0)
    };

    this.totalBalance.next(totalBalance);
  }

  private addWallet(wallet) {
    this.all.first().subscribe(wallets => {
      wallets.push(wallet);
      this.saveWallets(wallets);
    });
  }

  private loadWallets() {
    const storedWallets: string = localStorage.getItem('wallets');
    if (storedWallets) {
      this.wallets.next( JSON.parse(storedWallets) );
    }
  }

  private saveWallets(wallets) {
    const strippedWallets: Wallet[] = [];
    wallets.forEach(wallet => {
      const strippedAddresses: Address[] = [];
      wallet.addresses.forEach(address => strippedAddresses.push({ address: address.address }));
      strippedWallets.push({ label: wallet.label, addresses: strippedAddresses });
    });
    localStorage.setItem('wallets', JSON.stringify(strippedWallets));
    this.wallets.next(wallets);
  }

  private retrieveAddressesBalance(addresses: Address | Address[]): Observable<Balance> {
    const formattedAddresses = Array.isArray(addresses) ? addresses.map(a => a.address).join(',') : addresses.address;
    return this.apiService.get('balance', { addrs: formattedAddresses });
  }

  private getAddressesAsString(): Observable<string> {
    return this.all.map(wallets => wallets.map(wallet => {
      return wallet.addresses.reduce((a, b) => {
        a.push(b.address);
        return a;
      }, []).join(',');
    }).join(','));
  }

  private ascii_to_hexa(str): string {
    const arr1: string[] = [];
    for (let n = 0, l = str.length; n < l; n ++) {
      const hex = Number(str.charCodeAt(n)).toString(16);
      arr1.push(hex);
    }
    return arr1.join('');
  }

  private resetBalancesUpdateTime() {
    this.lastBalancesUpdateTime = new Date();
    this.calculateTimeSinceLastUpdate();
    this.restartTimer();
  }

  private restartTimer() {
    if (this.updateBalancesTimer) {
      clearInterval(this.updateBalancesTimer);
    }
    this.startTimer();
  }

  private startTimer() {
    this._ngZone.runOutsideAngular(() => {
      this.updateBalancesTimer = setInterval(() => this.calculateTimeSinceLastUpdate(), this.intervalTime);
    });
  }

  private calculateTimeSinceLastUpdate() {
    const diffMs: number = this.lastBalancesUpdateTime.getTime() - new Date().getTime();
    const timeSinceLastUpdate = Math.abs(Math.round((diffMs / 1000 / 60)));

    this._ngZone.run(() => {
      this.timeSinceLastBalancesUpdate.next(timeSinceLastUpdate);

      if (timeSinceLastUpdate === this.refreshBalancesTime) {
        this.loadBalances();
      }
    });
  }

  private getMinRequiredOutputs(transactionAmount: number, outputs: Output[]): Output[] {
    outputs.sort( function(a, b) {
      return b.coins - a.coins;
    });

    const minRequiredOutputs: Output[] = [];
    let sumCoins = 0;

    outputs.forEach(output => {
      if (transactionAmount > sumCoins && output.calculated_hours > 0) {
        minRequiredOutputs.push(output);
        sumCoins = sumCoins + output.coins;
      }
    });

    return minRequiredOutputs;
  }
}
