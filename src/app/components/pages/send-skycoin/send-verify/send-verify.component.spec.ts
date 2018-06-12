import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material';
import { NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';

import { SendVerifyComponent } from './send-verify.component';
import { WalletService } from '../../../../services/wallet.service';

@Pipe({name: 'translate'})
class MockTranslatePipe implements PipeTransform {
  transform() {
    return 'translated value';
  }
}

class MockWalletService {
}

class MockMatSnackBar {
  dismiss() {
  }
}

describe('SendVerifyComponent', () => {
  let component: SendVerifyComponent;
  let fixture: ComponentFixture<SendVerifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendVerifyComponent, MockTranslatePipe ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: WalletService, useClass: MockWalletService },
        { provide: MatSnackBar, useClass: MockMatSnackBar }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendVerifyComponent);
    component = fixture.componentInstance;
    component.transaction = { inputs: [], outputs: [], from: '', to: '', encoded: '' };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
