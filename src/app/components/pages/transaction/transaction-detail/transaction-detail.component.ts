import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';
import { PriceService } from '../../../../services/price.service';

@Component({
  selector: 'app-transaction-detail',
  templateUrl: './transaction-detail.component.html',
  styleUrls: ['./transaction-detail.component.scss'],
})
export class TransactionDetailComponent implements OnInit, OnDestroy {

  price: number;

  private priceSubscription: Subscription;

  constructor(
    @Inject(MD_DIALOG_DATA) public transaction: any,
    public dialogRef: MdDialogRef<TransactionDetailComponent>,
    private priceService: PriceService,
  ) {}

  ngOnInit() {
    this.priceSubscription = this.priceService.price.subscribe(price => this.price = price);
  }

  ngOnDestroy() {
    this.priceSubscription.unsubscribe();
  }

  closePopup() {
    this.dialogRef.close();
  }

  showOutput(output) {
    return !this.transaction.inputs.find(input => input.owner === output.dst);
  }
}
