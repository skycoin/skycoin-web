import { browser } from 'protractor';

import { OnboardingCreatePage } from './onboarding-create.po';

describe('Onboarding Create', () => {
  let page: OnboardingCreatePage;

  beforeAll(() => {
    browser.get('/').then(() => browser.sleep(500));

    page = new OnboardingCreatePage();
    page.navigateTo();
  });

  afterAll(() => {
    browser.restartSync();
  });

  it('should display title', () => {
    expect<any>(page.getHeaderText()).toEqual('Create Wallet');
  });

  it('should display the language selection modal', () => {
    expect<any>(page.getSelectLanguageModalIsShow()).toEqual(true);
  });

  it('should not close the language selection modal by pressing outside the window', () => {
    expect<any>(page.closeOutsideSelectLanguageModal()).toEqual(true);
  });

  it('should not close the language selection modal by pressing the X button', () => {
    expect<any>(page.closeSelectLanguageModal()).toEqual(true);
  });

  it('should close the language selection modal by selecting a language', () => {
    expect<any>(page.selectLanguage()).toEqual(false);
  });

  it('should display disclaimer', () => {
    expect<any>(page.getDisclaimerIsShow()).toEqual(true);
  });

  it('should not close disclaimer by press outside disclaimer', () => {
    expect<any>(page.closeOutsideDisclaimer()).toEqual(true);
  });

  it('should not close disclaimer by press the X button', () => {
    expect<any>(page.closeDisclaimer()).toEqual(true);
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

  it('should disable create new wallet button if seed do not match', () => {
    expect<any>(page.getCreateWalletButtonState()).toEqual(false);
  });

  it('should generate 12 words seed', () => {
    expect<any>(page.generateSeed(12)).toEqual(true);
  });

  it('should generate 24 words seed', () => {
    expect<any>(page.generateSeed(24)).toEqual(true);
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

  it('should close safeguard by press the X button', () => {
    expect<any>(page.closeSafeguard()).toEqual(false);
    page.createWallet();
  });

  it('should close safeguard by press outside safeguard', () => {
    expect<any>(page.closeOutsideSafeguard()).toEqual(false);
    page.createWallet();
  });

  it('should hide accepted safeguard', () => {
    expect<any>(page.acceptSafeguard()).toEqual(false);
  });

  it('should create wallet with correct address', () => {
    expect<any>(page.verifyCreatedWalletAddress()).toEqual(true);
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

  it('should load wallet with correct address', done => {
    browser.get('#/wizard').then(() => browser.sleep(500));
    expect<any>(page.verifyLoadedWalletAddress()).toEqual(true);
    done();
  });

});
