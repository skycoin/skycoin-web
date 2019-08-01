import { Component, OnDestroy} from '@angular/core';
import { ISubscription } from 'rxjs/Subscription';

import { NavBarService } from '../../../../services/nav-bar.service';
import { CoinService } from '../../../../services/coin.service';
import { BaseCoin } from '../../../../coins/basecoin';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnDestroy {
  exchangeEnabled: boolean;
  coinName = '';

  private coinSubscription: ISubscription;

  constructor(
    public navbarService: NavBarService,
    coinService: CoinService,
  ) {
    this.coinSubscription = coinService.currentCoin.subscribe((coin: BaseCoin) => {
      this.coinName = coin.coinSymbol;
      this.exchangeEnabled = !!coin.swaplabApiKey;
    });
  }

  ngOnDestroy() {
    this.coinSubscription.unsubscribe();
  }

  changeActiveComponent(value) {
    this.navbarService.setActiveComponent(value);
  }
}
