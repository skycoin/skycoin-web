import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { isString } from 'util';

export enum CipherWebWorkerOperation {
  Load = 0,
  CreateAdress = 1,
  PrepareTransaction = 2,
}

export class CipherWebWorkerHelper {

  // To be able to test changes more easily it is possible to modify assets/scripts/cipher-web-worker.js
  // and uncomment the worker constant below. However, for the wallet to work properly from the local file
  // system, it is necessary to placed the changes in this string after finishing and return the worker
  // constant to its initial state. When doing this, the URL on case 0 should not be modified, since a
  // different URL is used in assets/scripts/cipher-web-worker.js.
  private static readonly workerCode = `
    onmessage = function(e) {
      if (e) {
        try {
          switch(e.data.operation) {
            case 0: {
              importScripts(e.data.url + '/assets/scripts/main.js');
              break;
            }
            case 1: {
              postMessage({result: Cipher.GenerateAddresses(e.data.data), workID: e.data.workID});
              break;
            }
            case 2: {
              postMessage({result: Cipher.PrepareTransaction(e.data.data.inputs, e.data.data.outputs), workID: e.data.workID});
              break;
            }
            default: {
              postMessage({result: 0, workID: e.data.workID});
              break;
            }
          }
        } catch(err) {
          // The error message must be prefixed with "Error:" to be recognized as an error
          // message and not as a valid response. The prefix is defined in WebWorkersHelper.errPrefix.
          postMessage({result: "Error:" + err.message, workID: e.data.workID});
        }
      }
    }
  `;

  private static readonly errPrefix = 'Error:';

  // If you want to perform tests with assets/scripts/cipher-web-worker.js, uncomment the first worker
  // constant and comment the second one:

  // private static readonly worker: Worker = new Worker('./assets/scripts/cipher-web-worker.js');
  private static readonly worker: Worker = new Worker(URL.createObjectURL(new Blob(['(' + CipherWebWorkerHelper.workerCode.toString() + ')()'], { type: 'text/javascript' })));

  private static readonly activeWorks: Map<number, Subject<any>> = new Map<number, Subject<any>>();
  private static initialized = false;

  static Load() {
    let currentLocation = location.origin + location.pathname;
    if (currentLocation.includes('/index.html')) {
      currentLocation = currentLocation.substr(0, currentLocation.lastIndexOf('/index.html'));
    }

    CipherWebWorkerHelper.worker.postMessage({operation: CipherWebWorkerOperation.Load, url: currentLocation});
  }

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
