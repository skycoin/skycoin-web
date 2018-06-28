import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { HeaderComponent } from './header.component';
import { PriceService } from '../../../services/price.service';
import { WalletService } from '../../../services/wallet.service';
import { BlockchainService } from '../../../services/blockchain.service';
import { CoinService } from '../../../services/coin.service';
import { LanguageService } from '../../../services/language.service';
import {
  MockTranslatePipe,
  MockCoinService,
  MockBlockchainService,
  MockPriceService,
  MockWalletService,
  MockLanguageService
} from '../../../utils/test-mocks';

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
        { provide: BlockchainService, useClass: MockBlockchainService },
        { provide: CoinService, useClass: MockCoinService },
        { provide: LanguageService, useClass: MockLanguageService }
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
