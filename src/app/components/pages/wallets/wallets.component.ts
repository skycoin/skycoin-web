import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Subscription, ISubscription } from 'rxjs/Subscription';
import { TranslateService } from '@ngx-translate/core';

import { Wallet, ConfirmationData } from '../../../app.datatypes';
import { WalletService } from '../../../services/wallet/wallet.service';
import { CreateWalletComponent } from './create-wallet/create-wallet.component';
import { openUnlockWalletModal, openDeleteWalletModal, showConfirmationModal } from '../../../utils/index';
import { CoinService } from '../../../services/coin.service';
import { BaseCoin } from '../../../coins/basecoin';
import { CustomMatDialogService } from '../../../services/custom-mat-dialog.service';
import { environment } from '../../../../environments/environment';
import { HwOptionsDialogComponent } from '../../layout/hardware-wallet/hw-options-dialog/hw-options-dialog.component';
import { HwWalletService } from '../../../services/hw-wallet/hw-wallet.service';

@Component({
  selector: 'app-wallets',
  templateUrl: './wallets.component.html',
  styleUrls: ['./wallets.component.scss'],
})
export class WalletsComponent implements OnInit, OnDestroy {

  hwCompatibilityActivated = false;

  wallets: Wallet[];
  hardwareWallets: Wallet[] = [];
  currentCoin: BaseCoin;
  showLockIcons: boolean;

  private subscriptionsGroup: ISubscription[] = [];
  private confirmSeedSubscription: Subscription;
  private deleteWalletSubscription: Subscription;
  private hwOptionsWindow: MatDialogRef<HwOptionsDialogComponent, any>;

  constructor(
    private walletService: WalletService,
    private hwWalletService: HwWalletService,
    private dialog: CustomMatDialogService,
    private coinService: CoinService,
    private translateService: TranslateService
  ) {
    this.hwCompatibilityActivated = this.hwWalletService.hwWalletCompatibilityActivated;
    this.showLockIcons = !environment.production;
  }

  ngOnInit() {
    if (this.hwWalletService.showOptionsWhenPossible) {
      setTimeout(() => {
        this.hwWalletService.showOptionsWhenPossible = false;
        this.adminHwWallet();
      });
    }

    this.subscriptionsGroup.push(this.walletService.currentWallets.subscribe(wallets => {
      this.wallets = [];
      this.hardwareWallets = [];
      wallets.forEach(value => {
        if (!value.isHardware) {
          this.wallets.push(value);
        } else {
          this.hardwareWallets.push(value);
        }
      });
    }));

    this.subscriptionsGroup.push(this.coinService.currentCoin
      .subscribe((coin: BaseCoin) => this.currentCoin = coin)
    );
  }

  ngOnDestroy() {
    this.subscriptionsGroup.forEach(sub => sub.unsubscribe());
    this.removeConfirmationSuscriptions();
    if (this.hwOptionsWindow) {
      this.hwOptionsWindow.close();
    }
  }

  addWallet(create: boolean) {
    const config = new MatDialogConfig();
    config.width = '566px';
    config.data = { create };
    config.autoFocus = false;
    this.dialog.open(CreateWalletComponent, config);
  }

  unlockWallet(event, wallet: Wallet) {
    if (!wallet.needSeedConfirmation) {
      event.stopPropagation();
      openUnlockWalletModal(wallet, this.dialog);
    }
  }

  adminHwWallet() {
    const config = new MatDialogConfig();
    config.width = '566px';
    config.autoFocus = false;
    this.hwOptionsWindow = this.dialog.open(HwOptionsDialogComponent, config);
  }

  toggleWallet(wallet: Wallet) {
    if (wallet.isHardware && wallet.hasHwSecurityWarnings && !wallet.stopShowingHwSecurityPopup && !wallet.opened) {
      const confirmationData: ConfirmationData = {
        headerText: 'hardware-wallet.security-warning.title',
        text: 'hardware-wallet.security-warning.text',
        checkboxText: 'hardware-wallet.security-warning.check',
        confirmButtonText: 'hardware-wallet.security-warning.continue',
        cancelButtonText: 'hardware-wallet.security-warning.cancel',
        linkText: 'hardware-wallet.security-warning.link',
        linkFunction: this.adminHwWallet.bind(this),
      };

      showConfirmationModal(this.dialog, confirmationData).afterClosed().subscribe(confirmationResult => {
        if (confirmationResult) {
          wallet.stopShowingHwSecurityPopup = true;
          this.walletService.saveWallets();
          wallet.opened = true;
        }
      });
    } else {
      if (wallet.needSeedConfirmation) {
        this.removeConfirmationSuscriptions();

        const unlockDialog = openUnlockWalletModal({wallet: wallet}, this.dialog, false).componentInstance;

        this.confirmSeedSubscription = unlockDialog.onWalletUnlocked.first().subscribe(() => {
          wallet.needSeedConfirmation = false;
          this.walletService.saveWallets();
          wallet.opened ? wallet.opened = false : wallet.opened = true;
        });

        this.deleteWalletSubscription = unlockDialog.onDeleteClicked.first().subscribe(() => {
          openDeleteWalletModal(this.dialog, wallet, this.translateService, this.walletService);
        });
      } else {
        wallet.opened ? wallet.opened = false : wallet.opened = true;
      }
    }
  }

  private removeConfirmationSuscriptions() {
    if (this.confirmSeedSubscription) {
      this.confirmSeedSubscription.unsubscribe();
    }
    if (this.deleteWalletSubscription) {
      this.deleteWalletSubscription.unsubscribe();
    }
  }
}
