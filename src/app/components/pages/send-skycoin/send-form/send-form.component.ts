import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { ISubscription, Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/filter';
import { BigNumber } from 'bignumber.js';
import { Observable } from 'rxjs/Observable';

import { WalletService } from '../../../../services/wallet/wallet.service';
import { SpendingService, HoursSelectionTypes } from '../../../../services/wallet/spending.service';
import { ButtonComponent } from '../../../layout/button/button.component';
import { Wallet } from '../../../../app.datatypes';
import { openUnlockWalletModal } from '../../../../utils/index';
import { BaseCoin } from '../../../../coins/basecoin';
import { CoinService } from '../../../../services/coin.service';
import { BlockchainService } from '../../../../services/blockchain.service';
import { CustomMatDialogService } from '../../../../services/custom-mat-dialog.service';
import { config } from '../../../../app.config';

@Component({
  selector: 'app-send-form',
  templateUrl: './send-form.component.html',
  styleUrls: ['./send-form.component.scss'],
})
export class SendFormComponent implements OnInit, OnDestroy {
  @ViewChild('button') button: ButtonComponent;
  @Input() formData: any;
  @Output() onFormSubmitted = new EventEmitter<any>();

  showSlowMobileInfo = false;
  form: FormGroup;
  wallets: Wallet[];
  currentCoin: BaseCoin;

  private processSubscription: ISubscription;
  private subscription: Subscription;
  private slowInfoSubscription: ISubscription;

  constructor(
    private formBuilder: FormBuilder,
    private walletService: WalletService,
    private spendingService: SpendingService,
    private snackbar: MatSnackBar,
    private unlockDialog: CustomMatDialogService,
    private coinService: CoinService,
    private blockchainService: BlockchainService
  ) {}

  ngOnInit() {
    this.initForm();

    this.subscription.add(this.walletService.currentWallets
      .subscribe(wallets => this.wallets = wallets)
    );

    this.subscription.add(this.coinService.currentCoin
      .subscribe((coin: BaseCoin) => this.currentCoin = coin)
    );
  }

  ngOnDestroy() {
    this.removeSlowInfoSubscription();
    this.removeProcessSubscription();
    this.subscription.unsubscribe();
    this.snackbar.dismiss();
  }

  onVerify(event = null) {
    if (event) {
      event.preventDefault();
    }

    if (!this.form.valid || this.button.isLoading()) {
      return;
    }

    this.snackbar.dismiss();
    this.button.resetState();

    const wallet = this.form.value.wallet;

    if (!wallet.seed) {
      this.removeProcessSubscription();

      this.processSubscription = openUnlockWalletModal(wallet, this.unlockDialog).componentInstance
        .onWalletUnlocked.first().subscribe(() => this.createTransaction(wallet));
    } else {
      this.createTransaction(wallet);
    }
  }

  private createTransaction(wallet: Wallet) {
    this.button.setLoading();

    this.slowInfoSubscription = Observable.of(1).delay(config.timeBeforeSlowMobileInfo)
      .subscribe(() => this.showSlowMobileInfo = true);

    this.removeProcessSubscription();

    this.processSubscription = this.spendingService.createTransaction(
      wallet,
      null,
      null,
      [{
        address: this.form.value.address.replace(/\s/g, ''),
        coins: new BigNumber(this.form.value.amount),
      }],
      {
        type: HoursSelectionTypes.Auto,
        ShareFactor: new BigNumber(0.5),
      },
      null
    ).subscribe(
        transaction => this.onTransactionCreated(transaction),
        error => this.onError(error)
      );
  }

  private onTransactionCreated(transaction) {
    this.showSlowMobileInfo = false;
    this.removeSlowInfoSubscription();
    this.onFormSubmitted.emit({
      wallet: this.form.value.wallet,
      address: this.form.value.address,
      amount: new BigNumber(this.form.value.amount),
      transaction,
    });
  }

  private onError(error) {
    this.showSlowMobileInfo = false;
    this.removeSlowInfoSubscription();
    const snackBarConfig = new MatSnackBarConfig();
    snackBarConfig.duration = 300000;
    this.snackbar.open(error.message, null, snackBarConfig);
    this.button.setError(error.message);
  }

  private initForm() {
    this.form = this.formBuilder.group({
      wallet: ['', Validators.required],
      address: ['', Validators.required],
      amount: ['', [Validators.required]]
    });

    this.subscription = this.form.controls.wallet.valueChanges.subscribe(value => {
      const balance = value && value.balance ? value.balance : 0;

      this.form.controls.amount.setValidators([
        Validators.required,
        Validators.min(0.000001),
        Validators.max(balance),
        this.validateAmount.bind(this),
      ]);

      this.form.controls.amount.updateValueAndValidity();
    });

    if (this.formData) {
      Object.keys(this.form.controls).forEach(control => {
        this.form.get(control).setValue(this.formData[control]);
      });
    }
  }

  private validateAmount(amountControl: FormControl) {
    if (!amountControl.value || isNaN(amountControl.value) || parseFloat(amountControl.value) <= 0) {
      return { Invalid: true };
    }

    const parts = amountControl.value.toString().split('.');

    if (parts.length === 2 && parts[1].length > this.blockchainService.currentMaxDecimals) {
      return { Invalid: true };
    }

    return null;
  }

  private removeProcessSubscription() {
    if (this.processSubscription) {
      this.processSubscription.unsubscribe();
    }
  }

  private removeSlowInfoSubscription() {
    if (this.slowInfoSubscription) {
      this.slowInfoSubscription.unsubscribe();
    }
  }
}
