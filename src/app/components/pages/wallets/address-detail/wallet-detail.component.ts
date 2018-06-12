import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';

import { ConfirmationData, Wallet } from '../../../../app.datatypes';
import { WalletService } from '../../../../services/wallet.service';
import { QrCodeComponent } from '../../../layout/qr-code/qr-code.component';
import { ChangeNameComponent } from '../change-name/change-name.component';
import { openUnlockWalletModal } from '../../../../utils/index';
import { ConfirmationComponent } from '../../../layout/confirmation/confirmation.component';

@Component({
  selector: 'app-wallet-detail',
  templateUrl: './wallet-detail.component.html',
  styleUrls: ['./wallet-detail.component.scss'],
})
export class WalletDetailComponent implements OnInit {
  @Input() wallet: Wallet;

  private deleteConfirmation1: string;
  private deleteConfirmation2: string;
  private deleteConfirmationCheck: string;
  private headerText: string;
  private confirmButtonText: string;
  private cancelButtonText: string;

  constructor(
    private walletService: WalletService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    this.translateService.get('wallet').subscribe(res => {
      this.deleteConfirmation1 = res['delete-confirmation1'];
      this.deleteConfirmation2 = res['delete-confirmation2'];
      this.deleteConfirmationCheck = res['delete-confirmation-check'];
    });

    this.translateService.get('confirmation').subscribe(res => {
      this.headerText = res['header-text'];
      this.confirmButtonText = res['confirm-button'];
      this.cancelButtonText = res['cancel-button'];
    });
  }

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
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      width: '500px',
      data: this.getConfirmationData()
    });

    dialogRef.afterClosed()
      .subscribe(result => {
        if (result) {
          this.walletService.delete(this.wallet);
        }
      });
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

  private getConfirmationData(): ConfirmationData {
    return {
      text: `${this.deleteConfirmation1} "${this.wallet.label}" ${this.deleteConfirmation2}`,
      headerText: this.headerText,
      displayCheckbox: true,
      checkboxText: this.deleteConfirmationCheck,
      confirmButtonText: this.confirmButtonText,
      cancelButtonText: this.cancelButtonText
    };
  }
}
