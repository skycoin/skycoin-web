import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as Bip39 from 'bip39';
import { ISubscription } from 'rxjs/Subscription';

import { CoinService } from '../../../../../services/coin.service';
import { BaseCoin } from '../../../../../coins/basecoin';

export class FormData {
  label: string;
  seed: string;
  coin: BaseCoin;
}

@Component({
  selector: 'app-create-wallet-form',
  templateUrl: './create-wallet-form.component.html',
  styleUrls: ['./create-wallet-form.component.scss'],
})
export class CreateWalletFormComponent implements OnInit, OnDestroy {
  @Input() create: boolean;
  @Input() whiteText: boolean;

  form: FormGroup;
  haveManyCoins: boolean;
  normalSeed = false;
  customSeedAccepted = false;

  private statusSubscription: ISubscription;

  constructor(
    private formBuilder: FormBuilder,
    private coinService: CoinService
  ) { }

  ngOnInit() {
    this.haveManyCoins = this.coinService.coins.length > 1;
    this.initForm(this.coinService.currentCoin.getValue());
  }

  ngOnDestroy() {
    this.statusSubscription.unsubscribe();
  }

  get isValid(): boolean {
    return this.form.valid && (this.normalSeed || this.customSeedAccepted);
  }

  onCustomSeedAcceptance(event) {
    this.customSeedAccepted = event.checked ? true : false;
  }

  getData(): FormData {
    return {
      label: this.form.value.label,
      seed: this.form.value.seed,
      coin: this.form.value.coin
    };
  }

  initForm(defaultCoin: BaseCoin, create: boolean = null) {
    create = create !== null ? create : this.create;

    this.form = this.formBuilder.group({
        label: new FormControl('', [ Validators.required ]),
        coin: new FormControl(defaultCoin, [ Validators.required ]),
        seed: new FormControl('', [ Validators.required ]),
        confirm_seed: new FormControl(),
      },
      {
        validator: create ? this.seedMatchValidator.bind(this) : null,
      }
    );

    if (create) {
      this.generateSeed(128);
    }

    this.statusSubscription = this.form.statusChanges.subscribe(() => {
      this.customSeedAccepted = false;
      this.normalSeed = this.validateSeed(this.form.get('seed').value);
    });
  }

  private generateSeed(entropy: number) {
    this.form.controls.seed.setValue(Bip39.generateMnemonic(entropy));
  }

  private validateSeed(seed: string): boolean {
    const processedSeed = seed.replace(/\r?\n|\r/g, ' ').replace(/ +/g, ' ').trim();
    if (seed !== processedSeed) {
      return false;
    }

    const NumberOfWords = seed.split(' ').length;
    if (NumberOfWords !== 12 && NumberOfWords !== 24) {
      return false;
    }

    if (!(/^[a-z\s]*$/).test(seed)) {
      return false;
    }

    return true;
  }

  private seedMatchValidator(formGroup: FormGroup) {
    return formGroup.get('seed').value === formGroup.get('confirm_seed').value ? null : { NotEqual: true };
  }
}
