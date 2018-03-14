import { Component } from '@angular/core';
import 'rxjs/add/operator/takeWhile';
import { config } from './app.config';
import { WalletService } from './services/wallet.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  current: number;
  highest: number;
  otcEnabled: boolean;
  version: string;

  constructor(
    public walletService: WalletService,
  ) {
    this.otcEnabled = config.otcEnabled;
  }

  loading() {
    return !this.current || !this.highest || this.current !== this.highest;
  }
}
