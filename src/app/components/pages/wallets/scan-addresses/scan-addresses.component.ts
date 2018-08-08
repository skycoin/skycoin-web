import { Component, EventEmitter, Inject, OnInit, Output, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs/Subscription';

import { Wallet } from '../../../../app.datatypes';
import { WalletService, ScanProgressData } from '../../../../services/wallet/wallet.service';

@Component({
  selector: 'app-scan-addresses',
  templateUrl: './scan-addresses.component.html',
  styleUrls: ['./scan-addresses.component.scss'],
})
export class ScanAddressesComponent implements OnInit, OnDestroy {
  progress = new ScanProgressData();

  private subscription: Subscription;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Wallet,
    public dialogRef: MatDialogRef<ScanAddressesComponent>,
    private walletService: WalletService
  ) {}

  ngOnInit() {
    this.scan();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  closePopup(result = null) {
    this.dialogRef.close(result);
  }

  scan() {
    const onProgressChanged = new EventEmitter<ScanProgressData>();
    this.subscription = onProgressChanged.subscribe((progress: ScanProgressData) => this.progress = progress);

    this.subscription.add(this.walletService.scanAddresses(this.data, onProgressChanged)
      .subscribe(
        () => this.closePopup(null),
        (error: Error) => this.closePopup(error)
      )
    );
  }
}
