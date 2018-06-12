import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';

import { AppComponent } from './app.component';

class MockTranslateService {
  addLangs(langs: Array<string>): void {
  }

  setDefaultLang(lang: string): void {
  }

  use(lang: string): Observable<any> {
    return Observable.of({});
  }
}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppComponent],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: TranslateService, useClass: MockTranslateService }
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
