import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { TranslateService } from '@ngx-translate/core';

import { GetOutputsRequest, Output } from '../app.datatypes';
import { CoinService } from './coin.service';
import { BaseCoin } from '../coins/basecoin';
import { parseResponseMessage } from '../utils/errors';

@Injectable()
export class ApiService {

  private url: string;

  constructor(private http: HttpClient,
              private translate: TranslateService,
              private coinService: CoinService) {
    this.coinService.currentCoin
      .subscribe((coin: BaseCoin) => this.url = coin.nodeUrl);
  }

  getOutputs(addresses): Observable<Output[]> {
    return addresses ? this.get('outputs', { addrs: addresses }).map((response: GetOutputsRequest) => {
      const outputs: Output[] = [];
      response.head_outputs.forEach(output => outputs.push({
        address: output.address,
        coins: parseFloat(output.coins),
        hash: output.hash,
        calculated_hours: output.calculated_hours
      }));
      return outputs;
    }) : Observable.of([]);
  }

  postTransaction(rawTransaction: string): Observable<string> {
    return this.post('injectTransaction', { rawtx: rawTransaction });
  }

  get(url, params = null, options = {}): Observable<any> {
    return this.http.get(this.getUrl(url), this.getRequestOptions(options, params))
      .catch((error: any) => this.getErrorMessage(error));
  }

  post(url, body = {}, options: any = {}): Observable<any> {
    return this.getCsrf().first().flatMap(csrf => {
      options.csrf = csrf;
      return this.http.post(this.getUrl(url), body, this.getRequestOptions(options))
        .catch((error: any) => this.getErrorMessage(error));
    });
  }

  private getRequestOptions(additionalOptions: any, parameters: any = null): any {
    const options: any = {};
    options.params = this.getQueryStringParams(parameters);
    options.headers = new HttpHeaders();

    options.headers = options.headers.append('Content-Type', 'application/json');

    if (additionalOptions.csrf) {
      options.headers = options.headers.append('X-CSRF-Token', additionalOptions.csrf);
    }

    return options;
  }

  private getQueryStringParams(parameters: any): HttpParams {
    let params = new HttpParams();

    if (parameters) {
      Object.keys(parameters).forEach((key: string) => params = params.set(key, parameters[key]));
    }

    return params;
  }

  private getUrl(url: string): string {
    if (url.startsWith('/')) {
      url = url.substring(1);
    }
    return this.url + url;
  }

  private getCsrf(): Observable<any> {
    return this.get('csrf').map(response => response.csrf_token);
  }

  private getErrorMessage(error: any): Observable<string> {
    if (error.error) {
      return Observable.throw(new Error(parseResponseMessage(error.error.trim())));
    } if (error.message) {
      return Observable.throw(new Error(parseResponseMessage(error.message.trim())));
    }

    return this.translate.get('service.api.server-error')
      .flatMap(message => Observable.throw(new Error(message)));
  }
}
