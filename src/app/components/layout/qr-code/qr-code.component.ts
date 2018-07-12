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
  @ViewChild('qr') qr: any;
  @ViewChild('btnImg') btnImg: ElementRef;
  address: string;

  size = 300;
  level = 'M';
  colordark = '#000000';
  colorlight = '#ffffff';
  usesvg = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<QrCodeComponent>,
    private coinService: CoinService
  ) { }

  ngOnInit() {
    this.address = this.data.address ? this.data.address : this.data;

    const qrcode = new QRCode(this.qr.nativeElement, {
      text: this.coinService.currentCoin.value.coinName.toLowerCase() + ':' + this.address,
      width: this.size,
      height: this.size,
      colorDark: this.colordark,
      colorLight: this.colorlight,
      useSVG: this.usesvg,
      correctLevel: QRCode.CorrectLevel[this.level.toString()],
    });
  }

  ngAfterViewInit() {
    this.btnImg.nativeElement.src = '../../../../assets/img/copy-qr.png';
  }

  onCopySuccess() {
    this.btnImg.nativeElement.src = '../../../../assets/img/copy-qr-success.png';
  }
}
