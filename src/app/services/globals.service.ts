import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

// Add vars to this file when having problems with circular dependencies
@Injectable()
export class GlobalsService {
  nodeVersion: BehaviorSubject<string> = new BehaviorSubject<string>(null);
}
