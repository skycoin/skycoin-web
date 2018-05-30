import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { HeaderComponent } from './header.component';
import { PriceService } from '../../../services/price.service';
import { WalletService } from '../../../services/wallet.service';
import { AppService } from '../../../services/app.service';
import { BlockchainService } from '../../../services/blockchain.service';
import { TotalBalance } from '../../../app.datatypes';

class MockPriceService {
  price: Subject<number> = new BehaviorSubject<number>(null);
}

class MockWalletService {
  totalBalance: Subject<TotalBalance> = new BehaviorSubject<TotalBalance>(null);
  hasPendingTransactions: Subject<boolean> = new ReplaySubject<boolean>();

  sum() {
  }
}

class MockAppService {
  checkConnectionState()  {
    return Observable.of(null);
  }
}

class MockBlockchainService {
  get progress() {
    return Observable.of();
  }
}

@Pipe({name: 'translate'})
class MockTranslatePipe implements PipeTransform {
  transform() {
    return 'translated value';
  }
}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderComponent, MockTranslatePipe ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: PriceService, useClass: MockPriceService },
        { provide: WalletService, useClass: MockWalletService },
        { provide: AppService, useClass: MockAppService },
        { provide: BlockchainService, useClass: MockBlockchainService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
