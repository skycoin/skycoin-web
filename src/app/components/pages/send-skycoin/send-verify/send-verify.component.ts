import { Component, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';

import { PreviewTransaction } from '../../../../app.datatypes';
import { BalanceService } from '../../../../services/wallet/balance.service';
import { SpendingService } from '../../../../services/wallet/spending.service';
import { ButtonComponent } from '../../../layout/button/button.component';
import { parseResponseMessage } from './../../../../utils/errors';

@Component({
  selector: 'app-send-verify',
  templateUrl: './send-verify.component.html',
  styleUrls: ['./send-verify.component.scss'],
})
export class SendVerifyComponent implements OnDestroy {
  @ViewChild('sendButton') sendButton: ButtonComponent;
  @ViewChild('backButton') backButton: ButtonComponent;
  @Input() transaction: PreviewTransaction;
  @Output() onBack = new EventEmitter<boolean>();

  constructor(
    private balanceService: BalanceService,
    private spendingService: SpendingService,
    private snackbar: MatSnackBar
  ) {}

  ngOnDestroy() {
    this.snackbar.dismiss();
  }

  send() {
    this.snackbar.dismiss();
    this.sendButton.resetState();
    this.sendButton.setLoading();
    this.backButton.setDisabled();

    this.spendingService.injectTransaction(this.transaction.encoded)
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
    this.sendButton.setDisabled();

    this.balanceService.startGettingBalances();
    setTimeout(() => this.onBack.emit(true), 3000);
  }

  private onError(error) {
    const errorMessage = error.message ? error.message : parseResponseMessage(error['_body']);
    const config = new MatSnackBarConfig();
    config.duration = 300000;
    this.snackbar.open(errorMessage, null, config);
    this.sendButton.setError(errorMessage);
    this.backButton.setEnabled();
  }
}
