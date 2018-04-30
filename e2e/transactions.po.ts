import { browser, by, element } from 'protractor';

export class TransactionsPage {
  navigateTo() {
    return browser.get('/history');
  }

  getHeaderText() {
    return element(by.css('.title')).getText();
  }

  getTransactions() {
    return element.all(by.css('.-transaction'));
  }

  getTransactionsCount() {
    return this.getTransactions().count().then(count => {
      return count;
    });
  }

  getTransactionDetailIsShow() {
    return element(by.css('app-transaction-detail')).isPresent();
  }

  showTransactionsModal() {
    return this.getTransactions().first().click().then(() => {
      return this.getTransactionDetailIsShow();
    });
  }

  hideTransactionModal() {
    return element(by.css('.-header img')).click().then(() => {
      return this.getTransactionDetailIsShow();
    });
  }

}
