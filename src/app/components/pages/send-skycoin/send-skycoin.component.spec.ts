import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { SendSkycoinComponent } from './send-skycoin.component';
import { MockTranslatePipe } from '../../../utils/test-mocks';

describe('SendSkycoinComponent', () => {
  let component: SendSkycoinComponent;
  let fixture: ComponentFixture<SendSkycoinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendSkycoinComponent, MockTranslatePipe ],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendSkycoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
