import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TranslateService } from '@ngx-translate/core';

import { Address, TransactionInput, TransactionOutput } from '../app.datatypes';
import { WebWorkersHelper } from '../utils/web-workers-helper';

declare var Cipher;

@Injectable()
export class CipherProvider {

  constructor(private translateService: TranslateService) {
  }

  generateAddress(seed): Observable<Address> {
    return WebWorkersHelper.ExcecuteWorker('/assets/scripts/workers/generate-addresses.worker.js', seed)
      .map((address) => this.convertToAddress(address))
      .catch((error: Error) => Observable.throw(new Error(this.translateService.instant(error.message))));
  }

  prepareTransaction(inputs: TransactionInput[], outputs: TransactionOutput[]): string {
    return Cipher.PrepareTransaction(JSON.stringify(inputs), JSON.stringify(outputs));
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
