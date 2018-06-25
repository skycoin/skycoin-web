import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarModule, MatDialog } from '@angular/material';
import { NO_ERRORS_SCHEMA, PipeTransform, Pipe } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { SendFormComponent } from './send-form.component';
import { WalletService } from '../../../../services/wallet.service';
import { Wallet } from '../../../../app.datatypes';
import { BaseCoin } from '../../../../coins/basecoin';
import { CoinService } from '../../../../services/coin.service';

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

class MockCoinService {
  currentCoin = new BehaviorSubject<BaseCoin>({
    id: 1,
    nodeUrl: 'nodeUrl',
    nodeVersion: 'v1',
    coinName: 'test coin',
    coinSymbol: 'test',
    hoursName: 'test',
    cmcTickerId: 1,
    coinExplorer: 'testUrl'
  });
}

class MockMatSnackBar {
  dismiss() {
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
        { provide: MatDialog, useClass: MockMatSnackBar },
        { provide: CoinService, useClass: MockCoinService }
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
