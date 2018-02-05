import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogConfig } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';
import { PriceService } from '../../../services/price.service';
import { WalletService } from '../../../services/wallet.service';
import { TransactionDetailComponent } from '../transaction/transaction-detail/transaction-detail.component';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})

export class HistoryComponent implements OnInit {
  public transactions: any[];
  public price: number;
  private priceSubscription: Subscription;

  constructor(public walletService: WalletService,
              private priceService: PriceService,
              private dialog: MdDialog) {
  }

  ngOnInit() {
    this.priceSubscription = this.priceService.price.subscribe(price => this.price = price);
    this.walletService.transactionsHistory().subscribe(transactions => {
      this.transactions = this.mapTransactions(transactions);
    });
  }

  showTransaction(transaction: any) {
    const config = new MdDialogConfig();
    config.width = '566px';
    config.data = transaction;
    this.dialog.open(TransactionDetailComponent, config).afterClosed().subscribe();
  }

  private mapTransactions(transactions) {
    return transactions.map(transaction => {
      transaction.amount = transaction.outputs.map(output => output.coins >= 0 ? output.coins : 0)
        .reduce((a, b) => a + parseInt(b), 0);
      return transaction;
    });
  }
}
