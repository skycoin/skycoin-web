import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/filter';
import { WalletService } from '../../../services/wallet.service';
import { Wallet } from '../../../app.datatypes';

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
  ) { }

  ngOnInit() {
    this.initForm();
    this.walletService.all
      .subscribe(wallets => this.wallets = wallets);
  }

  send() {
    this.button.setLoading();
    this.walletService.sendSkycoin(this.form.value.wallet, this.form.value.address, this.form.value.amount)
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
        Validators.pattern("^[0-9]{1,2}(\.[0-9]{1,6})?$"),
      ]);
      this.form.controls.amount.updateValueAndValidity();
    });
  }
}
