import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBarModule } from '@angular/material';

import { CreateWalletComponent } from './create-wallet.component';
import { WalletService } from '../../../../services/wallet.service';
import { CoinService } from '../../../../services/coin.service';
import { MockTranslatePipe, MockWalletService, MockCoinService } from '../../../../utils/test-mocks';

describe('CreateWalletComponent', () => {
  let component: CreateWalletComponent;
  let fixture: ComponentFixture<CreateWalletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateWalletComponent, MockTranslatePipe ],
      imports: [ MatSnackBarModule ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: WalletService, useClass: MockWalletService },
        { provide: MatDialogRef, useValue: {} },
        { provide: CoinService, useClass: MockCoinService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
