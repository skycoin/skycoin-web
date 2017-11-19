import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WalletService } from '../../../../services/wallet.service';
import { MdDialogRef } from '@angular/material';
import * as Bip39 from 'bip39';

@Component({
  selector: 'app-create-wallet',
  templateUrl: './create-wallet.component.html',
  styleUrls: ['./create-wallet.component.css']
})
export class CreateWalletComponent implements OnInit {

  form: FormGroup;
  seed: string;

  constructor(
    public dialogRef: MdDialogRef<CreateWalletComponent>,
    private formBuilder: FormBuilder,
    private walletService: WalletService,
  ) {}

  ngOnInit() {
    this.initForm();
  }

  createWallet() {
    this.walletService.create(this.form.value.label, this.form.value.seed)
      .subscribe(() => this.dialogRef.close());
  }

  generateSeed() {
    this.form.controls.seed.setValue(Bip39.generateMnemonic());
  }

  private initForm() {
    this.form = this.formBuilder.group({
      label: ['', Validators.required],
      seed: ['', Validators.required],
    });

    this.generateSeed();
  }

}
