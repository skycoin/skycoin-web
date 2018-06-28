import { Injectable } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { config } from '../app.config';

@Injectable()
export class LanguageService {
  currentLanguage = new BehaviorSubject<string>(config.defaultLanguage);

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
    const currentLang = localStorage.getItem(this.storageKey);

    if (currentLang) {
      this.translate.use(currentLang);
    }
  }
}
