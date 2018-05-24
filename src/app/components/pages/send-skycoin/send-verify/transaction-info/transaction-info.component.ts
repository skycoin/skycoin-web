import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ISubscription } from 'rxjs/Subscription';

import { PreviewTransaction, Transaction } from '../../../../../app.datatypes';
import { PriceService } from '../../../../../services/price.service';

@Component({
  selector: 'app-transaction-info',
  templateUrl: './transaction-info.component.html',
  styleUrls: ['./transaction-info.component.scss'],
})
export class TransactionInfoComponent implements OnInit, OnDestroy {
  @Input() transaction: Transaction;
  @Input() isPreview: boolean;
  price: number;
  showInputsOutputs = false;

  private subscription: ISubscription;

  constructor(private priceService: PriceService) {
  }

  ngOnInit() {
    this.subscription = this.priceService.price
      .subscribe(price => this.price = price);

    if (this.isPreview) {
      this.transaction.hoursSent = this.transaction.outputs
        .filter(o => o.address === (<PreviewTransaction> this.transaction).to)
        .map(o => parseInt(o.hours, 10))
        .reduce((a, b) => a + b, 0);
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  toggleInputsOutputs(event) {
    event.preventDefault();

    this.showInputsOutputs = !this.showInputsOutputs;
  }
}
