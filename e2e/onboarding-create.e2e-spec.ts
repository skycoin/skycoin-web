import { browser } from 'protractor';

import { OnboardingCreatePage } from './onboarding-create.po';

describe('Onboarding Create', () => {
  let page: OnboardingCreatePage;

  beforeEach(() => {
    page = new OnboardingCreatePage();
  });

  it('should display title', () => {
    page.navigateTo();
    expect<any>(page.getHeaderText()).toEqual('Create a Wallet');
  });

  it('should display disclaimer', () => {
    expect<any>(page.getDisclaimerIsShow()).toEqual(true);
  });

  it('should disable disclaimer Continue button', () => {
    expect<any>(page.getDisclaimerButtonState()).toEqual(false);
  });

  it('should enable disclaimer Continue button', () => {
    expect<any>(page.getDisclaimerCheckedButtonState()).toEqual(true);
  });

  it('should hide accepted disclaimer', () => {
    // page.navigateTo();
    expect<any>(page.acceptDisclaimer()).toEqual(false);
  });

  it('should load wallet', () => {
    expect<any>(page.loadWallet()).toEqual(true);
  });

  it('should create wallet', () => {
    expect<any>(page.createWallet()).toEqual(true);
  });

  it('should show safeguard', () => {
    expect<any>(page.getSafeguardIsShow()).toEqual(true);
  });

  it('should hide accepted safeguard', () => {
    expect<any>(page.acceptSafeguard()).toEqual(false);
  });

  it('should skip wizard', () => {
    page.navigateTo();
    expect<any>(page.skipWizard()).toContain('/wallets');
  });

});
