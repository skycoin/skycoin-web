import { Injectable, NgZone } from '@angular/core';
import { Http } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
import { CoinService } from './coin.service';
import { BaseCoin } from '../coins/basecoin';

@Injectable()
export class PriceService {

  price: Subject<number> = new BehaviorSubject<number>(null);
  private cmcTickerId: number | null = null;
  private readonly updatePeriod = 10 * 60 * 1000;

  constructor(
    private http: Http,
    private ngZone: NgZone,
    private coinService: CoinService
  ) {
    this.coinService.currentCoin.subscribe((coin: BaseCoin) => {
      this.cmcTickerId = coin.cmcTickerId;
      this.loadPrice();
    });

    this.ngZone.runOutsideAngular(() => {
      Observable.timer(0, this.updatePeriod)
        .subscribe(() => this.ngZone.run(() => this.loadPrice()));
    });
  }

  private loadPrice() {
    if (this.cmcTickerId === null) {
      return;
    }

    this.http.get(`https://api.coinmarketcap.com/v2/ticker/${this.cmcTickerId}/`)
      .map(response => response.json())
      .subscribe(response => this.price.next(response.data.quotes.USD.price));
  }
}
