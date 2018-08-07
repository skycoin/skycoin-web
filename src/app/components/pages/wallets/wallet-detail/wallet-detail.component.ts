import { Component, Input, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';

import { ConfirmationData, Wallet, Address } from '../../../../app.datatypes';
import { WalletService } from '../../../../services/wallet/wallet.service';
import { ChangeNameComponent } from '../change-name/change-name.component';
import { openUnlockWalletModal, openQrModal, showConfirmationModal } from '../../../../utils/index';
import { ConfirmationComponent } from '../../../layout/confirmation/confirmation.component';

@Component({
  selector: 'app-wallet-detail',
  templateUrl: './wallet-detail.component.html',
  styleUrls: ['./wallet-detail.component.scss'],
})
export class WalletDetailComponent implements OnDestroy {
  @Input() wallet: Wallet;

  creatingAddress = false;

  constructor(
    private walletService: WalletService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private translateService: TranslateService
  ) {}

  ngOnDestroy() {
    this.snackBar.dismiss();
  }

  onShowQr(address: Address) {
    openQrModal(this.dialog, address.address);
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
        'wallet.add-confirmation',
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
    this.creatingAddress = true;

    setTimeout(() => {
      this.walletService.addAddress(this.wallet)
        .subscribe(
          () => { this.creatingAddress = false; },
          (error: Error) => this.onAddAddressError(error)
        );
    }, 0);
  }

  private onAddAddressError(error: Error) {
    this.creatingAddress = false;

    const config = new MatSnackBarConfig();
    config.duration = 5000;
    this.snackBar.open(error.message, null, config);
  }

  private showConfirmationModal(text: string, checkboxText: string): MatDialogRef<ConfirmationComponent, any> {
    const confirmationData: ConfirmationData = {
      text: text,
      headerText: 'confirmation.header-text',
      checkboxText: checkboxText,
      confirmButtonText: 'confirmation.confirm-button',
      cancelButtonText: 'confirmation.cancel-button'
    };

    return showConfirmationModal(this.dialog, confirmationData);
  }
}
