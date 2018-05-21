import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';

import { Wallet } from '../app.datatypes';
import { UnlockWalletComponent } from '../components/pages/wallets/unlock-wallet/unlock-wallet.component';

export function openUnlockWalletModal (wallet: Wallet, unlockDialog: MatDialog): MatDialogRef<UnlockWalletComponent, any> {
  const config = new MatDialogConfig();
  config.width = '500px';
  config.data = wallet;

  return unlockDialog.open(UnlockWalletComponent, config);
}

export function copyAddress(address) {
  const selBox = document.createElement('textarea');

  selBox.style.position = 'fixed';
  selBox.style.left = '0';
  selBox.style.top = '0';
  selBox.style.opacity = '0';
  selBox.value = address.address;

  document.body.appendChild(selBox);
  selBox.focus();
  selBox.select();

  document.execCommand('copy');
  document.body.removeChild(selBox);

  address.isCopying = true;

  // wait for a while and then remove the 'copying' class
  setTimeout(() => {
    address.isCopying = false;
  }, 500);
}
