import { Component, OnInit } from '@angular/core';
import { LanguageService } from './services/language.service';
import { Router, RouterEvent, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { config } from './app.config';
import { environment } from '../environments/environment';

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
    private languageService: LanguageService,
    router: Router
  ) {
    router.events.subscribe((event: RouterEvent) => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0);
      }
    });
  }

  ngOnInit() {
    this.otcEnabled = config.otcEnabled;
    this.languageService.loadLanguageSettings();

    window.onbeforeunload = (e) => {
      if (environment.production && !environment.e2eTest) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
  }

  loading() {
    return !this.current || !this.highest || this.current !== this.highest;
  }
}
