import { browser } from 'protractor';
import { TransactionsPage } from './transactions.po';

describe('Transactions', () => {
  let page: TransactionsPage;

  beforeEach(() => {
    page = new TransactionsPage();

  });

  it('should display title', () => {
    page.navigateTo().then(() => {
      browser.executeScript(
        `window.localStorage.setItem(\'wallets\',
          JSON.stringify([{"label":"Test wallet","addresses":
          [{"address":"2EzqAbuLosF47Vm418kYo2rnMgt6XgGaA1Z"}]}]) );`);
    });
    expect<any>(page.getHeaderText()).toEqual('Transactions');
  });

  it('should contain transactions', () => {
    page.navigateTo();
    expect<any>(page.getTransactionsCount()).toBeGreaterThan(0);
  });

  it('should show transaction detail modal', () => {
    expect<any>(page.showTransactionsModal()).toBeTruthy();
  });

  it('should hide transaction detail modal', () => {
    expect<any>(page.hideTransactionModal()).toBeFalsy();
  });
});
