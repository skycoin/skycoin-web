import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { WalletModel } from '../models/wallet.model';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/mergeMap';
import { Address, Output, TransactionInput, TransactionOutput, Wallet } from '../app.datatypes';

declare var Cipher;

function ascii_to_hexa(str) {
  const arr1 = [];
  for (let n = 0, l = str.length; n < l; n ++) {
    const hex = Number(str.charCodeAt(n)).toString(16);
    arr1.push(hex);
  }
  return arr1.join('');
}

@Injectable()
export class WalletService {
  recentTransactions: Subject<any[]> = new BehaviorSubject<any[]>([]);
  transactions: Subject<any[]> = new BehaviorSubject<any[]>([]);
  tempAddresses: Address[];
  wallets: Subject<Wallet[]> = new BehaviorSubject<Wallet[]>([]);

  constructor(
    private apiService: ApiService
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

  transactionsHistory(): Observable<any[]> {
    return this.addresses.filter(addresses => !!addresses.length).first().flatMap(addresses => {
      this.tempAddresses = addresses;
      return Observable.forkJoin(addresses.map(address => this.getExplorerAddress(address)));
    }).map(transactions => [].concat.apply([], transactions).sort((a, b) =>  b.timestamp - a.timestamp))
      .map(transactions => transactions.reduce((array, item) => {
        if (!array.find(trans => trans.txid === item.txid)) {
          array.push(item);
        }
        return array;
      }, []))
      .map(transactions => transactions.map(transaction => {
        const outgoing = !!this.tempAddresses.find(address => transaction.inputs[0].owner === address.address);
        transaction.outputs.forEach(output => {
          if (outgoing && !this.tempAddresses.find(address => output.dst === address.address)) {
            transaction.addresses.push(output.dst);
            transaction.balance = transaction.balance - parseFloat(output.coins);
          }
          if (!outgoing && this.tempAddresses.find(address => output.dst === address.address)) {
            transaction.addresses.push(output.dst);
            transaction.balance = transaction.balance + parseFloat(output.coins);
          }
          return transaction;
        });

        return transaction;
      }));
  }
  addAddress(wallet: Wallet) {
    const lastSeed = wallet.addresses[wallet.addresses.length - 1].next_seed;
    wallet.addresses.push(this.generateAddress(lastSeed));
    this.updateWallet(wallet);
  }

  create(label, seed) {
    const wallet = {
      label: label,
      seed: seed,
      addresses: [this.generateAddress(ascii_to_hexa(seed))]
    };

    this.addWallet(wallet);
  }

  sendSkycoin(wallet: Wallet, address: string, amount: number) {
    const addresses = wallet.addresses.map(a => a.address).join(',');
    return this.apiService.getOutputs(addresses).flatMap((outputs: Output[]) => {
      const totalCoins = outputs.reduce((count, output) => count + output.coins, 0);
      const totalHours = outputs.reduce((count, output) => count + output.hours, 0);
      const changeCoins = totalCoins - amount;
      const changeHours = totalHours / 4;
      const txOutputs: TransactionOutput[] = [{ address: address, coins: amount * 1000000, hours: changeHours }];
      const txInputs: TransactionInput[] = [];

      if (changeCoins > 0) {
        txOutputs.push({ address: wallet.addresses[0].address, coins: changeCoins * 1000000, hours: changeHours });
      }

      outputs.forEach(input => {
        txInputs.push({
          hash: input.hash,
          secret: wallet.addresses.find(a => a.address === input.address).secret_key,
        });
      });

      const rawTransaction = Cipher.PrepareTransaction(JSON.stringify(txInputs), JSON.stringify(txOutputs));

      return this.apiService.postTransaction(rawTransaction);
    });
  }

  updateWallet(wallet: Wallet) {
    this.all.first().subscribe(wallets => {
      const index = wallets.findIndex(w => w.addresses[0].address === wallet.addresses[0].address);
      wallets[index] = wallet;
      this.saveWallets(wallets);
    });
  }

  unlockWallet(wallet: Wallet, seed: string) {
    let currentSeed = ascii_to_hexa(seed);
    wallet.seed = seed;

    wallet.addresses.forEach(address => {
      const fullAddress = this.generateAddress(currentSeed);
      if (fullAddress.address !== address.address) {
        return new Error('addresses don\'t match');
      }
      address.next_seed = fullAddress.next_seed;
      address.secret_key = fullAddress.secret_key;
      address.public_key = fullAddress.public_key;
      currentSeed = fullAddress.next_seed;
    });

    this.updateWallet(wallet);
  }

  private addWallet(wallet) {
    this.all.first().subscribe(wallets => {
      wallets.push(wallet);
      this.saveWallets(wallets);
    });
  }

  private generateAddress(seed): Address {
    const address = Cipher.GenerateAddresses(seed);
    return {
      next_seed: address.NextSeed,
      secret_key: address.Secret,
      public_key: address.Public,
      address: address.Address,
    };
  }

  private loadBalances() {
    this.addresses.first().subscribe(addresses => {
      const stringified = addresses.map(address => address.address).join(',');
      this.apiService.getOutputs(stringified).subscribe(outputs => {
        this.all.first().subscribe(wallets => {
          wallets.forEach(wallet => {
            wallet.addresses.forEach(address => {
              const output = outputs.find(o => address.address === o.address);
              if (output) {
                address.balance = address.balance >= 0 ? address.balance + output.coins : output.coins;
                address.hours = address.hours >= 0 ? address.hours + output.hours : output.hours;
              }
            });
            wallet.balance = wallet.addresses.map(address => address.balance >= 0 ? address.balance : 0).reduce((a , b) => a + b, 0);
            wallet.hours = wallet.addresses.map(address => address.hours >= 0 ? address.hours : 0).reduce((a , b) => a + b, 0);
          });
          this.saveWallets(wallets);
        });
      });
    });
  }

  private loadWallets() {
    const wallets = JSON.parse(localStorage.getItem('wallets'));
    this.wallets.next(wallets);
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

  /*
  Legacy
   */
  addressesAsString(): Observable<string> {
    return this.all.map(wallets => wallets.map(wallet => {
      return wallet.addresses.reduce((a, b) => {
        a.push(b.address);
        return a;
      }, []).join(',');
    }).join(','));
  }



  folder(): Observable<string> {
    return this.apiService.get('wallets/folderName').map(response => response.address);
  }

  history(): Observable<any[]> {
    return this.transactions.asObservable();
  }

  outputs(): Observable<any> {
    return this.addressesAsString()
      .filter(addresses => !!addresses)
      .flatMap(addresses => this.apiService.get('outputs', {addrs: addresses}));
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
        wallet.balance = response.map(address => address.balance >= 0 ? address.balance : 0).reduce((a , b) => a + b, 0);
        wallet.hours = response.map(address => address.hours >= 0 ? address.hours : 0).reduce((a , b) => a + b, 0);
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
    return this.all.map(wallets => wallets.map(wallet => wallet.balance >= 0 ? wallet.balance : 0).reduce((a , b) => a + b, 0));
  }

  transaction(txid: string): Observable<any> {
    return this.apiService.get('transaction', {txid: txid}).flatMap(transaction => {
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

  private retrieveAddressBalance(address: any|any[]) {
    const addresses = Array.isArray(address) ? address.map(address => address.address).join(',') : address.address;
    return this.apiService.get('balance', {addrs: addresses});
  }

  private retrieveAddressTransactions(address: any) {
    return this.apiService.get('explorer/address', {address: address.address});
  }

  private retrieveInputAddress(input: string) {
    return this.apiService.get('uxout', {uxid: input});
  }

  public retrieveTransactions() {
    return this.all.first().subscribe(wallets => {
      Observable.forkJoin(wallets.map(wallet => this.retrieveWalletTransactions(wallet)))
        .map(transactions => [].concat.apply([], transactions).sort((a, b) =>  b.timestamp - a.timestamp))
        .map(transactions => transactions.reduce((array, item) => {
          if (!array.find(trans => trans.txid === item.txid)) {
            array.push(item);
          }
          return array;
        }, []))
        .subscribe(transactions => this.transactions.next(transactions));
    });
  }

  getExplorerAddress(address: Address): Observable<any[]> {
    return this.apiService.get('explorer/address', {address: address.address})
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
}
