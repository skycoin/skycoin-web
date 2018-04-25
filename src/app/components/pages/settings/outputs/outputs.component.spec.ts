import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs/Observable';

import { OutputsComponent } from './outputs.component';
import { WalletService } from '../../../../services/wallet.service';

class MockWalletService {
  outputs() {
    return Observable.of([]);
  }
}

describe('OutputsComponent', () => {
  let component: OutputsComponent;
  let fixture: ComponentFixture<OutputsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutputsComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: WalletService, useClass: MockWalletService },
        { provide: MatDialog, useValue: {} }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutputsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
