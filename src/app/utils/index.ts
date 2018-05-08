import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';

import { Wallet } from '../app.datatypes';
import { UnlockWalletComponent } from '../components/pages/wallets/unlock-wallet/unlock-wallet.component';

export function openUnlockWalletModal (wallet: Wallet, unlockDialog: MatDialog): MatDialogRef<UnlockWalletComponent, any> {
  const config = new MatDialogConfig();
  config.width = '500px';
  config.data = wallet;

  return unlockDialog.open(UnlockWalletComponent, config);
}
