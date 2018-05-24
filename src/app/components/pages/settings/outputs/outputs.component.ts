import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { WalletService } from '../../../../services/wallet.service';
import {  Wallet } from '../../../../app.datatypes';

@Component({
  selector: 'app-outputs',
  templateUrl: './outputs.component.html',
  styleUrls: ['./outputs.component.scss']
})
export class OutputsComponent implements OnInit {

  wallets: Wallet[];

  constructor(
    private route: ActivatedRoute,
    private walletService: WalletService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => this.getWalletsOutputs(params));
  }

  private getWalletsOutputs(queryParams: Params) {
    const address = queryParams['addr'];

    this.walletService.outputsWithWallets().subscribe(wallets => {
      if (address) {
        const filteredWallets: Wallet[]  = wallets.filter(wallet => {
          return wallet.addresses.find((addr) => {
            return addr.address === address;
          });
        }).map(wallet => {
          return Object.assign({}, wallet);
        });

        this.wallets = filteredWallets.map(wallet => {
          wallet.addresses = wallet.addresses.filter(addr => addr.address === address);
          return wallet;
        });
      } else {
        this.wallets = wallets;
      }
    });
  }
}
