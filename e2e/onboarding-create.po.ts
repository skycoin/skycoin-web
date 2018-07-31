import { browser, by, element, ElementFinder, ExpectedConditions } from 'protractor';

export class OnboardingCreatePage {
  navigateTo() {
    return browser.get('/wizard/create');
  }

  getHeaderText() {
    return element(by.css('.-header')).getText();
  }

  getSelectLanguageModalIsShow() {
    browser.sleep(250);
    return element(by.css('app-select-language')).isPresent();
  }

  closeOutsideSelectLanguageModal() {
    this.clickOutsideModal();
    return this.getSelectLanguageModalIsShow();
  }

  closeSelectLanguageModal() {
    const closeImg = element(by.css('img.btn-close'));
    return closeImg.isPresent().then((isShown) => {
      if (isShown) {
        closeImg.click();
      }
      return this.getSelectLanguageModalIsShow();
    });
  }

  selectLanguage() {
    return element.all(by.css('.header-sel-theme > button')) .first().click().then(() => {
      browser.sleep(250);
      return this.getSelectLanguageModalIsShow();
    });
  }

  getDisclaimerIsShow() {
    return element(by.css('app-onboarding-disclaimer')).isPresent();
  }

  getSafeguardIsShow() {
    return element(by.css('app-onboarding-safeguard')).isPresent();
  }

  closeOutsideDisclaimer() {
    this.clickOutsideModal();
    return this.getDisclaimerIsShow();
  }

  closeDisclaimer() {
    const closeImg = element(by.css('img.btn-close'));
    return closeImg.isPresent().then((isShown) => {
      if (isShown) {
        closeImg.click();
      }
      return this.getDisclaimerIsShow();
    });
  }

  acceptDisclaimer() {
    element.all(by.css('.-disclaimer-check-text span')).first().click();
    element(by.buttonText('Continue')).click();
    return this.getDisclaimerIsShow();
  }

  acceptSafeguard() {
   return element.all(by.css('app-modal .mat-checkbox-label')).first().click().then(() => {
     return element(by.buttonText('Continue')).click().then(() => {
        return this.getSafeguardIsShow();
      });
    });
  }

  closeOutsideSafeguard() {
    this.clickOutsideModal();
    return this.getSafeguardIsShow();
  }

  closeSafeguard() {
    browser.sleep(250);
    element(by.css('img.btn-close')).click();
    return this.getSafeguardIsShow();
  }

  getDisclaimerButtonState() {
    return element(by.buttonText('Continue')).isEnabled();
  }

  getDisclaimerCheckedButtonState() {
    element.all(by.css('.-disclaimer-check-text span')).first().click();
    const button = element(by.buttonText('Continue'));
    const state = button.getAttribute('disabled') !== null;
    element.all(by.css('.-disclaimer-check-text span')).first().click();
    return state;
  }

  getCreateWalletButtonState() {
    const btnCreate = this.fillCreateWalletForm('not matched seed');
    return btnCreate.isEnabled();
  }

  createWallet() {
    const btnCreate = this.fillCreateWalletForm();

    return btnCreate.isEnabled().then(status => {
      if (status) {
        btnCreate.click();
      }
      return status;
    });
  }

  createExistingWallet() {
    const btnCreate = this.fillCreateWalletForm();

    return btnCreate.click().then(() => {
      return !btnCreate.isPresent();
    });
  }

  loadWallet() {
    const btnLoad = this.fillLoadWalletForm();
    return btnLoad.isEnabled();
  }

  loadExistingWallet() {
    const btnLoad = this.fillLoadWalletForm();
    return btnLoad.click().then(() => {
      return !btnLoad.isPresent();
    });
  }

  generateSeed(wordsLength: number) {
    const link = element(by.cssContainingText('span.generators span', `${wordsLength} words`));

    return link.click().then(() => {
      const seed = element(by.css('[formcontrolname="seed"]'));
      return seed.getAttribute('value').then((val: string) => {
        return val.split(' ').length === wordsLength;
      });
    });
  }

  verifyCreatedWalletAddress() {
    this.waitUntilWalletIsCreated();

    return browser.executeScript('return window.localStorage.getItem("wallets");')
      .then((data: string) => {
        const wallets = JSON.parse(data);
        return wallets[0].addresses[0].address === '2EzqAbuLosF47Vm418kYo2rnMgt6XgGaA1Z';
      });
  }

  verifyLoadedWalletAddress() {
    const walletLabel = 'Loaded wallet';
    const btnLoad = this.fillLoadWalletForm(walletLabel, 'load seed');

    return btnLoad.click().then(() => {
      this.waitUntilWalletIsCreated();

      return browser.executeScript('return window.localStorage.getItem("wallets");')
        .then((data: string) => {
          const wallets = JSON.parse(data);
          const loadedWallet = wallets.find(w => w.label === walletLabel);
          return loadedWallet.addresses[0].address === '2iCJ67Giscwv4dBEghiPDzH4X9Z6ijNiEMR';
        });
    });
  }

  skipWizard() {
    const btnSkip = element(by.buttonText('Skip'));
    return this.getDisclaimerIsShow().then(result => {
      if (result) {
        return this.acceptDisclaimer().then(res => {
         return btnSkip.click().then(() => {
            return browser.getCurrentUrl().then(url => {
              return url;
            });
          });
        });
      } else {
       return btnSkip.click().then(() => {
          return browser.getCurrentUrl().then(url => {
            return url;
          });
        });
      }
    });
  }

  private fillCreateWalletForm(seedText: string = 'skycoin-web-e2e-test-seed', confirmSeedText: string = 'skycoin-web-e2e-test-seed'): ElementFinder {
    const btnOption = element(by.buttonText('New'));
    btnOption.click();
    const label = element(by.css('[formcontrolname="label"]'));
    const seed = element(by.css('[formcontrolname="seed"]'));
    const confirm = element(by.css('[formcontrolname="confirm_seed"]'));

    label.clear();
    label.sendKeys('Test wallet');
    seed.clear();
    seed.sendKeys(seedText);
    confirm.clear();
    confirm.sendKeys(confirmSeedText);

    if (seedText === confirmSeedText) {
      const seedValidationCheckBox = element(by.css('.-check'));
      seedValidationCheckBox.click();
    }

    return element(by.buttonText('Create'));
  }

  private fillLoadWalletForm(walletLabel: string = 'Test wallet', seedText: string = 'skycoin-web-e2e-test-seed-load'): ElementFinder {
    const btnOption = element(by.buttonText('Load'));
    btnOption.click();
    const label = element(by.css('[formcontrolname="label"]'));
    const seed = element(by.css('[formcontrolname="seed"]'));

    label.clear();
    label.sendKeys(walletLabel);
    seed.clear();
    seed.sendKeys(seedText);

    if (walletLabel && seedText) {
      const seedValidationCheckBox = element(by.css('.-check'));
      seedValidationCheckBox.click();
    }

    return element(by.buttonText('Create'));
  }

  private clickOutsideModal() {
    return browser.executeScript('arguments[0].click()', element(by.css('.cdk-overlay-backdrop')));
  }

  private waitUntilWalletIsCreated() {
    browser.wait(ExpectedConditions.invisibilityOf(element(by.buttonText('Create'))), 20000);
  }
}
