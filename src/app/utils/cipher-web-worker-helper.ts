import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { isString } from 'util';

import { environment } from '../../environments/environment';

export enum CipherWebWorkerOperation {
  Load = 0,
  CreateAdress = 1,
  PrepareTransaction = 2,
}

export class CipherWebWorkerHelper {

  private static readonly errPrefix = 'Error:';
  private static readonly browserWithputCryptoErrorMsg = 'No crypto';

  private static worker: Worker;

  private static readonly activeWorks: Map<number, Subject<any>> = new Map<number, Subject<any>>();
  private static initialized = false;
  private static mainService: any;

  static initialize(mainService: any) {
    if (!CipherWebWorkerHelper.initialized) {
      CipherWebWorkerHelper.initialized = true;

      CipherWebWorkerHelper.mainService = mainService;

      if (!environment.e2eTest) {
        System.import(`../../assets/scripts/cipher-web-worker.js`).then((content) => {
          // The worker is loaded as a blob so that it works correctly if the wallet
          // is loaded from the local file system
          CipherWebWorkerHelper.worker = new Worker(URL.createObjectURL(new Blob(['(onmessage = ' + content.onmessage.toString() + ')()'], { type: 'text/javascript' })));
          CipherWebWorkerHelper.configureWorker();
        });
      } else {
        // Chrome headless has problems with blobs, so the file is loaded from the URL.
        CipherWebWorkerHelper.worker = new Worker('./assets/scripts/cipher-web-worker.js');
        CipherWebWorkerHelper.configureWorker();
      }
    }
  }

  static ExcecuteWorker(operation: CipherWebWorkerOperation, data: any): Observable<any> {
    if (CipherWebWorkerHelper.worker) {
      const workID = Math.floor(Math.random() * 100000000000000);
      const workSubject = new Subject<any>();
      CipherWebWorkerHelper.activeWorks[workID] = workSubject;

      CipherWebWorkerHelper.worker.postMessage({operation: operation, data: data, workID: workID});

      return workSubject.asObservable();
    } else {
      return Observable.of(1).delay(1000).flatMap(() => CipherWebWorkerHelper.ExcecuteWorker(operation, data));
    }
  }

  private static configureWorker() {
    let currentLocation = location.origin + location.pathname;
    if (currentLocation.includes('/index.html')) {
      currentLocation = currentLocation.substr(0, currentLocation.lastIndexOf('/index.html'));
    } else if (currentLocation.includes('/context.html')) {
      currentLocation = currentLocation.substr(0, currentLocation.lastIndexOf('/context.html'));
    }

    CipherWebWorkerHelper.worker.postMessage({operation: CipherWebWorkerOperation.Load, url: currentLocation});

    CipherWebWorkerHelper.worker.addEventListener('message', CipherWebWorkerHelper.eventListener);
  }

  private static eventListener(e: MessageEvent) {
    if (isString(e.data.result) && (e.data.result as string).startsWith(CipherWebWorkerHelper.errPrefix)) {
      // Return the error message without the content of errPrefix.
      CipherWebWorkerHelper.activeWorks[e.data.workID].error(
        new Error((e.data.result as string).substr(
          CipherWebWorkerHelper.errPrefix.length,
          (e.data.result as string).length - CipherWebWorkerHelper.errPrefix.length)
      ));
    } else if (isString(e.data.result) && (e.data.result as string).startsWith(CipherWebWorkerHelper.browserWithputCryptoErrorMsg)) {
      CipherWebWorkerHelper.mainService.browserHasCryptoInsideWorkers.next(false);
    } else {
      // Return the result.
      CipherWebWorkerHelper.activeWorks[e.data.workID].next(e.data.result);
    }
    CipherWebWorkerHelper.activeWorks[e.data.workID].complete();
    CipherWebWorkerHelper.activeWorks.delete(e.data.workID);
  }
}
