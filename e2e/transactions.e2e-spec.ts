import { browser } from 'protractor';

import { TransactionsPage } from './transactions.po';

describe('Transactions', () => {
  let page: TransactionsPage;

  beforeAll(() => {
    browser.get('/').then(() => browser.sleep(500));
    browser.executeScript(
      `window.localStorage.setItem(\'wallets\',
        JSON.stringify([{"label":"Test wallet","addresses":
        [{"address":"qxmeHkwgAMfwXyaQrwv9jq3qt228xMuoT5"}]}]) );`);

    page = new TransactionsPage();
    page.navigateTo();
  });

  afterAll(() => {
    browser.restartSync();
  });

  it('should display title', () => {
    expect<any>(page.getHeaderText()).toEqual('Transactions');
  });

  it('should contain transactions', () => {
    expect<any>(page.getTransactionsCount()).toBeGreaterThan(0);
  });

  it('should show transaction detail modal', () => {
    expect<any>(page.showTransactionsModal()).toBeTruthy();
  });

  it('should hide transaction detail modal', () => {
    expect<any>(page.hideTransactionModal()).toBeFalsy();
  });
});
