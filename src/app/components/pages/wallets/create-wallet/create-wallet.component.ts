import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MdDialogRef } from '@angular/material';
import * as Bip39 from 'bip39';
import { WalletService } from '../../../../services/wallet.service';

@Component({
  selector: 'app-create-wallet',
  templateUrl: './create-wallet.component.html',
  styleUrls: ['./create-wallet.component.scss'],
})
export class CreateWalletComponent implements OnInit {

  form: FormGroup;
  seed: string;
  seedValid: boolean = false;

  constructor(public dialogRef: MdDialogRef<CreateWalletComponent>,
              private walletService: WalletService) {
  }

  ngOnInit() {
    this.initForm();
  }

  closePopup() {
    this.dialogRef.close();
  }

  createWallet() {
    this.walletService.create(this.form.value.label, this.form.value.seed);
    this.dialogRef.close();
  }

  generateSeed() {
    this.form.controls.seed.setValue(Bip39.generateMnemonic());
  }

  private initForm() {
    this.form = new FormGroup({});
    this.form.addControl('label', new FormControl('', [Validators.required]));
    this.form.addControl('seed', new FormControl('', [Validators.required]));
    this.form.addControl('confirm_seed', new FormControl('', [
      Validators.compose([Validators.required, this.validateAreEqual.bind(this)]),
    ]));
    this.form.controls.seed.valueChanges.subscribe(val => {
      this.form.controls.confirm_seed.updateValueAndValidity({ onlySelf: true });
    });
    this.generateSeed();
  }

  private validateAreEqual(fieldControl: FormControl) {
    return fieldControl.value === this.form.get('seed').value ? null : { NotEqual: true };
  }

}
