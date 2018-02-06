import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
  selector: 'app-onboarding-disclaimer',
  templateUrl: './onboarding-disclaimer.component.html',
  styleUrls: ['./onboarding-disclaimer.component.scss'],
})
export class OnboardingDisclaimerComponent {

  acceptTerms = false;

  constructor(
    public dialogRef: MdDialogRef<OnboardingDisclaimerComponent>,
  ) { }

  closePopup() {
    this.dialogRef.close(this.acceptTerms);
  }

  setAccept(event) {
    event.checked ? this.acceptTerms = true : this.acceptTerms = false;
  }

}
