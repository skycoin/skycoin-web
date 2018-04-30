import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/takeWhile';
import { config } from './app.config';

import { FeatureService } from './services/feature.service';
import { featuresConfig } from './constants/featuresConfig.const';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  current: number;
  highest: number;
  otcEnabled: boolean;
  version: string;
  featureToggleData: any;

  constructor(
    private featureService: FeatureService,
  ) {
    this.otcEnabled = config.otcEnabled;
  }

  ngOnInit() {
    this.getfeatureToggleData();
  }

  loading() {
    return !this.current || !this.highest || this.current !== this.highest;
  }

  hideDisclaimerWarning() {
    this.featureService.setFeatureToggleData(featuresConfig.disclaimerWarning, false);
    this.getfeatureToggleData();
  }

  getfeatureToggleData() {
    this.featureToggleData = this.featureService.getFeatureToggleData(featuresConfig.disclaimerWarning);
  }
}
