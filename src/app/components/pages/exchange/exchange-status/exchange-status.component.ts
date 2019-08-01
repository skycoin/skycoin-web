import { Component, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ExchangeOrder, StoredExchangeOrder, ConfirmationData } from '../../../../app.datatypes';
import { ExchangeService } from '../../../../services/exchange.service';
import { ISubscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { showConfirmationModal, openQrModal } from '../../../../utils';
import { BlockchainService } from '../../../../services/blockchain.service';
import { environment } from '../../../../../environments/environment';
import { CustomMatDialogService } from '../../../../services/custom-mat-dialog.service';
import { CoinService } from '../../../../services/coin.service';
import { BaseCoin } from '../../../../coins/basecoin';

@Component({
  selector: 'app-exchange-status',
  templateUrl: './exchange-status.component.html',
  styleUrls: ['./exchange-status.component.scss'],
})
export class ExchangeStatusComponent implements OnDestroy {
  private readonly TEST_MODE = environment.swaplab.activateTestMode;
  private readonly TEST_ERROR = environment.swaplab.endStatusInError;
  readonly statuses = [
    'user_waiting',
    'market_waiting_confirmations',
    'market_confirmed',
    'market_exchanged',
    'market_withdraw_waiting',
    'complete',
    'error',
    'user_deposit_timeout',
  ];

  loading = true;
  showError = false;
  expanded = false;
  showOperationNotStarted = false;

  private subscription: ISubscription;
  private testStatusIndex = 0;
  private order: ExchangeOrder;

  _orderDetails: StoredExchangeOrder;
  @Input() set orderDetails(val: StoredExchangeOrder) {
    const oldOrderDetails = this._orderDetails;

    if (val !== null && (!oldOrderDetails || oldOrderDetails.id !== val.id)) {
      this._orderDetails = val;
      this.exchangeService.lastViewedOrder = this._orderDetails;
      this.testStatusIndex = 0;
      this.loading = true;
      this.getStatus();
    }
  }

  @Output() goBack = new EventEmitter<void>();

  get fromCoin() {
    return this.order.pair.split('/')[0].toUpperCase();
  }

  get toCoin() {
    return this.order.pair.split('/')[1].toUpperCase();
  }

  get explorerUrl() {
    let explorerUrl: string = null;
    const toCoin = this.toCoin;

    this.coinService.coins.forEach(coin => {
      if (coin.coinSymbol === toCoin) {
        explorerUrl = coin.coinExplorer;

        if (explorerUrl.endsWith('/')) {
          explorerUrl = explorerUrl.substr(0, explorerUrl.length - 1);
        }
      }
    });

    return explorerUrl;
  }

  get translatedStatus() {
    const status = this.order.status.replace(/_/g, '-');
    const params = {
      from: this.fromCoin,
      amount: this.order.fromAmount,
      to: this.toCoin,
    };

    return {
      text: `exchange.statuses.${status}`,
      info: `exchange.statuses.${status}-info`,
      params,
    };
  }

  get statusIcon() {
    if (this.order.status === this.statuses[5]) {
      return 'done';
    }

    if (this.order.status === this.statuses[6] || this.order.status === this.statuses[7]) {
      return 'close';
    }

    return 'refresh';
  }

  get progress() {
    let index = this.statuses.indexOf(this.order.status);

    index = Math.min(index, 5) + 1;

    return Math.ceil((100 / 6) * index);
  }

  constructor(
    private exchangeService: ExchangeService,
    private dialog: CustomMatDialogService,
    public blockchainService: BlockchainService,
    private coinService: CoinService,
  ) { }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  showQrCode(address) {
    openQrModal(this.dialog, address, false);
  }

  toggleDetails() {
    this.expanded = !this.expanded;
  }

  close() {
    if (this.loading || this.exchangeService.isOrderFinished(this.order) || this.showOperationNotStarted) {
      this.goBack.emit();
    } else {
      const confirmationData: ConfirmationData = {
        text: !environment.production ? 'exchange.details.back-alert' : 'exchange.details.back-alert-without-history',
        headerText: 'confirmation.header-text',
        confirmButtonText: 'confirmation.confirm-button',
        cancelButtonText: 'confirmation.cancel-button',
      };

      showConfirmationModal(this.dialog, confirmationData).afterClosed().subscribe(confirmationResult => {
        if (confirmationResult) {
          this.goBack.emit();
        }
      });
    }
  }

  private getStatus(delay = 0) {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    const fromAmount = this._orderDetails.fromAmount;

    if (this.TEST_MODE && this.TEST_ERROR && this.testStatusIndex === this.statuses.length - 2) {
      this.testStatusIndex = this.statuses.length - 1;
    }

    this.subscription = Observable.of(0).delay(delay).flatMap(() => {
      return this.exchangeService.status(
        !this.TEST_MODE ? this._orderDetails.id : '4729821d-390d-4ef8-a31e-2465d82a142f',
        !this.TEST_MODE ? null : this.statuses[this.testStatusIndex++],
      );
    }).subscribe(order => {
      if (order.status === this.statuses[0] && this._orderDetails.loadedFromId) {
        this.showOperationNotStarted = true;
      } else {
        this.showOperationNotStarted = false;
      }

      this.order = order;
      if (fromAmount) {
        this.order.fromAmount = fromAmount;
      }
      this._orderDetails.id = order.id;
      this.exchangeService.lastViewedOrder = this._orderDetails;

      if (!this.exchangeService.isOrderFinished(order)) {
        this.getStatus(this.TEST_MODE ? 3000 : 30000);
      } else {
        this.exchangeService.lastViewedOrder = null;
      }

      this.loading = false;
    }, () => this.showError = true);
  }
}
