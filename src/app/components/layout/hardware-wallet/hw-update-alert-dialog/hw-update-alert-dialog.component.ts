import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { HwDialogBaseComponent } from '../hw-dialog-base.component';
import { HwWalletService } from '../../../../services/hw-wallet/hw-wallet.service';

@Component({
  selector: 'app-hw-update-alert-dialog',
  templateUrl: './hw-update-alert-dialog.component.html',
  styleUrls: ['./hw-update-alert-dialog.component.scss'],
})
export class HwUpdateAlertDialogComponent extends HwDialogBaseComponent<HwUpdateAlertDialogComponent> {

  constructor(
    public dialogRef: MatDialogRef<HwUpdateAlertDialogComponent>,
    hwWalletService: HwWalletService,
  ) {
    super(hwWalletService, dialogRef);
  }

  update() {
    this._dialogRef.close(true);
  }
}
