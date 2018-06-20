import { TestBed, inject } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';

import { BlockchainService } from './blockchain.service';
import { ApiService } from './api.service';
import { WalletService } from './wallet.service';

class MockApiService {
  get(url: string) {
    if (url === 'network/connections') {
      return Observable.of({ connections: [] });
    } else {
      return Observable.of({});
    }
  }
}

class MockWalletService {
}

describe('BlockchainService', () => {
  let service: BlockchainService;
  let apiService: ApiService;
  let walletService: WalletService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BlockchainService,
        { provide: ApiService, useClass: MockApiService },
        { provide: WalletService, useClass: MockWalletService }
      ]
    });
  });

  beforeEach(inject([BlockchainService, ApiService, WalletService], (serv, mockApiService, mockWalletService) => {
    service = serv;
    apiService = mockApiService;
    walletService = mockWalletService;
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
