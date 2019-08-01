import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-enter-swaplab-id',
  templateUrl: './enter-swaplab-id.component.html',
  styleUrls: ['./enter-swaplab-id.component.scss'],
})
export class EnterSwaplabIdComponent implements OnInit {
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EnterSwaplabIdComponent>,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit() {
    this.initForm();
  }

  closePopup() {
    this.dialogRef.close();
  }

  check() {
    if (!this.form.valid) {
      return;
    }

    this.dialogRef.close(this.form.value.id);
  }

  private initForm() {
    this.form = this.formBuilder.group({
      id: ['', Validators.required],
    });
  }
}
