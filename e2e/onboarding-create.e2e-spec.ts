import { browser } from 'protractor';

import { OnboardingCreatePage } from './onboarding-create.po';

describe('Onboarding Create', () => {
  let page: OnboardingCreatePage;

  beforeAll(() => {
    browser.get('/');

    page = new OnboardingCreatePage();
    page.navigateTo();
  });

  afterAll(() => {
    browser.restartSync();
  });

  it('should display title', () => {
    expect<any>(page.getHeaderText()).toEqual('Create Wallet');
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

  it('should not create wallet with already used seed', () => {
    page.navigateTo();
    expect<any>(page.createExistingWallet()).toEqual(false);
  });

  it('should not load wallet with already used seed', () => {
    page.navigateTo();
    expect<any>(page.loadExistingWallet()).toEqual(false);
  });
});
