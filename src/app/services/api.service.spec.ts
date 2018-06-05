import { TestBed, inject } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { HttpModule, XHRBackend } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { ApiService } from './api.service';
import { TranslateService } from '@ngx-translate/core';

class MockTranslateService {
  get(key: string | Array<string>, interpolateParams?: Object): Observable<string | any> {
    return Observable.of({});
  }
}

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
