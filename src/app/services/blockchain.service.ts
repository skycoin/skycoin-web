import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/takeWhile';

import { ApiService } from './api.service';
import { BalanceService } from './wallet/balance.service';
import { ConnectionError } from '../enums/connection-error.enum';
import { CoinService } from './coin.service';
import { environment } from '../../environments/environment';

export enum ProgressStates {
  Progress,
  Error,
  Restarting,
}

export class ProgressEvent {
  state: ProgressStates;
  error?: ConnectionError;
  currentBlock?: number;
  highestBlock?: number;
}

@Injectable()
export class BlockchainService {
  nodeVersion: string;

  private progressSubject: BehaviorSubject<ProgressEvent> = new BehaviorSubject<ProgressEvent>(null);
  private connectionsSubscription: Subscription;
  private readonly defaultPeriod = 90000;
  private readonly shortPeriod = 5000;

  get progress(): Observable<ProgressEvent> {
    return this.progressSubject.asObservable();
  }

  constructor (
    private apiService: ApiService,
    private balanceService: BalanceService,
    coinService: CoinService
  ) {
    coinService.currentCoin.subscribe(() => {
      this.startCheckingNode();
    });
  }

  lastBlock(): Observable<any> {
    return this.apiService.get('last_blocks', { num: 1 })
      .map(response => response.blocks[0]);
  }

  coinSupply(): Observable<any> {
    return this.apiService.get('coinSupply');
  }

  private startCheckingNode() {
    if (!!this.connectionsSubscription && !this.connectionsSubscription.closed) {
      this.connectionsSubscription.unsubscribe();
    }

    this.balanceService.stopGettingBalances();

    this.progressSubject.next({ state: ProgressStates.Restarting });

    this.connectionsSubscription = this.checkConnectionState()
      .subscribe(
        () => this.checkBlockchainProgress(0),
        error => error && error.reported ? null : this.onLoadBlockchainError()
      );
  }

  private checkBlockchainProgress(delay: number) {
    this.connectionsSubscription = Observable.of(1)
      .delay(delay)
      .flatMap(() => this.getBlockchainProgress())
      .subscribe(
        (response: any) => this.onBlockchainProgress(response),
        () => this.onLoadBlockchainError()
      );
  }

  private getBlockchainProgress() {
    return this.apiService.get('blockchain/progress');
  }

  private onBlockchainProgress(response: any) {
    this.progressSubject.next({
      state: ProgressStates.Progress,
      currentBlock: response.current,
      highestBlock: response.highest
    });

    if (response.current !== response.highest) {
      this.checkBlockchainProgress(
        response.highest - response.current <= 5 ? this.shortPeriod : this.defaultPeriod
      );
    } else {
      this.balanceService.startGettingBalances();
    }
  }

  private onLoadBlockchainError(error: ConnectionError = ConnectionError.UNAVAILABLE_BACKEND) {
    this.progressSubject.next({ state: ProgressStates.Error, error: error });
  }

  private checkConnectionState(): Observable<any> {
    return this.apiService.get('network/connections')
      .map((status: any) => {
        if ((!status.connections || status.connections.length === 0) && !environment.e2eTest) {
          this.onLoadBlockchainError(ConnectionError.NO_ACTIVE_CONNECTIONS);
          throw { reported: true };
        }
      })
      .flatMap(() => this.apiService.get('version'))
      .map ((response: any) => this.nodeVersion = response.version);
  }
}
