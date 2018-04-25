import { TestBed, inject } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { HttpModule, XHRBackend } from '@angular/http';

import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let mockbackend: MockBackend;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpModule ],
      providers: [
        ApiService,
        { provide: XHRBackend, useClass: MockBackend }
      ]
    });
  });

  beforeEach(inject([ApiService, XHRBackend], (serv, mock) => {
    service = serv;
    mockbackend = mock;
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
