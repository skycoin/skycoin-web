import { Component, Input, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Overlay } from '@angular/cdk/overlay';
import { MatDialog } from '@angular/material/dialog';

import { WalletService } from '../../../../services/wallet.service';
import { TotalBalance } from '../../../../app.datatypes';
import { CoinService } from '../../../../services/coin.service';
import { BaseCoin } from '../../../../coins/basecoin';
import { openChangeCoinModal, openChangeLanguageModal } from '../../../../utils';
import { LanguageService, LanguageData } from '../../../../services/language.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],
})
export class TopBarComponent implements OnInit, OnDestroy {
  @Input() headline: string;

  timeSinceLastUpdateBalances = 0;
  isBalanceObtained = false;
  isBalanceUpdated: boolean;
  currentCoin: BaseCoin;
  language: LanguageData;
  haveManyCoins: boolean;

  private subscription: Subscription;

  constructor(private walletService: WalletService,
              private coinService: CoinService,
              private dialog: MatDialog,
              private overlay: Overlay,
              private renderer: Renderer2,
              private languageService: LanguageService) {
  }

  ngOnInit() {
    this.walletService.totalBalance
      .subscribe((balance: TotalBalance) => {
        if (balance && !this.isBalanceObtained) {
          this.isBalanceObtained = true;
        }

        this.isBalanceUpdated = !!balance;
      });

    this.subscription = this.languageService.currentLanguage
      .subscribe(lang => this.language = lang);

    this.subscription.add(
      this.walletService.timeSinceLastBalancesUpdate
        .subscribe((time: number) => {
          if (time != null) {
            this.timeSinceLastUpdateBalances = time;
          }
        })
    );

    this.haveManyCoins = this.coinService.coins.length > 1;

    this.subscription.add(
      this.coinService.currentCoin
        .subscribe((coin: BaseCoin) => {
          this.currentCoin = coin;
          this.isBalanceObtained = false;
        })
      );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  changeCoin() {
    openChangeCoinModal(this.dialog, this.renderer, this.overlay)
      .subscribe(response => {
        if (response) {
          this.coinService.changeCoin(response);
        }
      });
  }

  changelanguage() {
    openChangeLanguageModal(this.dialog)
      .subscribe(response => {
        if (response) {
          this.languageService.changeLanguage(response);
        }
      });
  }
}
