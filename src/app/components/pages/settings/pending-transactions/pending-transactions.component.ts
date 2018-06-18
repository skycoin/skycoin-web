import { Component, OnDestroy, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ISubscription } from 'rxjs/Subscription';

import { WalletService } from '../../../../services/wallet.service';
import { NavBarService } from '../../../../services/nav-bar.service';
import { DoubleButtonActive } from '../../../layout/double-button/double-button.component';
import { Wallet } from '../../../../app.datatypes';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-pending-transactions',
  templateUrl: './pending-transactions.component.html',
  styleUrls: ['./pending-transactions.component.scss']
})
export class PendingTransactionsComponent implements OnInit, OnDestroy {

  transactions: any[] = [];
  private navbarSubscription: ISubscription;

  constructor(
    private walletService: WalletService,
    private navbarService: NavBarService
  ) { }

  ngOnInit() {
    this.navbarService.showSwitch('pending-txs.my', 'pending-txs.all');

    this.navbarSubscription = this.navbarService.activeComponent.subscribe(value => {
      this.loadTransactions(value);
    });
  }

  ngOnDestroy() {
    this.navbarSubscription.unsubscribe();
    this.navbarService.hideSwitch();
  }

  private loadTransactions(value: number) {
    const showAllTransactions = value === DoubleButtonActive.RightButton;
    this.walletService.getAllPendingTransactions()
      .flatMap((transactions: any) => {
          return showAllTransactions ? Observable.of(transactions) : this.getWalletsTransactions(transactions);
      })
      .subscribe(transactions => {
        this.transactions = this.mapTransactions(transactions);
      });
  }

  private mapTransactions(transactions) {
    return transactions.map(transaction => {
      transaction.transaction.timestamp = moment(transaction.received).unix();
      return transaction.transaction;
    })
    .map(transaction => {
      transaction.amount = transaction.outputs
        .map(output => output.coins >= 0 ? output.coins : 0)
        .reduce((a, b) => a + parseFloat(b), 0);
      return transaction;
    });
  }

  private getWalletsTransactions(transactions: any): Observable<any> {
    const allTransactions = this.getUpdatedTransactions(transactions);

    return Observable.zip(allTransactions, this.walletService.all, (trans: any, wallets: Wallet[]) => {
      const walletAddresses = new Set<string>();
      wallets.forEach(wallet => {
        wallet.addresses.forEach(address => walletAddresses.add(address.address));
      });

      return trans.filter(tran =>
        tran.owner_addressses.some(address => walletAddresses.has(address)) ||
          tran.transaction.outputs.some(output => walletAddresses.has(output.dst))
      );
    });
  }

  private getUpdatedTransactions(transactions: any): Observable<any> {
    return Observable.forkJoin(transactions.map((transaction: any) => {
      return Observable.forkJoin(transaction.transaction.inputs
        .map(input => this.walletService.getTransactionDetails(input)
          .map(inputDetails => inputDetails.owner_address)))
        .map((addresses) => {
          transaction.owner_addressses = addresses;
          return transaction;
        });
    }));
  }
}
