import { BaseCoin } from './base-coin';
import { coinsId } from '../constants/coins-id.const';

export class SkyCoin extends BaseCoin {
  constructor() {
    super({
      id: coinsId.sky,
      nodeUrl: '/v1/api/',
      nodeVersion: '1.0',
      coinName: 'SkyCoin',
      coinSymbol: 'SKY',
      hoursName: 'SkyHours'
    });
  }
}
