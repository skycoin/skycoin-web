import { TestBed, inject } from '@angular/core/testing';
import { readJSON } from 'karma-read-json';

import { CipherProvider } from './cipher.provider';

declare var CipherExtras;

describe('CipherProvider Lib', () => {
  let cipherProvider: CipherProvider;
  const addressesFilePath = 'e2e/test-fixtures/many-addresses.json';

  beforeAll(() => {
    TestBed.configureTestingModule({
      providers: [CipherProvider]
    });

    cipherProvider = TestBed.get(CipherProvider);
  });

  describe('generate address', () => {
    let actualAddresses = [];
    let expectedAddresses = [];

    beforeAll(() => {
      const addressFixtureFile = readJSON(addressesFilePath);
      expectedAddresses = addressFixtureFile.keys;

      let seed = convertAsciiToHexa(atob(addressFixtureFile.seed));

      actualAddresses = expectedAddresses.map(address => {
        const generatedAddress = cipherProvider.generateAddress(seed);
        seed = generatedAddress.next_seed;

        return generatedAddress;
      });
    });

    it('should generate many address correctly', () => {
      const convertedAddresses = actualAddresses.map(address => {
        return {
          address: address.address,
          public: address.public_key,
          secret: address.secret_key
        };
      });

      expect(convertedAddresses).toEqual(expectedAddresses);
    });

    it('should pass the verification', () => {
      actualAddresses.map(address => {
        const addressFromPubKey = CipherExtras.AddressFromPubKey(address.public_key);
        const addressFromSecKey = CipherExtras.AddressFromSecKey(address.secret_key);

        expect(addressFromPubKey && addressFromSecKey && addressFromPubKey === addressFromSecKey).toBe(true);

        expect(CipherExtras.VerifySeckey(address.secret_key)).toBe(1);
        expect(CipherExtras.VerifyPubkey(address.public_key)).toBe(1);
      });
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
