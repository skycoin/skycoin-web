import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Wallet } from '../../../app.datatypes';
import { WalletService } from '../../../services/wallet.service';
import { CreateWalletComponent } from './create-wallet/create-wallet.component';
import { LoadWalletComponent } from './load-wallet/load-wallet.component';
import { openUnlockWalletModal } from '../../../utils/index';

@Component({
  selector: 'app-wallets',
  templateUrl: './wallets.component.html',
  styleUrls: ['./wallets.component.scss'],
})
export class WalletsComponent implements OnInit {

  wallets: Wallet[];

  constructor(
    private walletService: WalletService,
    private dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.walletService.all.subscribe( (wallets) => {
      this.wallets = wallets;
    });
  }

  addWallet() {
    const config = new MatDialogConfig();
    config.width = '566px';
    this.dialog.open(CreateWalletComponent, config);
  }

  unlockWallet(wallet: Wallet) {
    openUnlockWalletModal(wallet, this.dialog);
  }

  loadWallet() {
    const config = new MatDialogConfig();
    config.width = '566px';
    this.dialog.open(LoadWalletComponent, config);
  }

  toggleWallet(wallet: Wallet) {
    wallet.opened ? wallet.opened = false : wallet.opened = true;
  }
}
