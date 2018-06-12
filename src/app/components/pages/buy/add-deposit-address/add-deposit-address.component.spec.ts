import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatSelectModule, MatDialogRef } from '@angular/material';
import { NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AddDepositAddressComponent } from './add-deposit-address.component';
import { WalletService } from '../../../../services/wallet.service';
import { PurchaseService } from '../../../../services/purchase.service';

class MockWalletService {
  get addresses(): Observable<any[]> {
    return Observable.of([]);
  }
}

class MockPurchaseService {
}

@Pipe({name: 'translate'})
class MockTranslatePipe implements PipeTransform {
  transform() {
    return 'translated value';
  }
}

describe('AddDepositAddressComponent', () => {
  let component: AddDepositAddressComponent;
  let fixture: ComponentFixture<AddDepositAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDepositAddressComponent, MockTranslatePipe ],
      imports: [ MatSelectModule ],
      providers: [
        FormBuilder,
        { provide: WalletService, useClass: MockWalletService },
        { provide: PurchaseService, useClass: MockPurchaseService },
        { provide: MatDialogRef, useValue: {} }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDepositAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
