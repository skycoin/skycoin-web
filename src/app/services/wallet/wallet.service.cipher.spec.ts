import { TestBed, fakeAsync } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { TranslateService } from '@ngx-translate/core';
import { BigNumber } from 'bignumber.js';

import { WalletService } from './wallet.service';
import { SpendingService } from './spending.service';
import { ApiService } from '../api.service';
import { CipherProvider } from '../cipher.provider';
import { Wallet, Address, TransactionOutput, TransactionInput, Output, Balance } from '../../app.datatypes';
import { CoinService } from '../coin.service';
import { MockCoinService, MockGlobalsService } from '../../utils/test-mocks';
import { createWallet } from './wallet.service.spec';
import { GlobalsService } from '../globals.service';

describe('WalletService with cipher:', () => {
  let store = {};
  let walletService: WalletService;
  let spendingService: SpendingService;
  let cipherProvider: CipherProvider;
  let spyApiService:  jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    spyOn(localStorage, 'setItem').and.callFake((key, value) => store[key] = value);
    spyOn(localStorage, 'getItem').and.callFake((key) => store[key]);

    TestBed.configureTestingModule({
      providers: [
        WalletService,
        CipherProvider,
        SpendingService,
        {
          provide: ApiService,
          useValue: jasmine.createSpyObj('ApiService', {
            'getOutputs': Observable.of([]),
            'postTransaction': Observable.of(''),
            'get': Observable.of([])
          })
        },
        {
          provide: TranslateService,
          useValue: jasmine.createSpyObj('TranslateService', ['instant'])
        },
        { provide: CoinService, useClass: MockCoinService },
        { provide: GlobalsService, useClass: MockGlobalsService }
      ]
    });

    walletService = TestBed.get(WalletService);
    spendingService = TestBed.get(SpendingService);
    cipherProvider = TestBed.get(CipherProvider);
    spyApiService = TestBed.get(ApiService);
  });

  afterEach(() => {
    store = {};
  });

  it('wallet service should be created', () => {
    expect(walletService).toBeTruthy();
  });

  it('spending service should be created', () => {
    expect(spendingService).toBeTruthy();
  });

  it('cipher service should be created', () => {
    expect(cipherProvider).toBeTruthy();
  });

  describe('cipher should generate an address', () => {
    it('on add address to wallet', () => {
      const wallet = createWallet();
      const expectedWallet = createWallet();
      const newAddress =
        createAddress(
          'fJfDHydeWopE5EbxDpH2EVf8kY47HQYb5Y',
          'f0cecf181dc39bc99d0b9bec3fdce293c22af99af20320974eab1217d0d75b69',
          '03c4e2d7b538a3717b6a489d3690605bc03746f1a04a4fd341a7da5b7c8fa742b3',
          'eca11b3aaf8858756af559840d2731b865bf5f09f91355c67066d4f676af6f8a'
        );

      expectedWallet.addresses.push(newAddress);

      spyApiService.get.and.callFake(() => {
        return Observable.of(createBalance());
      });

      walletService.addAddress(wallet)
        .subscribe(() => {
          expect(wallet).toEqual(expectedWallet);
        });
    });
  });

  describe('cipher createTransaction', () => {
    it('should return the correct transaction inputs and outputs', fakeAsync(() => {
      const amount = new BigNumber(10000);
      const destinationAddress = '2e1erPpaxNVC37PkEv3n8PESNw2DNr5aJNy';
      const addresses = [
        createAddress()
      ];

      const wallet: Wallet = Object.assign(createWallet(), { addresses: addresses });
      const expectedTxInputs: TransactionInput[] = [
        createTransactionInput()
      ];

      const expectedTxOutputs: TransactionOutput[] = [
        createTransactionOutput(destinationAddress)
      ];

      const outputs: Output[] = [
        createOutput(addresses[0].address, amount, new BigNumber(1)),
      ];

      spyApiService.get.and.returnValue(Observable.of({ head_outputs: outputs }));

      spendingService.createTransaction(wallet, destinationAddress, amount)
        .subscribe(
          (result: any) => {
            expect(result.inputs).toEqual(expectedTxInputs);
            expect(result.outputs).toEqual(expectedTxOutputs);
          });
    }));

    it('should rejected transaction for an invalid destination address\'', fakeAsync(() => {
      const amount = new BigNumber(10000);
      const wrongDestinationAddress = '2e1erPpaxNVC37PkEv3n8PESNw2DNr5aJNz';
      const addresses = [
        createAddress()
      ];

      const wallet: Wallet = Object.assign(createWallet(), { addresses: addresses });

      const outputs: Output[] = [
        createOutput(addresses[0].address, amount, new BigNumber(1)),
      ];

      spyApiService.get.and.returnValue(Observable.of({ head_outputs: outputs }));

      spendingService.createTransaction(wallet, wrongDestinationAddress, amount)
        .subscribe(
          () => {
            fail('should fail');
          },
          (error) => expect(error.message).toEqual('Error: Invalid checksum')
        );
    }));
  });
});

function createAddress(
  address = '2uATq4pdSb8Ka1YKSAAbp6Npehs3QQqTnb',
  next_seed = '9fe8bfb01de85dbba36cbd9854ad7478cd63459fedb4c9f7847bf280ee17a32c',
  public_key = '030a797a31100d3a7b5b403f551975e9a12f93b4d4e9e44b402b84832e0c7b89d2',
  secret_key = '20c3db0e1f3b95d98d1f78d73c134af8f1b5dd34cc05f053da94c20d72558862'
): Address {
  return {
    address: address,
    next_seed: next_seed,
    public_key: public_key,
    secret_key: secret_key
  };
}

function createOutput(address: string, coins: BigNumber = new BigNumber(10), calculated_hours: BigNumber = new BigNumber(100)): Output {
  return {
    address: address,
    coins: coins,
    hash: '1fe7d0625540d730a396962fe616053f0e1385d10f3f2702f8a490e3c4cee075',
    calculated_hours: calculated_hours
  };
}

function createBalance(coins = 0, hours = 0): Balance {
  return {
    confirmed: {
      coins: coins,
      hours: hours
    },
    predicted: {
      coins: coins,
      hours: hours
    },
    addresses: {
      'address': {
        confirmed: {
          coins: coins,
          hours: hours
        },
        predicted: {
          coins: coins,
          hours: hours
        }
      }
    }
  };
}

function createTransactionInput(): TransactionInput {
  return {
    hash: '1fe7d0625540d730a396962fe616053f0e1385d10f3f2702f8a490e3c4cee075',
    secret: '20c3db0e1f3b95d98d1f78d73c134af8f1b5dd34cc05f053da94c20d72558862',
    address: '2uATq4pdSb8Ka1YKSAAbp6Npehs3QQqTnb',
    coins: 10000,
    calculated_hours: 1
  };
}

function createTransactionOutput(address: string, coins = 10000, hours = 0): TransactionOutput {
  return {
    address: address,
    coins: coins,
    hours: hours
  };
}
