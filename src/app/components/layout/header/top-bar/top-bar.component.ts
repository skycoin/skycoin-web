import { Component, Input, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { ISubscription } from 'rxjs/Subscription';
import { Overlay } from '@angular/cdk/overlay';
import { MatDialog } from '@angular/material/dialog';

import { WalletService } from '../../../../services/wallet.service';
import { TotalBalance } from '../../../../app.datatypes';
import { CoinService } from '../../../../services/coin.service';
import { BaseCoin } from '../../../../coins/basecoin';
import { openChangeCoinModal } from '../../../../utils';

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

  private updateBalancesSubscription: ISubscription;
  private coinSubscription: ISubscription;

  constructor(private walletService: WalletService,
              private coinService: CoinService,
              private dialog: MatDialog,
              private overlay: Overlay,
              private renderer: Renderer2) {
  }

  ngOnInit() {
    this.walletService.totalBalance
      .subscribe((balance: TotalBalance) => {
        if (balance && !this.isBalanceObtained) {
          this.isBalanceObtained = true;
        }

        this.isBalanceUpdated = !!balance;
      });

    this.updateBalancesSubscription = this.walletService.timeSinceLastBalancesUpdate
      .subscribe((time: number) => {
        if (time != null) {
          this.timeSinceLastUpdateBalances = time;
        }
      });

    this.coinSubscription = this.coinService.currentCoin
      .subscribe((coin: BaseCoin) => {
        this.currentCoin = coin;
        this.isBalanceObtained = false;
      });
  }

  ngOnDestroy() {
    this.updateBalancesSubscription.unsubscribe();
    this.coinSubscription.unsubscribe();
  }

  changeCoin() {
    openChangeCoinModal(this.dialog, this.renderer, this.overlay)
      .subscribe(response => {
        if (response) {
          this.coinService.changeCoin(response);
        }
      });
  }
}
