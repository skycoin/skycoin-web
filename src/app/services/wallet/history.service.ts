import { Injectable } from '@angular/core';
import 'rxjs/add/observable/forkJoin';
import { Observable } from 'rxjs/Observable';

import { ApiService } from '../api.service';
import { Address, NormalTransaction } from '../../app.datatypes';
import { WalletService } from './wallet.service';

@Injectable()
export class HistoryService {

  constructor(
    private apiService: ApiService,
    private walletService: WalletService
  ) { }

  transactions(): Observable<any[]> {
    return this.walletService.addresses.first()
      .flatMap(addresses => {
        if (addresses.length === 0) {
          return Observable.of([]);
        }

        return Observable.forkJoin(addresses.map(address => this.retrieveAddressTransactions(address)))
          .map(transactions => {
            return []
              .concat.apply([], transactions)
              .reduce((array, item) => {
                if (!array.find(trans => trans.txid === item.txid)) {
                  array.push(item);
                }

                return array;
              }, [])
              .sort((a, b) =>  b.timestamp - a.timestamp)
              .map(transaction => {
                const outgoing = addresses.some(address => {
                  return transaction.inputs.some(input => input.owner === address.address);
                });

                const relevantOutputs = transaction.outputs.reduce((array, output) => {
                  const isMyOutput = addresses.some(address => address.address === output.dst);

                  if ((outgoing && !isMyOutput) || (!outgoing && isMyOutput)) {
                    array.push(output);
                  }

                  return array;
                }, []);

                const calculatedOutputs = (outgoing && relevantOutputs.length === 0)
                || (!outgoing && relevantOutputs.length === transaction.outputs.length)
                  ? transaction.outputs
                  : relevantOutputs;

                transaction.addresses.push(
                  ...calculatedOutputs
                    .map(output => output.dst)
                    .filter((dst, i, self) => self.indexOf(dst) === i),
                );

                transaction.balance += calculatedOutputs.reduce((a, b) => a + parseFloat(b.coins), 0) * (outgoing ? -1 : 1);

                return transaction;
              });
          });
      });
  }

  retrieveAddressTransactions(address: Address): Observable<NormalTransaction[]> {
    return this.apiService.get('explorer/address', { address: address.address })
      .map(transactions => transactions.map(transaction => ({
        addresses: [],
        balance: 0,
        block: transaction.status.block_seq,
        confirmed: transaction.status.confirmed,
        timestamp: transaction.timestamp,
        txid: transaction.txid,
        inputs: transaction.inputs,
        outputs: transaction.outputs,
      })));
  }

  getAllPendingTransactions(): Observable<any> {
    return this.apiService.get('pendingTxs');
  }

  getTransactionDetails(uxid: string): Observable<any> {
    return this.apiService.get('uxout', { uxid: uxid });
  }
}
