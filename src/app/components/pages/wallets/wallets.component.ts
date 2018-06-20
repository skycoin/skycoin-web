import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { Wallet } from '../../../app.datatypes';
import { WalletService } from '../../../services/wallet.service';
import { CreateWalletComponent } from './create-wallet/create-wallet.component';
import { openUnlockWalletModal } from '../../../utils/index';
import { CoinService } from '../../../services/coin.service';
import { BaseCoin } from '../../../coins/basecoin';
import { ISubscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-wallets',
  templateUrl: './wallets.component.html',
  styleUrls: ['./wallets.component.scss'],
})
export class WalletsComponent implements OnInit, OnDestroy {

  wallets: Wallet[];
  currentCoin: BaseCoin;

  private coinSubscription: ISubscription;

  constructor(
    private walletService: WalletService,
    private dialog: MatDialog,
    private coinService: CoinService
  ) {}

  ngOnInit() {
    this.walletService.all.subscribe( (wallets) => {
      this.wallets = wallets;
    });

    this.coinSubscription = this.coinService.currentCoin
      .subscribe((coin: BaseCoin) => this.currentCoin = coin);
  }

  ngOnDestroy() {
    this.coinSubscription.unsubscribe();
  }

  addWallet(create: boolean) {
    const config = new MatDialogConfig();
    config.width = '566px';
    config.data = { create };
    this.dialog.open(CreateWalletComponent, config);
  }

  unlockWallet(event, wallet: Wallet) {
    event.stopPropagation();

    openUnlockWalletModal(wallet, this.dialog);
  }

  toggleWallet(wallet: Wallet) {
    wallet.opened ? wallet.opened = false : wallet.opened = true;
  }
}
