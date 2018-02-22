import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
  selector: 'app-onboarding-safeguard',
  templateUrl: './onboarding-safeguard.component.html',
  styleUrls: ['./onboarding-safeguard.component.scss'],
})
export class OnboardingSafeguardComponent {

  public acceptSafe = false;

  constructor(
    public dialogRef: MdDialogRef<OnboardingSafeguardComponent>,
  ) { }

  closePopup() {
    this.dialogRef.close(this.acceptSafe);
  }

  setAccept(event) {
    event.checked ? this.acceptSafe = true : this.acceptSafe = false;
  }

}
