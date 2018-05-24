import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';

import { PreviewTransaction } from '../../../../app.datatypes';
import { WalletService } from '../../../../services/wallet.service';
import { ButtonComponent } from '../../../layout/button/button.component';

@Component({
  selector: 'app-send-verify',
  templateUrl: './send-verify.component.html',
  styleUrls: ['./send-verify.component.scss'],
})
export class SendVerifyComponent {
  @ViewChild('sendButton') sendButton: ButtonComponent;
  @ViewChild('backButton') backButton: ButtonComponent;
  @Input() transaction: PreviewTransaction;
  @Output() onBack = new EventEmitter<boolean>();

  constructor(
    private walletService: WalletService,
    private snackbar: MatSnackBar
  ) {}

  send() {
    this.snackbar.dismiss();
    this.sendButton.resetState();
    this.sendButton.setLoading();

    this.walletService.injectTransaction(this.transaction.inputs, this.transaction.outputs)
      .subscribe(
        () => this.onSuccess(),
        (error) => this.onError(error)
      );
  }

  back() {
    this.onBack.emit(false);
  }

  private onSuccess() {
    this.sendButton.setSuccess();
    this.walletService.loadBalances();
    this.onBack.emit(true);
  }

  private onError(error) {
    const config = new MatSnackBarConfig();
    config.duration = 300000;
    this.snackbar.open(error.message, null, config);
    this.sendButton.setError(error.message);
  }
}
