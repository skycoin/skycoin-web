import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { isString } from 'util';

export enum CipherWebWorkerOperation {
  CreateAdress = 0,
  PrepareTransaction = 1,
}

export class CipherWebWorkerHelper {

  private static readonly errPrefix = 'Error:';

  private static readonly worker: Worker = new Worker('/assets/scripts/cipher-web-worker.js');
  private static readonly activeWorks: Map<number, Subject<any>> = new Map<number, Subject<any>>();
  private static initialized = false;

  static ExcecuteWorker(operation: CipherWebWorkerOperation, data: any): Observable<any> {

    if (!CipherWebWorkerHelper.initialized) {
      CipherWebWorkerHelper.initialized = true;
      CipherWebWorkerHelper.worker.addEventListener('message', CipherWebWorkerHelper.eventListener);
    }

    const workID = Math.floor(Math.random() * 100000000000000);
    const workSubject = new Subject<any>();
    CipherWebWorkerHelper.activeWorks[workID] = workSubject;

    CipherWebWorkerHelper.worker.postMessage({operation: operation, data: data, workID: workID});

    return workSubject.asObservable();
  }

  private static eventListener(e: MessageEvent) {
    if (isString(e.data.result) && (e.data.result as string).startsWith(CipherWebWorkerHelper.errPrefix)) {
      // Return the error message without the content of errPrefix.
      CipherWebWorkerHelper.activeWorks[e.data.workID].error(
        new Error((e.data.result as string).substr(
          CipherWebWorkerHelper.errPrefix.length,
          (e.data.result as string).length - CipherWebWorkerHelper.errPrefix.length)
      ));
    } else {
      // Return the result.
      CipherWebWorkerHelper.activeWorks[e.data.workID].next(e.data.result);
    }
    CipherWebWorkerHelper.activeWorks[e.data.workID].complete();
    CipherWebWorkerHelper.activeWorks.delete(e.data.workID);
  }
}
