import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs/Observable';

import { ConnectionError } from '../enums/connection-error.enum';

@Injectable()
export class AppService {
  constructor(
    private apiService: ApiService
  ) {
  }

  checkConnectionState(): Observable<ConnectionError> {
    return this.apiService.get('network/connections')
      .map(response => {
        return response.connections.length === 0
          ? ConnectionError.NO_ACTIVE_CONNECTIONS
          : null;
      })
      .catch(() => Observable.of(ConnectionError.UNAVAILABLE_BACKEND));
  }
}
