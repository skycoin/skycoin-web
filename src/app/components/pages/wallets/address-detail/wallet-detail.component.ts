import { Component, Input } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Wallet } from '../../../../app.datatypes';
import { WalletService } from '../../../../services/wallet.service';
import { QrCodeComponent } from '../../../layout/qr-code/qr-code.component';
import { ChangeNameComponent } from '../change-name/change-name.component';
import { UnlockWalletComponent } from '../unlock-wallet/unlock-wallet.component';

@Component({
  selector: 'app-wallet-detail',
  templateUrl: './wallet-detail.component.html',
  styleUrls: ['./wallet-detail.component.scss'],
})
export class WalletDetailComponent {
  @Input() wallet: Wallet;

  constructor(
    public walletService: WalletService,
    private dialog: MatDialog,
  ) {}

  addAddress() {
    this.walletService.addAddress(this.wallet);
  }

  renameWallet() {
    const config = new MatDialogConfig();
    config.width = '500px';
    config.data = this.wallet;
    this.dialog.open(ChangeNameComponent, config);
  }

  showQr(address) {
    const config = new MatDialogConfig();
    config.data = address;
    this.dialog.open(QrCodeComponent, config);
  }

  unlockWallet() {
    const config = new MatDialogConfig();
    config.width = '500px';
    config.data = this.wallet;
    this.dialog.open(UnlockWalletComponent, config);
  }

  editWallet() {
    const config = new MatDialogConfig();
    config.width = '566px';
    config.data = this.wallet;
    this.dialog.open(ChangeNameComponent, config);
  }

  newAddress() {
    this.walletService.addAddress(this.wallet);
  }

  toggleEmpty() {
    this.wallet.hideEmpty = !this.wallet.hideEmpty;
  }

}
