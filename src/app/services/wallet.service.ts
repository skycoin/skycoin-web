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
import { Address, Wallet } from '../app.datatypes';

declare var Cipher;

@Injectable()
export class WalletService {
  recentTransactions: Subject<any[]> = new BehaviorSubject<any[]>([]);
  transactions: Subject<any[]> = new BehaviorSubject<any[]>([]);
  wallets: Subject<Wallet[]> = new BehaviorSubject<Wallet[]>([]);

  get all(): Observable<Wallet[]> {
    return this.wallets.asObservable();
  }

  constructor(
    private apiService: ApiService
  ) {}

  addAddress(wallet: Wallet) {
    const lastSeed = wallet.addresses[wallet.addresses.length - 1];
    wallet.addresses.push(this.generateAddress(lastSeed));
    this.updateWallet(wallet);
  }

  create(label, seed) {
    const wallet = {
      label: label,
      seed: seed,
      addresses: [this.generateAddress(seed)]
    };

    this.addWallet(wallet);
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

  private saveWallets(wallets) {
    this.wallets.next(wallets);
  }

  private updateWallet(wallet: Wallet) {
    this.all.first().subscribe(wallets => {
      const index = wallets.findIndex(w => w.addresses[0].address === wallet.addresses[0].address);
      wallets[index] = wallet;
      this.saveWallets(wallets);
    });
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

  allAddresses(): Observable<any[]> {
    return this.all.map(wallets => wallets.reduce((array, wallet) => array.concat(wallet.addresses), []));
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

  renameWallet(wallet: WalletModel, label: string): Observable<WalletModel> {
    return this.apiService.post('wallet/update', { id: wallet.meta.filename, label: label });
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

  sendSkycoin(wallet_id: string, address: string, amount: number) {
    return this.apiService.post('wallet/spend', {id: wallet_id, dst: address, coins: amount})
      .do(output => this.recentTransactions.first().subscribe(transactions => {
        const transaction = {id: output.txn.txid, address: address, amount: amount / 1000000};
        transactions.push(transaction);
        this.recentTransactions.next(transactions);
      }));
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

  private retrieveTransactions() {
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
