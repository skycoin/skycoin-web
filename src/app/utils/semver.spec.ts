import { isEqualOrSuperiorVersion } from './semver';

describe('semver', () => {
  it('correctly compares versions', () => {
    expect(isEqualOrSuperiorVersion('0.23.0', '0.22.0')).toBeTruthy();
    expect(isEqualOrSuperiorVersion('0.23.0', '0.23.0')).toBeTruthy();
    expect(isEqualOrSuperiorVersion('0.23.0', '0.23.1')).toBeFalsy();
    expect(isEqualOrSuperiorVersion('0.23.1', '0.24.0')).toBeFalsy();
    expect(isEqualOrSuperiorVersion('0.24.0', '1.0.0')).toBeFalsy();
  });

  it('correctly handles rc versions', () => {
    expect(isEqualOrSuperiorVersion('0.23.1-rc.1', '0.23.0')).toBeTruthy();
    expect(isEqualOrSuperiorVersion('0.23.1-rc.1', '0.23.1')).toBeTruthy();
    expect(isEqualOrSuperiorVersion('0.23.1-rc.1', '0.23.2')).toBeFalsy();
  });
});
