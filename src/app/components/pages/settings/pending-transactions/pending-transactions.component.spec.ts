import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { PendingTransactionsComponent } from './pending-transactions.component';
import { WalletService } from '../../../../services/wallet.service';

describe('PendingTransactionsComponent', () => {
  let component: PendingTransactionsComponent;
  let fixture: ComponentFixture<PendingTransactionsComponent>;

  class MockWalletService {
    getAllPendingTransactions() {
      return Observable.of([]);
    }
  }

  @Pipe({name: 'translate'})
  class MockTranslatePipe implements PipeTransform {
    transform() {
      return 'translated value';
    }
  }

  @Pipe({name: 'dateTime'})
  class MockDateTimePipe implements PipeTransform {
    transform() {
      return 'transformed value';
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule ],
      declarations: [
        PendingTransactionsComponent,
        MockDateTimePipe,
        MockTranslatePipe
      ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [{ provide: WalletService, useClass: MockWalletService }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
