import { Injectable } from '@angular/core';
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

  blocks(num: number = 5100) {
    return this.apiService.get('last_blocks', { num: num }).map(response => response.blocks.reverse());
  }

  lastBlock() {
    return this.blocks(1).map(blocks => blocks[0]);
  }

  coinSupply() {
    return this.apiService.get('coinSupply');
  }

  private loadBlockchainBlocks() {
    IntervalObservable
      .create(90000)
      .startWith(1)
      .flatMap(() => this.getBlockchainProgress())
      .takeWhile((response: any) => !response.current || response.current !== response.highest)
      .subscribe(
        response => this.progressSubject.next(response),
        () => this.onLoadBlockchainError(),
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
