export abstract class BaseCoin {
  id: number;
  nodeUrl: string;
  nodeVersion: string;
  coinName: string;
  coinSymbol: string;
  hoursName: string;
  cmcTickerId: number;
  coinExplorer: string;
  imageName: string;
  gradientName: string;

  constructor(coinObj) {
    Object.assign(this, coinObj);
  }
}
