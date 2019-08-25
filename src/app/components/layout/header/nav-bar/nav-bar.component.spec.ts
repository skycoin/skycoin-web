import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule, MatProgressSpinnerModule, MatTooltip } from '@angular/material';

import { NavBarComponent } from './nav-bar.component';
import { NavBarService } from '../../../../services/nav-bar.service';
import { DoubleButtonComponent } from '../../double-button/double-button.component';
import { ButtonComponent } from '../../button/button.component';
import { MockTranslatePipe, MockNavBarService, MockCoinService } from '../../../../utils/test-mocks';
import { CoinService } from '../../../../services/coin.service';

describe('NavBarComponent', () => {
  let component: NavBarComponent;
  let fixture: ComponentFixture<NavBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavBarComponent, MockTranslatePipe, DoubleButtonComponent, ButtonComponent, MatTooltip ],
      imports: [ MatIconModule, MatProgressSpinnerModule ],
      providers: [
        { provide: NavBarService, useClass: MockNavBarService },
        { provide: CoinService, useClass: MockCoinService },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
