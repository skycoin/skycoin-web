import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MatInputModule } from '@angular/material';
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
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AppComponent } from './app.component';
import { BackButtonComponent } from './components/layout/back-button/back-button.component';
import { BreadcrumbComponent } from './components/layout/breadcrumb/breadcrumb.component';
import { ButtonComponent } from './components/layout/button/button.component';
import { DoubleButtonComponent } from './components/layout/double-button/double-button.component';
import { HeaderComponent } from './components/layout/header/header.component';
import { NavBarComponent } from './components/layout/header/nav-bar/nav-bar.component';
import { TopBarComponent } from './components/layout/header/top-bar/top-bar.component';
import { ModalComponent } from './components/layout/modal/modal.component';
import { QrCodeComponent } from './components/layout/qr-code/qr-code.component';
import { AddressComponent } from './components/pages/address/address.component';
import { BlockComponent } from './components/pages/block/block.component';
import { AddDepositAddressComponent } from './components/pages/buy/add-deposit-address/add-deposit-address.component';
import { BuyComponent } from './components/pages/buy/buy.component';
import { ExplorerComponent } from './components/pages/explorer/explorer.component';
import { HistoryComponent } from './components/pages/history/history.component';
import {
  OnboardingCreateWalletComponent,
} from './components/pages/onboarding/onboarding-create-wallet/onboarding-create-wallet.component';
import {
  OnboardingDisclaimerComponent,
} from './components/pages/onboarding/onboarding-create-wallet/onboarding-disclaimer/onboarding-disclaimer.component';
import {
  OnboardingSafeguardComponent,
} from './components/pages/onboarding/onboarding-create-wallet/onboarding-safeguard/onboarding-safeguard.component';
import {
  OnboardingEncryptWalletComponent,
} from './components/pages/onboarding/onboarding-encrypt-wallet/onboarding-encrypt-wallet.component';
import { SendSkycoinComponent } from './components/pages/send-skycoin/send-skycoin.component';
import { BackupComponent } from './components/pages/settings/backup/backup.component';
import { BlockchainComponent } from './components/pages/settings/blockchain/blockchain.component';
import { NetworkComponent } from './components/pages/settings/network/network.component';
import { OutputsComponent } from './components/pages/settings/outputs/outputs.component';
import {
  PendingTransactionsComponent,
} from './components/pages/settings/pending-transactions/pending-transactions.component';
import { SettingsComponent } from './components/pages/settings/settings.component';
import {
  TransactionDetailComponent,
} from './components/pages/transaction/transaction-detail/transaction-detail.component';
import { TransactionComponent } from './components/pages/transaction/transaction.component';
import { WalletDetailComponent } from './components/pages/wallets/address-detail/wallet-detail.component';
import { ChangeNameComponent } from './components/pages/wallets/change-name/change-name.component';
import { CreateWalletComponent } from './components/pages/wallets/create-wallet/create-wallet.component';
import { LoadWalletComponent } from './components/pages/wallets/load-wallet/load-wallet.component';
import { UnlockWalletComponent } from './components/pages/wallets/unlock-wallet/unlock-wallet.component';
import { WalletsComponent } from './components/pages/wallets/wallets.component';
import { ClipboardDirective } from './directives/clipboard.directive';
import { DateFromNowPipe } from './pipes/date-from-now.pipe';
import { DateTimePipe } from './pipes/date-time.pipe';
import { SkyPipe } from './pipes/sky.pipe';
import { TellerStatusPipe } from './pipes/teller-status.pipe';
import { TransactionsAmountPipe } from './pipes/transactions-amount.pipe';
import { ApiService } from './services/api.service';
import { BlockchainService } from './services/blockchain.service';
import { ClipboardService } from './services/clipboard.service';
import { NetworkService } from './services/network.service';
import { PriceService } from './services/price.service';
import { PurchaseService } from './services/purchase.service';
import { WalletService } from './services/wallet.service';

const ROUTES = [
  {
    path: '',
    redirectTo: 'wizard',
    pathMatch: 'full',
  },
  {
    path: 'wallets',
    component: WalletsComponent,
    data: {
      breadcrumb: 'Wallets',
    },
  },
  {
    path: 'send',
    component: SendSkycoinComponent,
    data: {
      breadcrumb: 'Send Skycoin',
    },
  },
  {
    path: 'history',
    children: [
      {
        path: '',
        component: HistoryComponent,
        data: {
          breadcrumb: 'History',
        },
      },
      {
        path: ':transaction',
        component: TransactionComponent,
        data: {
          breadcrumb: 'Transaction',
        },
      },
    ],
  },
  {
    path: 'explorer',
    children: [
      {
        path: '',
        component: ExplorerComponent,
        data: {
          breadcrumb: 'Explorer',
        },
      },
      {
        path: 'address/:address',
        component: AddressComponent,
        data: {
          breadcrumb: 'Address',
        },
      },
      {
        path: ':block',
        component: BlockComponent,
        data: {
          breadcrumb: 'Block',
        },
      },
      {
        path: 'transaction/:transaction',
        component: TransactionComponent,
        data: {
          breadcrumb: 'Transaction',
        },
      },
    ],
  },
  {
    path: 'buy',
    component: BuyComponent,
    data: {
      breadcrumb: 'Buy Skycoin',
    },
  },
  {
    path: 'settings',
    children: [
      {
        path: 'backup',
        component: BackupComponent,
        data: {
          breadcrumb: 'Backup',
        },
      },
      {
        path: 'blockchain',
        component: BlockchainComponent,
        data: {
          breadcrumb: 'Blockchain',
        },
      },
      {
        path: 'network',
        component: NetworkComponent,
        data: {
          breadcrumb: 'Networking',
        },
      },
      {
        path: 'outputs',
        component: OutputsComponent,
        data: {
          breadcrumb: 'Outputs',
        },
      },
      {
        path: 'pending-transactions',
        component: PendingTransactionsComponent,
        data: {
          breadcrumb: 'Pending transactions',
        },
      },
    ],
  },
  {
    path: 'wizard',
    children: [
      {
        path: '',
        redirectTo: 'create',
        pathMatch: 'full',
      },
      {
        path: 'create',
        component: OnboardingCreateWalletComponent,
      },
      {
        path: 'encrypt',
        component: OnboardingEncryptWalletComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [
    AppComponent,
    HistoryComponent,
    WalletsComponent,
    WalletDetailComponent,
    CreateWalletComponent,
    LoadWalletComponent,
    SkyPipe,
    SendSkycoinComponent,
    DateFromNowPipe,
    BreadcrumbComponent,
    TransactionComponent,
    BackButtonComponent,
    ExplorerComponent,
    DateTimePipe,
    TransactionsAmountPipe,
    BlockComponent,
    AddressComponent,
    PendingTransactionsComponent,
    OutputsComponent,
    BlockchainComponent,
    BackupComponent,
    NetworkComponent,
    ChangeNameComponent,
    ButtonComponent,
    QrCodeComponent,
    BuyComponent,
    AddDepositAddressComponent,
    TellerStatusPipe,
    UnlockWalletComponent,
    HeaderComponent,
    NavBarComponent,
    TopBarComponent,
    OnboardingCreateWalletComponent,
    OnboardingEncryptWalletComponent,
    OnboardingDisclaimerComponent,
    OnboardingSafeguardComponent,
    DoubleButtonComponent,
    ModalComponent,
    ClipboardDirective,
    TransactionDetailComponent,
    SettingsComponent,
  ],
  entryComponents: [
    AddDepositAddressComponent,
    CreateWalletComponent,
    ChangeNameComponent,
    QrCodeComponent,
    UnlockWalletComponent,
    LoadWalletComponent,
    TransactionDetailComponent,
    OnboardingDisclaimerComponent,
    OnboardingSafeguardComponent,
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
    MatSnackBarModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatCheckboxModule,
    NgxDatatableModule,
    NoopAnimationsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(ROUTES, { useHash: true }),
  ],
  providers: [
    ApiService,
    BlockchainService,
    NetworkService,
    PurchaseService,
    WalletService,
    PriceService,
    ClipboardService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
