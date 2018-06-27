import { browser, by, element, ExpectedConditions } from 'protractor';

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
    const btnCreate = element(by.buttonText('Create'));
    this.fillWalletForm('Test wallet', 'test test2', 'skycoin-web-e2e-test-seed');
    return btnCreate.isEnabled();
  }

  loadWalletCheckValidationSeed() {
    browser.wait(ExpectedConditions.elementToBeClickable(element(by.buttonText('Cancel'))), 50000);

    const cancelAdd = element(by.buttonText('Cancel'));
    const btnLoadWallet = element(by.buttonText('Load Wallet'));
    const label = element(by.css('[formcontrolname="label"]'));
    const seed = element(by.css('[formcontrolname="seed"]'));
    const btnLoad = element(by.buttonText('Load'));

    return cancelAdd.click().then(() => {
      return btnLoadWallet.click().then(() => {
        return label.clear().then(() => {
          return label.sendKeys('Test wallet').then(() => {
            return seed.clear().then(() => {
              return seed.clear().then(() => {
                return btnLoad.isEnabled();
              });
            });
          });
        });
      });
    });
  }

  createWalletCheckValidationLabel() {
    const btnCreate = element(by.buttonText('Create'));
    this.fillWalletForm('', 'skycoin-web-e2e-test-seed', 'skycoin-web-e2e-test-seed');
    return btnCreate.isEnabled();
  }

  loadWalletCheckValidationLabel() {
    const btnLoad = element(by.buttonText('Load'));
    this.fillWalletForm('', 'skycoin-web-e2e-test-seed');
    return btnLoad.isEnabled();
  }

  createExistingWallet() {
    const btnCreate = element(by.buttonText('Create'));
    this.fillWalletForm('Test create wallet', 'skycoin-web-e2e-test-seed', 'skycoin-web-e2e-test-seed');
    return btnCreate.click().then(() => {
      return !btnCreate.isPresent();
    });
  }

  createWallet() {
    const btnCreate = element(by.css('.btn-create > button'));
    this.fillWalletForm(
      'Test create wallet',
      'skycoin-web-e2e-test-create-wallet-seed',
      'skycoin-web-e2e-test-create-wallet-seed'
    );

    return btnCreate.isEnabled().then(status => {
      if (!status) {
        return false;
      }

      btnCreate.click();
      this.waitUntilLoading();

      return this.getWalletAddress().then((address) => {
        return address === '2KLc8ha9uAzSLsytwsAKo8avjmVXyyvTH7e';
      });
    });
  }

  waitUntilLoading() {
    browser.wait(ExpectedConditions.invisibilityOf(element(by.css('mat-spinner'))));
  }

  waitUntilWalletIsCreated() {
    browser.wait(ExpectedConditions.invisibilityOf(element(by.css('app-create-wallet'))), 50000);
  }

  loadExistingWallet() {
    const btnLoad = element(by.buttonText('Load'));
    this.fillWalletForm('Test load wallet', 'skycoin-web-e2e-test-create-wallet-seed');
    return btnLoad.click().then(() => {
      return !btnLoad.isPresent();
    });
  }

  loadWallet() {
    const btnLoad = element(by.buttonText('Load'));
    this.fillWalletForm('Test load wallet', 'skycoin-web-e2e-test-load-wallet-seed');
    return btnLoad.isEnabled().then(status => {
      if (!status) {
        return false;
      }

      btnLoad.click();
      this.waitUntilLoading();

      return this.getWalletAddress().then((address) => {
        return address === 'quS3czcXyeqSAhrza7df643P4yGS8PNPap';
      });
    });
  }

  expandWallet() {
    return element.all(by.css('.-wallet')).get(1).click().then(() => {
      return element(by.css('.-record')).isPresent();
    });
  }

  checkQrDialogAddress() {
    return element(by.css('.-address-address')).getText().then((address: string) => {
      return address === 'quS3czcXyeqSAhrza7df643P4yGS8PNPap';
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
    return element(by.css('.-btn-plus')).click().then(() => {
      return browser.wait(() => {
        const lastRecord = element.all(by.css('.-record')).last();
        return lastRecord.element(by.css('.address-column')).getText().then((address) => {
          return address === 'bSp3JvfGiHzumCpdaWT7tGRtejwhLDd2zv';
        });
      }, 5000);
    });
  }

  hideEmptyAddress() {
    return element.all(by.css('.-hide-empty')).first().click().then(() => {
      const parentWalletElement = element.all(by.css('.-wallet-detail')).first();
      return parentWalletElement.all(by.css('.coins-column')).filter((address) => {
        return address.getText().then(value => {
          return value === '0';
        });
      }).count();
    });
  }

  showEmptyAddress() {
    return element.all(by.css('.-show-empty')).first().click().then(() => {
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
    const name = element.all(by.css('.-wallet .-label')).last();
    const label = element(by.css('[formcontrolname="label"]'));
    const btn = element(by.buttonText('Rename'));
    const newWalletName = 'New Wallet Name';

    return label.clear().then(() => {
      return label.sendKeys(newWalletName).then(() => {
        return btn.click().then(() => {
          return name.getText().then(value => {
            return value === newWalletName;
          });
        });
      });
    });
  }

  canUnlockWallet() {
    return element.all(by.css('.-encryption img')).first().click().then(() => {
      return this.unlockWallet('skycoin-web-e2e-test-seed').then(() => {
        return element.all(by.css('.-wallet .-encryption img')).first().getAttribute('src').then(source => {
          return source.includes('unlock-grey.png');
        });
      });
    });
  }

  showAddAddress() {
    return element.all(by.css('.-wallet')).get(1).click().then(() => {
      return element(by.css('.btn-add-address')).isPresent();
    });
  }

  showShowUnlockWallet() {
    return element(by.css('.btn-add-address')).click().then(() => {
      return element(by.css('app-unlock-wallet')).isPresent();
    });
  }

  unlockWallet(seedText: string = 'skycoin-web-e2e-test-create-wallet-seed') {
    const seed = element(by.css('[formcontrolname="seed"]'));
    seed.clear();
    seed.sendKeys(seedText);

    return element(by.buttonText('Unlock')).click().then(() => {
      browser.wait(ExpectedConditions.invisibilityOf(element(by.css('app-unlock-wallet'))), 20000);
      return (element(by.css('app-unlock-wallet')).isPresent()).then((result) => {
        return !result;
      });
    });
  }

  checkThirdAddress() {
    const lastRecord = element.all(by.css('.-record')).last();
    return lastRecord.element(by.css('.address-column')).getText().then((address) => {
      return address === 'rK1CMcqXjJ59H7XXs9xR3JZMejWs56FsmY';
    });
  }

  openDeleteWalletDialog() {
    return element.all(by.css('.btn-delete-wallet')).first().click().then(() => {
      return element(by.css('app-confirmation')).isPresent();
    });
  }

  cancelDeleteConfirmation() {
    let walletCount = 0;
    element.all(by.css('.-wallet')).count().then((count) => walletCount = count);

    return element(by.buttonText('No')).click().then(() => {
      return element.all(by.css('.-wallet')).count().then((count) => {
        return count === walletCount;
      });
    });
  }

  deleteWallet() {
    const walletNameToDelete = 'Test create wallet';

    return element.all(by.css('.btn-delete-wallet')).first().click().then(() => {
      return element(by.css('.-disclaimer-check-text')).click().then(() => {
        return element(by.buttonText('Yes')).click().then(() => {
          return element.all(by.css('.-wallet')).then(() => {
            return this.walletExist(walletNameToDelete).then((isWalletExistAfter) => {
              return !isWalletExistAfter;
            });
          });
        });
      });
    });
  }

  private walletExist(name: string) {
    return browser.executeScript(`return window.localStorage.getItem('wallets');`)
      .then((result: string) => {
        const wallets = JSON.parse(result);
        return !!wallets.find(wallet => wallet.label === name);
      });
  }

  private fillWalletForm(labelText: string, seedText: string, confirmSeedText = null) {
    const label = element(by.css('[formcontrolname="label"]'));
    const seed = element(by.css('[formcontrolname="seed"]'));
    const confirm = element(by.css('[formcontrolname="confirm_seed"]'));

    return label.clear().then(() => {
      return label.sendKeys(labelText).then(() => {
        return seed.clear().then(() => {
          return seed.sendKeys(seedText).then(() => {
            if (confirmSeedText) {
              return confirm.clear().then(() => {
                return confirm.sendKeys(confirmSeedText);
              });
            }
          });
        });
      });
    });
  }

  private getWalletAddress() {
    const walletElement = element.all(by.css('.-wallet')).last();

    return walletElement.click().then(() => {
      const recordElement = element.all(by.css('app-wallet-detail')).last().element(by.css('.-record'));
      return recordElement.isPresent().then((status) => {
        if (status) {
          return recordElement.element(by.css('.address-column')).getText().then(txt => txt);
        }
      });
    });
  }
}
