import { Component, OnInit, OnDestroy } from '@angular/core';
import { CoinService } from '../../../services/coin.service';
import { ISubscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-send-skycoin',
  templateUrl: './send-skycoin.component.html',
  styleUrls: ['./send-skycoin.component.scss'],
})
export class SendSkycoinComponent implements OnInit, OnDestroy {
  showForm = true;
  restarting = false;
  formData: any;

  private coinSubscription: ISubscription;

  constructor(
    private coinService: CoinService
  ) {}

  ngOnInit() {
    this.coinSubscription = this.coinService.currentCoin
      .subscribe(() => {
        this.onBack(true);
      });
  }

  ngOnDestroy() {
    this.coinSubscription.unsubscribe();
  }

  onFormSubmitted(data) {
    this.formData = data;
    this.showForm = false;
  }

  onBack(deleteFormData) {
    if (deleteFormData) {
      this.formData = null;
    }

    this.restarting = true;
    setTimeout(() => this.restarting = false, 0);

    this.showForm = true;
  }

  get transaction() {
    const transaction = this.formData.transaction;

    transaction.from = this.formData.wallet.label;
    transaction.to = this.formData.address;
    transaction.balance = this.formData.amount;

    return transaction;
  }
}
