import { Component, Input, HostListener, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/debounceTime';
import { TranslateService } from '@ngx-translate/core';

import { CoinService } from '../../../services/coin.service';
import { BaseCoin } from '../../../coins/basecoin';
import { ISubscription } from 'rxjs/Subscription';
import { WalletService } from '../../../services/wallet/wallet.service';
import { SpendingService } from '../../../services/wallet/spending.service';

@Component({
  selector: 'app-select-coin-overlay',
  templateUrl: './select-coin-overlay.component.html',
  styleUrls: ['./select-coin-overlay.component.scss'],
})
export class SelectCoinOverlayComponent implements OnInit, OnDestroy {

  @ViewChild('searchInput') private searchInput: ElementRef;
  private searchSuscription: ISubscription;
  private coinsWithWallets = new Map<number, boolean>();

  sections: Section[] = [];

  constructor(
    private dialogRef: MatDialogRef<SelectCoinOverlayComponent>,
    private coinService: CoinService,
    private walletService: WalletService,
    private spendingService: SpendingService,
    private translate: TranslateService,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit() {

    this.walletService.wallets.value.forEach(value => {
      if (!this.coinsWithWallets[value.coinId]) {
        this.coinsWithWallets[value.coinId] = true;
      }
    });

    this.searchSuscription = Observable.fromEvent(this.searchInput.nativeElement, 'keyup')
      .debounceTime(500)
      .subscribe(() => this.search());

    this.createSections(this.coinService.coins);
  }

  search() {
    let coins: BaseCoin[];
    const term: string = this.searchInput.nativeElement.value.trim().toLocaleUpperCase();

    if (term.length === 0) {
      coins = this.coinService.coins;
    } else {
      coins = this.coinService.coins.filter((element) => element.coinName.toLocaleUpperCase().includes(term) || element.coinSymbol.toLocaleUpperCase().includes(term));
    }

    this.createSections(coins);
  }

  createSections(coins: BaseCoin[]) {
    const withWallets: Section = {
      name: 'change-coin.with-wallet',
      coins: []
    };
    const withoutWallets: Section = {
      name: 'change-coin.without-wallet',
      coins: []
    };

    coins.forEach((coin: BaseCoin) => {
      if (this.coinsWithWallets[coin.id]) {
        withWallets.coins.push(coin);
      } else {
        withoutWallets.coins.push(coin);
      }
    });

    this.sections = [];
    if (withWallets.coins.length > 0) {
      this.sections.push(withWallets);
    }
    if (withoutWallets.coins.length > 0) {
      this.sections.push(withoutWallets);
    }
  }

  ngOnDestroy() {
    this.searchSuscription.unsubscribe();
    this.snackbar.dismiss();
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.keyCode === 27) {
      this.close(null);
    }
  }

  close(result: BaseCoin | null) {
    this.snackbar.dismiss();
    if (result && this.spendingService.isInjectingTx) {
      const config = new MatSnackBarConfig();
      config.duration = 10000;
      this.snackbar.open(this.translate.instant('change-coin.injecting-tx'), null, config);
      return;
    }
    this.dialogRef.close(result);
  }
}

class Section {
  name: string;
  coins: BaseCoin[];
}
