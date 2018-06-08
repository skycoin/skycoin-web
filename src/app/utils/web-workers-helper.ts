import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { isString } from 'util';

export class WebWorkersHelper {

  private static readonly errPrefix = 'Error:';

  static ExcecuteWorker(fileName: string, data: any): Observable<any> {

    return Observable.create((obs: Subject<any>) => {
      const worker = new Worker(fileName);
      worker.addEventListener('message', (e: MessageEvent) => {
        if (isString(e.data) && (e.data as string).startsWith(WebWorkersHelper.errPrefix)) {
          // Return the error message without the content of errPrefix.
          obs.error(new Error((e.data as string).substr(WebWorkersHelper.errPrefix.length, (e.data as string).length - WebWorkersHelper.errPrefix.length)));
        } else {
          obs.next(e.data);
        }
        obs.complete();
      });

      worker.postMessage(data);
    });

  }
}
