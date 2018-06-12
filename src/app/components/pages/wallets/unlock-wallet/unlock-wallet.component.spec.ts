import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { FormBuilder } from '@angular/forms';

import { UnlockWalletComponent } from './unlock-wallet.component';
import { WalletService } from '../../../../services/wallet.service';

class MockWalletService {
}

@Pipe({name: 'translate'})
class MockTranslatePipe implements PipeTransform {
  transform() {
    return 'translated value';
  }
}

describe('UnlockWalletComponent', () => {
  let component: UnlockWalletComponent;
  let fixture: ComponentFixture<UnlockWalletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnlockWalletComponent, MockTranslatePipe ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        { provide: WalletService, useClass: MockWalletService },
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatSnackBar, useValue: {} }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnlockWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
