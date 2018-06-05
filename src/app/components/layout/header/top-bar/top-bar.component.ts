import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { WalletService } from '../../../../services/wallet.service';
import { TotalBalance } from '../../../../app.datatypes';

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
  private updateBalancesSubscription: Subscription;

  constructor(private walletService: WalletService) {
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
  }

  ngOnDestroy() {
    this.updateBalancesSubscription.unsubscribe();
  }
}
