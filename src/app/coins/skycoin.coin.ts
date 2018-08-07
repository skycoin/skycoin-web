import { BaseCoin } from './basecoin';
import { coinsId } from '../constants/coins-id.const';
import { environment } from '../../environments/environment';

export class SkycoinCoin extends BaseCoin {
  id = coinsId.sky;
  nodeUrl = environment.production ? 'https://node.skycoin.net/api/v1/' : '/api/v1/';
  coinName = 'Skycoin';
  coinSymbol = 'SKY';
  hoursName = 'Coin Hours';
  cmcTickerId = 1619;
  coinExplorer = 'https://explorer.skycoin.net';
  imageName = 'skycoin-header.jpg';
  gradientName = 'skycoin-gradient.png';
  iconName = 'skycoin-icon.png';
  bigIconName = 'skycoin-icon-b.png';
}
