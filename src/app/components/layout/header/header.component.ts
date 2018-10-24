import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { BigNumber } from 'bignumber.js';

import { PriceService } from '../../../services/price.service';
import { BalanceService, BalanceStates } from '../../../services/wallet/balance.service';
import { BlockchainService, ProgressEvent, ProgressStates } from '../../../services/blockchain.service';
import { ConnectionError } from '../../../enums/connection-error.enum';
import { TotalBalance } from '../../../app.datatypes';
import { CoinService } from '../../../services/coin.service';
import { BaseCoin } from '../../../coins/basecoin';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() headline: string;

  coins: BigNumber = new BigNumber('0');
  hours: BigNumber;
  balance: string;
  hasPendingTxs: boolean;
  connectionError: ConnectionError = null;
  connectionErrorsList = ConnectionError;
  percentage: number;
  isBlockchainLoading = false;
  current: number;
  highest: number;
  currentCoin: BaseCoin;

  private balanceLoaded = false;
  private price: number;
  private subscription: Subscription;

  get loading() {
    return this.isBlockchainLoading || !this.balanceLoaded;
  }

  constructor(
    private priceService: PriceService,
    private balanceService: BalanceService,
    private blockchainService: BlockchainService,
    private coinService: CoinService
  ) {}

  ngOnInit() {
    this.subscription = this.coinService.currentCoin
      .subscribe((coin: BaseCoin) => this.currentCoin = coin);

    this.subscription.add(
      this.blockchainService.progress
        .filter(response => !!response)
        .subscribe(response => this.updateBlockchainProgress(response))
    );

    this.subscription.add(
      this.priceService.price
        .subscribe(price => {
          this.price = price;
          this.calculateBalance();
        })
    );

    this.subscription.add(
      this.balanceService.totalBalance
        .subscribe(balance => {
          if (balance && balance.state === BalanceStates.Obtained) {
            this.coins = balance.balance.coins;
            this.hours = balance.balance.hours;

            this.calculateBalance();
            this.balanceLoaded = true;
          }
        })
    );

    this.subscription.add(
      this.balanceService.hasPendingTransactions
        .subscribe(hasPendingTxs => this.hasPendingTxs = hasPendingTxs)
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private resetState() {
    this.coins = new BigNumber('0');
    this.price = null;
    this.balance = null;
    this.balanceLoaded = false;
    this.isBlockchainLoading = false;
    this.percentage = null;
    this.current = null;
    this.highest = null;
  }

  private updateBlockchainProgress(response: ProgressEvent) {
    switch (response.state) {
      case ProgressStates.Restarting: {
        this.resetState();
        break;
      }
      case ProgressStates.Error: {
        this.setConnectionError(response.error);
        break;
      }
      case ProgressStates.Progress: {
        this.connectionError = null;
        this.isBlockchainLoading = response.highestBlock !== response.currentBlock;

        if (this.isBlockchainLoading) {
          this.highest = response.highestBlock;
          this.current = response.currentBlock;
        }

        this.percentage = response.currentBlock / response.highestBlock;
        break;
      }
    }
  }

  private calculateBalance() {
    if (this.price) {
      const balance = this.coins.multipliedBy(this.price).toNumber();
      this.balance = '$' + balance.toFixed(2) + ' ($' + (Math.round(this.price * 100) / 100) + ')';
    }
  }

  private setConnectionError(error: ConnectionError) {
    if (!this.connectionError) {
      this.connectionError = error;
    }
  }
}
