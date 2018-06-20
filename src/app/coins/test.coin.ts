import { BaseCoin } from './basecoin';
import { coinsId } from '../constants/coins-id.const';
import { environment } from '../../environments/environment';

export class TestCoin extends BaseCoin {
  constructor() {
    super({
      id: coinsId.test,
      nodeUrl: environment.production ? 'https://node.skycoin.net/api/v1/' : '/api/v1/',
      nodeVersion: environment.production ? '0.23.0' : '0.23.1-rc2',
      coinName: 'Testcoin',
      coinSymbol: 'TEST',
      hoursName: 'Test Hours',
      cmcTickerId: 1
    });
  }
}
