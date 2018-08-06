import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';

import { SpendingService } from '../../../../services/wallet/spending.service';
import { Wallet } from '../../../../app.datatypes';
import { BaseCoin } from '../../../../coins/basecoin';
import { CoinService } from '../../../../services/coin.service';
import { openQrModal } from '../../../../utils';

@Component({
  selector: 'app-outputs',
  templateUrl: './outputs.component.html',
  styleUrls: ['./outputs.component.scss']
})
export class OutputsComponent implements OnInit, OnDestroy {

  wallets: Wallet[];
  currentCoin: BaseCoin;

  private subscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private spendingService: SpendingService,
    private dialog: MatDialog,
    private coinService: CoinService
  ) { }

  ngOnInit() {
    this.subscription = this.coinService.currentCoin
      .subscribe((coin: BaseCoin) => {
        this.wallets = null;
        this.currentCoin = coin;
      });

    this.route.queryParams.first().subscribe(params => this.getWalletsOutputs(params));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  showQr(address) {
    openQrModal(this.dialog, address);
  }

  private getWalletsOutputs(queryParams: Params) {
    const address = queryParams['addr'];

    this.subscription.add(this.spendingService.outputsWithWallets().subscribe(wallets => {
      if (wallets.length === 0) {
        this.wallets = [];
        return;
      }

      this.wallets = !!address
        ? this.getOutputsForSpecificAddress(wallets, address)
        : this.getOutputs(wallets);
      })
    );
  }

  private getOutputsForSpecificAddress(wallets, address: string) {
    const filteredWallets: Wallet[]  = wallets.filter(wallet => {
      return wallet.addresses.find((addr) => {
        return addr.address === address;
      });
    }).map(wallet => {
      return Object.assign({}, wallet);
    });

    return filteredWallets.map(wallet => {
      wallet.addresses = wallet.addresses.filter(addr => addr.address === address);
      return wallet;
    });
  }

  private getOutputs(wallets) {
    const copiedWallets = wallets.map(wallet => Object.assign({}, wallet));

    return copiedWallets.filter(wallet => {
      wallet.addresses = wallet.addresses.filter(addr => addr.outputs.length > 0);
      return wallet.addresses.length > 0;
    });
  }
}
