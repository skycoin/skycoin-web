import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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

  constructor(
    public dialogRef: MdDialogRef<CreateWalletComponent>,
    private walletService: WalletService,
    private formBuilder: FormBuilder,
  ) { }

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
    this.form = this.formBuilder.group({
        label: new FormControl('', Validators.compose([
          Validators.required, Validators.minLength(2),
        ])),
        seed: new FormControl('', Validators.compose([
          Validators.required, Validators.minLength(2),
        ])),
        confirm_seed: new FormControl('',
            Validators.compose([
              Validators.required,
              Validators.minLength(2),
            ]),
        ),
      },
      { validator: this.seedMatchValidator.bind(this) },
    );

    this.generateSeed();
  }

  private seedMatchValidator(g: FormGroup) {
    return g.get('seed').value === g.get('confirm_seed').value
      ? null : { mismatch: true };
  }

}
