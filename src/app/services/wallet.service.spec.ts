import { TestBed, inject } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';

import { WalletService } from './wallet.service';
import { ApiService } from './api.service';

class MockApiService {
  get() {
    return Observable.of({});
  }
  getOutputs() {
    return Observable.of({});
  }
}

describe('WalletService', () => {
  let service: WalletService;
  let apiService: ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        WalletService,
        { provide: ApiService, useClass: MockApiService }
      ]
    });
  });

  beforeEach(inject([WalletService, ApiService], (serv, stub) => {
    service = serv;
    apiService = stub;
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
