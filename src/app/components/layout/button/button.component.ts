import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatTooltip } from '@angular/material';

@Component({
  selector: 'app-button',
  templateUrl: 'button.component.html',
  styleUrls: ['button.component.scss'],
})

export class ButtonComponent {
  @Input() disabled: any;
  @Input() emit = false;
  @Output() action = new EventEmitter();
  @ViewChild('tooltip') tooltip: MatTooltip;

  error: string;
  state: number;
  mouseOver = false;

  onClick() {
    if (!this.disabled || this.emit) {
      this.error = '';
      this.action.emit();
    }
  }

  setLoading() {
    this.state = 0;
  }

  setSuccess() {
    this.state = 1;
    setTimeout(() => this.state = null, 3000);
  }

  setError(error: any) {
    this.error = error['_body'];
    this.state = 2;

    if (this.mouseOver) {
      setTimeout(() => this.tooltip.show(), 50);
    }
  }

  setDisabled() {
    this.disabled = true;
  }

  resetState() {
    this.state = null;
    this.error = '';
  }
}
