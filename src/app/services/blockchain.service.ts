import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';
import 'rxjs/add/operator/startWith';

import { ApiService } from './api.service';
import { WalletService } from './wallet.service';
import { ConnectionError } from '../enums/connection-error.enum';

@Injectable()
export class BlockchainService {

  private progressSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  get progress() {
    return this.progressSubject.asObservable();
  }

  constructor (
    private apiService: ApiService,
    private walletService: WalletService
  ) {
    this.loadBlockchainBlocks();
  }

  addressTransactions(id): Observable<any> {
    return this.apiService.get('explorer/address', { address: id });
  }

  addressBalance(id): Observable<any> {
    return this.apiService.get('outputs', { addrs: id });
  }

  block(id): Observable<any> {
    return this.apiService.get('blocks', { start: id, end: id }).map(response => response.blocks[0]).flatMap(block => {
      return Observable.forkJoin(block.body.txns.map(transaction => {
        if (transaction.inputs && !transaction.inputs.length) {
          return Observable.of(transaction);
        }
        return Observable.forkJoin(transaction.inputs.map(input => this.retrieveInputAddress(input).map(response => {
          return response.owner_address;
        }))).map(inputs => {
          transaction.inputs = inputs;
          return transaction;
        });
      })).map(transactions => {
        block.body.txns = transactions;
        return block;
      });
    });
  }

  blocks(num: number = 5100) {
    return this.apiService.get('last_blocks', { num: num }).map(response => response.blocks.reverse());
  }

  lastBlock() {
    return this.blocks(1).map(blocks => blocks[0]);
  }

  private retrieveInputAddress(input: string) {
    return this.apiService.get('uxout', {uxid: input});
  }

  private loadBlockchainBlocks() {
    IntervalObservable
      .create(90000)
      .startWith(1)
      .flatMap(() => this.getBlockchainProgress())
      .takeWhile((response: any) => !response.current || response.current !== response.highest)
      .subscribe(
        response => this.progressSubject.next(response),
        error => this.onLoadBlockchainError(),
        () => this.completeLoading()
      );
  }

  private getBlockchainProgress() {
    return this.apiService.get('blockchain/progress');
  }

  private completeLoading() {
    this.finishLoadingBlockchain();
    this.walletService.loadBalances();
  }

  private finishLoadingBlockchain() {
    this.progressSubject.next({ current: 999999999999, highest: 999999999999 });
  }

  private onLoadBlockchainError() {
    this.progressSubject.next({ isError: true, error: ConnectionError.UNAVAILABLE_BACKEND });
  }
}
