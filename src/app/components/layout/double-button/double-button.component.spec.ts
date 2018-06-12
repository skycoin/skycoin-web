import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';

import { DoubleButtonComponent } from './double-button.component';

@Pipe({name: 'translate'})
class MockTranslatePipe implements PipeTransform {
  transform() {
    return 'translated value';
  }
}

describe('DoubleButtonComponent', () => {
  let component: DoubleButtonComponent;
  let fixture: ComponentFixture<DoubleButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoubleButtonComponent, MockTranslatePipe ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoubleButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
