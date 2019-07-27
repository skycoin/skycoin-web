export const config = {
  otcEnabled: false,
  timeBeforeSlowMobileInfo: 7000,

  maxHardwareWalletAddresses: 1,
  useHwWalletDaemon: true,
  urlForHwWalletVersionChecking: 'https://version.skycoin.net/skywallet/version.txt',
  hwWalletDownloadUrlAndPrefix: 'https://downloads.skycoin.net/skywallet/skywallet-firmware-v',

  languages: [{
      code: 'en',
      name: 'English',
      iconName: 'en.png'
    },
    {
      code: 'es',
      name: 'Español',
      iconName: 'es.png'
    }
  ],
  defaultLanguage: 'en'
};
