import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { BaseCoin } from '../coins/basecoin';
import { SkycoinCoin } from '../coins/skycoin.coin';
import { TestCoin } from '../coins/test.coin';
import { defaultCoinId } from '../constants/coins-id.const';
import { environment } from '../../environments/environment';

export class CoinService {

  currentCoin: BehaviorSubject<BaseCoin> = new BehaviorSubject<BaseCoin>(null);
  coins: BaseCoin[] = [];

  private readonly storageKey = 'currentCoin';

  constructor() {
    this.loadAvailableCoins();
    this.loadCurrentCoin();
    sessionStorage.setItem(this.storageKey, this.currentCoin.getValue().id.toString());
  }

  changeCoin(coin: BaseCoin) {
    if (coin.id !== this.currentCoin.value.id) {
      this.currentCoin.next(coin);
      this.saveCoin(coin.id);
    }
  }

  private loadCurrentCoin() {
    const storedCoinId = sessionStorage.getItem(this.storageKey) || localStorage.getItem(this.storageKey);
    const coinId = storedCoinId ? +storedCoinId : defaultCoinId;
    const coin = this.coins.find((c: BaseCoin) => c.id === coinId);
    this.currentCoin.next(coin);
  }

  private saveCoin(coinId: number) {
    localStorage.setItem(this.storageKey, coinId.toString());
    sessionStorage.setItem(this.storageKey, coinId.toString());
  }

  private loadAvailableCoins() {
    this.coins.push(new SkycoinCoin());

    if (!environment.production) {
      this.coins.push(new TestCoin());
    }

    const IDs = new Map<number, boolean>();
    this.coins.forEach((value: BaseCoin) => {
      if (IDs[value.id]) {
        throw new Error('More than one coin with the same ID');
      }
      IDs[value.id] = true;
    });

    const nodes: string[] = [];
    this.coins.forEach((value: BaseCoin) => {
      nodes.push(value.nodeUrl);
    });
    // This list is used by Electron to know which hosts should not be blocked.
    window['nodeURLs'] = nodes;
  }
}
