import { TestBed, inject } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';

import { NetworkService } from './network.service';
import { ApiService } from './api.service';

class MockApiService {
  post() {
    return Observable.of({
      connections: []
    });
  }
}

describe('NetworkService', () => {
  let service: NetworkService;
  let apiService: ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NetworkService,
        { provide: ApiService, useClass: MockApiService }
      ]
    });
  });

  beforeEach(inject([NetworkService, ApiService], (serv, mock) => {
    service = serv;
    apiService = mock;
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
