import { Component, Input, OnInit, OnDestroy, Renderer2, ViewChild, NgZone } from '@angular/core';
import 'rxjs/add/observable/interval';
import { Subscription } from 'rxjs/Subscription';
import { Overlay } from '@angular/cdk/overlay';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs/Observable';

import { BalanceService, BalanceStates } from '../../../../services/wallet/balance.service';
import { CoinService } from '../../../../services/coin.service';
import { BaseCoin } from '../../../../coins/basecoin';
import { openChangeCoinModal, openChangeLanguageModal, getTimeSinceLastBalanceUpdate } from '../../../../utils';
import { LanguageService, LanguageData } from '../../../../services/language.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],
})
export class TopBarComponent implements OnInit, OnDestroy {
  @Input() headline: string;

  timeSinceLastBalanceUpdate = 0;
  balanceObtained = false;
  problemUpdatingBalance: boolean;
  updatingBalance = false;
  currentCoin: BaseCoin;
  language: LanguageData;
  hasManyCoins: boolean;

  private subscription: Subscription;

  constructor(private balanceService: BalanceService,
              private coinService: CoinService,
              private dialog: MatDialog,
              private overlay: Overlay,
              private renderer: Renderer2,
              private languageService: LanguageService,
              private _ngZone: NgZone) {
  }

  ngOnInit() {
    this.subscription = this.languageService.currentLanguage
      .subscribe(lang => this.language = lang);

    this.hasManyCoins = this.coinService.coins.length > 1;

    this.subscription.add(
      this.coinService.currentCoin.subscribe((coin: BaseCoin) => {
        this.currentCoin = coin;
        this.balanceObtained = false;
      })
    );

    this.subscription.add(
      this.balanceService.totalBalance.subscribe(balance => {
        if (balance) {
          if (balance.state === BalanceStates.Obtained) {
            this.balanceObtained = true;
          }
          this.timeSinceLastBalanceUpdate = getTimeSinceLastBalanceUpdate(this.balanceService);
          this.problemUpdatingBalance = balance.state === BalanceStates.Error;
          this.updatingBalance = balance.state === BalanceStates.Updating;
        }
      })
    );

    this._ngZone.runOutsideAngular(() => {
      this.subscription.add(
        Observable.interval(5000).subscribe(() => this._ngZone.run(() => this.timeSinceLastBalanceUpdate = getTimeSinceLastBalanceUpdate(this.balanceService)))
      );
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  refresBalance() {
    this.balanceService.startGettingBalances();
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
