import { Component, OnInit } from '@angular/core';
import {MdDialogRef} from '@angular/material';

@Component({
  selector: 'app-onboarding-safeguard',
  templateUrl: './onboarding-safeguard.component.html',
  styleUrls: ['./onboarding-safeguard.component.scss']
})
export class OnboardingSafeguardComponent implements OnInit {

  public acceptSafe = false;

  constructor(public dialogRef: MdDialogRef<OnboardingSafeguardComponent>) {
  }

  ngOnInit() {
  }

  closePopup() {
    this.dialogRef.close(this.acceptSafe);
  }

  setAccept(event) {
    this.acceptSafe = event.checked;
  }

}
