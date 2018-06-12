import { Injectable } from '@angular/core';

import { featuresConfig } from '../constants/featuresConfig.const';

@Injectable()
export class FeatureService {

  setFeatureToggleData(featureConfig: any, enabled: boolean) {
    const featuresStore = this.getFeatures();
    const feature = featuresStore.find((item) => Object.keys(item).includes(featureConfig.name));

    if (feature) {
      feature[featureConfig.name] = enabled;
    } else {
      featuresStore.push(this.getFeature(featureConfig, enabled));
    }

    localStorage.setItem(featuresConfig.localStorageName, JSON.stringify(featuresStore));
  }

  getFeatureToggleData(featureConfig: any): any {
    const feature = this.getFeatures().find((item) => Object.keys(item).includes(featureConfig.name));

    return feature ? feature : this.getFeature(featureConfig);
  }

  private getFeatures(): any[] {
    const featuresStore = localStorage.getItem(featuresConfig.localStorageName);

    return featuresStore ? JSON.parse(featuresStore) : [];
  }

  private getFeature(featureConfig: any, enabled?: boolean): any {
    const feature = {};
    feature[featureConfig.name] = enabled !== undefined ? enabled : featureConfig.enabled;

    return feature;
  }
}
