import { Directive, Output, Input, HostListener } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { ClipboardService } from '../services/clipboard.service';

@Directive({
  /* tslint:disable:directive-selector */
  selector: '[clipboard]',
})
export class ClipboardDirective {
  @Output() public copyEvent: EventEmitter<string>;
  @Output() public errorEvent: EventEmitter<Error>;
  /* tslint:disable:no-input-rename */
  @Input('clipboard') public value: string;

  private clipboardService: ClipboardService;

  constructor(clipboardService: ClipboardService) {
    this.clipboardService = clipboardService;
    this.copyEvent = new EventEmitter();
    this.errorEvent = new EventEmitter();
    this.value = '';
  }

  @HostListener('click') public copyToClipboard(): void {
    this.clipboardService
      .copy(this.value)
      .then(
        (value: string): void => {
          this.copyEvent.emit(value);
        },
      )
      .catch(
        (error: Error): void => {
          this.errorEvent.emit(error);
        },
      );
  }
}
