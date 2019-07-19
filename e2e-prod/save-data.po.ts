import { browser, by, element, ElementFinder, ExpectedConditions } from 'protractor';

export class SaveDataPage {
  navigateTo() {
    return browser.get('#/wizard/create').then(() => browser.sleep(500));
  }
  
  selectLanguage() {
    return element.all(by.css('.header-sel-theme > button')) .first().click().then(() => {
      browser.sleep(250);
      return element(by.css('app-select-language')).isPresent();
    });
  }

  acceptDisclaimer() {
    element.all(by.css('.-check-text span')).first().click();
    element(by.buttonText('Continue')).click();
    return element(by.css('app-confirmation')).isPresent();
  }

  loadWallet() {
    const walletLabel = 'Loaded wallet';
    const btnLoad = this.fillLoadWalletForm(walletLabel, 'load seed');

    return btnLoad.click().then(() => {
      this.waitUntilWalletIsCreated();
    });
  }

  verifyIfShowingWalletsPage() {
    return element(by.css('.title')).isPresent();
  }

  verifyLocalStorage() {
    return browser.executeScript('return window.localStorage.getItem("wallets");')
      .then((data: string) => {
        return data;
      });
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

    const seedValidationCheckBox = element(by.css('.-check'));
    seedValidationCheckBox.click();

    return element(by.css('.main-action-button'));
  }

  private waitUntilWalletIsCreated() {
    browser.wait(ExpectedConditions.invisibilityOf(element(by.css('.main-action-button'))), 30000);
  }
}
