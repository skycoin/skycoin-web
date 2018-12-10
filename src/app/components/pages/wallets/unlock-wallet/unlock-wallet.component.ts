import { Component, EventEmitter, Inject, OnInit, Output, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ISubscription } from 'rxjs/Subscription';

import { Wallet } from '../../../../app.datatypes';
import { WalletService } from '../../../../services/wallet/wallet.service';

export class ComfirmSeedParams {
  wallet: Wallet;
}

@Component({
  selector: 'app-unlock-wallet',
  templateUrl: './unlock-wallet.component.html',
  styleUrls: ['./unlock-wallet.component.scss'],
})
export class UnlockWalletComponent implements OnInit, OnDestroy {
  @Output() onWalletUnlocked = new EventEmitter<void>();
  @Output() onDeleteClicked = new EventEmitter<void>();
  @ViewChild('unlock') unlockButton;
  form: FormGroup;
  disableDismiss = false;
  loadingProgress = 0;
  showComfirmSeedWarning;

  private wallet: Wallet;
  private unlockSubscription: ISubscription;
  private progressSubscription: ISubscription;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data,
    public dialogRef: MatDialogRef<UnlockWalletComponent>,
    private formBuilder: FormBuilder,
    private walletService: WalletService,
    private snackbar: MatSnackBar
  ) {
    if (data.wallet) {
      this.showComfirmSeedWarning = true;
      this.wallet = data.wallet;
    } else {
      this.showComfirmSeedWarning = false;
      this.wallet = data;
    }
  }

  ngOnInit() {
    this.initForm();
  }

  ngOnDestroy() {
    this.snackbar.dismiss();
    this.removeProgressSubscriptions();
  }

  closePopup() {
    this.dialogRef.close();
  }

  unlockWallet() {
    this.removeProgressSubscriptions();

    this.unlockButton.setLoading();
    this.disableDismiss = true;

    const onProgressChanged = new EventEmitter<number>();
    if (this.wallet.addresses.length > 1) {
      this.progressSubscription = onProgressChanged.subscribe((progress) => this.loadingProgress = progress);
    }

    const seed = !this.showComfirmSeedWarning ?
      this.form.value.seed :
      (this.form.value.seed as string).substr(0, (this.form.value.seed as string).length - 1);

    this.unlockSubscription = this.walletService.unlockWallet(this.wallet, seed, onProgressChanged)
      .subscribe(
        () => this.onUnlockSuccess(),
        (error: Error) => this.onUnlockError(error)
      );
  }

  delete() {
    this.closePopup();
    this.onDeleteClicked.emit();
  }

  private initForm() {
    this.form = this.formBuilder.group({
      seed: ['', Validators.required],
    });

    if (this.showComfirmSeedWarning) {
      this.form.controls.seed.setValidators([
        Validators.required,
        this.validateSeedConfirmation,
      ]);
    }
  }

  private onUnlockSuccess() {
    this.removeProgressSubscriptions();
    this.unlockButton.setSuccess();
    this.closePopup();
    this.onWalletUnlocked.emit();
  }

  private onUnlockError(error: Error) {
    this.removeProgressSubscriptions();
    this.disableDismiss = false;
    const config = new MatSnackBarConfig();
    config.duration = 5000;
    this.snackbar.open(error.message, null, config);
    this.unlockButton.setError(error.message);
  }

  private removeProgressSubscriptions() {
    if (this.progressSubscription && !this.progressSubscription.closed) {
      this.progressSubscription.unsubscribe();
    }
    if (this.unlockSubscription && !this.unlockSubscription.closed) {
      this.unlockSubscription.unsubscribe();
    }
  }

  private validateSeedConfirmation(seedControl: FormControl) {
    if (!(seedControl.value as string).endsWith('?')) {
      return { Invalid: true };
    }

    return null;
  }
}
