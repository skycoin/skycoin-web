import { browser, by, element } from 'protractor';

export class SendSkyPage {
  navigateTo() {
    return browser.get('#/send').then(() => browser.sleep(500));
  }

  getHeaderText() {
    return element(by.css('.title')).getText();
  }

  getWalletsCount() {
    return element.all(by.css('#wallet option')).count().then(c => {
      return c - 1;
    });
  }

  getWalletsWidthMoney() {
    return element.all(by.tagName('#wallet option'))
      .filter((opt) => {
        return opt.getText().then((v) => {
          return this._getSkyFromOptionString(v) > 0;
        });
      });
  }

  getValidsWallets() {
    return element.all(by.tagName('#wallet option'))
      .filter((opt) => {
        return opt.getText().then((v) => {
          return opt.getAttribute('disabled').then(status => {
            return status === null && this._getSkyFromOptionString(v) > 0;
          });
        });
      });
  }

  selectValidWallet() {
    return this.getValidsWallets().then(wallets => {
      if (wallets.length > 0) {
        return wallets[0].click().then(() => {
          return true;
        });
      } else {
        return false;
      }
    });
  }

  getValidWidthWrongAmount() {
    const dest = element(by.css('[formcontrolname="address"]'));
    dest.clear();
    const amount = element(by.css('[formcontrolname="amount"]'));
    amount.clear();
    const btnSend = element(by.buttonText('Send'));
    return dest.sendKeys('2cYALUgtwGHRcw8fyAoXaDWLJjFTxzroggx').then(() => {
     return this.getValidsWallets().then(wallets => {
        if (wallets.length > 0) {
          return wallets[0].click().then(() => {
            return wallets[0].getText().then((v) => {
              const walletAmount = this._getSkyFromOptionString(v) + 1;
              return amount.sendKeys(walletAmount.toString()).then(() => {
                return btnSend.isEnabled();
              });
            });
          });
        } else {
          return false;
        }
      });
    });
  }

  getCanSend() {
    const dest = element(by.css('[formcontrolname="address"]'));
    dest.clear();
    const amount = element(by.css('[formcontrolname="amount"]'));
    amount.clear();
    const btnSend = element(by.buttonText('Send'));
    return dest.sendKeys('2cYALUgtwGHRcw8fyAoXaDWLJjFTxzroggx').then(() => {
      return this.getValidsWallets().then(wallets => {
        if (wallets.length > 0) {
          return wallets[0].click().then(() => {
            return wallets[0].getText().then((v) => {
              const walletAmount = this._getSkyFromOptionString(v);
              return amount.sendKeys(walletAmount.toString()).then(() => {
                return btnSend.isEnabled();
              });
            });
          });
        } else {
          return false;
        }
      });
    });
  }

  _getSkyFromOptionString(option: string) {
    const value = option.slice(option.indexOf('—') + 1, option.indexOf(' SKY'));
    return parseFloat(value);
  }
}
