// Karma configuration file, see link for more information
// https://karma-runner.github.io/0.13/config/configuration-file.html

process.env.CHROME_BIN = require('puppeteer').executablePath()

module.exports = function (config) {
 
  var cipherParamIndex = process.argv.indexOf('--cipher');
  // check if command line has cipher parameter with not empty value
  if (cipherParamIndex > -1 && (cipherParamIndex + 1) < process.argv.length && process.argv[cipherParamIndex + 1]) {
    var cipherMode = process.argv[cipherParamIndex + 1];
  }

  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular/cli'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular/cli/plugins/karma'),
      require('karma-read-json')
    ],
    files: [
      { pattern: 'e2e/test-fixtures/*.json', included: false }
    ],
    client: {
      // this works only with `karma start`, not `karma run`.
      cipher: cipherMode,
      args: ['--browserNoActivityTimeout', config.browserNoActivityTimeout],
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      reports: [ 'html', 'lcovonly' ],
      fixWebpackSourcePaths: true
    },
    angularCli: {
      environment: 'dev'
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['ChromeHeadless', 'ChromeHeadlessNoSandbox', 'Chrome'],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox']
      }
    },
    singleRun: false
  });
};
