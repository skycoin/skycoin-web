import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs/Observable';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ConnectionModel } from '../models/connection.model';
import { ConnectionError } from '../enums/connection-error.enum';

@Injectable()
export class AppService {
  private connectionError$: BehaviorSubject<ConnectionError> = new BehaviorSubject<ConnectionError>(null);

  get connectionError(): Observable<ConnectionError> {
    return this.connectionError$.asObservable();
  }

  constructor(
    private apiService: ApiService
  ) {
    this.monitorConnections();
  }

  private monitorConnections() {
    IntervalObservable
      .create(1500)
      .flatMap(() => this.apiService.get('network/connections'))
      .subscribe(
        connections => this.checkConnection(connections),
        error => this.connectionError$.next(ConnectionError.UNAVAILABLE_BACKEND)
      );
  }

  private checkConnection(response: any) {
    if (response.connections.length === 0) {
      this.connectionError$.next(ConnectionError.NO_ACTIVE_CONNECTIONS);
    }

    if (response.connections.length > 0 && this.connectionError$.value === ConnectionError.NO_ACTIVE_CONNECTIONS) {
      this.connectionError$.next(null);
    }
  }
}
