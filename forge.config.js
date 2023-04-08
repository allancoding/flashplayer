module.exports = {
  packagerConfig: {},
  rebuildConfig: {},
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'PrismNet',
          name: 'flashplayer'
        },
        prerelease: false
      }
    }
  ],
  makers: [{
      name: '@electron-forge/maker-squirrel',
      config: {
        authors: 'PrismNet',
        description: 'A flash player!',
        //certificateFile: './cert.pfx',
        //certificatePassword: process.env.CERTIFICATE_PASSWORD
      },
    },{
      name: '@electron-forge/maker-zip',
      platforms: ['darwin', 'linux'],
    },{
      name: '@electron-forge/maker-deb',
      config: {
        options: {
          maintainer: 'PrismNet',
          homepage: 'https://github.com/PrismNet/flashplayer'
        }
      },
    },{
      name: '@electron-forge/maker-dmg',
      config: {
        //background: './assets/dmg-background.png',
        format: 'ULFO'
      }
    },{
      name: '@electron-forge/maker-rpm',
      config: {
        options: {
          maintainer: 'PrismNet',
          homepage: 'https://github.com/PrismNet/flashplayer'
        }
      }
    },{
      name: "@rabbitholesyndrome/electron-forge-maker-portable",
      config: {
        appId: "net.prism.flashplayer"
      }
    },{ name: '@electron-forge/maker-pkg', config: {
      //keychain: 'my-secret-ci-keychain'
    }},{
      name: 'electron-forge-maker-appimage',
      platforms: ['linux']
    }
  ],
};
