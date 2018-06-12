import { TestBed, inject } from '@angular/core/testing';
import { readJSON } from 'karma-read-json';

import { CipherProvider } from './cipher.provider';
import { testCases } from '../utils/jasmine-utils';

declare var CipherExtras;

describe('CipherProvider Lib', () => {
  let cipherProvider: CipherProvider;
  const addressesFilePath = 'e2e/test-fixtures/many-addresses.json';
  const inputHashesFilePath = 'e2e/test-fixtures/input-hashes.json';

  const seedSignaturesPath = 'e2e/test-fixtures/';
  const seedSignaturesFiles = [
    'seed-0000.json', 'seed-0001.json', 'seed-0002.json',
    'seed-0003.json', 'seed-0004.json', 'seed-0005.json',
    'seed-0006.json', 'seed-0007.json', 'seed-0008.json',
    'seed-0009.json', 'seed-0010.json'
  ];

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

    it('should generate many address correctly', done => {
      const convertedAddresses = actualAddresses.map(address => {
        return {
          address: address.address,
          public: address.public_key,
          secret: address.secret_key
        };
      });

      expect(convertedAddresses).toEqual(expectedAddresses);
      done();
    });

    it('should pass the verification', done => {
      actualAddresses.map(address => {
        const addressFromPubKey = CipherExtras.AddressFromPubKey(address.public_key);
        const addressFromSecKey = CipherExtras.AddressFromSecKey(address.secret_key);

        expect(addressFromPubKey && addressFromSecKey && addressFromPubKey === addressFromSecKey).toBe(true);

        expect(CipherExtras.VerifySeckey(address.secret_key)).toBe(1);
        expect(CipherExtras.VerifyPubkey(address.public_key)).toBe(1);
      });

      done();
    });
  });

  describe('seed signatures', () => {
    let inputHashes = [];

    beforeAll(() => {
      inputHashes = readJSON(inputHashesFilePath).hashes;
    });

    testCases(seedSignaturesFiles, (fileName: string) => {
      describe(`should pass the verification for ${fileName}`, () => {
        let seedKeys;
        let actualAddresses;
        let testData: { signature: string, public_key: string, hash: string, secret_key: string, address: string }[] = [];

        beforeAll(() => {
          const signaturesFixtureFile = readJSON(seedSignaturesPath + fileName);
          let seed = convertAsciiToHexa(atob(signaturesFixtureFile.seed));
          seedKeys = signaturesFixtureFile.keys;

          actualAddresses = seedKeys.map(() => {
            const generatedAddress = cipherProvider.generateAddress(seed);
            seed = generatedAddress.next_seed;

            return generatedAddress;
          });

          testData = getSeedTestData(inputHashes, seedKeys, actualAddresses);
        });

        it(`should verify signature correctly`, done => {
          testData.forEach(data => {
            const result = CipherExtras.VerifySignature(data.public_key, data.signature, data.hash);
              expect(result).toBeUndefined();
              done();
          });
        });

        it(`should check signature correctly`, done => {
          testData.forEach(data => {
            const result = CipherExtras.ChkSig(data.address, data.hash, data.signature);
              expect(result).toBeUndefined();
              done();
          });
        });

        it(`should verify signed hash correctly`, done => {
          testData.forEach(data => {
            const result = CipherExtras.VerifySignedHash(data.signature, data.hash);
              expect(result).toBeUndefined();
              done();
          });
        });

        it(`should generate public key correctly`, done => {
          testData.forEach(data => {
            const pubKey = CipherExtras.PubKeyFromSig(data.signature, data.hash);
            expect(pubKey === data.public_key).toBeTruthy();
            done();
          });
        });

        it(`sign hash should be created`, done => {
          testData.forEach(data => {
            const sig = CipherExtras.SignHash(data.hash, data.secret_key);
            expect(sig).toBeTruthy();
            done();
          });
        });
      });
    });
  });
});

function convertAsciiToHexa(str): string {
  const arr1: string[] = [];
  for (let n = 0, l = str.length; n < l; n ++) {
    const hex = Number(str.charCodeAt(n)).toString(16);
    arr1.push(hex !== '0' ? hex : '00');
  }
  return arr1.join('');
}

function getSeedTestData(inputHashes, seedKeys, actualAddresses) {
  const data = [];

  for (let seedIndex = 0; seedIndex < seedKeys.length; seedIndex++) {
    for (let hashIndex = 0; hashIndex < inputHashes.length; hashIndex++) {
      data.push({
        signature: seedKeys[seedIndex].signatures[hashIndex],
        public_key: actualAddresses[seedIndex].public_key,
        secret_key: actualAddresses[seedIndex].secret_key,
        address: actualAddresses[seedIndex].address,
        hash: inputHashes[hashIndex]
      });
    }
  }

  return data;
}
