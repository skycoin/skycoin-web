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
  size: number = 230;
  level: string = 'M';
  colordark: string = '#000000';
  colorlight: string = '#ffffff';
  usesvg: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<QrCodeComponent>,
  ) { }

  ngOnInit() {
    const qr = new QRCode(this.qr.nativeElement, {
      text: this.data.address,
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
