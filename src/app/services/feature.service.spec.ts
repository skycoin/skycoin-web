import { TestBed } from '@angular/core/testing';

import { FeatureService } from './feature.service';
import { featuresConfig } from '../constants/featuresConfig.const';

describe('FeatureService', () => {
  let store = {};
  let featureService: FeatureService;
  let fakeConfig: any;
  const otherFakeConfigName = 'otherFakeConfigNAme';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FeatureService]
    });

    featureService = TestBed.get(FeatureService);
    fakeConfig = getFakeFeaturesConfig();
  });

  afterEach(() => {
    store = {};
  });

  it('should be created', () => {
    expect(featureService).toBeTruthy();
  });

  describe('getFeatureToggleData', () => {
    it('should be default with empty localStorage', () => {
      spyOn(localStorage, 'getItem').and.returnValue(null);

      expect(featureService.getFeatureToggleData(fakeConfig)).toEqual(createFeature(fakeConfig.name, fakeConfig.enabled));
    });

    it('should be default with missing localStorage value', () => {
      const features = getFeatures(createFeature(otherFakeConfigName, fakeConfig.enabled));
      spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(features));

      expect(featureService.getFeatureToggleData(fakeConfig)).toEqual(createFeature(fakeConfig.name, fakeConfig.enabled));
    });

    it('should be enabled with existing localStorage value true', () => {
      const features = getFeatures(createFeature(fakeConfig.name, fakeConfig.enabled));
      spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(features));

      expect(featureService.getFeatureToggleData(fakeConfig)).toEqual(createFeature(fakeConfig.name, fakeConfig.enabled));
    });

    it('should be disabled with existing localStorage value fakeConfig', () => {
      const features = getFeatures(createFeature(fakeConfig.name, !fakeConfig.enabled));
      spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(features));
      fakeConfig.enabled = !fakeConfig.enabled;

      expect(featureService.getFeatureToggleData(fakeConfig)).toEqual(createFeature(fakeConfig.name, fakeConfig.enabled));
    });
  });

  describe('setFeatureToggleData', () => {
    beforeEach(() => {
      spyOn(localStorage, 'setItem').and.callFake((key, value) => store[key] = value);
      spyOn(localStorage, 'getItem').and.callFake((key) => store[key]);
    });

    it('should add localStorage value', () => {
      featureService.setFeatureToggleData(fakeConfig, true);
      const expectedObject = getFeatures(createFeature(fakeConfig.name, fakeConfig.enabled));

      expect(localStorage.getItem(featuresConfig.localStorageName)).toBe(JSON.stringify(expectedObject));
    });

    it('should change localStorage value', () => {
      featureService.setFeatureToggleData(fakeConfig, !fakeConfig.enabled);
      const expectedObject = getFeatures(createFeature(fakeConfig.name, !fakeConfig.enabled));

      expect(localStorage.getItem(featuresConfig.localStorageName)).toBe(JSON.stringify(expectedObject));
    });
  });
});

function createFeature(featureNeme: string, enabled: boolean): any {
  const feature = {};
  feature[featureNeme] = enabled;

  return feature;
}

function getFeatures(feature: any): any[] {
  const features = [];
  features.push(feature);

  return features;
}

function getFakeFeaturesConfig(): any {
  return {
    name: 'enableFakeFeature',
    enabled: true
  };
}
