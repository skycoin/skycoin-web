import { Component, Input } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';

import { Wallet } from '../../../../app.datatypes';
import { WalletService } from '../../../../services/wallet.service';
import { QrCodeComponent } from '../../../layout/qr-code/qr-code.component';
import { ChangeNameComponent } from '../change-name/change-name.component';
import { openUnlockWalletModal, copyAddress } from '../../../../utils/index';

@Component({
  selector: 'app-wallet-detail',
  templateUrl: './wallet-detail.component.html',
  styleUrls: ['./wallet-detail.component.scss'],
})
export class WalletDetailComponent {
  @Input() wallet: Wallet;

  constructor(
    private walletService: WalletService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  showQr(address) {
    const config = new MatDialogConfig();
    config.data = address;
    this.dialog.open(QrCodeComponent, config);
  }

  editWallet() {
    const config = new MatDialogConfig();
    config.width = '566px';
    config.data = this.wallet;
    this.dialog.open(ChangeNameComponent, config);
  }

  onAddNewAddress() {
    if (!this.wallet.seed || !this.wallet.addresses[this.wallet.addresses.length - 1].next_seed) {
      openUnlockWalletModal(this.wallet, this.dialog).componentInstance.onWalletUnlocked
        .subscribe(() => this.addNewAddress());
    } else {
      this.addNewAddress();
    }
  }

  toggleEmpty() {
    this.wallet.hideEmpty = !this.wallet.hideEmpty;
  }

  onCopyAddress(address) {
    copyAddress(address);
  }

  private addNewAddress() {
    try {
      this.walletService.addAddress(this.wallet);
    } catch (exception) {
      const config = new MatSnackBarConfig();
      config.duration = 5000;
      this.snackBar.open(exception.message, null, config);
    }
  }
}
