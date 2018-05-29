import { Component, EventEmitter, Input, Output, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent {
  @Input() text: string;
  @Input() headerText = 'Confirmation';
  @Input() confirmButtonText = 'Yes';
  @Input() cancelButtonText = 'No';

  constructor(
    public dialogRef: MatDialogRef<ConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  closeModal(isConfirmed: boolean) {
    this.dialogRef.close(isConfirmed);
  }
}
