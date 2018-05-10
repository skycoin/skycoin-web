import { Injectable } from '@angular/core';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/mergeMap';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Address, Output, Transaction, TransactionInput, TransactionOutput, Wallet } from '../app.datatypes';
import { WalletModel } from '../models/wallet.model';
import { ApiService } from './api.service';
import { CipherProvider } from './cipher.provider';

@Injectable()
export class WalletService {
  recentTransactions: Subject<any[]> = new BehaviorSubject<any[]>([]);
  wallets: BehaviorSubject<Wallet[]> = new BehaviorSubject<Wallet[]>([]);
  addressesTemp: Address[];

  constructor(
    private apiService: ApiService,
    private cipherProvider: CipherProvider
  ) {
    this.loadWallets();
    this.loadBalances();
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
      const totalCoins = parseInt((outputs.reduce((count, output) => count + output.coins, 0) * 1000000) + '', 10);
      const totalHours = outputs.reduce((count, output) => count + output.hours, 0);
      const changeCoins = totalCoins - amount * 1000000;
      const changeHours = totalHours / 4;
      const txOutputs: TransactionOutput[] = [{ address: address, coins: amount * 1000000, hours: changeHours }];
      const txInputs: TransactionInput[] = [];

      if (changeCoins > 0) {
        txOutputs.push({ address: wallet.addresses[0].address, coins: changeCoins, hours: changeHours });
      }

      outputs.forEach(input => {
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
    return new Promise<void>((resolve, reject) => {
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
  folder(): Observable<string> {
    return this.apiService.get('wallets/folderName').map(response => response.address);
  }

  outputs(): Observable<any> {
    return this.getAddressesAsString()
      .filter(addresses => !!addresses)
      .flatMap(addresses => this.apiService.get('outputs', { addrs: addresses }))
      .map(response => response.head_outputs);
  }

  pendingTransactions(): Observable<any> {
    return this.apiService.get('pendingTxs');
  }

  recent(): Observable<any[]> {
    return this.recentTransactions.asObservable();
  }

  refreshBalances() {
    this.all.first().subscribe(wallets => {
      Observable.forkJoin(wallets.map(wallet => this.retrieveWalletBalance(wallet).map(response => {
        wallet.addresses = response;
        wallet.balance = response.map(address => address.balance >= 0 ? address.balance : 0)
          .reduce((a , b) => a + b, 0);
        wallet.hours = response.map(address => address.hours >= 0 ? address.hours : 0)
          .reduce((a , b) => a + b, 0);
        return wallet;
      })))
        .subscribe(newWallets => this.wallets.next(newWallets));
    });
  }

  retrieveUpdatedTransactions(transactions) {
    return Observable.forkJoin((transactions.map(transaction => {
      return this.apiService.get('transaction', { txid: transaction.id }).map(response => {
        response.amount = transaction.amount;
        response.address = transaction.address;
        return response;
      });
    })));
  }

  sum(): Observable<number> {
    return this.all.map(wallets => wallets.map(wallet => wallet.balance >= 0 ? wallet.balance : 0)
      .reduce((a , b) => a + b, 0));
  }

  transaction(txid: string): Observable<any> {
    return this.apiService.get('transaction', { txid: txid }).flatMap(transaction => {
      if (transaction.txn.inputs && !transaction.txn.inputs.length) {
        return Observable.of(transaction);
      }
      return Observable.forkJoin(transaction.txn.inputs.map(input => this.retrieveInputAddress(input).map(response => {
        return response.owner_address;
      }))).map(inputs => {
        transaction.txn.inputs = inputs;
        return transaction;
      });
    });
  }

  private addWallet(wallet) {
    this.all.first().subscribe(wallets => {
      wallets.push(wallet);
      this.saveWallets(wallets);
    });
  }

  private loadBalances() {
    this.addresses.first().subscribe(addresses => {
      const stringified = addresses.map(address => address.address).join(',');
      this.apiService.getOutputs(stringified).subscribe(outputs => {
        this.all.first().subscribe(wallets => {
          wallets.forEach(wallet => {
            wallet.addresses.forEach(address => {
              address.balance = 0;
              address.hours = 0;

              outputs
                .filter(o => address.address === o.address)
                .map(output => {
                  address.balance = address.balance + output.coins;
                  address.hours = address.hours + output.hours;
                });
            });

            wallet.balance = wallet.addresses.map(address => address.balance >= 0 ? address.balance : 0)
              .reduce((a , b) => a + b, 0);
            wallet.hours = wallet.addresses.map(address => address.hours >= 0 ? address.hours : 0)
              .reduce((a , b) => a + b, 0);
          });
          this.saveWallets(wallets);
        });
      });
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

  private retrieveAddressBalance(address: any|any[]) {
    const addresses = Array.isArray(address) ? address.map(a => a.address).join(',') : address.address;
    return this.apiService.get('balance', { addrs: addresses });
  }

  private retrieveInputAddress(input: string) {
    return this.apiService.get('uxout', { uxid: input });
  }

  private retrieveWalletBalance(wallet: Wallet): Observable<any> {
    return Observable.forkJoin(wallet.addresses.map(address => this.retrieveAddressBalance(address).map(balance => {
      address.balance = balance.confirmed.coins;
      address.hours = balance.confirmed.hours;
      return address;
    })));
  }

  private retrieveWalletTransactions(wallet: Wallet) {
    return Observable.forkJoin(wallet.addresses.map(address => this.retrieveAddressTransactions(address)))
      .map(addresses => [].concat.apply([], addresses));
  }

  private retrieveWallets(): Observable<WalletModel[]> {
    return this.apiService.get('wallets');
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
}
