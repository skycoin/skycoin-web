import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { MatDialogModule, MatDialog } from '@angular/material';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { HistoryComponent } from './history.component';
import { WalletService } from '../../../services/wallet.service';
import { PriceService } from '../../../services/price.service';

class MockWalletService {
  transactions(): Observable<any[]> {
    return Observable.of([]);
  }
}

class MockPriceService {
  price: BehaviorSubject<number> = new BehaviorSubject<number>(null);
}

@Pipe({name: 'translate'})
class MockTranslatePipe implements PipeTransform {
  transform() {
    return 'translated value';
  }
}

describe('HistoryComponent', () => {
  let component: HistoryComponent;
  let fixture: ComponentFixture<HistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryComponent, MockTranslatePipe ],
      imports: [ MatDialogModule ],
      providers: [
        MatDialog,
        { provide: WalletService, useClass: MockWalletService },
        { provide: PriceService, useClass: MockPriceService }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
