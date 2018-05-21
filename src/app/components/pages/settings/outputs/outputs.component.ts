import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Params } from '@angular/router';

import { WalletService } from '../../../../services/wallet.service';
import { QrCodeComponent } from '../../../layout/qr-code/qr-code.component';
import { Address, Wallet } from '../../../../app.datatypes';
import { copyAddress } from '../../../../utils/index';

@Component({
  selector: 'app-outputs',
  templateUrl: './outputs.component.html',
  styleUrls: ['./outputs.component.scss']
})
export class OutputsComponent implements OnInit {

  wallets: Wallet[];

  constructor(
    private route: ActivatedRoute,
    private walletService: WalletService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => this.getWalletsOutputs(params));
  }

  showQr(address) {
    const config = new MatDialogConfig();
    config.data = address;
    this.dialog.open(QrCodeComponent, config);
  }

  onCopyAddress(address: Address) {
    copyAddress(address);
  }

  private getWalletsOutputs(queryParams: Params) {
    const address = queryParams['addr'];

    this.walletService.outputsWithWallets().subscribe(wallets => {
      if (address) {
        const filteredWallets: Wallet[]  = wallets.filter(wallet => {
          return wallet.addresses.find((addr) => {
            return addr.address === address;
          });
        }).map(wallet => {
          return Object.assign({}, wallet);
        });

        this.wallets = filteredWallets.map(wallet => {
          wallet.addresses = wallet.addresses.filter(addr => addr.address === address);
          return wallet;
        });
      } else {
        this.wallets = wallets;
      }
    });
  }
}
