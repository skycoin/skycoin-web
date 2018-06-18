import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { BaseCoin } from '../coins/basecoin';
import { SkycoinCoin } from '../coins/skycoin.coin';
import { TestCoin } from '../coins/test.coin';

export class CoinService {

  currentCoin: BehaviorSubject<BaseCoin> = new BehaviorSubject<BaseCoin>(null);

  private coins: BaseCoin[] = [];
  private readonly storageKey = 'currentCoin';

  constructor() {
    this.loadCurrentCoin();
    this.loadAvailableCoins();
  }

  changeCoin(coin: BaseCoin) {
    this.currentCoin.next(coin);

    this.saveCoin(coin);
  }

  private loadCurrentCoin() {
    const storedCoin: string = localStorage.getItem(this.storageKey);
    if (storedCoin) {
      const coin: BaseCoin = JSON.parse(storedCoin);
      this.currentCoin.next(coin);
    }
  }

  private saveCoin(coin) {
    localStorage.setItem(this.storageKey, JSON.stringify(coin));
  }

  private loadAvailableCoins() {
    this.coins.push(new SkycoinCoin(), new TestCoin());
  }
}
