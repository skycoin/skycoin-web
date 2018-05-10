import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { WalletService } from '../../../../services/wallet.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],
})
export class TopBarComponent implements OnInit, OnDestroy {
  @Input() title: string;

  timeSinceLastUpdateBalances = 0;

  private updateBalancesTimer: NodeJS.Timer;
  private updateBalancesSubscription: Subscription;
  private lastUpdatedBalancesTime;
  private intervalTime = 60 * 1000;
  private refreshBalancesTime = 5;

  constructor(private walletService: WalletService) {
  }

  ngOnInit() {
    this.updateBalancesSubscription = this.walletService.getBalancesUpdated()
      .subscribe((lastUpdatedTime) => {
        if (lastUpdatedTime) {
          this.lastUpdatedBalancesTime = lastUpdatedTime;

          this.refreshData();
          this.startTimer();
        }
      });
  }

  ngOnDestroy() {
    if (this.updateBalancesTimer) {
      clearInterval(this.updateBalancesTimer);
    }

    this.updateBalancesSubscription.unsubscribe();
  }

  private startTimer() {
    this.updateBalancesTimer = setInterval(() => {
      this.refreshData();
    }, this.intervalTime);
  }

  private refreshData() {
    const diffMs: number = this.lastUpdatedBalancesTime.getTime() - new Date().getTime();
    this.timeSinceLastUpdateBalances = Math.abs(parseInt((diffMs / 1000 / 60).toFixed(2), 10));

    if (this.timeSinceLastUpdateBalances === this.refreshBalancesTime) {
      this.walletService.loadBalances();
    }
  }
}
