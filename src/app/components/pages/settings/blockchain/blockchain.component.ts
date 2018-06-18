import { Component, OnInit } from '@angular/core';

import { BlockchainService } from '../../../../services/blockchain.service';
import { Observable } from 'rxjs/Observable';

@Component({
  templateUrl: './blockchain.component.html',
  styleUrls: ['./blockchain.component.scss']
})
export class BlockchainComponent implements OnInit {
  block: any;
  coinSupply: any;
  isLoading = false;

  constructor(
    private blockchainService: BlockchainService,
  ) { }

  ngOnInit() {
    this.isLoading = true;

    Observable.forkJoin(
      this.blockchainService.lastBlock(),
      this.blockchainService.coinSupply()
    )
    .subscribe(([block, coinSupply]) => {
      this.block = block;
      this.coinSupply = coinSupply;

      this.isLoading = false;
    });
  }
}
