import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatTooltip } from '@angular/material';

@Component({
  selector: 'app-button',
  templateUrl: 'button.component.html',
  styleUrls: ['button.component.scss'],
})

export class ButtonComponent {
  @Input() disabled: boolean;
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
    this.error = !error || typeof error === 'string' ? error : error['_body'];
    this.state = 2;

    setTimeout(() => {
      if (this.mouseOver) {
        this.tooltip.show(50);
      }
    }, 0);
  }

  setEnabled() {
    this.disabled = false;
  }

  setDisabled() {
    this.disabled = true;
  }

  resetState() {
    this.state = null;
    this.error = '';
  }
}
