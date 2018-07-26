import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialogModule, MatSnackBarModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { FormBuilder } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

import { OnboardingCreateWalletComponent } from './onboarding-create-wallet.component';
import { WalletService } from '../../../../services/wallet.service';
import { OnboardingDisclaimerComponent } from './onboarding-disclaimer/onboarding-disclaimer.component';
import { CoinService } from '../../../../services/coin.service';
import { MockTranslatePipe, MockWalletService, MockCoinService, MockLanguageService } from '../../../../utils/test-mocks';
import { LanguageService } from '../../../../services/language.service';
import { CreateWalletFormComponent } from '../../wallets/create-wallet/create-wallet-form/create-wallet-form.component';

describe('OnboardingCreateWalletComponent', () => {
  let component: OnboardingCreateWalletComponent;
  let fixture: ComponentFixture<OnboardingCreateWalletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        OnboardingCreateWalletComponent,
        OnboardingDisclaimerComponent,
        MockTranslatePipe,
        CreateWalletFormComponent
      ],
      imports: [
        MatDialogModule,
        RouterTestingModule,
        BrowserAnimationsModule,
        MatSnackBarModule
      ],
      providers: [
        FormBuilder,
        { provide: WalletService, useClass: MockWalletService },
        { provide: CoinService, useClass: MockCoinService },
        { provide: LanguageService, useClass: MockLanguageService }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });
  }));

  beforeEach(() => {
    TestBed.overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [ OnboardingDisclaimerComponent ],
      }
    });

    fixture = TestBed.createComponent(OnboardingCreateWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
