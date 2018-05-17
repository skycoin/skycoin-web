import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { WalletService } from '../../../../services/wallet.service';
import { QrCodeComponent } from '../../../layout/qr-code/qr-code.component';
import { Wallet } from '../../../../app.datatypes';

@Component({
  selector: 'app-outputs',
  templateUrl: './outputs.component.html',
  styleUrls: ['./outputs.component.scss']
})
export class OutputsComponent implements OnInit {

  wallets: Wallet[];

  constructor(
    private walletService: WalletService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.walletService.outputsWithWallets().subscribe(wallets => this.wallets = wallets);
  }

  showQr(address) {
    const config = new MatDialogConfig();
    config.data = address;
    this.dialog.open(QrCodeComponent, config);
  }
}
