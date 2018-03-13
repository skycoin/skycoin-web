import { Component, OnInit } from '@angular/core';
import { WalletService } from '../../../../services/wallet.service';
import { QrCodeComponent } from '../../../layout/qr-code/qr-code.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Component({
  selector: 'app-outputs',
  templateUrl: './outputs.component.html',
  styleUrls: ['./outputs.component.scss']
})
export class OutputsComponent implements OnInit {

  outputs: any[];

  constructor(
    public walletService: WalletService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.walletService.outputs().subscribe(outputs => this.outputs = outputs);
  }

  showQr(address) {
    const config = new MatDialogConfig();
    config.data = address;
    this.dialog.open(QrCodeComponent, config);
  }
}
