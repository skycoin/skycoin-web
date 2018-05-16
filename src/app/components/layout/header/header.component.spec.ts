import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { HeaderComponent } from './header.component';
import { PriceService } from '../../../services/price.service';
import { WalletService } from '../../../services/wallet.service';
import { TotalBalance } from '../../../app.datatypes';

class MockPriceService {
  price: Subject<number> = new BehaviorSubject<number>(null);
}

class MockWalletService {
  totalBalance: Subject<TotalBalance> = new BehaviorSubject<TotalBalance>(null);

  sum() {
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
        { provide: WalletService, useClass: MockWalletService }
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
