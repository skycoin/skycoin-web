import { Component, Input, OnDestroy } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';

import { ConfirmationData, Wallet, Address } from '../../../../app.datatypes';
import { WalletService } from '../../../../services/wallet/wallet.service';
import { ChangeNameComponent, ChangeNameData } from '../change-name/change-name.component';
import { openUnlockWalletModal, openQrModal, showConfirmationModal, openDeleteWalletModal } from '../../../../utils/index';
import { Subscription, ISubscription } from 'rxjs/Subscription';
import { WalletOptionsComponent, WalletOptionsResponses } from './wallet-options/wallet-options.component';
import { CustomMatDialogService } from '../../../../services/custom-mat-dialog.service';
import { config } from '../../../../app.config';
import { MsgBarService } from '../../../../services/msg-bar.service';
import { HwWalletService } from '../../../../services/hw-wallet/hw-wallet.service';
import { getHardwareWalletErrorMsg } from '../../../../utils/errors';
import { AddressConfirmationParams, HwConfirmAddressDialogComponent } from '../../../layout/hardware-wallet/hw-confirm-address-dialog/hw-confirm-address-dialog.component';

@Component({
  selector: 'app-wallet-detail',
  templateUrl: './wallet-detail.component.html',
  styleUrls: ['./wallet-detail.component.scss'],
})
export class WalletDetailComponent implements OnDestroy {
  @Input() wallet: Wallet;

  creatingAddress = false;
  showSlowMobileInfo = false;
  preparingToEdit = false;
  confirmingIndex = null;

  private unlockSubscription: Subscription;
  private slowInfoSubscription: ISubscription;
  private editSubscription: ISubscription;
  private confirmSubscription: ISubscription;

  constructor(
    private walletService: WalletService,
    private dialog: CustomMatDialogService,
    private translateService: TranslateService,
    private msgBarService: MsgBarService,
    private hwWalletService: HwWalletService,
  ) {}

  ngOnDestroy() {
    this.msgBarService.hide();
    this.removeUnlockSubscription();
    this.removeSlowInfoSubscription();
    if (this.editSubscription) {
      this.editSubscription.unsubscribe();
    }
    if (this.confirmSubscription) {
      this.confirmSubscription.unsubscribe();
    }
  }

  onShowQr(address: Address) {
    openQrModal(this.dialog, address.address, true);
  }

  onShowQrIfPointer(component: HTMLDivElement, address: Address, addressIndex: number) {
    if (getComputedStyle(component).cursor === 'pointer') {
      if (this.wallet.isHardware && !address.confirmed) {
        this.confirmAddress(address, addressIndex, true);
      } else {
        this.onShowQr(address);
      }
    }
  }

  onEditWallet() {
    this.msgBarService.hide();

    if (this.wallet.isHardware) {
      if (this.preparingToEdit) {
        return;
      }

      this.preparingToEdit = true;
      this.editSubscription = this.hwWalletService.checkIfCorrectHwConnected(this.wallet.addresses[0].address)
        .flatMap(() => this.walletService.getHwFeaturesAndUpdateData(this.wallet))
        .subscribe(
          response => {
            this.continueEditWallet();
            this.preparingToEdit = false;

            if (response.walletNameUpdated) {
              this.msgBarService.showWarning('hardware-wallet.general.name-updated');
            }
          },
          err => {
            this.msgBarService.showError(getHardwareWalletErrorMsg(this.translateService, err));
            this.preparingToEdit = false;
          },
        );
    } else {
      this.continueEditWallet();
    }
  }

  confirmAddress(address, addressIndex, showCompleteConfirmation) {
    if (this.confirmingIndex !== null) {
      return;
    }

    this.confirmingIndex = addressIndex;
    this.msgBarService.hide();

    if (this.confirmSubscription) {
      this.confirmSubscription.unsubscribe();
    }

    this.confirmSubscription = this.hwWalletService.checkIfCorrectHwConnected(this.wallet.addresses[0].address).subscribe(response => {
      const data = new AddressConfirmationParams();
      data.address = address;
      data.addressIndex = addressIndex;
      data.showCompleteConfirmation = showCompleteConfirmation;

      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = '566px';
      dialogConfig.autoFocus = false;
      dialogConfig.data = data;
      this.dialog.open(HwConfirmAddressDialogComponent, dialogConfig);

      this.confirmingIndex = null;
    }, err => {
      this.msgBarService.showError(getHardwareWalletErrorMsg(this.translateService, err));
      this.confirmingIndex = null;
    });
  }

  onShowOptions() {
    if (this.preparingToEdit) {
      return;
    }

    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '566px';
    dialogConfig.autoFocus = false;
    dialogConfig.data = this.wallet;
    this.dialog.open(WalletOptionsComponent, dialogConfig).afterClosed().subscribe((response: WalletOptionsResponses | null) => {
      if (response != null && response !== undefined) {
        if (response === WalletOptionsResponses.UnlockWallet) {
          openUnlockWalletModal(this.wallet, this.dialog);
        } else if (response === WalletOptionsResponses.AddNewAddress) {
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
    if (!this.wallet.seed || !this.wallet.nextSeed) {
      this.removeUnlockSubscription();

      this.unlockSubscription = openUnlockWalletModal(this.wallet, this.dialog).componentInstance.onWalletUnlocked.first()
        .subscribe(() => this.addNewAddress());
    } else {
      this.addNewAddress();
    }
  }

  private addNewAddress() {
    if (this.creatingAddress === true) {
      this.msgBarService.showError('wallet.already-adding-address-error');

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
    this.msgBarService.showError(error.message);
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

  private continueEditWallet() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '566px';
    dialogConfig.data = new ChangeNameData();
    (dialogConfig.data as ChangeNameData).wallet = this.wallet;
    this.dialog.open(ChangeNameComponent, dialogConfig);
  }
}
