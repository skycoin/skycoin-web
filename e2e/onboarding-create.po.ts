import { browser, by, element } from 'protractor';

export class OnboardingCreatePage {
  navigateTo() {
    return browser.get('/wizard/create');
  }

  getHeaderText() {
    return element(by.css('.-header span')).getText();
  }

  getDisclaimerIsShow() {
    return element(by.css('app-onboarding-disclaimer')).isPresent();
  }

  getSafeguardIsShow() {
    return element(by.css('app-onboarding-safeguard')).isPresent();
  }

  acceptDisclaimer() {
    element.all(by.css('.-disclaimer-check-text span')).first().click();
    element(by.buttonText('Continue')).click();
    return this.getDisclaimerIsShow();
  }

  acceptSafeguard() {
   return element.all(by.css('.mat-checkbox-label')).first().click().then(() => {
     return element(by.buttonText('Continue')).click().then(() => {
        return this.getSafeguardIsShow();
      });
    });
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

  createWallet() {
    const btnOption = element(by.buttonText('New'));
    btnOption.click();
    const label = element(by.css('[formcontrolname="label"]'));
    const seed = element(by.css('[formcontrolname="seed"]'));
    const confirm = element(by.css('[formcontrolname="confirm_seed"]'));
    const btnCreate = element(by.buttonText('Create'));

    label.clear();
    label.sendKeys('Test wallet');
    seed.clear();
    seed.sendKeys('skycoin-web-e2e-test-seed');
    confirm.clear();
    confirm.sendKeys('skycoin-web-e2e-test-seed');
    return btnCreate.isEnabled().then(status => {
      if (status) {
        btnCreate.click();
      }
      return status;
    });
  }

  createExistingWallet() {
    const btnOption = element(by.buttonText('New'));
    btnOption.click();
    const label = element(by.css('[formcontrolname="label"]'));
    const seed = element(by.css('[formcontrolname="seed"]'));
    const confirm = element(by.css('[formcontrolname="confirm_seed"]'));
    const btnCreate = element(by.buttonText('Create'));

    label.clear();
    label.sendKeys('Test wallet');
    seed.clear();
    seed.sendKeys('skycoin-web-e2e-test-seed');
    confirm.clear();
    confirm.sendKeys('skycoin-web-e2e-test-seed');
    return btnCreate.click().then(() => {
      return !btnCreate.isPresent();
    });
  }

  loadWallet() {
    const btnOption = element(by.buttonText('Load'));
    btnOption.click();
    const label = element(by.css('[formcontrolname="label"]'));
    const seed = element(by.css('[formcontrolname="seed"]'));
    const btnLoad = element(by.buttonText('Create'));

    label.clear();
    label.sendKeys('Test wallet');
    seed.clear();
    seed.sendKeys('skycoin-web-e2e-test-seed');
    return btnLoad.isEnabled();
  }

  loadExistingWallet() {
    const btnOption = element(by.buttonText('Load'));
    btnOption.click();
    const label = element(by.css('[formcontrolname="label"]'));
    const seed = element(by.css('[formcontrolname="seed"]'));
    const btnLoad = element(by.buttonText('Create'));

    label.clear();
    label.sendKeys('Test wallet');
    seed.clear();
    seed.sendKeys('skycoin-web-e2e-test-seed');
    return btnLoad.click().then(() => {
      return !btnLoad.isPresent();
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
      }else {
       return btnSkip.click().then(() => {
          return browser.getCurrentUrl().then(url => {
            return url;
          });
        });
      }
    });
    }
}
