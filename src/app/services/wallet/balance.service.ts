import { Injectable, NgZone } from '@angular/core';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/first';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { ISubscription } from 'rxjs/Subscription';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { ApiService } from '../api.service';
import { Address, Wallet, TotalBalance, Balance } from '../../app.datatypes';
import { WalletService } from './wallet.service';

export enum BalanceStates {
  Obtained,
  Error,
  Updating,
}

export class BalanceEvent {
  state: BalanceStates;
  balance?: TotalBalance;
}

@Injectable()
export class BalanceService {
  lastBalancesUpdateTime: Date = new Date();
  totalBalance: ReplaySubject<BalanceEvent> = new ReplaySubject<BalanceEvent>();
  hasPendingTransactions: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private canGetBalance = false;
  private schedulerSubscription: ISubscription;

  private readonly coinsMultiplier = 1000000;
  private readonly shortUpdatePeriod = 5 * 1000;
  private readonly longUpdatePeriod = 300 * 1000;

  constructor(
    private apiService: ApiService,
    private walletService: WalletService,
    private _ngZone: NgZone
  ) {
    walletService.wallets.subscribe(() => this.canGetBalance ? this.scheduleUpdate(0) : null);
  }

  startGettingBalances() {
    this.canGetBalance = true;
    this.scheduleUpdate(0);
  }

  stopGettingBalances() {
    this.removeSubscription();
    this.canGetBalance = false;
  }

  private removeSubscription() {
    if (!!this.schedulerSubscription && !this.schedulerSubscription.closed) {
      this.schedulerSubscription.unsubscribe();
    }
  }

  private scheduleUpdate(delay: number) {
    this._ngZone.runOutsideAngular(() => {
      this.removeSubscription();

      this.schedulerSubscription = Observable.of(1)
        .delay(delay)
        .flatMap(() => this._ngZone.run(() => this.getBalance()))
        .subscribe(
          hasPendingTxs => this.scheduleUpdate(hasPendingTxs ? this.shortUpdatePeriod : this.longUpdatePeriod),
          () => {
            this.scheduleUpdate(this.shortUpdatePeriod);
            this._ngZone.run(() => this.totalBalance.next({state: BalanceStates.Error}));
          }
        );
    });
  }

  private getBalance(): Observable<boolean> {
    this.totalBalance.next({state: BalanceStates.Updating});
    return this.walletService.addresses.first().flatMap((addresses: Address[]) => {
      if (addresses.length === 0) {
        this.lastBalancesUpdateTime = new Date();
        this.totalBalance.next({state: BalanceStates.Obtained, balance: { coins: 0, hours: 0 }});
        return Observable.of(false);
      }

      return this.retrieveAddressesBalance(addresses).flatMap((balance) => {
        return this.walletService.currentWallets.first().map(wallets => this.calculateBalance(wallets, balance));
      });
    });
  }

  private retrieveAddressesBalance(addresses: Address[]): Observable<Balance> {
    const formattedAddresses = addresses.map(a => a.address).join(',');
    return this.apiService.get('balance', { addrs: formattedAddresses });
  }

  private calculateBalance(wallets: Wallet[], balance: Balance): boolean {
    if (balance.addresses) {
      wallets.map((wallet: Wallet) => {
        wallet.balance = 0;
        wallet.hours = 0;

        wallet.addresses.map((address: Address) => {
          if (balance.addresses[address.address]) {
            address.balance = balance.addresses[address.address].confirmed.coins / this.coinsMultiplier;
            address.hours = balance.addresses[address.address].confirmed.hours;
            wallet.balance += address.balance;
            wallet.hours += address.hours;
          }
        });
      });
    }

    this.lastBalancesUpdateTime = new Date();
    this.totalBalance.next({
      state: BalanceStates.Obtained,
      balance: { coins: balance.confirmed.coins / this.coinsMultiplier, hours: balance.confirmed.hours }
    });
    return this.refreshPendingTransactions(balance);
  }

  private refreshPendingTransactions(balance: Balance) {
    const hasPendingTxs = balance.confirmed.coins !== balance.predicted.coins ||
      balance.confirmed.hours !== balance.predicted.hours;

    this.hasPendingTransactions.next(hasPendingTxs);
    return hasPendingTxs;
  }
}
