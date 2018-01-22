import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';

export enum DoubleButtonActive {RightButton, LeftButton}

@Component({
  selector: 'app-double-button',
  templateUrl: './double-button.component.html',
  styleUrls: ['./double-button.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class DoubleButtonComponent implements OnInit {
  @Input()
  right_button_text: any;
  @Input()
  left_button_text: any;
  @Input()
  active_button: DoubleButtonActive;
  @Output()
  onStateChange = new EventEmitter();
  right_active = false;

  constructor() {
  }

  ngOnInit() {
    this.initState();
  }

  initState() {
    if (this.active_button) {
      if (this.active_button === DoubleButtonActive.LeftButton) {
        this.right_active = false;
      } else {
        this.right_active = true;
      }
    }
  }

  onRightClick() {
    if (!this.right_active) {
      this.onStateChange.emit(DoubleButtonActive.RightButton);
      this.right_active = true;
    }
  }

  onLeftClick() {
    if (this.right_active) {
      this.onStateChange.emit(DoubleButtonActive.LeftButton);
      this.right_active = false;
    }
  }
}
