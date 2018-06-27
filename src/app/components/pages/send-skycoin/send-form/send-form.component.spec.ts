import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarModule, MatDialog } from '@angular/material';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { SendFormComponent } from './send-form.component';
import { WalletService } from '../../../../services/wallet.service';
import { CoinService } from '../../../../services/coin.service';
import { MockTranslatePipe, MockWalletService, MockMatSnackBar, MockCoinService } from '../../../../utils/test-mocks';

describe('SendFormComponent', () => {
  let component: SendFormComponent;
  let fixture: ComponentFixture<SendFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendFormComponent, MockTranslatePipe ],
      schemas: [ NO_ERRORS_SCHEMA ],
      imports: [ MatSnackBarModule ],
      providers: [
        FormBuilder,
        { provide: WalletService, useClass: MockWalletService },
        { provide: MatDialog, useClass: MockMatSnackBar },
        { provide: CoinService, useClass: MockCoinService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
