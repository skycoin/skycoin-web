import { browser } from 'protractor';

import { SaveDataPage } from './save-data.po';

describe('Save data', () => {
  let page: SaveDataPage;

  beforeAll(() => {
    page = new SaveDataPage();
    page.navigateTo();
  });

  it('should not retain data after refreshing', done => {
    expect<any>(page.selectLanguage()).toEqual(false);
    expect<any>(page.acceptDisclaimer()).toEqual(false);
    page.loadWallet().then(() => {
      expect<any>(page.verifyIfShowingWalletsPage()).toEqual(true);

      browser.get('#/wallets').then(() => browser.sleep(500));
      expect<any>(page.verifyLocalStorage()).toEqual(null);
      expect<any>(page.verifyIfShowingWalletsPage()).toEqual(false);
      done();
    });
  });

});
