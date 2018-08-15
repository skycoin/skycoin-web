import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Subscription, ISubscription } from 'rxjs/Subscription';

import { PriceService } from '../../../services/price.service';
import { HistoryService } from '../../../services/wallet/history.service';
import { TransactionDetailComponent } from './transaction-detail/transaction-detail.component';
import { BaseCoin } from '../../../coins/basecoin';
import { CoinService } from '../../../services/coin.service';
import { openQrModal } from '../../../utils';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})

export class HistoryComponent implements OnInit, OnDestroy {
  currentCoin: BaseCoin;
  showError = false;

  public transactions: any[];
  public price: number;
  private subscription: Subscription;
  private transactionsSubscription: ISubscription;

  constructor(
    private historyService: HistoryService,
    private priceService: PriceService,
    private dialog: MatDialog,
    private coinService: CoinService
  ) { }

  ngOnInit() {
    this.subscription = this.coinService.currentCoin
      .subscribe((coin: BaseCoin) => {
        this.transactions = null;
        this.currentCoin = coin;
        this.showError = false;

        this.closeTransactionsSubscription();
        this.transactionsSubscription = this.historyService.transactions().subscribe(
          transactions => this.transactions = transactions,
          () => this.showError = true
        );
      });

    this.subscription.add(this.priceService.price.subscribe(price => this.price = price));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.closeTransactionsSubscription();
  }

  showTransaction(transaction: any) {
    const config = new MatDialogConfig();
    config.width = '800px';
    config.data = transaction;
    this.dialog.open(TransactionDetailComponent, config);
  }

  showQr(event, address) {
    event.stopPropagation();
    openQrModal(this.dialog, address);
  }

  private closeTransactionsSubscription() {
    if (this.transactionsSubscription && !this.transactionsSubscription.closed) {
      this.transactionsSubscription.unsubscribe();
    }
  }
}
