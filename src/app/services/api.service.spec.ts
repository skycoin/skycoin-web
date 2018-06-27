import { TestBed, inject } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { HttpModule, XHRBackend } from '@angular/http';
import { TranslateService } from '@ngx-translate/core';

import { ApiService } from './api.service';
import { MockTranslateService } from '../utils/test-mocks';

describe('ApiService', () => {
  let service: ApiService;
  let mockBackEnd: MockBackend;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpModule ],
      providers: [
        ApiService,
        { provide: XHRBackend, useClass: MockBackend },
        { provide: TranslateService, useClass: MockTranslateService }
      ]
    });
  });

  beforeEach(inject([ApiService, XHRBackend], (serv, mock) => {
    service = serv;
    mockBackEnd = mock;
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
