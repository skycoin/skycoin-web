import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material';

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
      providers: [
        { provide: WalletService, useClass: MockWalletService },
        { provide: MatDialog, useValue: {} }
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
