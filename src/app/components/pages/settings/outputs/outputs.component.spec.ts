import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';

import { OutputsComponent } from './outputs.component';
import { WalletService } from '../../../../services/wallet.service';

class MockWalletService {
  outputsWithWallets() {
    return Observable.of([]);
  }
}

@Pipe({name: 'translate'})
class MockTranslatePipe implements PipeTransform {
  transform() {
    return 'translated value';
  }
}

describe('OutputsComponent', () => {
  let component: OutputsComponent;
  let fixture: ComponentFixture<OutputsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutputsComponent, MockTranslatePipe ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: ActivatedRoute, useValue: { queryParams: Observable.of({}) } },
        { provide: WalletService, useClass: MockWalletService }
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
