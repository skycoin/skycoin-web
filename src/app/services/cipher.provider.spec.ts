import { TestBed, inject } from '@angular/core/testing';
import { CipherProvider } from './cipher.provider';

describe('CipherProvider', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CipherProvider]
    });
  });

  it('should be created', inject([CipherProvider], (service: CipherProvider) => {
    expect(service).toBeTruthy();
  }));
});
