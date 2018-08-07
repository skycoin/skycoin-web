import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ISubscription } from 'rxjs/Subscription';

import { Transaction } from '../../../../../app.datatypes';
import { PriceService } from '../../../../../services/price.service';
import { CoinService } from '../../../../../services/coin.service';
import { BaseCoin } from '../../../../../coins/basecoin';

@Component({
  selector: 'app-transaction-info',
  templateUrl: './transaction-info.component.html',
  styleUrls: ['./transaction-info.component.scss'],
})
export class TransactionInfoComponent implements OnInit, OnDestroy {
  @Input() transaction: Transaction;
  @Input() isPreview: boolean;
  price: number;
  showInputsOutputs = false;
  currentCoin: BaseCoin;

  private subscription: ISubscription;

  constructor(
    private priceService: PriceService,
    private coinService: CoinService
  ) {}

  ngOnInit() {
    this.subscription = this.priceService.price
      .subscribe(price => this.price = price);

    this.currentCoin = this.coinService.currentCoin.value;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  toggleInputsOutputs(event) {
    event.preventDefault();

    this.showInputsOutputs = !this.showInputsOutputs;
  }
}
