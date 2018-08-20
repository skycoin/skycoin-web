import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';

import { CoinService } from '../../../../services/coin.service';
import { BaseCoin } from '../../../../coins/basecoin';
import { ChangeNodeURLComponent } from './change-url/change-node-url.component';

@Component({
  selector: 'app-nodes',
  templateUrl: './nodes.component.html',
  styleUrls: ['./nodes.component.scss'],
})
export class NodesComponent implements OnInit {

  coins: BaseCoin[];
  customNodeUrls: object;

  constructor(
    private coinService: CoinService,
    private dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.coins = this.coinService.coins;
    this.customNodeUrls = this.coinService.customNodeUrls;
  }

  changeNodeURL(coin: BaseCoin) {
    const customNodeUrl = this.customNodeUrls[coin.id.toString()] ? this.customNodeUrls[coin.id.toString()] : '';

    const config = new MatDialogConfig();
    config.width = '566px';
    config.data = {coinId: coin.id, url: customNodeUrl};
    this.dialog.open(ChangeNodeURLComponent, config);
  }
}
