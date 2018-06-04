import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSnackBarConfig, MatSnackBar } from '@angular/material';
import * as Bip39 from 'bip39';

import { WalletService } from '../../../../services/wallet.service';
import { DoubleButtonActive } from '../../../layout/double-button/double-button.component';
import { OnboardingDisclaimerComponent } from './onboarding-disclaimer/onboarding-disclaimer.component';
import { OnboardingSafeguardComponent } from './onboarding-safeguard/onboarding-safeguard.component';

@Component({
  selector: 'app-onboarding-create-wallet',
  templateUrl: './onboarding-create-wallet.component.html',
  styleUrls: ['./onboarding-create-wallet.component.scss'],
})
export class OnboardingCreateWalletComponent implements OnInit {
  showNewForm = true;
  form: FormGroup;
  doubleButtonActive = DoubleButtonActive.LeftButton;
  haveWallets = false;

  constructor(
    private dialog: MatDialog,
    private walletService: WalletService,
    private router: Router,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.initForm();
    this.existWallets();
  }

  existWallets() {
    this.walletService.all.subscribe(wallets => {
      if (wallets.length === 0) {
        this.haveWallets = false;
        this.showDisclaimer();
      }else {
        this.haveWallets = true;
      }
    });
  }

  initForm() {
    this.form = this.formBuilder.group({
        label: new FormControl('', Validators.compose([
          Validators.required, Validators.minLength(2),
        ])),
        seed: new FormControl('', Validators.compose([
          Validators.required, Validators.minLength(2),
        ])),
        confirm_seed: new FormControl('',
          this.showNewForm ?
            Validators.compose([
              Validators.required,
              Validators.minLength(2),
            ])
            : Validators.compose([]),
        ),
      },
      this.showNewForm ? { validator: this.seedMatchValidator.bind(this) } : {},
      );

    if (this.showNewForm) {
      this.generateSeed(128);
    }
  }

  changeForm(newState) {
    newState === DoubleButtonActive.RightButton ? this.showNewForm = false : this.showNewForm = true;
    this.initForm();
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

  private generateSeed(entropy: number) {
    this.form.controls.seed.setValue(Bip39.generateMnemonic(entropy));
  }

  private createWallet() {
    this.walletService.create(this.form.value.label, this.form.value.seed)
    .then(
      () => this.skip(),
      (error) => this.onCreateError(error.message)
    );
  }

  private seedMatchValidator(g: FormGroup) {
      return g.get('seed').value === g.get('confirm_seed').value
        ? null : { mismatch: true };
  }

  private onCreateError(errorMesasge: string) {
    const config = new MatSnackBarConfig();
    config.duration = 5000;
    this.snackBar.open(errorMesasge, null, config);
  }

  private createDialogConfig(disableClose = false) {
    const config = new MatDialogConfig();
    config.width = '450px';
    config.disableClose = disableClose;
    return config;
  }
}
