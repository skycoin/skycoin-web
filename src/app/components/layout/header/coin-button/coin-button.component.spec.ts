import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material';

import { CoinButtonComponent } from './coin-button.component';
import { CoinService } from '../../../../services/coin.service';
import { MockCoinService } from '../../../../utils/test-mocks';

describe('CoinButtonComponent', () => {
  let component: CoinButtonComponent;
  let fixture: ComponentFixture<CoinButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoinButtonComponent ],
      imports: [
        MatIconModule
      ],
      providers: [
        { provide: CoinService, useClass: MockCoinService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoinButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
