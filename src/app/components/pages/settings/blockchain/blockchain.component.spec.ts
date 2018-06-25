import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BlockchainComponent } from './blockchain.component';
import { NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { BlockchainService } from '../../../../services/blockchain.service';
import { BaseCoin } from '../../../../coins/basecoin';
import { CoinService } from '../../../../services/coin.service';

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

class MockCoinService {
  currentCoin = new BehaviorSubject<BaseCoin>(null);
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
        { provide: BlockchainService, useClass: MockBlockchainService },
        { provide: CoinService, useClass: MockCoinService }
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
