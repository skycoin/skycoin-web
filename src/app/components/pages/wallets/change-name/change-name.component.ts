import { Component, Inject, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ISubscription } from 'rxjs/Subscription';
import { TranslateService } from '@ngx-translate/core';

import { Wallet } from '../../../../app.datatypes';
import { WalletService } from '../../../../services/wallet/wallet.service';
import { ButtonComponent } from '../../../layout/button/button.component';
import { MsgBarService } from '../../../../services/msg-bar.service';
import { MessageIcons } from '../../../layout/hardware-wallet/hw-message/hw-message.component';
import { HwWalletService } from '../../../../services/hw-wallet/hw-wallet.service';
import { getHardwareWalletErrorMsg } from '../../../../utils/errors';

enum States {
  Initial,
  WaitingForConfirmation,
}

export class ChangeNameData {
  wallet: Wallet;
  newName: string;
}

export class ChangeNameErrorResponse {
  errorMsg: string;
}

@Component({
  selector: 'app-change-name',
  templateUrl: './change-name.component.html',
  styleUrls: ['./change-name.component.scss'],
})
export class ChangeNameComponent implements OnInit, OnDestroy {
  @ViewChild('button') button: ButtonComponent;
  form: FormGroup;
  currentState: States = States.Initial;
  states = States;
  msgIcons = MessageIcons;
  maxHwWalletLabelLength = HwWalletService.maxLabelLength;
  busy = false;

  private newLabel: string;
  private hwConnectionSubscription: ISubscription;
  private operationSubscription: ISubscription;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: ChangeNameData,
    public dialogRef: MatDialogRef<ChangeNameComponent>,
    private formBuilder: FormBuilder,
    private walletService: WalletService,
    private msgBarService: MsgBarService,
    private hwWalletService: HwWalletService,
    private translateService: TranslateService,
  ) {}

  ngOnInit() {
    if (!this.data.newName) {
      this.form = this.formBuilder.group({
        label: [this.data.wallet.label, Validators.required],
      });
    } else {
      this.finishRenaming(this.data.newName);
    }

    if (this.data.wallet.isHardware) {
      this.hwConnectionSubscription = this.hwWalletService.walletConnectedAsyncEvent.subscribe(connected => {
        if (!connected) {
          this.closePopup();
        }
      });
    }
  }

  ngOnDestroy() {
    this.msgBarService.hide();
    if (this.hwConnectionSubscription) {
      this.hwConnectionSubscription.unsubscribe();
    }
    if (this.operationSubscription) {
      this.operationSubscription.unsubscribe();
    }
  }

  closePopup() {
    this.dialogRef.close();
  }

  rename() {
    if (!this.form.valid || this.busy) {
      return;
    }

    this.msgBarService.hide();
    this.button.setLoading();

    this.finishRenaming(this.form.value.label);
  }

  private finishRenaming(newLabel) {
    this.newLabel = newLabel;

    if (!this.data.wallet.isHardware) {
      this.data.wallet.label = this.newLabel;
      this.walletService.saveWallets();
      this.dialogRef.close(this.newLabel);

      setTimeout(() => this.msgBarService.showDone('common.changes-made'));
    } else {
      if (this.data.newName) {
        this.currentState = States.WaitingForConfirmation;
      }

      this.operationSubscription = this.hwWalletService.checkIfCorrectHwConnected(this.data.wallet.addresses[0].address)
        .flatMap(() => {
          this.currentState = States.WaitingForConfirmation;

          return this.hwWalletService.changeLabel(this.newLabel);
        })
        .subscribe(
          () => {
            this.data.wallet.label = this.newLabel;
            this.walletService.saveWallets();
            this.dialogRef.close(this.newLabel);

            if (!this.data.newName) {
              setTimeout(() => this.msgBarService.showDone('common.changes-made'));
            }
          },
          err => {
            if (this.data.newName) {
              const response = new ChangeNameErrorResponse();
              response.errorMsg = getHardwareWalletErrorMsg(this.translateService, err);
              this.dialogRef.close(response);
            } else {
              this.msgBarService.showError(getHardwareWalletErrorMsg(this.translateService, err));
              this.currentState = States.Initial;
              this.busy = false;
              if (this.button) {
                this.button.resetState();
              }
            }
          },
        );
    }
  }
}
