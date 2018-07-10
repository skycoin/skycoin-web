import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ISubscription } from 'rxjs/Subscription';

import { WalletService } from '../../../../services/wallet.service';
import { TotalBalance } from '../../../../app.datatypes';
import { CoinService } from '../../../../services/coin.service';
import { BaseCoin } from '../../../../coins/basecoin';

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
              private coinService: CoinService) {
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
}
