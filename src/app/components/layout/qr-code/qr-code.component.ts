import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CoinService } from '../../../services/coin.service';

declare var QRCode: any;

@Component({
  selector: 'app-qr-code',
  templateUrl: './qr-code.component.html',
  styleUrls: ['./qr-code.component.scss'],
})
export class QrCodeComponent implements OnInit, AfterViewInit {
  @ViewChild('qr') qr: ElementRef;
  @ViewChild('btnImg') btnImg: ElementRef;
  address: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<QrCodeComponent>,
    private coinService: CoinService
  ) { }

  ngOnInit() {
    this.address = this.data.address ? this.data.address : this.data;

    const qrcode = new QRCode(this.qr.nativeElement, {
      text: this.coinService.currentCoin.value.coinName.toLowerCase() + ':' + this.address,
      width: 300,
      height: 300,
      colorDark: '#000000',
      colorLight: '#ffffff',
      useSVG: false,
      correctLevel: QRCode.CorrectLevel['M'],
    });
  }

  ngAfterViewInit() {
    this.btnImg.nativeElement.src = 'assets/img/copy-qr.png';
  }

  onCopySuccess() {
    this.btnImg.nativeElement.src = 'assets/img/copy-qr-success.png';
  }
}
