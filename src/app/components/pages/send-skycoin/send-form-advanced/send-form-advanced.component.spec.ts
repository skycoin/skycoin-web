import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatSnackBarModule } from '@angular/material';
import { FormBuilder } from '@angular/forms';

import { SendFormAdvancedComponent } from './send-form-advanced.component';
import { MockTranslatePipe, MockWalletService, MockSpendingService, MockCoinService, MockBlockchainService, MockCustomMatDialogService, MockNavBarService } from '../../../../utils/test-mocks';
import { WalletService } from '../../../../services/wallet/wallet.service';
import { SpendingService } from '../../../../services/wallet/spending.service';
import { CoinService } from '../../../../services/coin.service';
import { BlockchainService } from '../../../../services/blockchain.service';
import { CustomMatDialogService } from '../../../../services/custom-mat-dialog.service';
import { NavBarService } from '../../../../services/nav-bar.service';

describe('SendFormAdvancedComponent', () => {
  let component: SendFormAdvancedComponent;
  let fixture: ComponentFixture<SendFormAdvancedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendFormAdvancedComponent, MockTranslatePipe ],
      schemas: [ NO_ERRORS_SCHEMA ],
      imports: [ MatSnackBarModule ],
      providers: [
        FormBuilder,
        { provide: WalletService, useClass: MockWalletService },
        { provide: SpendingService, useClass: MockSpendingService },
        { provide: CoinService, useClass: MockCoinService },
        { provide: BlockchainService, useClass: MockBlockchainService },
        { provide: CustomMatDialogService, useClass: MockCustomMatDialogService },
        { provide: NavBarService, useClass: MockNavBarService },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendFormAdvancedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
