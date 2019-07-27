import { readJSON } from 'karma-read-json';
import { TxEncoder } from './tx-encoder';

describe('TxEncoder', () => {

  describe('check encoding', () => {
    const txs = readJSON('test-fixtures/encoded-txs.json').txs;

    for (let i = 0; i < txs.length; i++) {
      it('encode tx ' + i, () => {
        (txs[i].inputs as Array<any>).forEach(input => input.hash = input.hashIn);
        (txs[i].outputs as Array<any>).forEach(output => {
          output.coins = output.coin / 1000000;
          output.hours = output.hour;
        });
        expect(TxEncoder.encode(txs[i].inputs, txs[i].outputs, txs[i].signatures, txs[i].innerHash)).toBe(txs[i].raw);
      });
    }
  });
});
