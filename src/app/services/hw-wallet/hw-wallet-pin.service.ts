import { Injectable } from '@angular/core';
import { MatDialogConfig } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { HwPinDialogParams } from '../../components/layout/hardware-wallet/hw-pin-dialog/hw-pin-dialog.component';
import { CustomMatDialogService } from '../custom-mat-dialog.service';

export enum ChangePinStates {
  RequestingCurrentPin,
  RequestingNewPin,
  ConfirmingNewPin,
}

@Injectable()
export class HwWalletPinService {

  // Set on AppComponent to avoid a circular reference.
  private requestPinComponentInternal;
  set requestPinComponent(value) {
    this.requestPinComponentInternal = value;
  }

  // Values to be sent to HwPinDialogComponent
  changingPin: boolean;
  signingTx: boolean;
  changePinState: ChangePinStates;

  constructor(
    private dialog: CustomMatDialogService,
  ) {}

  resetValues() {
    this.changingPin = false;
    this.signingTx = false;
  }

  requestPin(): Observable<string> {
    return this.dialog.open(this.requestPinComponentInternal, <MatDialogConfig> {
      width: '350px',
      autoFocus: false,
      data : <HwPinDialogParams> {
        changingPin: this.changingPin,
        changePinState: this.changePinState,
        signingTx: this.signingTx,
      },
    }).afterClosed().map(pin => {
      if (this.changingPin) {
        if (this.changePinState === ChangePinStates.RequestingCurrentPin) {
          this.changePinState = ChangePinStates.RequestingNewPin;
        } else if (this.changePinState === ChangePinStates.RequestingNewPin) {
          this.changePinState = ChangePinStates.ConfirmingNewPin;
        }
      }

      return pin;
    });
  }
}
