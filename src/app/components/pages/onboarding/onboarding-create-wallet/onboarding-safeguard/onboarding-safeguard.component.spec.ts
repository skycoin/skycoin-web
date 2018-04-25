import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialogRef } from '@angular/material';

import { OnboardingSafeguardComponent } from './onboarding-safeguard.component';

describe('OnboardingSafeguardComponent', () => {
  let component: OnboardingSafeguardComponent;
  let fixture: ComponentFixture<OnboardingSafeguardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnboardingSafeguardComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: MatDialogRef, useValue: {} }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingSafeguardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
