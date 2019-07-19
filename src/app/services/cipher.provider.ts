import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/observable/fromPromise';

import { Address, TransactionInput, TransactionOutput } from '../app.datatypes';

declare var Go: any;

export interface GenerateAddressResponse {
  address: Address;
  nextSeed: string;
}

export enum InitializationResults {
  Ok = 1,
  BrowserIncompatibleWithWasm = 2,
  ErrorLoadingWasmFile = 3,
}

@Injectable()
export class CipherProvider {

  private initialized = false;

  constructor(private http: HttpClient) {}

  initialize(): Observable<InitializationResults> {
    if (!this.initialized) {
      this.initialized = true;
      if (window['WebAssembly'] && window['WebAssembly'].instantiate) {
        return this.http.get('/assets/scripts/skycoin-lite.wasm', { responseType: 'arraybuffer' })
          .catch(() => Observable.throw(InitializationResults.ErrorLoadingWasmFile))
          .flatMap((response: ArrayBuffer) => {
            const go = new Go();
            return Observable.fromPromise((window['WebAssembly'].instantiate(response, go.importObject) as Promise<any>)).map(result => {
              go.run(result.instance);

              return InitializationResults.Ok;
            }).catch(err => {
              return Observable.throw(InitializationResults.ErrorLoadingWasmFile);
            });
          });
      } else {
        return Observable.throw(InitializationResults.BrowserIncompatibleWithWasm);
      }
    }

    return null;
  }

  generateAddress(seed): Observable<GenerateAddressResponse> {
    const address = window['SkycoinCipher'].generateAddress(seed);

    if (!address.error) {
      return Observable.of(this.convertToAddress(address));
    } else {
      return Observable.throw(new Error(address.error));
    }
  }

  prepareTransaction(inputs: TransactionInput[], outputs: TransactionOutput[]): Observable<string> {
    const tx = window['SkycoinCipher'].prepareTransaction(JSON.stringify(inputs), JSON.stringify(outputs));

    if (!tx.error) {
      return Observable.of(tx);
    } else {
      return Observable.throw(new Error(tx.error));
    }
  }

  private convertToAddress(address): GenerateAddressResponse {
    return {
      nextSeed: address.nextSeed,
      address: {
        secret_key: address.secret,
        public_key: address.public,
        address: address.address
      }
    };
  }
}
