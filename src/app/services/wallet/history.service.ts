import { Injectable } from '@angular/core';
import 'rxjs/add/observable/forkJoin';
import { Observable } from 'rxjs/Observable';
import { BigNumber } from 'bignumber.js';

import { ApiService } from '../api.service';
import { Address, NormalTransaction } from '../../app.datatypes';
import { WalletService } from './wallet.service';
import { GlobalsService } from '../globals.service';
import { isEqualOrSuperiorVersion } from '../../utils/semver';

@Injectable()
export class HistoryService {

  constructor(
    private apiService: ApiService,
    private walletService: WalletService,
    private globalsService: GlobalsService
  ) { }

  transactions(): Observable<any[]> {
    return this.walletService.addresses.first()
      .flatMap(addresses => {
        if (addresses.length === 0) {
          return Observable.of([]);
        }

        return this.globalsService.nodeVersion.filter(version => version !== null).first().flatMap (version => {
          let TxObsv: Observable<any>;
          if (isEqualOrSuperiorVersion(version, '0.25.0')) {
            TxObsv = this.retrieveAddressesTransactions(addresses).map(transactions => {
              return transactions.sort((a, b) =>  b.timestamp - a.timestamp);
            });
          } else {
            TxObsv = Observable.forkJoin(addresses.map(address => this.retrieveAddressTransactions(address)))
              .map(transactions => {
                return []
                  .concat.apply([], transactions)
                  .reduce((array, item) => {
                    if (!array.find(trans => trans.txid === item.txid)) {
                      array.push(item);
                    }

                    return array;
                  }, [])
                  .sort((a, b) =>  b.timestamp - a.timestamp);
              });
          }

          return TxObsv.map(transactions => {
            return transactions.map(transaction => {
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

              calculatedOutputs.map (output => transaction.balance = transaction.balance.plus(new BigNumber(output.coins)));
              transaction.balance = (outgoing ? transaction.balance.negated() : transaction.balance);

              transaction.hoursSent = new BigNumber('0');
              calculatedOutputs.map(output => transaction.hoursSent = transaction.hoursSent.plus(new BigNumber(output.hours)));

              let inputsHours = new BigNumber('0');
              transaction.inputs.map(input => inputsHours = inputsHours.plus(new BigNumber(input.calculated_hours)));
              let outputsHours = new BigNumber('0');
              transaction.outputs.map(output => outputsHours = outputsHours.plus(new BigNumber(output.hours)));
              transaction.hoursBurned = inputsHours.minus(outputsHours);

              return transaction;
            });
          });
        });
      });
  }

  retrieveAddressTransactions(address: Address): Observable<NormalTransaction[]> {
    return this.apiService.get('explorer/address', { address: address.address })
      .map(transactions => transactions.map(transaction => ({
        addresses: [],
        balance: new BigNumber('0'),
        block: transaction.status.block_seq,
        confirmed: transaction.status.confirmed,
        timestamp: transaction.timestamp,
        txid: transaction.txid,
        inputs: transaction.inputs,
        outputs: transaction.outputs,
      })));
  }

  retrieveAddressesTransactions(addresses: Address[]): Observable<NormalTransaction[]> {
    const formattedAddresses = addresses.map(a => a.address).join(',');

    return this.apiService.post('transactions', { addrs: formattedAddresses, verbose: true })
      .map(transactions => transactions.map(transaction => ({
        addresses: [],
        balance: new BigNumber('0'),
        block: transaction.status.block_seq,
        confirmed: transaction.status.confirmed,
        timestamp: transaction.txn.timestamp,
        txid: transaction.txn.txid,
        inputs: transaction.txn.inputs,
        outputs: transaction.txn.outputs,
      })));
  }

  getAllPendingTransactions(): Observable<any> {
    return this.globalsService.nodeVersion.filter(version => version !== null).first().flatMap (version => {
      if (isEqualOrSuperiorVersion(version, '0.25.0')) {
        return this.apiService.get('pendingTxs', { verbose: true });
      } else {
        return this.apiService.get('pendingTxs');
      }
    });
  }

  getTransactionDetails(uxid: string): Observable<any> {
    return this.apiService.get('uxout', { uxid: uxid });
  }
}
