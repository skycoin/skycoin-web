import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatSnackBar, MatMenuModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { WalletDetailComponent } from './wallet-detail.component';
import { WalletService } from '../../../../services/wallet.service';

class MockWalletService {
}

describe('WalletDetailComponent', () => {

  let component: WalletDetailComponent;
  let fixture: ComponentFixture<WalletDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WalletDetailComponent ],
      imports: [
        RouterTestingModule,
        MatMenuModule
      ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: WalletService, useClass: MockWalletService },
        { provide: MatDialog, useValue: {} },
        { provide: MatSnackBar, useValue: {} }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletDetailComponent);
    component = fixture.componentInstance;
    component.wallet = { label: '', addresses: [] };
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
