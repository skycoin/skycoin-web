import { Component, OnInit, Renderer2 } from '@angular/core';
import { LanguageService } from './services/language.service';
import { Router, RouterEvent, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { config } from './app.config';
import { environment } from '../environments/environment';
import { CipherProvider } from './services/cipher.provider';
import { CustomMatDialogService } from './services/custom-mat-dialog.service';
import { Bip39WordListService } from './services/bip39-word-list.service';

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
  browserHasCryptoInsideWorkers: boolean;

  constructor(
    private languageService: LanguageService,
    cipherProvider: CipherProvider,
    router: Router,
    dialog: CustomMatDialogService,
    renderer: Renderer2,
    private bip38WordList: Bip39WordListService,
  ) {
    router.events.subscribe((event: RouterEvent) => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0);
      }
    });

    cipherProvider.browserHasCryptoInsideWorkers.subscribe(value => {
      this.browserHasCryptoInsideWorkers = value;
    });

    dialog.showingDialog.subscribe(value => {
      if (!value) {
        renderer.addClass(document.body, 'fix-error-position');
      } else {
        renderer.removeClass(document.body, 'fix-error-position');
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
