import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { PriceService } from '../../../services/price.service';
import { WalletService } from '../../../services/wallet.service';
import { BlockchainService } from '../../../services/blockchain.service';
import { AppService } from '../../../services/app.service';
import { ConnectionError } from '../../../enums/connection-error.enum';
import { TotalBalance } from '../../../app.datatypes';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() headline: string;

  coins = 0;
  hours: number;
  balance: string;
  hasPendingTxs: boolean;
  connectionError: ConnectionError;
  connectionErrorsList = ConnectionError;
  percentage: number;
  querying = true;
  current: number;
  highest: number;

  private isBlockchainLoading = false;
  private isBalanceLoaded = false;
  private price: number;
  private priceSubscription: Subscription;
  private walletSubscription: Subscription;
  private blockchainSubscription: Subscription;

  get loading() {
    return this.isBlockchainLoading || !this.balance || !this.isBalanceLoaded;
  }

  constructor(
    private appService: AppService,
    private priceService: PriceService,
    private walletService: WalletService,
    private blockchainService: BlockchainService
  ) {}

  ngOnInit() {
    this.appService.checkConnectionState()
      .subscribe((error: ConnectionError) => this.setConnectionError(error));

    this.blockchainSubscription = this.blockchainService.progress
      .filter(response => !!response)
      .subscribe(response => this.updateBlockchainProgress(response));

    this.priceSubscription = this.priceService.price
      .subscribe(price => {
        this.price = price;
        this.calculateBalance();
      });

    this.walletSubscription = this.walletService.totalBalance
      .subscribe((balance: TotalBalance) => {
        if (balance) {
          this.coins = balance.coins;
          this.hours = balance.hours;

          this.calculateBalance();
          this.isBalanceLoaded = true;
        }
      });

    this.walletService.hasPendingTransactions
      .subscribe(hasPendingTxs => this.hasPendingTxs = hasPendingTxs);
  }

  ngOnDestroy() {
    this.priceSubscription.unsubscribe();
    this.walletSubscription.unsubscribe();
    this.blockchainSubscription.unsubscribe();
  }

  private updateBlockchainProgress(response) {
    if (response.isError) {
      this.setConnectionError(response.error);
      return;
    }

    this.querying = false;
    this.isBlockchainLoading = response.highest !== response.current;

    if (this.isBlockchainLoading) {
      this.highest = response.highest;
      this.current = response.current;
    }

    this.percentage = response.current && response.highest ? (response.current / response.highest) : 0;
  }

  private calculateBalance() {
    if (this.price) {
      const balance = Math.round(this.coins * this.price * 100) / 100;
      this.balance = '$' + balance.toFixed(2) + ' ($' + (Math.round(this.price * 100) / 100) + ')';
    }
  }

  private setConnectionError(error: ConnectionError) {
    if (!this.connectionError) {
      this.connectionError = error;
    }
  }
}
