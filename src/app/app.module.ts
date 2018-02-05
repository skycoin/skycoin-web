import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {
  MdButtonModule, MdCardModule, MdCheckboxModule, MdDialogModule, MdExpansionModule, MdGridListModule, MdIconModule,
  MdInputModule, MdListModule, MdMenuModule, MdProgressBarModule,
  MdProgressSpinnerModule,  MdSelectModule, MdSnackBarModule,
  MdTabsModule, MdToolbarModule, MdTooltipModule,
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AppComponent } from './app.component';
import { BackButtonComponent } from './components/layout/back-button/back-button.component';
import { BreadcrumbComponent } from './components/layout/breadcrumb/breadcrumb.component';
import { ButtonComponent } from './components/layout/button/button.component';
import { HeaderComponent } from './components/layout/header/header.component';
import { NavBarComponent } from './components/layout/header/nav-bar/nav-bar.component';
import { TopBarComponent } from './components/layout/header/top-bar/top-bar.component';
import { ModalComponent } from './components/layout/modal/modal.component';
import { ClipboardButtonComponent } from './components/layout/qr-code/clipboard-button/clipboard-button.component';
import { QrCodeComponent } from './components/layout/qr-code/qr-code.component';
import { AddressComponent } from './components/pages/address/address.component';
import { BlockComponent } from './components/pages/block/block.component';
import { AddDepositAddressComponent } from './components/pages/buy/add-deposit-address/add-deposit-address.component';
import { BuyComponent } from './components/pages/buy/buy.component';
import { ExplorerComponent } from './components/pages/explorer/explorer.component';
import { HistoryComponent } from './components/pages/history/history.component';
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
    redirectTo: 'wallets',
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
    ModalComponent,
    ClipboardDirective,
    ClipboardButtonComponent,
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
  ],
  imports: [
    BrowserModule,
    HttpModule,
    MdButtonModule,
    MdCardModule,
    MdDialogModule,
    MdExpansionModule,
    MdGridListModule,
    MdIconModule,
    MdInputModule,
    MdListModule,
    MdMenuModule,
    MdProgressBarModule,
    MdProgressSpinnerModule,
    MdSelectModule,
    MdSnackBarModule,
    MdTabsModule,
    MdToolbarModule,
    MdTooltipModule,
    MdCheckboxModule,
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
