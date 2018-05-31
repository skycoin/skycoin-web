import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/takeWhile';
import { config } from './app.config';
import { TranslateService } from '@ngx-translate/core';

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
    private translate: TranslateService
  ) {
  }

  ngOnInit() {
    this.otcEnabled = config.otcEnabled;
    this.translate.addLangs(['en']);
    this.translate.setDefaultLang('en');
    this.translate.use('en');
    this.getFeatureToggleData();
  }

  loading() {
    return !this.current || !this.highest || this.current !== this.highest;
  }

  hideDisclaimerWarning() {
    this.featureService.setFeatureToggleData(featuresConfig.disclaimerWarning, false);
    this.getFeatureToggleData();
  }

  getFeatureToggleData() {
    this.featureToggleData = this.featureService.getFeatureToggleData(featuresConfig.disclaimerWarning);
  }
}
