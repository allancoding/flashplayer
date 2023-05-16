module.exports = {
  packagerConfig: {
    icon: './icon',
  },
  rebuildConfig: {},
  // publishers: [
  //   {
  //     name: '@electron-forge/publisher-github',
  //     config: {
  //       repository: {
  //         owner: 'allancoding',
  //         name: 'flashplayer'
  //       },
  //       prerelease: false,
  //       authToken: $GITHUB_TOKEN,
  //     }
  //   }
  // ],
  makers: [{
      name: '@electron-forge/maker-squirrel',
      config: {
        authors: 'allancoding',
        description: 'A flash player!',
        //certificateFile: './cert.pfx',
        //certificatePassword: process.env.CERTIFICATE_PASSWORD
        iconUrl: 'https://raw.githubusercontent.com/allancoding/flashplayer/master/icon.ico',
        setupIcon: './icon.ico',
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin', 'linux'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        options: {
          maintainer: 'allancoding',
          homepage: 'https://github.com/allancoding/flashplayer',
          icon: './icon.png'
        }
      },
    },{
      name: '@electron-forge/maker-dmg',
      config: {
        //background: './assets/dmg-background.png',
        format: 'ULFO',
        icon: './icon.icns',
      }
    },{
      name: '@electron-forge/maker-rpm',
      config: {
        options: {
          maintainer: 'allancoding',
          homepage: 'https://github.com/allancoding/flashplayer',
          icon: './icon.png'
        }
      }
    },{
      name: "@rabbitholesyndrome/electron-forge-maker-portable",
      config: {
        appId: "net.prism.flashplayer",
        icon: "./icon.ico",
      }
    },{ name: '@electron-forge/maker-pkg', config: {
      //keychain: 'my-secret-ci-keychain'
    }},{
      name: "@reforged/maker-appimage",
  config: {
    options: {
      name: "flashflayer",
      bin: "flashplayer",
      productName: "Flashplayer",
      genericName: "Flashplayer",
      categories: [ "Utility" ],
      icon: "./icon.png",
      description: "A flash player!",
      AppImageKitRelease: "continuous"
    }
  }
    }
  ],
};
