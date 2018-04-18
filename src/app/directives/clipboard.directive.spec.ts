import { TestBed, inject } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';

import { ClipboardDirective } from './clipboard.directive';
import { ClipboardService } from '../services/clipboard.service';

@Component({
  template: `<span clipboard="test data"></span>`
})
class TestComponent {
}

class MockClipboardService {
}

describe('Directive: Clipboard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, ClipboardDirective],
      providers: [{provide: ClipboardService, useClass: MockClipboardService}]
    });
  });

  it('should create an instance', inject([ClipboardService], () => {
    const fixture = TestBed.createComponent(TestComponent);
    const directiveEl = fixture.debugElement.query(By.directive(ClipboardDirective));
    expect(directiveEl).not.toBeNull();
  }));
});
