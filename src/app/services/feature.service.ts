import { Injectable } from '@angular/core';
import { features } from '../constants/features.const';

@Injectable()
export class FeatureService {

  setFeatureToggleData(featureItem: string, enabled: boolean) {
    const featuresStore = this.getFeatures();
    const feature = featuresStore.find((item) => Object.keys(item).includes(featureItem));

    if (feature) {
      feature[featureItem] = enabled;
    } else {
      featuresStore.push(this.getFeature(featureItem, enabled));
    }

    localStorage.setItem(features.disclaimerWarning.name, JSON.stringify(featuresStore));
  }

  getFeatureToggleData(featureItem: string): any {
    const feature = this.getFeatures().find((item) => Object.keys(item).includes(featureItem));

    return feature ? feature : this.getFeature(featureItem);
  }

  private getFeatures(): any[] {
    return JSON.parse(localStorage.getItem(features.disclaimerWarning.name)) || [];
  }

  private getFeature(featureItem: string, enabled = true): any {
    const feature = {};
    feature[featureItem] = enabled;

    return feature;
  }
}
