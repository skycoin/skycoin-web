import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { Renderer2 } from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import { Observable } from 'rxjs/Observable';
import { TranslateService } from '@ngx-translate/core';

import { Wallet, ConfirmationData } from '../app.datatypes';
import { UnlockWalletComponent, ComfirmSeedParams } from '../components/pages/wallets/unlock-wallet/unlock-wallet.component';
import { SelectCoinOverlayComponent } from '../components/layout/select-coin-overlay/select-coin-overlay.component';
import { SelectLanguageComponent } from '../components/layout/select-language/select-language.component';
import { QrCodeComponent } from '../components/layout/qr-code/qr-code.component';
import { ConfirmationComponent } from '../components/layout/confirmation/confirmation.component';
import { BlockchainService, ProgressStates } from '../services/blockchain.service';
import { ScanAddressesComponent } from '../components/pages/wallets/scan-addresses/scan-addresses.component';
import { WalletService } from '../services/wallet/wallet.service';

export function openUnlockWalletModal (wallet: Wallet | ComfirmSeedParams, unlockDialog: MatDialog): MatDialogRef<UnlockWalletComponent, any> {
  const config = new MatDialogConfig();
  config.width = '500px';
  config.data = wallet;

  return unlockDialog.open(UnlockWalletComponent, config);
}

export function openChangeCoinModal (dialog: MatDialog, renderer: Renderer2, overlay: Overlay) {
  renderer.addClass(document.body, 'no-overflow');

  const config = new MatDialogConfig();
  config.maxWidth = '100%';
  config.width = '100%';
  config.height = '100%';
  config.scrollStrategy = overlay.scrollStrategies.noop();
  config.disableClose = true;
  config.panelClass = 'transparent-background-dialog';
  config.backdropClass = 'clear-dialog-background';

  return dialog.open(SelectCoinOverlayComponent, config).afterClosed()
    .map(response => {
      renderer.removeClass(document.body, 'no-overflow');
      return response;
    });
}

export function openChangeLanguageModal (dialog: MatDialog, disableClose = false): Observable<any> {
  const config = new MatDialogConfig();
  config.width = '600px';
  config.disableClose = disableClose;
  config.autoFocus = false;

  return dialog.open(SelectLanguageComponent, config).afterClosed();
}

export function openQrModal (dialog: MatDialog, address: string) {
  const config = new MatDialogConfig();
  config.data = address;
  dialog.open(QrCodeComponent, config);
}

export function showConfirmationModal(dialog: MatDialog, confirmationData: ConfirmationData): MatDialogRef<ConfirmationComponent, any> {
  return dialog.open(ConfirmationComponent, <MatDialogConfig>{
    width: '450px',
    data: confirmationData,
    autoFocus: false
  });
}

export function openDeleteWalletModal (dialog: MatDialog, wallet: Wallet, translateService: TranslateService, walletService: WalletService) {
  const mainText = translateService.instant('wallet.delete-confirmation1') + ' \"' +
    wallet.label + '\" ' +
    translateService.instant('wallet.delete-confirmation2');

  const confirmationData: ConfirmationData = {
    text: mainText,
    headerText: 'confirmation.header-text',
    checkboxText: 'wallet.delete-confirmation-check',
    confirmButtonText: 'confirmation.confirm-button',
    cancelButtonText: 'confirmation.cancel-button'
  };

  showConfirmationModal(dialog, confirmationData).afterClosed().subscribe(result => {
    if (result) {
      walletService.delete(wallet);
    }
  });
}

export function scanAddresses(dialog: MatDialog, wallet: Wallet, blockchainService: BlockchainService, translate: TranslateService): Observable<any> {
  return blockchainService.progress
    .filter(event => event.state === ProgressStates.Progress || event.state === ProgressStates.Error)
    .first()
    .flatMap(event => {
      if (event.state === ProgressStates.Error) {
        return Observable.throw(new Error(translate.instant('wallet.scan.connection-error')));
      }
      if (event.highestBlock - event.currentBlock > 2) {
        return Observable.throw(new Error(translate.instant('wallet.scan.unsynchronized-node-error')));
      }

      return dialog.open(ScanAddressesComponent, <MatDialogConfig>{
        width: '450px',
        data: wallet,
        autoFocus: false
      }).afterClosed();
    });
}
