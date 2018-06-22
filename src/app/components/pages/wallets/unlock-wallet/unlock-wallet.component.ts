import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

import { Wallet } from '../../../../app.datatypes';
import { WalletService } from '../../../../services/wallet.service';

@Component({
  selector: 'app-unlock-wallet',
  templateUrl: './unlock-wallet.component.html',
  styleUrls: ['./unlock-wallet.component.scss'],
})
export class UnlockWalletComponent implements OnInit {
  @Output() onWalletUnlocked = new EventEmitter<void>();
  @ViewChild('unlock') unlockButton;
  form: FormGroup;
  loadingProgress = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Wallet,
    public dialogRef: MatDialogRef<UnlockWalletComponent>,
    private formBuilder: FormBuilder,
    private walletService: WalletService,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit() {
    this.initForm();
  }

  closePopup() {
    this.dialogRef.close();
  }

  unlockWallet() {
    this.unlockButton.setLoading();

    const onProgressChanged = new EventEmitter<number>();
    if (this.data.addresses.length > 1) {
      onProgressChanged.subscribe((progress) => this.loadingProgress = progress);
    }

    this.walletService.unlockWallet(this.data, this.form.value.seed, onProgressChanged)
      .subscribe(
        () => this.onUnlockSuccess(),
        (error: Error) => this.onUnlockError(error)
      );
  }

  private initForm() {
    this.form = this.formBuilder.group({
      seed: [this.data.seed || '', Validators.required],
    });
  }

  private onUnlockSuccess() {
    this.unlockButton.setSuccess();
    this.closePopup();
    this.onWalletUnlocked.emit();
  }

  private onUnlockError(error: Error) {
    const config = new MatSnackBarConfig();
    config.duration = 5000;
    this.snackbar.open(error.message, null, config);
    this.unlockButton.setError({ _body: error.message });
  }
}
