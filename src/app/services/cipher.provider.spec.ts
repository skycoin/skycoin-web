import { TestBed } from '@angular/core/testing';

import { CipherProvider } from './cipher.provider';
import { Address, TransactionInput, TransactionOutput } from '../app.datatypes';
import { convertAsciiToHexa } from '../utils/converters';

describe('CipherProvider', () => {
  let cipherProvider: CipherProvider;

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
    const seed = convertAsciiToHexa('test seed');

    cipherProvider.generateAddress(seed)
      .subscribe(addr => expect(addr).toEqual(expectedAddress));
  });

  it('should prepare transaction', () => {
    const inputs: TransactionInput[] = [
      createTransactionInput()
    ];

    const outputs: TransactionOutput[] = [
      createTransactionOutput('2e1erPpaxNVC37PkEv3n8PESNw2DNr5aJNy'),
      createTransactionOutput('2e1erPpaxNVC37PkEv3n8PESNw2DNr5aJNy', 20000)
    ];

    cipherProvider.prepareTransaction(inputs, outputs)
      .subscribe((rowTx: string) => {
        const actualLength = rowTx.length;
        const expectedLength = 440;

        expect(actualLength).toBe(expectedLength);
      });
  });
});

function createAddress(): Address {
  return {
    address: '2uATq4pdSb8Ka1YKSAAbp6Npehs3QQqTnb',
    next_seed: '9fe8bfb01de85dbba36cbd9854ad7478cd63459fedb4c9f7847bf280ee17a32c',
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

function createTransactionOutput(address: string, coins = 10000, hours = 0): TransactionOutput {
  return {
    address: address,
    coins: coins,
    hours: hours
  };
}
