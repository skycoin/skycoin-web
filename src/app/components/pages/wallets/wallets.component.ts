import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Wallet } from '../../../app.datatypes';
import { WalletService } from '../../../services/wallet.service';
import { CreateWalletComponent } from './create-wallet/create-wallet.component';
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
