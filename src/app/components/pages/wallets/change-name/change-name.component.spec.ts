import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { ChangeNameComponent } from './change-name.component';
import { WalletService } from '../../../../services/wallet/wallet.service';
import { MockTranslatePipe, MockWalletService, MockMsgBarService, MockHwWalletService, MockTranslateService } from '../../../../utils/test-mocks';
import { MsgBarService } from '../../../../services/msg-bar.service';
import { HwWalletService } from '../../../../services/hw-wallet/hw-wallet.service';

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
        { provide: MAT_DIALOG_DATA, useValue: { wallet: { label: '' } } },
        { provide: MsgBarService, useClass: MockMsgBarService },
        { provide: HwWalletService, useClass: MockHwWalletService },
        { provide: TranslateService, useClass: MockTranslateService },
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
