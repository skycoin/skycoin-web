import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';

import { DisclaimerWarningComponent } from './disclaimer-warning.component';
import { FeatureService } from '../../../services/feature.service';

@Pipe({name: 'translate'})
class MockTranslatePipe implements PipeTransform {
  transform() {
    return 'translated value';
  }
}

class MockFeatureService {
  getFeatureToggleData(): any {
    return {};
  }
}

describe('DisclaimerWarningComponent', () => {
  let component: DisclaimerWarningComponent;
  let fixture: ComponentFixture<DisclaimerWarningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DisclaimerWarningComponent,
        MockTranslatePipe
      ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: FeatureService, useClass: MockFeatureService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisclaimerWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
