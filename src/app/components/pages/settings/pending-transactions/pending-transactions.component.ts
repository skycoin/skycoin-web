import { Component, OnDestroy, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { ISubscription } from 'rxjs/Subscription';

import { WalletService } from '../../../../services/wallet.service';
import { NavBarService } from '../../../../services/nav-bar.service';
import { DoubleButtonActive } from '../../../layout/double-button/double-button.component';

@Component({
  selector: 'app-pending-transactions',
  templateUrl: './pending-transactions.component.html',
  styleUrls: ['./pending-transactions.component.scss']
})
export class PendingTransactionsComponent implements OnInit, OnDestroy {

  transactions: any[];
  private navbarSubscription: ISubscription;

  constructor(
    private walletService: WalletService,
    private router: Router,
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

  onActivate(response) {
    if (response.row && response.row.txid) {
      this.router.navigate(['/history', response.row.txid]);
    }
  }

  private loadTransactions(value) {
    const showAllTransactions = value === DoubleButtonActive.LeftButton ? false : true;

    this.walletService.getAllPendingTransactions().subscribe(transactions => {
      if (!showAllTransactions) {
        transactions.map(tran => {
          // add logic for wallets related transactions
        });
      }

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
}
