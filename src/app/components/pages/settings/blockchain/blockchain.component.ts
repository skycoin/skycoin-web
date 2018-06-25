import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { BlockchainService } from '../../../../services/blockchain.service';
import { Observable } from 'rxjs/Observable';
import { CoinService } from '../../../../services/coin.service';
import { BaseCoin } from '../../../../coins/basecoin';

@Component({
  templateUrl: './blockchain.component.html',
  styleUrls: ['./blockchain.component.scss']
})
export class BlockchainComponent implements OnInit, OnDestroy {
  block: any;
  coinSupply: any;
  currentCoin: BaseCoin;

  private coinSubscription: Subscription;

  constructor(
    private blockchainService: BlockchainService,
    private coinService: CoinService
  ) { }

  ngOnInit() {
    Observable.forkJoin(
      this.blockchainService.lastBlock(),
      this.blockchainService.coinSupply()
    )
    .subscribe(([block, coinSupply]) => {
      this.block = block;
      this.coinSupply = coinSupply;
    });

    this.coinSubscription = this.coinService.currentCoin
      .subscribe((coin: BaseCoin) => this.currentCoin = coin);
  }

  ngOnDestroy() {
    this.coinSubscription.unsubscribe();
  }
}
