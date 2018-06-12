import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder } from '@angular/forms';

import { ChangeNameComponent } from './change-name.component';
import { WalletService } from '../../../../services/wallet.service';

class MockWalletService {
}

@Pipe({name: 'translate'})
class MockTranslatePipe implements PipeTransform {
  transform() {
    return 'translated value';
  }
}

describe('ChangeNameComponent', () => {
  let component: ChangeNameComponent;
  let fixture: ComponentFixture<ChangeNameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeNameComponent, MockTranslatePipe ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        { provide: WalletService, useClass: MockWalletService },
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
