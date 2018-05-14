import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { HeaderComponent } from './header.component';
import { PriceService } from '../../../services/price.service';
import { WalletService } from '../../../services/wallet.service';
import { Wallet } from '../../../app.datatypes';
import { AppService } from '../../../services/app.service';
import { Observable } from 'rxjs/Observable';
import { BlockchainService } from '../../../services/blockchain.service';

class MockPriceService {
  price: Subject<number> = new BehaviorSubject<number>(null);
}

class MockWalletService {
  wallets: Subject<Wallet[]> = new BehaviorSubject<Wallet[]>([]);

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

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderComponent ],
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
