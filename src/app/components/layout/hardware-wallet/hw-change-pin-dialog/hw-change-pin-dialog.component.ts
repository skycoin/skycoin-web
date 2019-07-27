import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChildHwDialogParams } from '../hw-options-dialog/hw-options-dialog.component';
import { HwDialogBaseComponent } from '../hw-dialog-base.component';
import { HwWalletService } from '../../../../services/hw-wallet/hw-wallet.service';
import { config } from '../../../../app.config';

@Component({
  selector: 'app-hw-change-pin-dialog',
  templateUrl: './hw-change-pin-dialog.component.html',
  styleUrls: ['./hw-change-pin-dialog.component.scss'],
})
export class HwChangePinDialogComponent extends HwDialogBaseComponent<HwChangePinDialogComponent> {
  changingExistingPin: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ChildHwDialogParams,
    public dialogRef: MatDialogRef<HwChangePinDialogComponent>,
    private hwWalletService: HwWalletService,
  ) {
    super(hwWalletService, dialogRef);

    this.changingExistingPin = data.walletHasPin;

    this.operationSubscription = this.hwWalletService.getFeatures().flatMap(features => {
      if (config.useHwWalletDaemon) {
        return this.hwWalletService.changePin(features.rawResponse.pin_protection);
      } else {
        return this.hwWalletService.changePin(features.rawResponse.pinProtection);
      }
    }).subscribe(
      () => {
        this.showResult({
          text: 'hardware-wallet.general.completed',
          icon: this.msgIcons.Success,
        });
        this.data.requestOptionsComponentRefresh(null, true);
      },
      err => this.processResult(err.result),
    );
  }
}
