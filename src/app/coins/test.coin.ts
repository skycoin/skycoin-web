import { BaseCoin } from './basecoin';
import { coinsId } from '../constants/coins-id.const';
import { environment } from '../../environments/environment';

export class TestCoin extends BaseCoin {
  id = coinsId.test;
  nodeUrl = '';
  coinName = 'Testcoin';
  coinSymbol = 'TEST';
  hoursName = 'Test Hours';
  priceTickerId = 'btc-bitcoin';
  coinExplorer = 'https://explorer.testcoin.net';
  imageName = 'testcoin-header.jpg';
  gradientName = 'testcoin-gradient.png';
  iconName = 'testcoin-icon.png';
  bigIconName = 'testcoin-icon-b.png';

  constructor() {
    super();
    // Fetch node URL from server config
    if (environment.production) {
      fetch('/api/config')
        .then(response => response.json())
        .then(config => {
          this.nodeUrl = config.nodeUrl || 'https://node.skycoin.com';
        })
        .catch(() => {
          // Fallback to default
          this.nodeUrl = 'https://node.skycoin.com';
        });
    }
  }
}
