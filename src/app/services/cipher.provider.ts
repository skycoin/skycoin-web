import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Address, TransactionInput, TransactionOutput } from '../app.datatypes';
import { CipherWebWorkerHelper, CipherWebWorkerOperation } from '../utils/cipher-web-worker-helper';

@Injectable()
export class CipherProvider {

  browserHasCryptoInsideWorkers: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor() {
    CipherWebWorkerHelper.initialize(this);
  }

  generateAddress(seed): Observable<Address> {
    return CipherWebWorkerHelper.ExcecuteWorker(CipherWebWorkerOperation.CreateAdress, seed)
      .map((address) => this.convertToAddress(address));
  }

  prepareTransaction(inputs: TransactionInput[], outputs: TransactionOutput[]): Observable<string> {
    const data = { inputs: JSON.stringify(inputs), outputs: JSON.stringify(outputs) };
    return CipherWebWorkerHelper.ExcecuteWorker(CipherWebWorkerOperation.PrepareTransaction, data);
  }

  private convertToAddress(address): Address {
    return {
      next_seed: address.NextSeed,
      secret_key: address.Secret,
      public_key: address.Public,
      address: address.Address
    };
  }
}
