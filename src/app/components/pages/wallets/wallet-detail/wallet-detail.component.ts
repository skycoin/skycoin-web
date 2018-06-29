import { Component, Input } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';

import { ConfirmationData, Wallet } from '../../../../app.datatypes';
import { WalletService } from '../../../../services/wallet.service';
import { QrCodeComponent } from '../../../layout/qr-code/qr-code.component';
import { ChangeNameComponent } from '../change-name/change-name.component';
import { openUnlockWalletModal } from '../../../../utils/index';
import { ConfirmationComponent } from '../../../layout/confirmation/confirmation.component';
import { Observable } from 'rxjs/Observable';

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

  copyAddress(event, address, interval = 500) {
    event.stopPropagation();

    if (address.isCopying) {
      return;
    }

    const selBox = document.createElement('textarea');

    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = address.address;

    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();

    document.execCommand('copy');
    document.body.removeChild(selBox);

    address.isCopying = true;

    // wait for a while and then remove the 'copying' class
    setTimeout(() => {
      address.isCopying = false;
    }, interval);
  }

  toggleEmpty() {
    this.wallet.hideEmpty = !this.wallet.hideEmpty;
  }

  deleteWallet() {
    Observable.forkJoin(
      this.translateService.get('wallet'),
      this.translateService.get('confirmation')
    ).subscribe(([walletTranslation, confirmationTranslation]) => {
      const confirmationData = this.getConfirmationData(walletTranslation, confirmationTranslation);
      this.showDeleteConfirmation(confirmationData);
    });
  }

  private showDeleteConfirmation(confirmationData: ConfirmationData) {
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      width: '500px',
      data: confirmationData
    });

    dialogRef.afterClosed()
      .subscribe(result => {
        if (result) {
          this.walletService.delete(this.wallet);
        }
      });
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

  private getConfirmationData(walletTranslation, confirmationTranslation): ConfirmationData {
    return {
      text: `${walletTranslation['delete-confirmation1']} "${this.wallet.label}" ${walletTranslation['delete-confirmation2']}`,
      headerText: confirmationTranslation['header-text'],
      displayCheckbox: true,
      checkboxText: walletTranslation['delete-confirmation-check'],
      confirmButtonText: confirmationTranslation['confirm-button'],
      cancelButtonText: confirmationTranslation['cancel-button']
    };
  }
}
