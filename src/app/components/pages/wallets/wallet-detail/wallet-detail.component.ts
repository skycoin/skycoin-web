import { Component, Input, OnDestroy } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';

import { ConfirmationData, Wallet, Address } from '../../../../app.datatypes';
import { WalletService } from '../../../../services/wallet/wallet.service';
import { ChangeNameComponent } from '../change-name/change-name.component';
import { openUnlockWalletModal, openQrModal, showConfirmationModal, openDeleteWalletModal } from '../../../../utils/index';
import { Subscription, ISubscription } from 'rxjs/Subscription';
import { WalletOptionsComponent, WalletOptionsResponses } from './wallet-options/wallet-options.component';
import { CustomMatDialogService } from '../../../../services/custom-mat-dialog.service';
import { config } from '../../../../app.config';

@Component({
  selector: 'app-wallet-detail',
  templateUrl: './wallet-detail.component.html',
  styleUrls: ['./wallet-detail.component.scss'],
})
export class WalletDetailComponent implements OnDestroy {
  @Input() wallet: Wallet;

  creatingAddress = false;
  showSlowMobileInfo = false;

  private unlockSubscription: Subscription;
  private slowInfoSubscription: ISubscription;

  constructor(
    private walletService: WalletService,
    private dialog: CustomMatDialogService,
    private snackBar: MatSnackBar,
    private translateService: TranslateService
  ) {}

  ngOnDestroy() {
    this.snackBar.dismiss();
    this.removeUnlockSubscription();
    this.removeSlowInfoSubscription();
  }

  onShowQr(address: Address) {
    openQrModal(this.dialog, address.address, true);
  }

  onShowQrIfPointer(component: HTMLDivElement, address: Address) {
    if (getComputedStyle(component).cursor === 'pointer') {
      this.onShowQr(address);
    }
  }

  onEditWallet() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '566px';
    dialogConfig.data = this.wallet;
    dialogConfig.autoFocus = false;
    this.dialog.open(ChangeNameComponent, dialogConfig);
  }

  onShowOptions() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '566px';
    dialogConfig.autoFocus = false;
    this.dialog.open(WalletOptionsComponent, dialogConfig).afterClosed().subscribe((response: WalletOptionsResponses | null) => {
      if (response != null && response !== undefined) {
        if (response === WalletOptionsResponses.AddNewAddress) {
          this.onAddNewAddress();
        } else if (response === WalletOptionsResponses.EditWallet) {
          this.onEditWallet();
        } else if (response === WalletOptionsResponses.DeleteWallet) {
          this.onDeleteWallet();
        }
      }
    });
  }

  onAddNewAddress() {
    if (this.wallet.addresses.length < 5) {
      this.verifyBeforeAddingNewAddress();
    } else {
      const confirmationData: ConfirmationData = {
        text: 'wallet.add-confirmation',
        headerText: 'confirmation.header-text',
        confirmButtonText: 'confirmation.confirm-button',
        cancelButtonText: 'confirmation.cancel-button'
      };

      showConfirmationModal(this.dialog, confirmationData).afterClosed().subscribe(result => {
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
    openDeleteWalletModal(this.dialog, this.wallet, this.translateService, this.walletService);
  }

  private verifyBeforeAddingNewAddress() {
    if (!this.wallet.seed || !this.wallet.addresses[this.wallet.addresses.length - 1].next_seed) {
      this.removeUnlockSubscription();

      this.unlockSubscription = openUnlockWalletModal(this.wallet, this.dialog).componentInstance.onWalletUnlocked.first()
        .subscribe(() => this.addNewAddress());
    } else {
      this.addNewAddress();
    }
  }

  private addNewAddress() {
    if (this.creatingAddress === true) {
      const snackBarConfig = new MatSnackBarConfig();
      snackBarConfig.duration = 5000;
      this.snackBar.open(this.translateService.instant('wallet.already-adding-address-error'), null, snackBarConfig);

      return;
    }

    this.creatingAddress = true;

    this.slowInfoSubscription = Observable.of(1).delay(config.timeBeforeSlowMobileInfo)
      .subscribe(() => this.showSlowMobileInfo = true);

    setTimeout(() => {
      this.walletService.addAddress(this.wallet)
        .subscribe(
          () => {
            this.showSlowMobileInfo = false;
            this.removeSlowInfoSubscription();
            this.creatingAddress = false;
          },
          (error: Error) => this.onAddAddressError(error)
        );
    }, 0);
  }

  private onAddAddressError(error: Error) {
    this.showSlowMobileInfo = false;
    this.removeSlowInfoSubscription();
    this.creatingAddress = false;

    const snackBarConfig = new MatSnackBarConfig();
    snackBarConfig.duration = 5000;
    this.snackBar.open(error.message, null, snackBarConfig);
  }

  private removeUnlockSubscription() {
    if (this.unlockSubscription) {
      this.unlockSubscription.unsubscribe();
    }
  }

  private removeSlowInfoSubscription() {
    if (this.slowInfoSubscription) {
      this.slowInfoSubscription.unsubscribe();
    }
  }
}
