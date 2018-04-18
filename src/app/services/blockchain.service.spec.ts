import { TestBed, inject } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';

import { BlockchainService } from './blockchain.service';
import { ApiService } from './api.service';

class MockApiService {
  get() {
    return Observable.of({});
  }
}

describe('BlockchainService', () => {
  let service: BlockchainService;
  let apiService: ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BlockchainService,
        { provide: ApiService, useClass: MockApiService }
      ]
    });
  });

  beforeEach(inject([BlockchainService, ApiService], (serv, mock) => {
    service = serv;
    apiService = mock;
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
