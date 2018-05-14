import { TestBed, inject } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';

import { NumberFieldDirective } from './number-field.directive';

@Component({
  template: `<input type="text" appNumberField>`
})
class TestComponent {
}

describe('Directive: NumberField', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, NumberFieldDirective]
    });
  });

  it('should create an instance', () => {
    const fixture = TestBed.createComponent(TestComponent);
    const directiveEl = fixture.debugElement.query(By.directive(NumberFieldDirective));
    expect(directiveEl).not.toBeNull();
  });
});
