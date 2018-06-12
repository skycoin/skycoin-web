import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Subscription } from 'rxjs/Subscription';

import { PriceService } from '../../../services/price.service';
import { WalletService } from '../../../services/wallet.service';
import { TransactionDetailComponent } from './transaction-detail/transaction-detail.component';
import { QrCodeComponent } from '../../layout/qr-code/qr-code.component';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})

export class HistoryComponent implements OnInit {
  public transactions: any[];
  public price: number;
  private priceSubscription: Subscription;

  constructor(
    private walletService: WalletService,
    private priceService: PriceService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.priceSubscription = this.priceService.price.subscribe(price => this.price = price);
    this.walletService.transactions().subscribe(transactions => {
      this.transactions = transactions;
    });
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
