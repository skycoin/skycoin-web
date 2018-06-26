import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ISubscription } from 'rxjs/Subscription';

import { BlockchainService } from '../../../../services/blockchain.service';
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

  private coinSubscription: ISubscription;

  constructor(
    private blockchainService: BlockchainService,
    private coinService: CoinService
  ) { }

  ngOnInit() {
    this.coinSubscription = this.coinService.currentCoin
      .subscribe(() => {
        this.block = null;
        this.coinSupply = null;

        Observable.forkJoin(
          this.blockchainService.lastBlock(),
          this.blockchainService.coinSupply()
        )
          .subscribe(([block, coinSupply]) => {
            this.block = block;
            this.coinSupply = coinSupply;
          });
      });
  }

  ngOnDestroy() {
    this.coinSubscription.unsubscribe();
  }
}
