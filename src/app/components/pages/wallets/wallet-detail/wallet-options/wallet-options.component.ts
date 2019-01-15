import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

export enum WalletOptionsResponses {
  AddNewAddress,
  EditWallet,
  DeleteWallet,
}

@Component({
  selector: 'app-wallet-options',
  templateUrl: './wallet-options.component.html',
  styleUrls: ['./wallet-options.component.scss'],
})
export class WalletOptionsComponent {

  constructor(
    public dialogRef: MatDialogRef<WalletOptionsComponent>
  ) { }

  onAddNewAddress() {
    this.closePopup(WalletOptionsResponses.AddNewAddress);
  }

  onEditWallet() {
    this.closePopup(WalletOptionsResponses.EditWallet);
  }

  onDeleteWallet() {
    this.closePopup(WalletOptionsResponses.DeleteWallet);
  }

  closePopup(response: WalletOptionsResponses = null) {
    this.dialogRef.close(response);
  }
}
