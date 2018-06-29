import { Injectable } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { config } from '../app.config';

@Injectable()
export class LanguageService {
  currentLanguage = new ReplaySubject<string>();

  private readonly storageKey = 'lang';

  constructor(
    private translate: TranslateService
  ) {
  }

  get langs() {
    return this.translate.langs;
  }

  loadLanguageSettings() {
    this.translate.addLangs(config.languages);
    this.translate.setDefaultLang(config.defaultLanguage);

    this.translate.onLangChange
      .subscribe((event: LangChangeEvent) => this.onLanguageChanged(event));

    this.loadCurrentLanguage();
  }

  changeLanguage(lang: string) {
    this.translate.use(lang);
  }

  private onLanguageChanged(event: LangChangeEvent) {
    this.currentLanguage.next(event.lang);
    localStorage.setItem(this.storageKey, event.lang);
  }

  private loadCurrentLanguage() {
    const storedLang = localStorage.getItem(this.storageKey);
    const currentLang = !!storedLang ? storedLang : config.defaultLanguage;
    this.translate.use(currentLang);
  }
}
