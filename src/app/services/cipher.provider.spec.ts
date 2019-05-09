import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';

import { CipherProvider } from './cipher.provider';
import { Address, TransactionInput, TransactionOutput } from '../app.datatypes';
import { CipherWebWorkerHelper } from '../utils/cipher-web-worker-helper';

describe('CipherProvider', () => {
  let cipherProvider: CipherProvider;
  const errorMessage = 'error message';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CipherProvider
      ]
    });

    cipherProvider = TestBed.get(CipherProvider);
  });

  it('should be created', () => {
    expect(cipherProvider).toBeTruthy();
  });

  it('should generate address', () => {
    const expectedAddress: Address = createAddress();

    spyOn(CipherWebWorkerHelper, 'ExcecuteWorker').and.returnValue(Observable.of(createAddressInCipherFormat()));

    cipherProvider.generateAddress('seed')
      .subscribe(addr => expect(addr.address).toEqual(expectedAddress));
  });

  it('should throw error in case of any error in web worker', () => {
    spyOn(CipherWebWorkerHelper, 'ExcecuteWorker').and.throwError(errorMessage);

    expect(() => cipherProvider.generateAddress('seed'))
      .toThrowError(errorMessage);
  });

  it('should prepare transaction', () => {
    const expectedRowTx = '1234567890';

    spyOn(CipherWebWorkerHelper, 'ExcecuteWorker').and.returnValue(Observable.of(expectedRowTx));

    cipherProvider.prepareTransaction([createTransactionInput()], [createTransactionOutput()])
      .subscribe((rowTx: string) => expect(rowTx).toBe(expectedRowTx));
  });

  it('should throw error in case of any error in web worker', () => {
    spyOn(CipherWebWorkerHelper, 'ExcecuteWorker').and.throwError(errorMessage);

    expect(() => cipherProvider.prepareTransaction([createTransactionInput()], [createTransactionOutput()]))
      .toThrowError(errorMessage);
  });
});

function createAddress(): Address {
  return {
    address: '2uATq4pdSb8Ka1YKSAAbp6Npehs3QQqTnb',
    public_key: '030a797a31100d3a7b5b403f551975e9a12f93b4d4e9e44b402b84832e0c7b89d2',
    secret_key: '20c3db0e1f3b95d98d1f78d73c134af8f1b5dd34cc05f053da94c20d72558862'
  };
}

function createTransactionInput(): TransactionInput {
  return {
    hash: '1fe7d0625540d730a396962fe616053f0e1385d10f3f2702f8a490e3c4cee075',
    secret: '001aa9e416aff5f3a3c7f9ae0811757cf54f393d50df861f5c33747954341aa7'
  };
}

function createTransactionOutput(address = '2e1erPpaxNVC37PkEv3n8PESNw2DNr5aJNy', coins = 10000, hours = 0): TransactionOutput {
  return {
    address: address,
    coins: coins,
    hours: hours
  };
}

function createAddressInCipherFormat() {
  return {
    NextSeed: '9fe8bfb01de85dbba36cbd9854ad7478cd63459fedb4c9f7847bf280ee17a32c',
    Secret: '20c3db0e1f3b95d98d1f78d73c134af8f1b5dd34cc05f053da94c20d72558862',
    Public: '030a797a31100d3a7b5b403f551975e9a12f93b4d4e9e44b402b84832e0c7b89d2',
    Address: '2uATq4pdSb8Ka1YKSAAbp6Npehs3QQqTnb'
  };
}
