import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { GetOutputsRequest, Output } from '../../../app.datatypes';

@Injectable()
export class ApiService {

  private url = 'http://128.199.57.221/';

  constructor(private http: Http) { }

  getOutputs(addresses): Observable<Output[]> {
    return addresses ? this.get('outputs', { addresses: addresses }).map((response: GetOutputsRequest) => {
      const outputs: Output[] = [];
      response.head_outputs.forEach(output => outputs.push({
        address: output.address,
        coins: parseFloat(output.coins),
        hash: output.hash,
        hours: output.hours,
      }));
      return outputs;
    }) : Observable.of([]);
  }

  postTransaction(rawTransaction: string): Observable<string> {
    return this.post('transaction', { raw: rawTransaction });
  }

  get(url, options = null) {
    return this.http.get(this.getUrl(url, options), this.getHeaders())
      .map((res: any) => res.json())
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  post(url, body = {}) {
    return this.http.post(this.getUrl(url), body, this.returnRequestOptions())
      .map((res: any) => res.json())
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  private getHeaders() {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return headers;
  }

  private returnRequestOptions() {
    const options = new RequestOptions();

    options.headers = this.getHeaders();

    return options;
  }

  private getQueryString(parameters = null) {
    if (!parameters) {
      return '';
    }

    return Object.keys(parameters).reduce((array, key) => {
      array.push(key + '=' + encodeURIComponent(parameters[key]));
      return array;
    }, []).join('&');
  }

  private getUrl(url, options = null) {
    return this.url + url + '?' + this.getQueryString(options);
  }
}
