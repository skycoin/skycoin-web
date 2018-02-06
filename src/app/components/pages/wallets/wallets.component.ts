import { Component } from '@angular/core';
import { MdDialog, MdDialogConfig } from '@angular/material';
import { WalletService } from '../../../services/wallet.service';
import { CreateWalletComponent } from './create-wallet/create-wallet.component';

@Component({
  selector: 'app-wallets',
  templateUrl: './wallets.component.html',
  styleUrls: ['./wallets.component.css'],
})
export class WalletsComponent {

  constructor(
    public walletService: WalletService,
    private dialog: MdDialog,
  ) {}

  addWallet() {
    const config = new MdDialogConfig();
    config.width = '500px';
    this.dialog.open(CreateWalletComponent, config);
  }
}
