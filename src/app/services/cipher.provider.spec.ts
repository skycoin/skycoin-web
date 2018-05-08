import { TestBed, inject } from '@angular/core/testing';
import { CipherProvider } from './cipher.provider';
import { Address, TransactionInput, TransactionOutput } from '../app.datatypes';

describe('CipherProvider', () => {
  let cipherProvider: CipherProvider;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CipherProvider]
    });

    cipherProvider = TestBed.get(CipherProvider);
  });

  it('should be created', () => {
    expect(cipherProvider).toBeTruthy();
  });

  it('should generate address', () => {
    const expectedAddress: Address = {
      address: '2e1erPpaxNVC37PkEv3n8PESNw2DNr5aJNy',
      next_seed: 'ab9a6ae9e25d987026fc52cd6d4bfa52bf0c18f77b6286ac5bae5ff51efdbe1b',
      public_key: '03aa0bebc25b65c771502237a256d80215eaebae0f255094bd31424700bdb7d112',
      secret_key: 'd72b2db210877d2a6606670d2d57a125bdc2cdba20d1bab8f009eac29c111d52'
    };
    expect(cipherProvider.generateAddress('test seed')).toEqual(expectedAddress);
  });

  it('should prepare transaction', () => {
    const inputs: TransactionInput[] = [{
      hash: '1fe7d0625540d730a396962fe616053f0e1385d10f3f2702f8a490e3c4cee075',
      secret: '001aa9e416aff5f3a3c7f9ae0811757cf54f393d50df861f5c33747954341aa7'
    }];

    const outputs: TransactionOutput[] = [{
      address: '2e1erPpaxNVC37PkEv3n8PESNw2DNr5aJNy',
      coins: 0.01,
      hours: 0
    },
    {
      address: '2e1erPpaxNVC37PkEv3n8PESNw2DNr5aJNy',
      coins: 0.01,
      hours: 0
    }];

    const actualLength = cipherProvider.prepareTransaction(inputs, outputs).length;
    const expectedLength = 440;

    expect(actualLength).toBe(expectedLength);
  });
});
