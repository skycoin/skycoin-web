import { inject, TestBed } from '@angular/core/testing';

import { TransactionsAmountPipe } from './transactions-amount.pipe';

describe('TransactionsAmountPipe', () => {
  let pipe;

  beforeEach(() => TestBed.configureTestingModule({
    providers: [TransactionsAmountPipe]
  }));

  beforeEach(inject([TransactionsAmountPipe], p => {
    pipe = p;
  }));

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should calculate amount', () => {
    const testData = [
      { outputs: [{ coins: 2 }, { coins: 3 }] },
      { outputs: [{ coins: 1 }, { coins: 4 }] }
    ];
    expect(pipe.transform(testData)).toBe(10);
  });
});
