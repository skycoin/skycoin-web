import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { Renderer2 } from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import { Observable } from 'rxjs/Observable';

import { Wallet } from '../app.datatypes';
import { UnlockWalletComponent } from '../components/pages/wallets/unlock-wallet/unlock-wallet.component';
import { SelectCoinOverlayComponent } from '../components/layout/select-coin-overlay/select-coin-overlay.component';
import { SelectLanguageComponent } from '../components/layout/select-language/select-language.component';

export function openUnlockWalletModal (wallet: Wallet, unlockDialog: MatDialog): MatDialogRef<UnlockWalletComponent, any> {
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
