import { TestBed, inject } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';

import { AppService } from './app.service';
import { ApiService } from './api.service';

describe('AppService', () => {
  let appService: AppService;
  let spyApiService:  jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AppService,
        {
          provide: ApiService,
          useValue: jasmine.createSpyObj('ApiService', {
            'get': Observable.of({})
          })
        }
      ]
    });

    appService = TestBed.get(AppService);
    spyApiService = TestBed.get(ApiService);
  });

  it('should be created', () => {
    expect(appService).toBeTruthy();
  });
});
