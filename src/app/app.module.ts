import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {
  MdButtonModule, MdCardModule, MdDialogModule, MdExpansionModule, MdGridListModule, MdIconModule, MdInputModule,
  MdListModule, MdMenuModule, MdProgressBarModule, MdProgressSpinnerModule,
  MdSelectModule, MdSnackBarModule, MdTabsModule, MdToolbarModule, MdTooltipModule
} from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {DashboardModule} from './modules/dashboard/dashboard.module';
import {SharedModule} from "./modules/shared/shared.module";


const ROUTES = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  { path: 'dashboard', loadChildren: 'app/modules/dashboard/dashboard.module#DashboardModule' },
  // {
  //   path: 'wallets',
  //   component: WalletsComponent,
  //   data: {
  //     breadcrumb: 'Wallets',
  //   },
  // },
  // {
  //   path: 'send',
  //   component: SendSkycoinComponent,
  //   data: {
  //     breadcrumb: 'Send Skycoin',
  //   },
  // },
  // {
  //   path: 'history',
  //   children: [
  //     {
  //       path: '',
  //       component: HistoryComponent,
  //       data: {
  //         breadcrumb: 'History',
  //       },
  //     },
  //     {
  //       path: ':transaction',
  //       component: TransactionComponent,
  //       data: {
  //         breadcrumb: 'Transaction',
  //       },
  //     },
  //   ],
  // },
  // {
  //   path: 'explorer',
  //   children: [
  //     {
  //       path: '',
  //       component: ExplorerComponent,
  //       data: {
  //         breadcrumb: 'Explorer',
  //       },
  //     },
  //     {
  //       path: 'address/:address',
  //       component: AddressComponent,
  //       data: {
  //         breadcrumb: 'Address',
  //       },
  //     },
  //     {
  //       path: ':block',
  //       component: BlockComponent,
  //       data: {
  //         breadcrumb: 'Block',
  //       },
  //     },
  //     {
  //       path: 'transaction/:transaction',
  //       component: TransactionComponent,
  //       data: {
  //         breadcrumb: 'Transaction',
  //       },
  //     },
  //   ],
  // },
  // {
  //   path: 'buy',
  //   component: BuyComponent,
  //   data: {
  //     breadcrumb: 'Buy Skycoin',
  //   },
  // },
  // {
  //   path: 'settings',
  //   children: [
  //     {
  //       path: 'backup',
  //       component: BackupComponent,
  //       data: {
  //         breadcrumb: 'Backup',
  //       },
  //     },
  //     {
  //       path: 'blockchain',
  //       component: BlockchainComponent,
  //       data: {
  //         breadcrumb: 'Blockchain',
  //       },
  //     },
  //     {
  //       path: 'network',
  //       component: NetworkComponent,
  //       data: {
  //         breadcrumb: 'Networking',
  //       },
  //     },
  //     {
  //       path: 'outputs',
  //       component: OutputsComponent,
  //       data: {
  //         breadcrumb: 'Outputs',
  //       },
  //     },
  //     {
  //       path: 'pending-transactions',
  //       component: PendingTransactionsComponent,
  //       data: {
  //         breadcrumb: 'Pending transactions',
  //       },
  //     },
  //   ],
  // },
];

@NgModule({
  declarations: [
    AppComponent,
  ],
  entryComponents: [
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
    NgxDatatableModule,
    NoopAnimationsModule,
    ReactiveFormsModule,
    SharedModule,
    DashboardModule,
    RouterModule.forRoot(ROUTES, { useHash: true }),
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
