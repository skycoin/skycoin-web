import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSnackBarConfig, MatSnackBar } from '@angular/material';
import * as Bip39 from 'bip39';

import { WalletService } from '../../../../services/wallet.service';
import { DoubleButtonActive } from '../../../layout/double-button/double-button.component';
import { OnboardingDisclaimerComponent } from './onboarding-disclaimer/onboarding-disclaimer.component';
import { OnboardingSafeguardComponent } from './onboarding-safeguard/onboarding-safeguard.component';
import { CoinService } from '../../../../services/coin.service';
import { BaseCoin } from '../../../../coins/basecoin';

@Component({
  selector: 'app-onboarding-create-wallet',
  templateUrl: './onboarding-create-wallet.component.html',
  styleUrls: ['./onboarding-create-wallet.component.scss'],
})
export class OnboardingCreateWalletComponent implements OnInit {
  @ViewChild('create') createButton;
  showNewForm = true;
  form: FormGroup;
  doubleButtonActive = DoubleButtonActive.LeftButton;
  haveWallets = false;
  isWalletCreating = false;

  constructor(
    private dialog: MatDialog,
    private walletService: WalletService,
    private router: Router,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private coinService: CoinService
  ) { }

  ngOnInit() {
    this.existWallets();
    this.initForm(this.coinService.currentCoin.getValue());
  }

  changeForm(newState) {
    newState === DoubleButtonActive.RightButton ? this.showNewForm = false : this.showNewForm = true;
    this.initForm(this.coinService.currentCoin.getValue());
  }

  showDisclaimer() {
    setTimeout(() => {
      this.dialog.open(OnboardingDisclaimerComponent, this.createDialogConfig(true));
    }, 0);
  }

  showSafe() {
    this.dialog.open(OnboardingSafeguardComponent, this.createDialogConfig()).afterClosed().subscribe(result => {
      if (result) {
        this.createWallet();
      }
    });
  }

  loadWallet() {
    this.createWallet();
  }

  skip() {
    this.router.navigate(['/wallets']);
  }

  private existWallets() {
    this.walletService.haveWallets.subscribe(result => {
      if (!result) {
        this.haveWallets = false;
        this.showDisclaimer();
      } else {
        this.haveWallets = true;
      }
    });
  }

  private initForm(defaultCoin: BaseCoin) {
    this.form = this.formBuilder.group({
        label: new FormControl('', [ Validators.required ]),
        coin: new FormControl(defaultCoin, [ Validators.required ]),
        seed: new FormControl('', [ Validators.required ]),
        confirm_seed: new FormControl()
      },
      {
        validator: this.showNewForm ? this.seedMatchValidator.bind(this) : null
      }
    );

    if (this.showNewForm) {
      this.generateSeed(128);
    }
  }

  private generateSeed(entropy: number) {
    this.form.controls.seed.setValue(Bip39.generateMnemonic(entropy));
  }

  private createWallet() {
    this.createButton.setLoading();
    this.isWalletCreating = true;

    this.walletService.create(this.form.value.label, this.form.value.seed, this.form.value.coin.id)
      .subscribe(
        () => this.onCreateSuccess(),
        (error) => this.onCreateError(error.message)
      );
  }

  private seedMatchValidator(g: FormGroup) {
    return g.get('seed').value === g.get('confirm_seed').value ? null : { NotEqual: true };
  }

  private onCreateSuccess() {
    this.createButton.setSuccess();
    this.skip();
    this.isWalletCreating = false;
  }

  private onCreateError(errorMesasge: string) {
    const config = new MatSnackBarConfig();
    config.duration = 5000;
    this.snackBar.open(errorMesasge, null, config);

    this.createButton.setError(errorMesasge);
    this.isWalletCreating = false;
  }

  private createDialogConfig(disableClose = false) {
    const config = new MatDialogConfig();
    config.width = '450px';
    config.disableClose = disableClose;
    return config;
  }
}
