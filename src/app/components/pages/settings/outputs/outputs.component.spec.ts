import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';
import { MatDialogModule } from '@angular/material';

import { OutputsComponent } from './outputs.component';
import { SpendingService } from '../../../../services/wallet/spending.service';
import { CoinService } from '../../../../services/coin.service';
import { MockTranslatePipe, MockSpendingService, MockCoinService } from '../../../../utils/test-mocks';

describe('OutputsComponent', () => {
  let component: OutputsComponent;
  let fixture: ComponentFixture<OutputsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutputsComponent, MockTranslatePipe ],
      imports: [ MatDialogModule ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: ActivatedRoute, useValue: { queryParams: Observable.of({}) } },
        { provide: SpendingService, useClass: MockSpendingService },
        { provide: CoinService, useClass: MockCoinService }
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
