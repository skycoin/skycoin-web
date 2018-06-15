import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Address, TransactionInput, TransactionOutput } from '../app.datatypes';
import { CipherWebWorkerHelper, CipherWebWorkerOperation } from '../utils/cipher-web-worker-helper';

@Injectable()
export class CipherProvider {

  generateAddress(seed): Observable<Address> {
    return CipherWebWorkerHelper.ExcecuteWorker(CipherWebWorkerOperation.CreateAdress, seed)
      .map((address) => this.convertToAddress(address))
      .catch((error: Error) => Observable.throw(new Error(error.message)));
  }

  prepareTransaction(inputs: TransactionInput[], outputs: TransactionOutput[]): Observable<string> {
    const data = { inputs: JSON.stringify(inputs), outputs: JSON.stringify(outputs) };
    return CipherWebWorkerHelper.ExcecuteWorker(CipherWebWorkerOperation.PrepareTransaction, data)
      .catch((error: Error) => Observable.throw(new Error(error.message)));
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
