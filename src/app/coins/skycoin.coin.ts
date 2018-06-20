import { BaseCoin } from './basecoin';
import { coinsId } from '../constants/coins-id.const';
import { environment } from '../../environments/environment';

export class SkycoinCoin extends BaseCoin {
  constructor() {
    super({
      id: coinsId.sky,
      nodeUrl: environment.production ? 'https://node.skycoin.net/api/v1/' : '/api/v1/',
      nodeVersion: environment.production ? '0.23.0' : '0.23.1-rc2',
      coinName: 'Skycoin',
      coinSymbol: 'SKY',
      hoursName: 'Coin Hours',
      cmcTickerId: 1619
    });
  }
}
