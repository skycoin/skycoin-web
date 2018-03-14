import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { WalletService } from '../../../../services/wallet.service';

@Component({
  selector: 'app-load-wallet',
  templateUrl: './load-wallet.component.html',
  styleUrls: ['./load-wallet.component.scss'],
})
export class LoadWalletComponent implements OnInit {

  form: FormGroup;
  seed: string;

  constructor(
    public dialogRef: MatDialogRef<LoadWalletComponent>,
    private walletService: WalletService,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit() {
    this.initForm();
  }

  closePopup() {
    this.dialogRef.close();
  }

  loadWallet() {
    this.walletService.create(this.form.value.label, this.form.value.seed);
    this.dialogRef.close();
  }

  private initForm() {
    this.form = this.formBuilder.group({
        label: new FormControl('', Validators.compose([
          Validators.required, Validators.minLength(2),
        ])),
        seed: new FormControl('', Validators.compose([
          Validators.required, Validators.minLength(2),
        ])),
      });
  }
}
