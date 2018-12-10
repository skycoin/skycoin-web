import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Subscription } from 'rxjs/Subscription';
import { TranslateService } from '@ngx-translate/core';

import { Wallet } from '../../../app.datatypes';
import { WalletService } from '../../../services/wallet/wallet.service';
import { CreateWalletComponent } from './create-wallet/create-wallet.component';
import { openUnlockWalletModal, openDeleteWalletModal } from '../../../utils/index';
import { CoinService } from '../../../services/coin.service';
import { BaseCoin } from '../../../coins/basecoin';

@Component({
  selector: 'app-wallets',
  templateUrl: './wallets.component.html',
  styleUrls: ['./wallets.component.scss'],
})
export class WalletsComponent implements OnInit, OnDestroy {

  wallets: Wallet[];
  currentCoin: BaseCoin;

  private subscription: Subscription;
  private confirmSeedSubscription: Subscription;
  private deleteWalletSubscription: Subscription;

  constructor(
    private walletService: WalletService,
    private dialog: MatDialog,
    private coinService: CoinService,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    this.subscription = this.walletService.currentWallets.subscribe( (wallets) => {
      this.wallets = wallets;
    });

    this.subscription.add(this.coinService.currentCoin
      .subscribe((coin: BaseCoin) => this.currentCoin = coin)
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.removeConfirmationSuscriptions();
  }

  addWallet(create: boolean) {
    const config = new MatDialogConfig();
    config.width = '566px';
    config.data = { create };
    this.dialog.open(CreateWalletComponent, config);
  }

  unlockWallet(event, wallet: Wallet) {
    if (!wallet.needSeedConfirmation) {
      event.stopPropagation();
      openUnlockWalletModal(wallet, this.dialog);
    }
  }

  toggleWallet(wallet: Wallet) {
    if (wallet.needSeedConfirmation) {
      this.removeConfirmationSuscriptions();

      const unlogDialog = openUnlockWalletModal({wallet: wallet}, this.dialog).componentInstance;

      this.confirmSeedSubscription = unlogDialog.onWalletUnlocked.first().subscribe(() => {
        wallet.needSeedConfirmation = false;
        this.walletService.saveWallets();
        wallet.opened ? wallet.opened = false : wallet.opened = true;
      });

      this.confirmSeedSubscription = unlogDialog.onDeleteClicked.first().subscribe(() => {
        openDeleteWalletModal(this.dialog, wallet, this.translateService, this.walletService);
      });
    } else {
      wallet.opened ? wallet.opened = false : wallet.opened = true;
    }
  }

  private removeConfirmationSuscriptions() {
    if (this.confirmSeedSubscription) {
      this.confirmSeedSubscription.unsubscribe();
    }
    if (this.deleteWalletSubscription) {
      this.deleteWalletSubscription.unsubscribe();
    }
  }
}
