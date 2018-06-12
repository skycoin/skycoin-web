import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/takeWhile';
import { TranslateService } from '@ngx-translate/core';

import { config } from './app.config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  current: number;
  highest: number;
  otcEnabled: boolean;
  version: string;

  constructor(
    private translate: TranslateService
  ) {
  }

  ngOnInit() {
    this.otcEnabled = config.otcEnabled;
    this.translate.addLangs(['en']);
    this.translate.setDefaultLang('en');
    this.translate.use('en');
  }

  loading() {
    return !this.current || !this.highest || this.current !== this.highest;
  }
}
