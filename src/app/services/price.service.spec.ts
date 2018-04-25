import { TestBed, inject } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { HttpModule, XHRBackend } from '@angular/http';

import { PriceService } from './price.service';

describe('PriceService', () => {
  let service: PriceService;
  let mockbackend: MockBackend;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpModule ],
      providers: [
        PriceService,
        { provide: XHRBackend, useClass: MockBackend }
      ]
    });
  });

  beforeEach(inject([PriceService, XHRBackend], (serv, mock) => {
    service = serv;
    mockbackend = mock;
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
