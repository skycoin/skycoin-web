import { BaseCoin } from './basecoin';
import { coinsId } from '../constants/coins-id.const';
import { environment } from '../../environments/environment';

export class SkycoinCoin extends BaseCoin {
  id = coinsId.sky;
  nodeUrl = environment.production ? 'https://node.skycoin.net' : '';
  coinName = 'Skycoin';
  coinSymbol = 'SKY';
  hoursName = 'Coin Hours';
  priceTickerId = 'sky-skycoin';
  coinExplorer = 'https://explorer.skycoin.net';
  imageName = 'skycoin-header.jpg';
  gradientName = 'skycoin-gradient.png';
  swaplabApiKey = 'w4bxe2tbf9beb72r';
  iconName = 'skycoin-icon.png';
  bigIconName = 'skycoin-icon-b.png';
}
