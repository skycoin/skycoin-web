import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import {
  ExchangeOrder,
  StoredExchangeOrder,
  TradingPair,
} from '../app.datatypes';
import * as moment from 'moment';
import 'rxjs/add/operator/repeatWhen';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ApiService } from './api.service';
import { environment } from '../../environments/environment';
import { CoinService } from './coin.service';
import { BaseCoin } from '../coins/basecoin';

@Injectable()
export class ExchangeService {
  private readonly API_ENDPOINT = 'https://swaplab.cc/api/v3';
  private readonly STORAGE_KEY = 'exchange-orders';
  private readonly LAST_VIEWED_STORAGE_KEY = 'last-viewed-order';
  private readonly TEST_MODE = environment.swaplab.activateTestMode;

  lastViewedOrderLoaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  currentCoin: BaseCoin;

  private _lastViewedOrder: StoredExchangeOrder;

  set lastViewedOrder(order) {
    this._lastViewedOrder = order;

    if (!environment.production) {
      localStorage.setItem(this.currentCoin.id + this.LAST_VIEWED_STORAGE_KEY, JSON.stringify(order));
    }
  }

  get lastViewedOrder() {
    return this._lastViewedOrder;
  }

  constructor(
    private http: HttpClient,
    private apiService: ApiService,
    coinService: CoinService,
  ) {
    coinService.currentCoin.subscribe((coin: BaseCoin) => {
      if (this.currentCoin && this.currentCoin.id !== coin.id) {
        this.lastViewedOrder = null;
      }
      this.currentCoin = coin;
    });

    if (!environment.production) {
      this.lastViewedOrder = JSON.parse(localStorage.getItem(this.currentCoin.id + this.LAST_VIEWED_STORAGE_KEY));
    }
    this.lastViewedOrderLoaded.next(true);
  }

  tradingPairs(): Observable<TradingPair[]> {
    return this.post('trading_pairs').map(data => data.result);
  }

  exchange(pair: string, fromAmount: number, toAddress: string, price: number): Observable<ExchangeOrder> {
    let response: ExchangeOrder;

    return this.post('orders', { pair, fromAmount, toAddress })
      .flatMap(data => {
        response = data.result;

        return this.storeOrder(response, price);
      }).map(() => response);
  }

  status(id: string, devForceState?: string): Observable<ExchangeOrder> {
    if (this.TEST_MODE && !devForceState) {
      devForceState = 'user_waiting';
    }

    return this.post('orders/status', { id }, this.TEST_MODE ? { status: devForceState } : null)
      .retryWhen((err) => {
        return err.flatMap(response => {
          if ((response as Error).message && (response as Error).message.includes('404')) {
            return Observable.throw(response);
          }

          return Observable.of(response);
        }).delay(3000);
      }).map(data => data.result);
  }

  history() {
    if (!environment.production) {
      const val = localStorage.getItem(this.currentCoin.id + this.STORAGE_KEY);
      if (val) {
        return Observable.of(JSON.parse(val));
      }
    }

    return Observable.throw(new Error());
  }

  isOrderFinished(order: ExchangeOrder) {
    return ['complete', 'error', 'user_deposit_timeout'].indexOf(order.status) > -1;
  }

  private post(url: string, body?: any, headers?: any): Observable<any> {
    return this.http.post(this.buildUrl(url), body, {
      responseType: 'json',
      headers: new HttpHeaders({
        'api-key': this.currentCoin.swaplabApiKey,
        'Accept': 'application/json',
        ...headers,
      }),
    }).catch((error: any) => this.apiService.getErrorMessage(error));
  }

  private buildUrl(url: string) {
    if (!this.TEST_MODE || url === 'trading_pairs') {
      return `${this.API_ENDPOINT}/${url}`;
    }

    return `${this.API_ENDPOINT}sandbox/${url}`;
  }

  private storeOrder(order: ExchangeOrder, price: number) {
    return this.history()
      .catch(() => Observable.of([]))
      .flatMap((oldOrders: StoredExchangeOrder[]) => this.storeOrderEntry(oldOrders, order, price));
  }

  private storeOrderEntry(orders: StoredExchangeOrder[], order: ExchangeOrder, price: number): Observable<any> {
    const newOrder = {
      id: order.id,
      pair: order.pair,
      fromAmount: order.fromAmount,
      toAmount: order.toAmount,
      address: order.toAddress,
      timestamp: moment().unix(),
      price: price,
    };

    orders.push(newOrder);
    const data = JSON.stringify(orders);
    orders.pop();

    if (!environment.production) {
      localStorage.setItem(this.currentCoin.id + this.STORAGE_KEY, data);
    }

    return Observable.of(orders.push(newOrder));
  }
}
