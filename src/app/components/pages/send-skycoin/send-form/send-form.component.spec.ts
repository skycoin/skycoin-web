import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarModule, MatDialog } from '@angular/material';
import { NO_ERRORS_SCHEMA, PipeTransform, Pipe } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { SendFormComponent } from './send-form.component';
import { WalletService } from '../../../../services/wallet.service';
import { Wallet } from '../../../../app.datatypes';

@Pipe({name: 'translate'})
class MockTranslatePipe implements PipeTransform {
  transform() {
    return 'translated value';
  }
}

class MockWalletService {
  get all(): Observable<Wallet[]> {
    return Observable.of([]);
  }
}

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
        { provide: MatDialog, useValue: {} }
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
