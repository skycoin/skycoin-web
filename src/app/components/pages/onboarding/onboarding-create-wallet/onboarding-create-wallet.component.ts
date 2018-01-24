import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {DoubleButtonActive} from '../../../layout/double-button/double-button.component';
import {MdDialogConfig, MdDialog} from '@angular/material';
import {OnboardingDisclaimerComponent} from './onboarding-disclaimer/onboarding-disclaimer.component';
import {OnboardingSafeguardComponent} from './onboarding-safeguard/onboarding-safeguard.component';
import {WalletService} from '../../../../services/wallet.service';
import * as Bip39 from 'bip39';
import {Router} from '@angular/router';

@Component({
  selector: 'app-onboarding-create-wallet',
  templateUrl: './onboarding-create-wallet.component.html',
  styleUrls: ['./onboarding-create-wallet.component.scss']
})
export class OnboardingCreateWalletComponent implements OnInit, AfterViewInit {
  showNewForm = true;
  form: FormGroup;
  doubleButtonActive = DoubleButtonActive.LeftButton;

  constructor(private dialog: MdDialog,
              public walletService: WalletService,
              private router: Router,) {
  }

  ngOnInit() {

    this.initForm();
  }

  ngAfterViewInit() {
    this.existWallets();
  }

  existWallets() {
    this.walletService.all().subscribe(wallets => {
      if (wallets.length === 0) {
        this.showDisclaimer();
      }
    });
  }

  initForm() {
    this.form = new FormGroup({});
    this.form.addControl('label', new FormControl('', Validators.compose([Validators.required, Validators.minLength(2)])));
    this.form.addControl('seed', new FormControl('', Validators.compose([Validators.required, Validators.minLength(2)])));
    this.form.addControl('confirm_seed', new FormControl('',
      this.showNewForm ?
        Validators.compose([
          Validators.required,
          Validators.minLength(2),
          this.validateAreEqual.bind(this)])
        : Validators.compose([])
    ));

    this.form.valueChanges.subscribe(data => this.onValueChanged(data));
    if (this.showNewForm) {
      this.generateSeed();
    }

  }

  changeForm(newState) {
    if (newState === DoubleButtonActive.RightButton) {
      this.showNewForm = false;
    } else {
      this.showNewForm = true;
    }
    this.initForm();
  }

  onValueChanged(data) {
  }

  showDisclaimer() {
    const config = new MdDialogConfig();
    config.width = '450px';
    config.disableClose = true;
    this.dialog.open(OnboardingDisclaimerComponent, config).afterClosed().subscribe(result => {
    });
  }

  showSafe() {
    const config = new MdDialogConfig();
    config.width = '450px';
    config.disableClose = true;
    this.dialog.open(OnboardingSafeguardComponent, config).afterClosed().subscribe(result => {
      this.router.navigate(['/wallets']);
    });
  }

  createWallet() {
    this.walletService.create(this.form.value.label, this.form.value.seed);
    this.showSafe();
  }

  loadWallet() {
  }

  private validateAreEqual(fieldControl: FormControl) {
    return fieldControl.value === this.form.get('seed').value ? null : {NotEqual: true};
  }

  generateSeed() {
    this.form.controls.seed.setValue(Bip39.generateMnemonic());
  }
}
