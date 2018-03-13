import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

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

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<QrCodeComponent>,
  ) { }

  ngOnInit() {
    this.address = this.data.address ? this.data.address : this.data;
    this.qr = new QRCode(this.qr.nativeElement, {
      text: this.address,
      width: 230,
      height: 230,
      useSVG: false,
      correctLevel: QRCode.CorrectLevel['M'],
    });
  }

  ngAfterViewInit() {
    this.btnImg.nativeElement.src = '../../../../assets/img/copy-qr.png';
  }

  onCopySuccess() {
    this.btnImg.nativeElement.src = '../../../../assets/img/copy-qr-success.png';
  }
}
