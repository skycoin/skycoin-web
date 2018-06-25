import { Component, OnInit, forwardRef, Output, EventEmitter, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { CoinService } from '../../../services/coin.service';
import { BaseCoin } from '../../../coins/basecoin';

@Component({
  selector: 'app-select-coin',
  templateUrl: 'select-coin.component.html',
  styleUrls: ['select-coin.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SelectCoinComponent),
    multi: true
  }]
})
export class SelectCoinComponent implements OnInit, ControlValueAccessor {
  @Output() onCoinChanged = new EventEmitter<BaseCoin>();
  @Input() selectedCoin: BaseCoin;
  coins: BaseCoin[];

  constructor(
    private coinService: CoinService
  ) {}

  ngOnInit() {
    this.coins = this.coinService.coins;
  }

  onChanged(coin: BaseCoin) {
    this.selectedCoin = coin;
    this.onChangeCallback(this.selectedCoin);
    this.onCoinChanged.emit(coin);
  }

  writeValue(coin: any) {
    this.selectedCoin = coin;
  }

  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any) {
  }

  private onChangeCallback: any = () => {};
}
