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
        `return window.localStorage.setItem(\'wallets\',
       JSON.stringify([{"label":"Test wallet","addresses":
       [{"address":"2moe8pXGU3zq8jmKS3Fv1vysJBW1nKXBr7R"}]}]) );
       `);
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
