import { Component, OnInit } from '@angular/core';
import { LanguageService } from './services/language.service';

import { config } from './app.config';
import { CipherProvider } from './services/cipher.provider';

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
  appStoreUrl: string;
  googlePlayUrl: string;
  isElectron: boolean;
  browserHasCryptoInsideWorkers: boolean;

  constructor(
    private languageService: LanguageService,
    cipherProvider: CipherProvider
  ) {
    cipherProvider.browserHasCryptoInsideWorkers.subscribe(value => {
      this.browserHasCryptoInsideWorkers = value;
    });
  }

  ngOnInit() {
    this.otcEnabled = config.otcEnabled;
    this.appStoreUrl = config.appStoreUrl;
    this.googlePlayUrl = config.googlePlayUrl;
    this.isElectron = window['isElectron'];
    this.languageService.loadLanguageSettings();
  }

  loading() {
    return !this.current || !this.highest || this.current !== this.highest;
  }
}
