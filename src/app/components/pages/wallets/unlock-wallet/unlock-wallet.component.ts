import { Component, Inject, OnInit } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { Wallet } from '../../../../app.datatypes';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WalletService } from '../../../../services/wallet.service';

@Component({
  selector: 'app-unlock-wallet',
  templateUrl: './unlock-wallet.component.html',
  styleUrls: ['./unlock-wallet.component.css']
})
export class UnlockWalletComponent implements OnInit {

  form: FormGroup;

  constructor(
    @Inject(MD_DIALOG_DATA) private data: Wallet,
    public dialogRef: MdDialogRef<UnlockWalletComponent>,
    private formBuilder: FormBuilder,
    private walletService: WalletService,
  ) {}

  ngOnInit() {
    this.initForm();
  }

  unlock() {
    this.walletService.unlockWallet(this.data, this.form.value.seed);
    this.dialogRef.close();
  }

  private initForm() {
    this.form = this.formBuilder.group({
      seed: [this.data.seed, Validators.required],
    });
  }
}
