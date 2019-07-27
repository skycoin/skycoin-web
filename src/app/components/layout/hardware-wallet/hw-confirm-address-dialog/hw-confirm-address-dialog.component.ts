import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HwDialogBaseComponent } from '../hw-dialog-base.component';
import { Address } from '../../../../app.datatypes';
import { HwWalletService } from '../../../../services/hw-wallet/hw-wallet.service';
import { WalletService } from '../../../../services/wallet/wallet.service';

export class AddressConfirmationParams {
  address: Address;
  addressIndex: number;
  showCompleteConfirmation: boolean;
}

@Component({
  selector: 'app-hw-confirm-address-dialog',
  templateUrl: './hw-confirm-address-dialog.component.html',
  styleUrls: ['./hw-confirm-address-dialog.component.scss'],
})
export class HwConfirmAddressDialogComponent extends HwDialogBaseComponent<HwConfirmAddressDialogComponent> {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: AddressConfirmationParams,
    public dialogRef: MatDialogRef<HwConfirmAddressDialogComponent>,
    private hwWalletService: HwWalletService,
    private walletService: WalletService,
  ) {
    super(hwWalletService, dialogRef);
    this.operationSubscription = this.hwWalletService.confirmAddress(data.addressIndex).subscribe(
      () => {
        this.showResult({
          text: data.showCompleteConfirmation ? 'hardware-wallet.confirm-address.confirmation' : 'hardware-wallet.confirm-address.short-confirmation',
          icon: this.msgIcons.Success,
        });
        this.data.address.confirmed = true;
        this.walletService.saveWallets();
      },
      err => this.processResult(err.result),
    );
  }
}
