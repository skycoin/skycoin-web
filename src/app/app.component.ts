import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/takeWhile';
import { config } from './app.config';

import { FeatureService } from './services/feature.service';
import { features } from './constants/features.const';

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

    // this.featureService.setFeatureToggleData(features.disclaimerWarning.enableDisclaimerWarning, true);
    this.featureToggleData = this.featureService.getFeatureToggleData(features.disclaimerWarning.enableDisclaimerWarning);
  }

  loading() {
    return !this.current || !this.highest || this.current !== this.highest;
  }
}
