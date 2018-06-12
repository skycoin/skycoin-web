import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCheckboxModule } from '@angular/material';
import { FormBuilder } from '@angular/forms';
import { NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';

import { OnboardingEncryptWalletComponent } from './onboarding-encrypt-wallet.component';

@Pipe({name: 'translate'})
class MockTranslatePipe implements PipeTransform {
  transform() {
    return 'translated value';
  }
}

describe('OnboardingEncryptWalletComponent', () => {
  let component: OnboardingEncryptWalletComponent;
  let fixture: ComponentFixture<OnboardingEncryptWalletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnboardingEncryptWalletComponent, MockTranslatePipe ],
      imports: [ MatCheckboxModule ],
      providers: [ FormBuilder ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingEncryptWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
