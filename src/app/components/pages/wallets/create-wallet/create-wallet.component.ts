import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA, MatSnackBarConfig, MatSnackBar } from '@angular/material';
import * as Bip39 from 'bip39';

import { WalletService } from '../../../../services/wallet.service';
import { ButtonComponent } from '../../../layout/button/button.component';
import { CoinService } from '../../../../services/coin.service';
import { BaseCoin } from '../../../../coins/basecoin';

@Component({
  selector: 'app-create-wallet',
  templateUrl: './create-wallet.component.html',
  styleUrls: ['./create-wallet.component.scss'],
})
export class CreateWalletComponent implements OnInit {
  @ViewChild('create') createButton: ButtonComponent;

  form: FormGroup;
  seed: string;
  disableDismiss = false;
  haveManyCoins: boolean;

  private currentCoin: BaseCoin;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<CreateWalletComponent>,
    private walletService: WalletService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private coinService: CoinService
  ) { }

  ngOnInit() {
    this.haveManyCoins = this.coinService.coins.length > 1;
    this.currentCoin = this.coinService.currentCoin.getValue();
    this.initForm(this.currentCoin);
  }

  closePopup() {
    this.dialogRef.close();
  }

  createWallet() {
    this.createButton.setLoading();
    this.disableDismiss = true;
    this.dialogRef.disableClose = true;
    const coinToCreate: BaseCoin = this.form.value.coin;

    this.walletService.create(this.form.value.label, this.form.value.seed, coinToCreate.id)
      .subscribe(
        () => {
          this.onCreateSuccess(coinToCreate);
        },
        (error) => {
          this.onCreateError(error.message);
          this.disableDismiss = false;
          this.dialogRef.disableClose = false;
        }
      );
  }

  private generateSeed(entropy: number) {
    this.form.controls.seed.setValue(Bip39.generateMnemonic(entropy));
  }

  private onCreateSuccess(coin: BaseCoin) {
    this.createButton.setSuccess();
    this.dialogRef.close();

    if (coin.id !== this.currentCoin.id) {
      this.coinService.changeCoin(coin);
    }
  }

  private onCreateError(errorMesasge: string) {
    const config = new MatSnackBarConfig();
    config.duration = 5000;
    this.snackBar.open(errorMesasge, null, config);
    this.createButton.setError({ _body: errorMesasge });
  }

  private initForm(defaultCoin: BaseCoin) {
    this.form = this.formBuilder.group({
        label: new FormControl('', [ Validators.required ]),
        coin: new FormControl(defaultCoin, [ Validators.required ]),
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
