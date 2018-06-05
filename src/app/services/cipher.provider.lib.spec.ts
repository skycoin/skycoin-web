import { TestBed, inject } from '@angular/core/testing';
import { readJSON } from 'karma-read-json';

import { CipherProvider } from './cipher.provider';
import { Address } from '../app.datatypes';

describe('CipherProvider Lib', () => {
  let cipherProvider: CipherProvider;
  const manyAddressesFilePath = 'e2e/test-fixtures/many-addresses.json';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CipherProvider]
    });

    cipherProvider = TestBed.get(CipherProvider);
  });

  it('should generate many address correctly', async() => {
    const fixtureFile = readJSON(manyAddressesFilePath);
    const expectedAddresses = fixtureFile.keys;

    let seed = atob(fixtureFile.seed);
    seed = convertAsciiToHexa(seed);

    expectedAddresses.map(address => {
      const generatedAddress = cipherProvider.generateAddress(seed);

      const actualAddress = {
        address: generatedAddress.address,
        public: generatedAddress.public_key,
        secret: generatedAddress.secret_key
      };

      expect(actualAddress).toEqual(address);
      seed = generatedAddress.next_seed;
    });
  });
});

function convertAsciiToHexa(str): string {
  const arr1: string[] = [];
  for (let n = 0, l = str.length; n < l; n ++) {
    const hex = Number(str.charCodeAt(n)).toString(16);
    arr1.push(hex);
  }
  return arr1.join('');
}
