import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatMenuModule, MatIconModule } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Pipe, PipeTransform } from '@angular/core';

import { TopBarComponent } from './top-bar.component';
import { WalletService } from '../../../../services/wallet.service';

@Pipe({name: 'translate'})
class MockTranslatePipe implements PipeTransform {
  transform() {
    return 'translated value';
  }
}

class MockWalletService {
  get timeSinceLastBalancesUpdate(): Observable<void> {
    return Observable.of();
  }
}

describe('TopBarComponent', () => {
  let component: TopBarComponent;
  let fixture: ComponentFixture<TopBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopBarComponent, MockTranslatePipe ],
      imports: [
        MatMenuModule,
        MatIconModule,
        RouterTestingModule
      ],
      providers: [
        { provide: WalletService, useClass: MockWalletService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
