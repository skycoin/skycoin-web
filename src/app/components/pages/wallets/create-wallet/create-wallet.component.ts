import { Component, Inject, ViewChild, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA, MatSnackBarConfig, MatSnackBar } from '@angular/material';

import { WalletService } from '../../../../services/wallet/wallet.service';
import { ButtonComponent } from '../../../layout/button/button.component';
import { CoinService } from '../../../../services/coin.service';
import { BaseCoin } from '../../../../coins/basecoin';
import { CreateWalletFormComponent } from './create-wallet-form/create-wallet-form.component';

@Component({
  selector: 'app-create-wallet',
  templateUrl: './create-wallet.component.html',
  styleUrls: ['./create-wallet.component.scss'],
})
export class CreateWalletComponent implements OnDestroy {
  @ViewChild('formControl') formControl: CreateWalletFormComponent;
  @ViewChild('create') createButton: ButtonComponent;

  disableDismiss = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<CreateWalletComponent>,
    private walletService: WalletService,
    private snackBar: MatSnackBar,
    private coinService: CoinService
  ) { }

  ngOnDestroy() {
    this.snackBar.dismiss();
  }

  closePopup() {
    this.dialogRef.close();
  }

  createWallet() {
    this.createButton.setLoading();
    this.disableDismiss = true;

    const data = this.formControl.getData();

    this.walletService.create(data.label, data.seed, data.coin.id)
      .subscribe(
        () => this.onCreateSuccess(data.coin),
        (error) => this.onCreateError(error.message)
      );
  }

  private onCreateSuccess(coin: BaseCoin) {
    this.createButton.setSuccess();
    this.dialogRef.close();
    this.coinService.changeCoin(coin);
  }

  private onCreateError(errorMesasge: string) {
    const config = new MatSnackBarConfig();
    config.duration = 5000;
    this.snackBar.open(errorMesasge, null, config);
    this.createButton.setError(errorMesasge);

    this.disableDismiss = false;
  }
}
