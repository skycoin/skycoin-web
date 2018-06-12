import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { TransactionInfoComponent } from './transaction-info.component';
import { PriceService } from '../../../../../services/price.service';

@Pipe({name: 'translate'})
class MockTranslatePipe implements PipeTransform {
  transform() {
    return 'translated value';
  }
}

class MockPriceService {
  price: Subject<number> = new BehaviorSubject<number>(null);
}

describe('TransactionInfoComponent', () => {
  let component: TransactionInfoComponent;
  let fixture: ComponentFixture<TransactionInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionInfoComponent, MockTranslatePipe ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: PriceService, useClass: MockPriceService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionInfoComponent);
    component = fixture.componentInstance;
    component.transaction = { inputs: [], outputs: [] };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
