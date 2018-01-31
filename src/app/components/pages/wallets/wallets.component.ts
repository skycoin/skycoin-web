import { Component } from '@angular/core';
import { WalletService } from '../../../services/wallet.service';
import { MdDialog, MdDialogConfig } from '@angular/material';
import { CreateWalletComponent } from './create-wallet/create-wallet.component';
import {Wallet} from '../../../app.datatypes';
import {UnlockWalletComponent} from './unlock-wallet/unlock-wallet.component';

@Component({
  selector: 'app-wallets',
  templateUrl: './wallets.component.html',
  styleUrls: ['./wallets.component.scss']
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

  loadWallet(){}

  toggleWallet(wallet: Wallet) {
    wallet.opened = !wallet.opened;
  }

}
