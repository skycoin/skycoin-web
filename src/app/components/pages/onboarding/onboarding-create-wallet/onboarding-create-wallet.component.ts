import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSnackBarConfig, MatSnackBar } from '@angular/material';

import { WalletService } from '../../../../services/wallet.service';
import { DoubleButtonActive } from '../../../layout/double-button/double-button.component';
import { OnboardingDisclaimerComponent } from './onboarding-disclaimer/onboarding-disclaimer.component';
import { OnboardingSafeguardComponent } from './onboarding-safeguard/onboarding-safeguard.component';
import { CoinService } from '../../../../services/coin.service';
import { BaseCoin } from '../../../../coins/basecoin';
import { LanguageService } from '../../../../services/language.service';
import { openChangeLanguageModal } from '../../../../utils';
import { CreateWalletFormComponent } from '../../wallets/create-wallet/create-wallet-form/create-wallet-form.component';

@Component({
  selector: 'app-onboarding-create-wallet',
  templateUrl: './onboarding-create-wallet.component.html',
  styleUrls: ['./onboarding-create-wallet.component.scss'],
})
export class OnboardingCreateWalletComponent implements OnInit {
  @ViewChild('formControl') formControl: CreateWalletFormComponent;
  @ViewChild('create') createButton;

  showNewForm = true;
  doubleButtonActive = DoubleButtonActive.LeftButton;
  userHaveWallets = false;
  creatingWallet = false;
  haveManyCoins: boolean;

  constructor(
    private dialog: MatDialog,
    private walletService: WalletService,
    private router: Router,
    private snackBar: MatSnackBar,
    private coinService: CoinService,
    private languageService: LanguageService
  ) { }

  ngOnInit() {
    this.checkUsertWallets();
    this.haveManyCoins = this.coinService.coins.length > 1;
    this.formControl.initForm(this.coinService.currentCoin.getValue());
  }

  changeForm(newState: DoubleButtonActive) {
    newState === DoubleButtonActive.RightButton ? this.showNewForm = false : this.showNewForm = true;
    this.formControl.initForm(this.coinService.currentCoin.getValue(), this.showNewForm);
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

  private showLanguageModal() {
    setTimeout(() => {
      openChangeLanguageModal(this.dialog, true)
        .subscribe(response => {
          if (response) {
            this.languageService.changeLanguage(response);
          }
          this.showDisclaimer();
        });
    }, 0);
  }

  private showDisclaimer() {
    this.dialog.open(OnboardingDisclaimerComponent, this.createDialogConfig(true));
  }

  private checkUsertWallets() {
    this.walletService.haveWallets.first().subscribe(result => {
      if (!result) {
        this.userHaveWallets = false;
        this.showLanguageModal();
      } else {
        this.userHaveWallets = true;
      }
    });
  }

  private createWallet() {
    this.createButton.setLoading();
    this.creatingWallet = true;

    const data = this.formControl.getData();

    this.walletService.create(data.label, data.seed, data.coin.id)
      .subscribe(
        () => this.onCreateSuccess(data.coin),
        (error) => this.onCreateError(error.message)
      );
  }

  private onCreateSuccess(coin: BaseCoin) {
    this.createButton.setSuccess();
    this.skip();
    this.creatingWallet = false;
    this.coinService.changeCoin(coin);
  }

  private onCreateError(errorMesasge: string) {
    const config = new MatSnackBarConfig();
    config.duration = 5000;
    this.snackBar.open(errorMesasge, null, config);

    this.createButton.setError(errorMesasge);
    this.creatingWallet = false;
  }

  private createDialogConfig(disableClose = false): MatDialogConfig {
    const config = new MatDialogConfig();
    config.width = '450px';
    config.disableClose = disableClose;
    return config;
  }
}
