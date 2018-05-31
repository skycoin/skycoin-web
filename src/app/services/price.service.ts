import { Injectable, NgZone } from '@angular/core';
import { Http } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';

@Injectable()
export class PriceService {

  price: Subject<number> = new BehaviorSubject<number>(null);
  private readonly CMC_TICKER_ID = 1619;
  private readonly updatePeriod = 10 * 60 * 1000;

  constructor(
    private http: Http,
    private ngZone: NgZone
  ) {
    this.ngZone.runOutsideAngular(() => {
      Observable.timer(0, this.updatePeriod)
        .subscribe(() => this.ngZone.run(() => this.loadPrice()));
    });
  }

  private loadPrice() {
    this.http.get('https://api.coinmarketcap.com/v1/ticker/skycoin/')
      .map(response => response.json()[0])
      .subscribe(data => this.price.next(data.price_usd));
  }
}
