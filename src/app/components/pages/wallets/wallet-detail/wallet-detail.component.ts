import { Component, Input } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';

import { ConfirmationData, Wallet, Address } from '../../../../app.datatypes';
import { WalletService } from '../../../../services/wallet/wallet.service';
import { QrCodeComponent } from '../../../layout/qr-code/qr-code.component';
import { ChangeNameComponent } from '../change-name/change-name.component';
import { openUnlockWalletModal } from '../../../../utils/index';
import { ConfirmationComponent } from '../../../layout/confirmation/confirmation.component';

@Component({
  selector: 'app-wallet-detail',
  templateUrl: './wallet-detail.component.html',
  styleUrls: ['./wallet-detail.component.scss'],
})
export class WalletDetailComponent {
  @Input() wallet: Wallet;

  isAddressCreating = false;

  constructor(
    private walletService: WalletService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private translateService: TranslateService
  ) {}

  onShowQr(address: Address) {
    const config = new MatDialogConfig();
    config.data = address;
    this.dialog.open(QrCodeComponent, config);
  }

  onEditWallet() {
    const config = new MatDialogConfig();
    config.width = '566px';
    config.data = this.wallet;
    this.dialog.open(ChangeNameComponent, config);
  }

  onAddNewAddress() {
    if (this.wallet.addresses.length < 5) {
      this.verifyBeforeAddingNewAddress();
    } else {
      const dialogRef = this.showConfirmationModal(
        this.translateService.instant('wallet.add-confirmation'),
        null
      );

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.verifyBeforeAddingNewAddress();
        }
      });
    }
  }

  onCopySuccess(address: Address, interval = 500) {
    if (address.isCopying) {
      return;
    }

    address.isCopying = true;

    // wait for a while and then remove the 'copying' class
    setTimeout(() => {
      address.isCopying = false;
    }, interval);
  }

  onToggleEmpty() {
    this.wallet.hideEmpty = !this.wallet.hideEmpty;
  }

  onDeleteWallet() {
    const dialogRef = this.showConfirmationModal(
      this.translateService.instant('wallet.delete-confirmation1') + ' \"' +
      this.wallet.label + '\" ' +
      this.translateService.instant('wallet.delete-confirmation2'),
      this.translateService.instant('wallet.delete-confirmation-check'),
    );

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.walletService.delete(this.wallet);
      }
    });
  }

  private verifyBeforeAddingNewAddress() {
    if (!this.wallet.seed || !this.wallet.addresses[this.wallet.addresses.length - 1].next_seed) {
      openUnlockWalletModal(this.wallet, this.dialog).componentInstance.onWalletUnlocked
        .subscribe(() => this.addNewAddress());
    } else {
      this.addNewAddress();
    }
  }

  private addNewAddress() {
    this.isAddressCreating = true;

    setTimeout(() => {
      this.walletService.addAddress(this.wallet)
        .subscribe(
          () => { this.isAddressCreating = false; },
          (error: Error) => this.onAddAddressError(error)
        );
    }, 0);
  }

  private onAddAddressError(error: Error) {
    this.isAddressCreating = false;

    const config = new MatSnackBarConfig();
    config.duration = 5000;
    this.snackBar.open(error.message, null, config);
  }

  private showConfirmationModal(text: string, checkboxText: string): MatDialogRef<ConfirmationComponent, any> {
    const confirmationData: ConfirmationData = {
      text: text,
      headerText: this.translateService.instant('confirmation.header-text'),
      checkboxText: checkboxText,
      confirmButtonText: this.translateService.instant('confirmation.confirm-button'),
      cancelButtonText: this.translateService.instant('confirmation.cancel-button')
    };

    return this.dialog.open(ConfirmationComponent, <MatDialogConfig>{
      width: '450px',
      data: confirmationData,
      autoFocus: false
    });
  }
}
