import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Subscription } from 'rxjs/Subscription';

import { PriceService } from '../../../services/price.service';
import { HistoryService } from '../../../services/wallet/history.service';
import { TransactionDetailComponent } from './transaction-detail/transaction-detail.component';
import { QrCodeComponent } from '../../layout/qr-code/qr-code.component';
import { BaseCoin } from '../../../coins/basecoin';
import { CoinService } from '../../../services/coin.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})

export class HistoryComponent implements OnInit, OnDestroy {
  currentCoin: BaseCoin;

  public transactions: any[];
  public price: number;
  private subscription: Subscription;

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
      });

    this.subscription.add(this.priceService.price.subscribe(price => this.price = price));
    this.subscription.add(this.historyService.transactions().subscribe(transactions => {
        this.transactions = transactions;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  showTransaction(transaction: any) {
    const config = new MatDialogConfig();
    config.width = '800px';
    config.data = transaction;
    this.dialog.open(TransactionDetailComponent, config).afterClosed().subscribe();
  }

  showQr(event, address) {
    event.stopPropagation();

    const config = new MatDialogConfig();
    config.data = address;
    this.dialog.open(QrCodeComponent, config);
  }
}
