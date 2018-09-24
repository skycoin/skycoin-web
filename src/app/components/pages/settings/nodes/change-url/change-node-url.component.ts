import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { CoinService } from '../../../../../services/coin.service';

@Component({
  selector: 'app-change-node-url',
  templateUrl: './change-node-url.component.html',
  styleUrls: ['./change-node-url.component.scss'],
})
export class ChangeNodeURLComponent implements OnInit {
  form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: {coinId: number, url: string},
    public dialogRef: MatDialogRef<ChangeNodeURLComponent>,
    private formBuilder: FormBuilder,
    private coinService: CoinService
  ) {}

  ngOnInit() {
    this.initForm();
  }

  closePopup() {
    this.dialogRef.close();
  }

  change() {
    this.coinService.changeNodeUrl(this.data.coinId, this.form.value.url.trim());
    this.closePopup();
  }

  private initForm() {
    this.form = this.formBuilder.group({
      url: [this.data.url],
    });
  }
}
