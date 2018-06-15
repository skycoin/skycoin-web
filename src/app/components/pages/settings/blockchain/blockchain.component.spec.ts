import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BlockchainComponent } from './blockchain.component';
import { NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { BlockchainService } from '../../../../services/blockchain.service';

@Pipe({name: 'dateFromNow'})
class MockDateFromNowPipe implements PipeTransform {
  transform() {
    return 'transformed value';
  }
}

@Pipe({name: 'translate'})
class MockTranslatePipe implements PipeTransform {
  transform() {
    return 'translated value';
  }
}

class MockBlockchainService {
  lastBlock(): Observable<any> {
    return Observable.of({});
  }

  coinSupply(): Observable<any> {
    return Observable.of({});
  }
}

describe('BlockchainComponent', () => {
  let component: BlockchainComponent;
  let fixture: ComponentFixture<BlockchainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        BlockchainComponent,
        MockDateFromNowPipe,
        MockTranslatePipe
      ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: BlockchainService, useClass: MockBlockchainService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockchainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
