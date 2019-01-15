import { Component, Inject, ViewChild, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA, MatSnackBarConfig, MatSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';

import { WalletService } from '../../../../services/wallet/wallet.service';
import { ButtonComponent } from '../../../layout/button/button.component';
import { CoinService } from '../../../../services/coin.service';
import { BaseCoin } from '../../../../coins/basecoin';
import { CreateWalletFormComponent } from './create-wallet-form/create-wallet-form.component';
import { Wallet } from '../../../../app.datatypes';
import { scanAddresses } from '../../../../utils';
import { BlockchainService } from '../../../../services/blockchain.service';
import { CustomMatDialogService } from '../../../../services/custom-mat-dialog.service';

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
    private coinService: CoinService,
    private blockchainService: BlockchainService,
    private translate: TranslateService,
    private dialog: CustomMatDialogService
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

    this.walletService.create(data.label, data.seed, data.coin.id, this.data.create)
      .subscribe(
        wallet => this.onCreateSuccess(wallet, data.coin),
        (error) => this.onCreateError(error.message)
      );
  }

  private onCreateSuccess(wallet: Wallet, coin: BaseCoin) {
    const initialCoin = this.coinService.currentCoin.value;
    this.coinService.changeCoin(coin);

    if (!this.data.create) {
      scanAddresses(this.dialog, wallet, this.blockchainService, this.translate).subscribe(
        response => this.processScanResponse(initialCoin, wallet, false, response),
        error => this.processScanResponse(initialCoin, wallet, true, error)
      );
    } else {
      this.finish();
    }
  }

  private processScanResponse(initialCoin: BaseCoin, wallet: Wallet, isError: boolean, response) {
    if (isError || response !== null) {
      this.coinService.changeCoin(initialCoin);
      this.onCreateError(response.message ? response.message : response.toString());
    } else {
      wallet.needSeedConfirmation = false;
      this.walletService.add(wallet);
      this.finish();
    }
  }

  private finish() {
    this.createButton.setSuccess();
    this.dialogRef.close();
  }

  private onCreateError(errorMesasge: string) {
    const config = new MatSnackBarConfig();
    config.duration = 5000;
    this.snackBar.open(errorMesasge, null, config);
    this.createButton.setError(errorMesasge);

    this.disableDismiss = false;
  }
}
