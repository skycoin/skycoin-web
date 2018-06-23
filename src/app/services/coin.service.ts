import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { BaseCoin } from '../coins/basecoin';
import { SkycoinCoin } from '../coins/skycoin.coin';
import { TestCoin } from '../coins/test.coin';
import { defaultCoinId } from '../constants/coins-id.const';

export class CoinService {

  currentCoin: BehaviorSubject<BaseCoin> = new BehaviorSubject<BaseCoin>(null);
  coins: BaseCoin[] = [];

  private readonly storageKey = 'currentCoin';

  constructor() {
    this.loadAvailableCoins();
    this.loadCurrentCoin();
  }

  changeCoin(coin: BaseCoin) {
    this.currentCoin.next(coin);
    this.saveCoin(coin.id);
  }

  private loadCurrentCoin() {
    const storedCoinId = localStorage.getItem(this.storageKey);
    const coinId = storedCoinId ? +storedCoinId : defaultCoinId;

    const coin = this.coins.find((c: BaseCoin) => c.id === coinId);
    this.currentCoin.next(coin);
  }

  private saveCoin(coinId: number) {
    localStorage.setItem(this.storageKey, coinId.toString());
  }

  private loadAvailableCoins() {
    this.coins.push(new SkycoinCoin(), new TestCoin());
  }
}
