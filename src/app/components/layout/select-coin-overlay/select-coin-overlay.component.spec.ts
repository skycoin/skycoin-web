import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule, MatDialogRef, MatSnackBar } from '@angular/material';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { SelectCoinOverlayComponent } from './select-coin-overlay.component';
import { MockTranslatePipe, MockMatDialogRef, MockCoinService, MockWalletService, MockSpendingService, MockTranslateService, MockMatSnackBar } from '../../../utils/test-mocks';
import { CoinService } from '../../../services/coin.service';
import { WalletService } from '../../../services/wallet/wallet.service';
import { SpendingService } from '../../../services/wallet/spending.service';

describe('SelectCoinOverlayComponent', () => {
  let component: SelectCoinOverlayComponent;
  let fixture: ComponentFixture<SelectCoinOverlayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectCoinOverlayComponent, MockTranslatePipe ],
      schemas: [ NO_ERRORS_SCHEMA ],
      imports: [
        MatIconModule
      ],
      providers: [
        { provide: MatDialogRef, useClass: MockMatDialogRef },
        { provide: CoinService, useClass: MockCoinService },
        { provide: WalletService, useClass: MockWalletService },
        { provide: SpendingService, useClass: MockSpendingService },
        { provide: TranslateService, useClass: MockTranslateService },
        { provide: MatSnackBar, useClass: MockMatSnackBar }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectCoinOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
