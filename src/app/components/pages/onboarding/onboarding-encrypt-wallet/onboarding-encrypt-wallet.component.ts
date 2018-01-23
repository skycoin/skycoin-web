import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-onboarding-encrypt-wallet',
  templateUrl: './onboarding-encrypt-wallet.component.html',
  styleUrls: ['./onboarding-encrypt-wallet.component.scss']
})
export class OnboardingEncryptWalletComponent implements OnInit {
  encryptWallet = false;
  form: FormGroup;

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.initEncryptForm();
  }

  initEncryptForm() {
    this.form = this.formBuilder.group({
      password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(2)])),
      confirm: new FormControl('', Validators.compose([Validators.required, Validators.minLength(2)])),
    });
    this.form.valueChanges.subscribe(data => this.onValueChanged(data));
    this.form.disable();
  }

  setEncrypt(event) {
    this.encryptWallet = event.checked;
    if (this.encryptWallet) {
      this.form.enable();
    } else {
      this.form.disable();
    }
  }

  onValueChanged(data) {

  }

  onSubmit(values) {

  }
}
