import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatSnackBar, MatMenuModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';

import { WalletDetailComponent } from './wallet-detail.component';
import { WalletService } from '../../../../services/wallet.service';

@Pipe({name: 'translate'})
class MockTranslatePipe implements PipeTransform {
  transform() {
    return 'translated value';
  }
}

class MockWalletService {
}

class MockTranslateService {
  get(key: string | Array<string>, interpolateParams?: Object): Observable<string | any> {
    return Observable.of({});
  }
}

describe('WalletDetailComponent', () => {

  let component: WalletDetailComponent;
  let fixture: ComponentFixture<WalletDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WalletDetailComponent, MockTranslatePipe ],
      imports: [
        RouterTestingModule,
        MatMenuModule
      ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: WalletService, useClass: MockWalletService },
        { provide: MatDialog, useValue: {} },
        { provide: MatSnackBar, useValue: {} },
        { provide: TranslateService, useClass: MockTranslateService },
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletDetailComponent);
    component = fixture.componentInstance;
    component.wallet = { label: '', addresses: [] };
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
