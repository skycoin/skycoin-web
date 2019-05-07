import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, Renderer2 } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { AppComponent } from './app.component';
import { MockLanguageService, MockTranslatePipe, MockTranslateService, MockCustomMatDialogService } from './utils/test-mocks';
import { LanguageService } from './services/language.service';
import { CipherProvider } from './services/cipher.provider';
import { CustomMatDialogService } from './services/custom-mat-dialog.service';
import { Bip39WordListService } from './services/bip39-word-list.service';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppComponent, MockTranslatePipe ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: LanguageService, useClass: MockLanguageService },
        { provide: TranslateService, useClass: MockTranslateService },
        { provide: Router, useValue: { events: Observable.of({}) } },
        { provide: CipherProvider, useValue: { browserHasCryptoInsideWorkers: new BehaviorSubject<boolean>(true) } },
        { provide: Renderer2, useValue: { addClass: null, removeClass: null } },
        { provide: CustomMatDialogService, useClass: MockCustomMatDialogService },
        { provide: Bip39WordListService, useValue: {} }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', async(() => {
    expect(component).toBeTruthy();
  }));
});
