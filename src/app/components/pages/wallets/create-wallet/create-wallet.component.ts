import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA, MatSnackBarConfig, MatSnackBar } from '@angular/material';
import * as Bip39 from 'bip39';

import { WalletService } from '../../../../services/wallet.service';
import { ButtonComponent } from '../../../layout/button/button.component';

@Component({
  selector: 'app-create-wallet',
  templateUrl: './create-wallet.component.html',
  styleUrls: ['./create-wallet.component.scss'],
})
export class CreateWalletComponent implements OnInit {
  @ViewChild('create') createButton: ButtonComponent;
  form: FormGroup;
  seed: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<CreateWalletComponent>,
    private walletService: WalletService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.initForm();
  }

  closePopup() {
    this.dialogRef.close();
  }

  createWallet() {
    this.createButton.setLoading();

    this.walletService.create(this.form.value.label, this.form.value.seed)
      .subscribe(
        () => this.onCreateSuccess(),
        (error) => this.onCreateError(error.message)
      );
  }

  private generateSeed(entropy: number) {
    this.form.controls.seed.setValue(Bip39.generateMnemonic(entropy));
  }

  private onCreateSuccess() {
    this.createButton.setSuccess();
    this.dialogRef.close();
  }

  private onCreateError(errorMesasge: string) {
    this.createButton.setSuccess();

    const config = new MatSnackBarConfig();
    config.duration = 5000;
    this.snackBar.open(errorMesasge, null, config);
  }

  private initForm() {
    this.form = this.formBuilder.group({
        label: new FormControl('', [ Validators.required ]),
        seed: new FormControl('', [ Validators.required ]),
        confirm_seed: new FormControl(),
      },
      {
        validator: this.data.create ? this.seedMatchValidator.bind(this) : null,
      }
    );

    if (this.data.create) {
      this.generateSeed(128);
    }
  }

  private seedMatchValidator(formGroup: FormGroup) {
    return formGroup.get('seed').value === formGroup.get('confirm_seed').value ? null : { NotEqual: true };
  }
}
