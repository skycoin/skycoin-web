import { Component, OnInit, OnDestroy } from '@angular/core';
import { ISubscription } from 'rxjs/Subscription';

import { BaseCoin } from '../../../../coins/basecoin';
import { CoinService } from '../../../../services/coin.service';

@Component({
  selector: 'app-coin-button',
  templateUrl: 'coin-button.component.html',
  styleUrls: ['coin-button.component.scss'],
})
export class CoinButtonComponent implements OnInit, OnDestroy {

  currentCoin: BaseCoin;
  private coinSubscription: ISubscription;

  constructor(private coinService: CoinService) { }

  ngOnInit() {
    this.coinSubscription = this.coinService.currentCoin
    .subscribe((coin: BaseCoin) => {
      this.currentCoin = coin;
    });
  }

  ngOnDestroy() {
    this.coinSubscription.unsubscribe();
  }

}
