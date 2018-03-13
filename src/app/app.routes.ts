import { AddressComponent } from './components/pages/address/address.component';
import { SendSkycoinComponent } from './components/pages/send-skycoin/send-skycoin.component';
import { WizardGuardService } from './services/wizard-guard.service';
import { WalletsComponent } from './components/pages/wallets/wallets.component';
import { BlockComponent } from './components/pages/block/block.component';
import { PendingTransactionsComponent } from './components/pages/settings/pending-transactions/pending-transactions.component';
import { OutputsComponent } from './components/pages/settings/outputs/outputs.component';
import { BlockchainComponent } from './components/pages/settings/blockchain/blockchain.component';
import { HistoryComponent } from './components/pages/history/history.component';
import { OnboardingEncryptWalletComponent } from './components/pages/onboarding/onboarding-encrypt-wallet/onboarding-encrypt-wallet.component';
import { ExplorerComponent } from './components/pages/explorer/explorer.component';
import { BuyComponent } from './components/pages/buy/buy.component';
import { OnboardingCreateWalletComponent } from './components/pages/onboarding/onboarding-create-wallet/onboarding-create-wallet.component';
import { TransactionComponent } from './components/pages/transaction/transaction.component';

export const AppRoutes = [
  {
    path: '',
    redirectTo: 'wallets',
    pathMatch: 'full',
  },
  {
    path: 'wallets',
    component: WalletsComponent,
    canActivate: [WizardGuardService],
  },
  {
    path: 'send',
    component: SendSkycoinComponent,
    canActivate: [WizardGuardService],
  },
  {
    path: 'history',
    children: [
      {
        path: '',
        component: HistoryComponent,
      },
      {
        path: ':transaction',
        component: TransactionComponent,
      },
    ],
    canActivate: [WizardGuardService],
  },
  {
    path: 'explorer',
    children: [
      {
        path: '',
        component: ExplorerComponent,
      },
      {
        path: 'address/:address',
        component: AddressComponent,
      },
      {
        path: ':block',
        component: BlockComponent,
      },
      {
        path: 'transaction/:transaction',
        component: TransactionComponent,
      },
    ],
    canActivate: [WizardGuardService],
  },
  {
    path: 'buy',
    component: BuyComponent,
    canActivate: [WizardGuardService],
  },
  {
    path: 'settings',
    children: [
      {
        path: 'blockchain',
        component: BlockchainComponent,
      },
      {
        path: 'outputs',
        component: OutputsComponent,
      },
      {
        path: 'pending-transactions',
        component: PendingTransactionsComponent,
      },
    ],
    canActivate: [WizardGuardService],
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
