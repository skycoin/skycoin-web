import { browser, by, element } from 'protractor';

export class WalletsPage {
  navigateTo() {
    return browser.get('/wallets');
  }

  getHeaderText() {
    return element(by.css('.title')).getText();
  }

  showAddWallet() {
    const btnAdd = element(by.buttonText('Add Wallet'));
    return btnAdd.click().then(() => {
      return element(by.css('app-create-wallet')).isPresent();
    });
  }

  showLoadWallet() {
    const btnLoad = element(by.buttonText('Load Wallet'));
    return btnLoad.click().then(() => {
      return element(by.css('app-create-wallet')).isPresent();
    });
  }

  createWalletCheckValidationSeed() {
    const label = element(by.css('[formcontrolname="label"]'));
    const seed = element(by.css('[formcontrolname="seed"]'));
    const confirm = element(by.css('[formcontrolname="confirm_seed"]'));
    const btnCreate = element(by.buttonText('Create'));

    return label.clear().then(() => {
      return label.sendKeys('Test wallet').then(() => {
        return seed.clear().then(() => {
          return seed.sendKeys('test test2').then(() => {
            return confirm.clear().then(() => {
              return confirm.sendKeys('skycoin-web-e2e-test-seed').then(() => {
                return btnCreate.isEnabled();
              });
            });
          });
        });
      });
    });
  }

  loadWalletCheckValidationSeed() {
    const label = element(by.css('[formcontrolname="label"]'));
    const seed = element(by.css('[formcontrolname="seed"]'));
    const btnLoad = element(by.buttonText('Load'));

    return label.clear().then(() => {
      return label.sendKeys('Test wallet').then(() => {
        return seed.clear().then(() => {
          return seed.sendKeys(' ').then(() => {
            return btnLoad.isEnabled();
          });
        });
      });
    });
  }

  createWalletCheckValidationLabel() {
    const label = element(by.css('[formcontrolname="label"]'));
    const seed = element(by.css('[formcontrolname="seed"]'));
    const confirm = element(by.css('[formcontrolname="confirm_seed"]'));
    const btnCreate = element(by.buttonText('Create'));

    return label.clear().then(() => {
      return label.sendKeys(' ').then(() => {
        return seed.clear().then(() => {
          return seed.sendKeys('skycoin-web-e2e-test-seed').then(() => {
            return confirm.clear().then(() => {
              return confirm.sendKeys('skycoin-web-e2e-test-seed').then(() => {
                return btnCreate.isEnabled();
              });
            });
          });
        });
      });
    });
  }

  loadWalletCheckValidationLabel() {
    const label = element(by.css('[formcontrolname="label"]'));
    const seed = element(by.css('[formcontrolname="seed"]'));
    const btnLoad = element(by.buttonText('Load'));

    return label.clear().then(() => {
      return label.sendKeys(' ').then(() => {
        return seed.clear().then(() => {
          return seed.sendKeys('skycoin-web-e2e-test-seed').then(() => {
            return btnLoad.isEnabled();
          });
        });
      });
    });
  }

  createExistingWallet() {
    const label = element(by.css('[formcontrolname="label"]'));
    const seed = element(by.css('[formcontrolname="seed"]'));
    const confirm = element(by.css('[formcontrolname="confirm_seed"]'));
    const btnCreate = element(by.buttonText('Create'));

    label.clear();
    label.sendKeys('Test create wallet');
    seed.clear();
    seed.sendKeys('skycoin-web-e2e-test-seed');
    confirm.clear();
    confirm.sendKeys('skycoin-web-e2e-test-seed');
    return btnCreate.click().then(() => {
      return !btnCreate.isPresent();
    });
  }

  createWallet() {
    const label = element(by.css('[formcontrolname="label"]'));
    const seed = element(by.css('[formcontrolname="seed"]'));
    const confirm = element(by.css('[formcontrolname="confirm_seed"]'));
    const btnCreate = element(by.buttonText('Create'));

    label.clear();
    label.sendKeys('Test create wallet');
    seed.clear();
    seed.sendKeys('skycoin-web-e2e-test-create-wallet-seed');
    confirm.clear();
    confirm.sendKeys('skycoin-web-e2e-test-create-wallet-seed');
    return btnCreate.isEnabled().then(status => {
      if (status) {
        btnCreate.click();
      }
      return status;
    });
  }

  loadExistingWallet() {
    const label = element(by.css('[formcontrolname="label"]'));
    const seed = element(by.css('[formcontrolname="seed"]'));
    const btnLoad = element(by.buttonText('Load'));

    label.clear();
    label.sendKeys('Test load wallet');
    seed.clear();
    seed.sendKeys('skycoin-web-e2e-test-create-wallet-seed');
    return btnLoad.click().then(() => {
      return !btnLoad.isPresent();
    });
  }

  loadWallet() {
    const label = element(by.css('[formcontrolname="label"]'));
    const seed = element(by.css('[formcontrolname="seed"]'));
    const btnLoad = element(by.buttonText('Load'));

    label.clear();
    label.sendKeys('Test load wallet');
    seed.clear();
    seed.sendKeys('skycoin-web-e2e-test-load-wallet-seed');
    return btnLoad.isEnabled().then(status => {
      if (status) {
        btnLoad.click();
      }
      return status;
    });
  }

  expandWallet() {
    return element.all(by.css('.-wallet')).get(1).click().then(() => {
      return element(by.css('.-record')).isPresent();
    });
  }

  showQrDialog() {
    return element(by.css('.address-column img')).click().then(() => {
      return element(by.css('app-qr-code')).isPresent();
    });
  }

  hideQrDialog() {
    return element(by.css('app-modal .-header img')).click().then(() => {
      return element(by.css('app-qr-code')).isPresent();
    });
  }

  addAddress() {
    const records = element.all(by.css('.-record')).count();
    return element(by.css('.-btn-plus')).click().then(() => {
      return element.all(by.css('.-record')).count() > records;
    });
  }

  hideEmptyAddress() {
    return element.all(by.css('.-btn-minus')).first().click().then(() => {
      const parentWalletElement = element.all(by.css('.-wallet-detail')).first();
      return parentWalletElement.all(by.css('.coins-column')).filter((address) => {
        return address.getText().then(value => {
          return value === '0';
        });
      }).count();
    });
  }

  showEmptyAddress() {
    return element.all(by.css('.-btn-plus')).get(1).click().then(() => {
      return element.all(by.css('.-record')).count().then(count => {
        return count > 0;
      });
    });
  }

  showChangeWalletName() {
    return element(by.css('.-btn-edit')).click().then(() => {
      return element(by.css('app-change-name')).isPresent();
    });
  }

  changeWalletName() {
    const name = element.all(by.css('.-wallet .-label')).get(1);
    const label = element(by.css('[formcontrolname="label"]'));
    const btn = element(by.buttonText('Rename'));

    return label.clear().then(() => {
      return label.sendKeys('New Wallet Name').then(() => {
        return btn.click().then(() => {
          return name.getText().then(value => {
            return value === 'New Wallet Name';
          });
        });
      });
    });
  }

  canUnlock() {
     return this.unlockFirstWallet().then(result => {
       if (result) {
          return element.all(by.css('.-wallet .-encryption img')).first().getAttribute('src').then(source => {
            return source.includes('unlock-grey.png');
          });
        } else {
          return false;
        }
      });
  }

  unlockFirstWallet(): any {
    return element.all(by.css('.-encryption img')).first().click().then(() => {
      const seed = element(by.css('[formcontrolname="seed"]'));
      const btnUnlock = element(by.buttonText('Unlock'));
      return seed.sendKeys('skycoin-web-e2e-test-seed').then(() => {
        return btnUnlock.click().then(() => {
          return true;
        });
      });
    });
  }

  showAddAddress() {
    return element.all(by.css('.-wallet')).first().click().then(() => {
      return element(by.css('.btn-add-address')).isPresent();
    });
  }

  showShowUnlockWallet() {
    return element(by.css('.btn-add-address')).click().then(() => {
      return element(by.css('app-unlock-wallet')).isPresent();
    });
  }

  unlockWallet() {
    const seed = element(by.css('[formcontrolname="seed"]'));
    seed.clear();
    seed.sendKeys('skycoin-web-e2e-test-seed');

    return element(by.buttonText('Unlock')).click().then(() => {
      return (element(by.css('app-unlock-wallet')).isPresent()).then((result) => {
        return !result;
      });
    });
  }

  showPriceInformation() {
    return element(by.css('.balance p.dollars')).getText().then(text => {
      return this._checkHeaderPriceFormat(text);
    });
  }

  _checkHeaderPriceFormat(price: string) {
    const reg = /^\$[0-9]+.[0-9]{2}\s\(\$[0-9]+.[0-9]{2}\)$/;
    return price.match(reg) ?  true :  false;
  }
}
