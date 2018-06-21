import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { WalletsComponent } from './wallets.component';
import { WalletService } from '../../../services/wallet.service';
import { Wallet } from '../../../app.datatypes';
import { BaseCoin } from '../../../coins/basecoin';
import { CoinService } from '../../../services/coin.service';

class MockWalletService {
  get all(): Observable<Wallet[]> {
    return Observable.of([]);
  }
}

class MockCoinService {
  currentCoin = new BehaviorSubject<BaseCoin>({
    id: 1,
    nodeUrl: 'nodeUrl',
    nodeVersion: 'v1',
    coinName: 'test coin',
    coinSymbol: 'test',
    hoursName: 'test',
    cmcTickerId: 1
  });
}

@Pipe({name: 'translate'})
class MockTranslatePipe implements PipeTransform {
  transform() {
    return 'translated value';
  }
}

describe('WalletsComponent', () => {
  let component: WalletsComponent;
  let fixture: ComponentFixture<WalletsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WalletsComponent, MockTranslatePipe ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: WalletService, useClass: MockWalletService },
        { provide: MatDialog, useValue: {} },
        { provide: CoinService, useClass: MockCoinService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

