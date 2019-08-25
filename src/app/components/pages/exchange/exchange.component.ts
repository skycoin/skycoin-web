import { Component, OnInit, OnDestroy } from '@angular/core';
import { StoredExchangeOrder } from '../../../app.datatypes';
import { ExchangeService } from '../../../services/exchange.service';
import { MatDialogConfig } from '@angular/material';
import { ExchangeHistoryComponent } from './exchange-history/exchange-history.component';
import { ISubscription } from 'rxjs/Subscription';
import { CustomMatDialogService } from '../../../services/custom-mat-dialog.service';
import { CoinService } from '../../../services/coin.service';
import { BaseCoin } from '../../../coins/basecoin';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { EnterSwaplabIdComponent } from './enter-swaplab-id/enter-swaplab-id.component';

@Component({
  selector: 'app-exchange',
  templateUrl: './exchange.component.html',
  styleUrls: ['./exchange.component.scss'],
})
export class ExchangeComponent implements OnDestroy {
  currentOrderDetails: StoredExchangeOrder;
  hasHistory = false;
  loading = true;
  inProductionMode = environment.production;
  currentCoinSymbol: string;
  restarting = true;

  private lastViewedSubscription: ISubscription;
  private historySubscription: ISubscription;
  private coinSubscription: ISubscription;

  constructor(
    private exchangeService: ExchangeService,
    private dialog: CustomMatDialogService,
    coinService: CoinService,
    router: Router,
  ) {
    this.coinSubscription = coinService.currentCoin.subscribe((coin: BaseCoin) => {
      if (!coin.swaplabApiKey) {
        setTimeout(() => router.navigate(['/wallets']), 32);

        return;
      }
      this.restarting = true;
      this.initialize();

      if (coinService.coins.length > 1) {
        this.currentCoinSymbol = coin.coinSymbol;
      }

      setTimeout(() => this.restarting = false, 32);
    });
  }

  ngOnDestroy() {
    if (this.lastViewedSubscription) {
      this.lastViewedSubscription.unsubscribe();
    }
    if (this.historySubscription) {
      this.historySubscription.unsubscribe();
    }
    this.coinSubscription.unsubscribe();
  }

  showStatus(order) {
    window.scrollTo(0, 0);
    this.currentOrderDetails = order;
    if (!this.inProductionMode) {
      this.hasHistory = true;
    }
  }

  showHistory(event) {
    event.preventDefault();

    const config = new MatDialogConfig();
    config.width = '566px';
    config.autoFocus = false;

    this.dialog.open(ExchangeHistoryComponent, config).afterClosed().subscribe((oldOrder: StoredExchangeOrder) => {
      if (oldOrder) {
        window.scrollTo(0, 0);
        this.currentOrderDetails = oldOrder;
      }
    });
  }

  checkOrder(event) {
    event.preventDefault();

    const config = new MatDialogConfig();
    config.width = '566px';

    this.dialog.open(EnterSwaplabIdComponent, config).afterClosed().subscribe((id: string) => {
      if (id) {
        window.scrollTo(0, 0);
        this.currentOrderDetails = {
          id: id,
          pair: null,
          fromAmount: null,
          toAmount: null,
          address: null,
          timestamp: null,
          price: null,
          loadedFromId: true,
        };
      }
    });
  }

  goBack() {
    window.scrollTo(0, 0);
    this.currentOrderDetails = null;
    this.exchangeService.lastViewedOrder = null;
  }

  private initialize() {
    this.currentOrderDetails = null;
    this.hasHistory = false;
    this.loading = true;

    this.lastViewedSubscription = this.exchangeService.lastViewedOrderLoaded.subscribe(response => {
      if (response) {
        const lastViewedOrder = this.exchangeService.lastViewedOrder;
        if (lastViewedOrder) {
          this.currentOrderDetails = lastViewedOrder;
        }

        setTimeout(() => this.lastViewedSubscription.unsubscribe());
        this.loading = false;
      }
    });

    this.historySubscription = this.exchangeService.history().subscribe(() => this.hasHistory = true, () => {});
  }
}
