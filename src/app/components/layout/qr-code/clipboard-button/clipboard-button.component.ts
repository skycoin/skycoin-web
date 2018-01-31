import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-clipboard-button',
  templateUrl: './clipboard-button.component.html',
  styleUrls: ['./clipboard-button.component.scss'],
})
export class ClipboardButtonComponent implements AfterViewInit {
  @ViewChild('btnImg') btnImg: ElementRef;
  @Input()
  text: string;
  @Output()
  successEvent: EventEmitter<void>;
  @Output()
  errorEvent: EventEmitter<void>;

  constructor() {
    this.successEvent = new EventEmitter<void>();
    this.errorEvent = new EventEmitter<void>();
  }

  ngAfterViewInit() {
    this.btnImg.nativeElement.src = '../../../../../assets/img/copy-qr.png';
  }

  onSuccess() {
    this.btnImg.nativeElement.src = '../../../../../assets/img/copy-qr-success.png';
    this.successEvent.emit();
  }

  onError() {
    this.errorEvent.emit();
  }

}
