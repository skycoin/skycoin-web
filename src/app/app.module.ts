import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatSliderModule, MatInputModule, MatAutocompleteModule } from '@angular/material';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { ButtonComponent } from './components/layout/button/button.component';
import { DoubleButtonComponent } from './components/layout/double-button/double-button.component';
import { HeaderComponent } from './components/layout/header/header.component';
import { NavBarComponent } from './components/layout/header/nav-bar/nav-bar.component';
import { TopBarComponent } from './components/layout/header/top-bar/top-bar.component';
import { ModalComponent } from './components/layout/modal/modal.component';
import { QrCodeComponent } from './components/layout/qr-code/qr-code.component';
import { AddDepositAddressComponent } from './components/pages/buy/add-deposit-address/add-deposit-address.component';
import { BuyComponent } from './components/pages/buy/buy.component';
import { HistoryComponent } from './components/pages/history/history.component';
import { OnboardingCreateWalletComponent } from './components/pages/onboarding/onboarding-create-wallet/onboarding-create-wallet.component';
import { OnboardingEncryptWalletComponent } from './components/pages/onboarding/onboarding-encrypt-wallet/onboarding-encrypt-wallet.component';
import { SendSkycoinComponent } from './components/pages/send-skycoin/send-skycoin.component';
import { BlockchainComponent } from './components/pages/settings/blockchain/blockchain.component';
import { OutputsComponent } from './components/pages/settings/outputs/outputs.component';
import { PendingTransactionsComponent } from './components/pages/settings/pending-transactions/pending-transactions.component';
import { TransactionDetailComponent } from './components/pages/history/transaction-detail/transaction-detail.component';
import { WalletDetailComponent } from './components/pages/wallets/wallet-detail/wallet-detail.component';
import { ChangeNameComponent } from './components/pages/wallets/change-name/change-name.component';
import { CreateWalletComponent } from './components/pages/wallets/create-wallet/create-wallet.component';
import { UnlockWalletComponent } from './components/pages/wallets/unlock-wallet/unlock-wallet.component';
import { WalletsComponent } from './components/pages/wallets/wallets.component';
import { ClipboardDirective } from './directives/clipboard.directive';
import { DateTimePipe } from './pipes/date-time.pipe';
import { TellerStatusPipe } from './pipes/teller-status.pipe';
import { ApiService } from './services/api.service';
import { BlockchainService } from './services/blockchain.service';
import { ClipboardService } from './services/clipboard.service';
import { PriceService } from './services/price.service';
import { PurchaseService } from './services/purchase.service';
import { WizardGuardService } from './services/wizard-guard.service';
import { AppRoutes } from './app.routes';
import { CipherProvider } from './services/cipher.provider';
import { NumberFieldDirective } from './directives/number-field.directive';
import { AppTranslateLoader } from './app.translate-loader';
import { SendFormComponent } from './components/pages/send-skycoin/send-form/send-form.component';
import { SendVerifyComponent } from './components/pages/send-skycoin/send-verify/send-verify.component';
import { TransactionInfoComponent } from './components/pages/send-skycoin/send-verify/transaction-info/transaction-info.component';
import { ConfirmationComponent } from './components/layout/confirmation/confirmation.component';
import { DisclaimerWarningComponent } from './components/layout/disclaimer-warning/disclaimer-warning.component';
import { NavBarService } from './services/nav-bar.service';
import { CoinService } from './services/coin.service';
import { LoadingContentComponent } from './components/layout/loading-content/loading-content.component';
import { SelectCoinComponent } from './components/layout/select-coin/select-coin.component';
import { LanguageService } from './services/language.service';
import { SelectCoinOverlayComponent } from './components/layout/select-coin-overlay/select-coin-overlay.component';
import { SelectLanguageComponent } from './components/layout/select-language/select-language.component';
import { WalletService } from './services/wallet/wallet.service';
import { BalanceService } from './services/wallet/balance.service';
import { HistoryService } from './services/wallet/history.service';
import { SpendingService } from './services/wallet/spending.service';
import { CreateWalletFormComponent } from './components/pages/wallets/create-wallet/create-wallet-form/create-wallet-form.component';
import { ScanAddressesComponent } from './components/pages/wallets/scan-addresses/scan-addresses.component';
import { NodesComponent } from './components/pages/settings/nodes/nodes.component';
import { ChangeNodeURLComponent } from './components/pages/settings/nodes/change-url/change-node-url.component';
import { GlobalsService } from './services/globals.service';
import { WalletOptionsComponent } from './components/pages/wallets/wallet-detail/wallet-options/wallet-options.component';
import { CustomMatDialogService } from './services/custom-mat-dialog.service';
import { Bip39WordListService } from './services/bip39-word-list.service';
import { SendFormAdvancedComponent } from './components/pages/send-skycoin/send-form-advanced/send-form-advanced.component';
import { SelectAddressComponent } from './components/pages/send-skycoin/send-form-advanced/select-address/select-address';
import { MsgBarService } from './services/msg-bar.service';
import { MsgBarComponent } from './components/layout/msg-bar/msg-bar.component';
import { HwOptionsDialogComponent } from './components/layout/hardware-wallet/hw-options-dialog/hw-options-dialog.component';
import { HwWipeDialogComponent } from './components/layout/hardware-wallet/hw-wipe-dialog/hw-wipe-dialog.component';
import { HwAddedDialogComponent } from './components/layout/hardware-wallet/hw-added-dialog/hw-added-dialog.component';
import { HwGenerateSeedDialogComponent } from './components/layout/hardware-wallet/hw-generate-seed-dialog/hw-generate-seed-dialog.component';
import { HwBackupDialogComponent } from './components/layout/hardware-wallet/hw-backup-dialog/hw-backup-dialog.component';
import { HwMessageComponent } from './components/layout/hardware-wallet/hw-message/hw-message.component';
import { HwPinDialogComponent } from './components/layout/hardware-wallet/hw-pin-dialog/hw-pin-dialog.component';
import { HwChangePinDialogComponent } from './components/layout/hardware-wallet/hw-change-pin-dialog/hw-change-pin-dialog.component';
import { HwPinHelpDialogComponent } from './components/layout/hardware-wallet/hw-pin-help-dialog/hw-pin-help-dialog.component';
import { HwRestoreSeedDialogComponent } from './components/layout/hardware-wallet/hw-restore-seed-dialog/hw-restore-seed-dialog.component';
import { HwDialogBaseComponent } from './components/layout/hardware-wallet/hw-dialog-base.component';
import { HwConfirmTxDialogComponent } from './components/layout/hardware-wallet/hw-confirm-tx-dialog/hw-confirm-tx-dialog.component';
import { HwConfirmAddressDialogComponent } from './components/layout/hardware-wallet/hw-confirm-address-dialog/hw-confirm-address-dialog.component';
import { HwRemovePinDialogComponent } from './components/layout/hardware-wallet/hw-remove-pin-dialog/hw-remove-pin-dialog.component';
import { HwUpdateFirmwareDialogComponent } from './components/layout/hardware-wallet/hw-update-firmware-dialog/hw-update-firmware-dialog.component';
import { HwUpdateAlertDialogComponent } from './components/layout/hardware-wallet/hw-update-alert-dialog/hw-update-alert-dialog.component';
import { HwWalletService } from './services/hw-wallet/hw-wallet.service';
import { HwWalletDaemonService } from './services/hw-wallet/hw-wallet-daemon.service';
import { HwWalletPinService } from './services/hw-wallet/hw-wallet-pin.service';
import { HwWalletSeedWordService } from './services/hw-wallet/hw-wallet-seed-word.service';
import { SeedWordDialogComponent } from './components/layout/seed-word-dialog/seed-word-dialog.component';

@NgModule({
  declarations: [
    AddDepositAddressComponent,
    AppComponent,
    BlockchainComponent,
    ButtonComponent,
    BuyComponent,
    ChangeNameComponent,
    ClipboardDirective,
    NumberFieldDirective,
    CreateWalletComponent,
    DateTimePipe,
    DoubleButtonComponent,
    HeaderComponent,
    HistoryComponent,
    ModalComponent,
    NavBarComponent,
    OutputsComponent,
    OnboardingCreateWalletComponent,
    OnboardingEncryptWalletComponent,
    PendingTransactionsComponent,
    QrCodeComponent,
    SendSkycoinComponent,
    TellerStatusPipe,
    TopBarComponent,
    TransactionDetailComponent,
    UnlockWalletComponent,
    WalletsComponent,
    WalletDetailComponent,
    SendFormComponent,
    SendVerifyComponent,
    TransactionInfoComponent,
    ConfirmationComponent,
    DisclaimerWarningComponent,
    LoadingContentComponent,
    SelectCoinComponent,
    SelectCoinOverlayComponent,
    SelectLanguageComponent,
    CreateWalletFormComponent,
    ScanAddressesComponent,
    NodesComponent,
    ChangeNodeURLComponent,
    WalletOptionsComponent,
    SendFormAdvancedComponent,
    SelectAddressComponent,
    MsgBarComponent,
    HwOptionsDialogComponent,
    HwWipeDialogComponent,
    HwAddedDialogComponent,
    HwGenerateSeedDialogComponent,
    HwBackupDialogComponent,
    HwMessageComponent,
    HwPinDialogComponent,
    HwChangePinDialogComponent,
    HwPinHelpDialogComponent,
    HwRestoreSeedDialogComponent,
    HwDialogBaseComponent,
    HwConfirmTxDialogComponent,
    HwConfirmAddressDialogComponent,
    HwRemovePinDialogComponent,
    HwUpdateFirmwareDialogComponent,
    HwUpdateAlertDialogComponent,
    SeedWordDialogComponent,
  ],
  entryComponents: [
    AddDepositAddressComponent,
    CreateWalletComponent,
    ChangeNameComponent,
    QrCodeComponent,
    UnlockWalletComponent,
    TransactionDetailComponent,
    ConfirmationComponent,
    SelectCoinOverlayComponent,
    SelectLanguageComponent,
    ScanAddressesComponent,
    ChangeNodeURLComponent,
    WalletOptionsComponent,
    SelectAddressComponent,
    HwOptionsDialogComponent,
    HwWipeDialogComponent,
    HwAddedDialogComponent,
    HwGenerateSeedDialogComponent,
    HwBackupDialogComponent,
    HwMessageComponent,
    HwPinDialogComponent,
    HwChangePinDialogComponent,
    HwPinHelpDialogComponent,
    HwRestoreSeedDialogComponent,
    HwDialogBaseComponent,
    HwConfirmTxDialogComponent,
    HwConfirmAddressDialogComponent,
    HwRemovePinDialogComponent,
    HwUpdateFirmwareDialogComponent,
    HwUpdateAlertDialogComponent,
    SeedWordDialogComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatSliderModule,
    NoopAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forRoot(AppRoutes, { useHash: true }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: AppTranslateLoader,
      },
    }),
  ],
  providers: [
    ApiService,
    BlockchainService,
    PurchaseService,
    PriceService,
    ClipboardService,
    WizardGuardService,
    CipherProvider,
    NavBarService,
    CoinService,
    LanguageService,
    WalletService,
    BalanceService,
    HistoryService,
    SpendingService,
    GlobalsService,
    CustomMatDialogService,
    Bip39WordListService,
    MsgBarService,
    HwWalletService,
    HwWalletDaemonService,
    HwWalletPinService,
    HwWalletSeedWordService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
