import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';

import { LoadingContentComponent } from './loading-content.component';

@Pipe({name: 'translate'})
class MockTranslatePipe implements PipeTransform {
  transform() {
    return 'translated value';
  }
}

describe('LoadingContentComponent', () => {
  let component: LoadingContentComponent;
  let fixture: ComponentFixture<LoadingContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        LoadingContentComponent,
        MockTranslatePipe
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
