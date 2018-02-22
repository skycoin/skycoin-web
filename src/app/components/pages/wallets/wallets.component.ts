import { Component } from '@angular/core';
import { MdDialog, MdDialogConfig } from '@angular/material';
import { Wallet } from '../../../app.datatypes';
import { WalletService } from '../../../services/wallet.service';
import { CreateWalletComponent } from './create-wallet/create-wallet.component';
import { LoadWalletComponent } from './load-wallet/load-wallet.component';
import { UnlockWalletComponent } from './unlock-wallet/unlock-wallet.component';

@Component({
  selector: 'app-wallets',
  templateUrl: './wallets.component.html',
  styleUrls: ['./wallets.component.scss'],
})
export class WalletsComponent {

  constructor(
    public walletService: WalletService,
    private dialog: MdDialog,
  ) {}

  addWallet() {
    const config = new MdDialogConfig();
    config.width = '566px';
    this.dialog.open(CreateWalletComponent, config);
  }
  unlockWallet(wallet: Wallet) {
    const config = new MdDialogConfig();
    config.width = '500px';
    config.data = wallet;
    this.dialog.open(UnlockWalletComponent, config);
  }

  loadWallet() {
    const config = new MdDialogConfig();
    config.width = '566px';
    this.dialog.open(LoadWalletComponent, config);
  }

  toggleWallet(wallet: Wallet) {
    wallet.opened ? wallet.opened = false : wallet.opened = true;
  }

}
