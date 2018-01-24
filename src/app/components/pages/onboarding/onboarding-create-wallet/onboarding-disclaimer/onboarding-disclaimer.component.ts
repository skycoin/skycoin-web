import {Component, OnInit} from '@angular/core';
import {MdDialogRef} from '@angular/material';

@Component({
  selector: 'app-onboarding-disclaimer',
  templateUrl: './onboarding-disclaimer.component.html',
  styleUrls: ['./onboarding-disclaimer.component.scss']
})
export class OnboardingDisclaimerComponent implements OnInit {

  public acceptTerms = false;

  constructor(public dialogRef: MdDialogRef<OnboardingDisclaimerComponent>) {
  }

  ngOnInit() {
  }

  closePopup() {
    this.dialogRef.close(this.acceptTerms);
  }

  setAccept(event) {
    this.acceptTerms = event.checked;
  }

}
