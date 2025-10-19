import { BaseCoin } from './basecoin';
import { coinsId } from '../constants/coins-id.const';
import { environment } from '../../environments/environment';

export class SkycoinCoin extends BaseCoin {
  id = coinsId.sky;
  nodeUrl = '';
  coinName = 'Skycoin';
  coinSymbol = 'SKY';
  hoursName = 'Coin Hours';
  priceTickerId = 'sky-skycoin';
  coinExplorer = 'https://explorer.skycoin.net';
  imageName = 'skycoin-header.jpg';
  gradientName = 'skycoin-gradient.png';
  iconName = 'skycoin-icon.png';
  bigIconName = 'skycoin-icon-b.png';

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
