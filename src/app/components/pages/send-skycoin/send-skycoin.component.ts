import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/filter';
import { WalletService } from '../../../services/wallet.service';
import { Wallet } from '../../../app.datatypes';
import { MatDialog } from '@angular/material';
import { openUnlockWalletModal } from '../../../utils/index';

@Component({
  selector: 'app-send-skycoin',
  templateUrl: './send-skycoin.component.html',
  styleUrls: ['./send-skycoin.component.scss'],
})
export class SendSkycoinComponent implements OnInit {
  @ViewChild('button') button;

  form: FormGroup;
  wallets: Wallet[];
  transactions = [];

  constructor(
    private formBuilder: FormBuilder,
    private walletService: WalletService,
    private snackbar: MatSnackBar,
    private unlockDialog: MatDialog
  ) { }

  ngOnInit() {
    this.initForm();

    this.walletService.all
      .subscribe(wallets => this.wallets = wallets);
  }

  onSendSkyCoin() {
    const wallet = this.form.value.wallet;

    if (!wallet.seed) {
      openUnlockWalletModal(wallet, this.unlockDialog).componentInstance.onWalletUnlocked
        .subscribe(() => this.send(wallet));
    } else {
      this.send(wallet);
    }
  }

  private send(wallet: Wallet) {
    this.button.setLoading();
    this.walletService.sendSkycoin(wallet, this.form.value.address, this.form.value.amount)
      .subscribe(
        () => {
          this.form.reset();
          this.button.setSuccess();
        },
        error => {
          const config = new MatSnackBarConfig();
          config.duration = 300000;
          const errorMessage = error._body ? error._body : 'Your transaction appears to be unsuccessful';
          this.snackbar.open(errorMessage, null, config);
          this.button.setError(error);
        },
      );
  }

  private initForm() {
    this.form = this.formBuilder.group({
      wallet: ['', Validators.required],
      address: ['', Validators.required],
      amount: ['', [Validators.required]],
      notes: [''],
    });
    this.form.controls.wallet.valueChanges.subscribe(value => {
      const balance = value && value.balance ? value.balance : 0;
      this.form.controls.amount.setValidators([
        Validators.required,
        Validators.min(0.000001),
        Validators.max(balance),
        this.validateAmount,
      ]);
      this.form.controls.amount.updateValueAndValidity();
    });
  }
  private validateAmount(amountControl: FormControl) {
    if (!amountControl.value || isNaN(amountControl.value) || parseFloat(amountControl.value) <= 0) {
      return { Invalid: true };
    }

    const parts = amountControl.value.toString().split('.');

    if (parts.length === 2 && parts[1].length > 6) {
      return { Invalid: true };
    }

    return null;
  }
}
