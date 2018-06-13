import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Wallet } from '../../../../app.datatypes';
import { WalletService } from '../../../../services/wallet.service';
import { ButtonComponent } from '../../../layout/button/button.component';

@Component({
  selector: 'app-change-name',
  templateUrl: './change-name.component.html',
  styleUrls: ['./change-name.component.scss'],
})
export class ChangeNameComponent implements OnInit {
  @ViewChild('button') button: ButtonComponent;
  form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Wallet,
    public dialogRef: MatDialogRef<ChangeNameComponent>,
    private formBuilder: FormBuilder,
    private walletService: WalletService,
  ) {}

  ngOnInit() {
    this.initForm();
  }

  closePopup() {
    this.dialogRef.close();
  }

  rename() {
    if (!this.form.valid || this.button.isLoading()) {
      return;
    }

    this.button.setLoading();
    this.data.label = this.form.value.label;
    this.walletService.updateWallet(this.data);
    this.dialogRef.close();
  }

  private initForm() {
    this.form = this.formBuilder.group({
      label: [this.data.label, Validators.required],
    });
  }
}
