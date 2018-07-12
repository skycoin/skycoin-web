import { Pipe, PipeTransform, Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { BaseCoin } from '../coins/basecoin';
import { TotalBalance, Wallet } from '../app.datatypes';

// -- Components
@Component({
  template: `
    <span clipboard="test data"></span>
    <input type="text" appNumberField>`
})
export class TestComponent {
}

// --- Pipes
@Pipe({name: 'translate'})
export class MockTranslatePipe implements PipeTransform {
  transform() {
    return 'translated value';
  }
}

@Pipe({name: 'tellerStatus'})
export class MockTellerStatusPipe implements PipeTransform {
  transform() {
    return 'transformed value';
  }
}

@Pipe({ name: 'dateTime' })
export class MockDateTimePipe implements PipeTransform {
  transform() {
    return 'transformed value';
  }
}

// --- Services
export class MockFeatureService {
  getFeatureToggleData(): any {
    return {};
  }
}

export class MockNavBarService {
  activeComponent = new BehaviorSubject({});

  showSwitch(leftText: any, rightText: any) {}

  hideSwitch() {}

  setActiveComponent() {}
}

export class MockPurchaseService {
  all(): Observable<any[]> {
    return Observable.of([]);
  }
}

export class MockCoinService {
  coins = [];

  currentCoin = new BehaviorSubject<BaseCoin>({
    id: 1,
    cmcTickerId: 1,
    nodeUrl: 'nodeUrl',
    nodeVersion: 'v1',
    coinName: 'test coin',
    coinSymbol: 'test',
    hoursName: 'Test Hours',
    coinExplorer: 'testUrl',
    imageName: 'imageName.png',
    gradientName: 'imageName.png',
    iconName: 'icon.png',
    bigIconName: 'big-icon.png',
  });
}

export class MockWalletService {
  hasPendingTransactions: Subject<boolean> = new ReplaySubject<boolean>();
  haveWallets: Observable<boolean> = Observable.of();

  get timeSinceLastBalancesUpdate(): Observable<void> {
    return Observable.of();
  }

  get totalBalance(): BehaviorSubject<TotalBalance> {
    return new BehaviorSubject<TotalBalance>(null);
  }

  get addresses(): Observable<any[]> {
    return Observable.of([]);
  }

  wallets = new BehaviorSubject<any[]>([]);

  get all(): Observable<Wallet[]> {
    return Observable.of([]);
  }

  sum() {
  }

  transactions(): Observable<any[]> {
    return Observable.of([]);
  }

  generateSeed(entropy) {
    return Observable.of('');
  }

  outputsWithWallets() {
    return Observable.of([]);
  }

  getAllPendingTransactions() {
    return Observable.of([]);
  }

  getTransactionDetails() {
    return Observable.of({});
  }

  loadBalances() {
  }
}

export class MockPriceService {
  price: Subject<number> = new BehaviorSubject<number>(null);
}

export class MockBlockchainService {
  get progress() {
    return Observable.of();
  }

  lastBlock(): Observable<any> {
    return Observable.of({});
  }

  coinSupply(): Observable<any> {
    return Observable.of({});
  }

  loadBlockchainBlocks() {
  }
}

export class MockMatSnackBar {
  dismiss() {
  }
}

export class MockTranslateService {
  onLangChange = Observable.of({});

  get(key: string | Array<string>, interpolateParams?: Object): Observable<string | any> {
    return Observable.of({});
  }

  addLangs(langs: Array<string>): void {
  }

  setDefaultLang(lang: string): void {
  }

  use(lang: string): Observable<any> {
    return Observable.of({});
  }
}

export class MockApiService {
  get(url: string) {
    if (url === 'network/connections') {
      return Observable.of({ connections: [] });
    } else {
      return Observable.of({});
    }
  }
}

export class MockClipboardService {
}

export class MockLanguageService {
  currentLanguage = new BehaviorSubject<string>('en');

  loadLanguageSettings() {
  }
}

export class MockMatDialogRef<T> {
  close(dialogResult?: any) {
  }
}
