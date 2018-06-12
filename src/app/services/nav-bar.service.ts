import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class NavBarService {
  switchVisible = false;
  activeComponent = new BehaviorSubject(1);
  leftText: string;
  rightText: string;

  setActiveComponent(value: number) {
    this.activeComponent.next(value);
  }

  showSwitch(leftText: string, rightText: string) {
    this.switchVisible = true;
    this.leftText = leftText;
    this.rightText = rightText;
  }

  hideSwitch() {
    this.switchVisible = false;
  }
}
