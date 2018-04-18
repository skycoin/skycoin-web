import { SkyPipe } from './sky.pipe';
import { TestBed, inject } from '@angular/core/testing';

describe('SkyPipe', () => {
  let pipe;

  beforeEach(() => TestBed.configureTestingModule({
    providers: [SkyPipe]
  }));

  beforeEach(inject([SkyPipe], p => {
    pipe = p;
  }));

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should work with null', () => {
    expect(pipe.transform(null)).toBe('loading .. ');
  });

  it('should work with negative values', () => {
    expect(pipe.transform(-1)).toBe('loading .. ');
  });

  it('should convert', () => {
    expect(pipe.transform(1000)).toBe('0.001 SKY');
  });
});
