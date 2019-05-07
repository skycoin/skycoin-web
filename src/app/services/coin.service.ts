import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { BaseCoin } from '../coins/basecoin';
import { SkycoinCoin } from '../coins/skycoin.coin';
import { TestCoin } from '../coins/test.coin';
import { defaultCoinId } from '../constants/coins-id.const';
import { environment } from '../../environments/environment';

export class CoinService {

  currentCoin: BehaviorSubject<BaseCoin> = new BehaviorSubject<BaseCoin>(null);
  coins: BaseCoin[] = [];
  customNodeUrls: object;

  private readonly correntCoinStorageKey = 'currentCoin';
  private readonly nodeUrlsStorageKey = 'nodeUrls';

  constructor() {
    this.loadAvailableCoins();
    this.loadNodeUrls();
    this.loadCurrentCoin();
    sessionStorage.setItem(this.correntCoinStorageKey, this.currentCoin.getValue().id.toString());
  }

  changeCoin(coin: BaseCoin) {
    if (coin.id !== this.currentCoin.value.id) {
      this.currentCoin.next(coin);
      this.saveCoin(coin.id);
    }
  }

  changeNodeUrl(coinId: number, url: string) {
    if (!this.coins.find(coin => coin.id === coinId)) {
      return;
    }

    if (url.length > 0) {
      this.customNodeUrls[coinId.toString()] = url;
    } else {
      delete this.customNodeUrls[coinId.toString()];
    }

    localStorage.setItem(this.nodeUrlsStorageKey, JSON.stringify(this.customNodeUrls));

    this.updateNodesUrls();

    if (coinId === this.currentCoin.value.id) {
      this.currentCoin.next(this.currentCoin.value);
    }
  }

  private loadNodeUrls() {
    const savedUrls: object = JSON.parse(localStorage.getItem(this.nodeUrlsStorageKey));
    this.customNodeUrls = savedUrls ? savedUrls : {};

    this.updateNodesUrls();
  }

  private loadCurrentCoin() {
    const storedCoinId = sessionStorage.getItem(this.correntCoinStorageKey) || localStorage.getItem(this.correntCoinStorageKey);
    const coinId = storedCoinId ? +storedCoinId : defaultCoinId;
    const coin = this.coins.find((c: BaseCoin) => c.id === coinId);
    this.currentCoin.next(coin);
  }

  private saveCoin(coinId: number) {
    localStorage.setItem(this.correntCoinStorageKey, coinId.toString());
    sessionStorage.setItem(this.correntCoinStorageKey, coinId.toString());
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

    this.updateNodesUrls();
  }

  private updateNodesUrls() {
    if (window['isElectron']) {
      const nodes: string[] = [];
      this.coins.forEach((value: BaseCoin) => {
        nodes.push(value.nodeUrl);
      });

      if (this.customNodeUrls) {
        Object.keys(this.customNodeUrls).forEach(val => nodes.push(this.customNodeUrls[val]));
      }

      // The list is used by Electron to know which hosts should not be blocked.
      window['ipcRenderer'].sendSync('setNodesUrls', nodes);
    }
  }
}
