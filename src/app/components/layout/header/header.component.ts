import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { PriceService } from '../../../services/price.service';
import { WalletService } from '../../../services/wallet.service';
import { TotalBalance } from '../../../app.datatypes';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() title: string;

  coins = 0;
  hours: number;
  balance: string;
  isBalanceCalculated = false;

  private price: number;
  private priceSubscription: Subscription;
  private walletSubscription: Subscription;
  private subscription: Subscription;

  constructor(
    private priceService: PriceService,
    public walletService: WalletService,
  ) {}

  ngOnInit() {
    this.priceSubscription = this.priceService.price
      .subscribe(price => {
        this.price = price;
        this.calculateBalance();
      });

    this.walletSubscription = this.walletService.totalBalance
      .subscribe((balance: TotalBalance) => {
        if (balance) {
          this.coins = balance.coins;
          this.hours = balance.hours;

          this.calculateBalance();
        }
      });
  }

  ngOnDestroy() {
    this.priceSubscription.unsubscribe();
    this.walletSubscription.unsubscribe();
  }

  private calculateBalance() {
    if (this.price) {
      const balance = Math.round(this.coins * this.price * 100) / 100;
      this.balance = '$' + balance.toFixed(2) + ' ($' + (Math.round(this.price * 100) / 100) + ')';

      this.isBalanceCalculated = true;
    }
  }
}
