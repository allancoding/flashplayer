module.exports = {
  packagerConfig: {
    icon: './icon',
    executableName: 'flashplayer',
    protocols: [{
      name: "Flashplayer",
      schemes: ["flashplayer"]
    }]
  },
  rebuildConfig: {},
  publishers: [
     {
       name: '@electron-forge/publisher-github',
       config: {
         repository: {
           owner: 'allancoding',
           name: 'flashplayer'
         },
         prerelease: false,
         authToken: process.env.GITHUB_TOKEN
       }
     }
   ],
  makers: [{
      name: '@electron-forge/maker-squirrel',
      config: {
        authors: 'allancoding',
        description: 'A flash player!',
        //certificateFile: './cert.pfx',
        //certificatePassword: process.env.CERTIFICATE_PASSWORD
        iconUrl: 'https://raw.githubusercontent.com/allancoding/flashplayer/master/icon.ico',
        setupIcon: './icon.ico',
        mimeType: ["x-scheme-handler/flashplayer"],
      },
    },
    {
      name: '@electron-forge/maker-zip'
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        options: {
          name: "flashplayer",
          productName: "flashplayer",
          maintainer: 'allancoding',
          homepage: 'https://github.com/allancoding/flashplayer',
          icon: './icon.png',
          bin: "flashplayer",
        },
        mimeType: ["x-scheme-handler/flashplayer"]
      },
    },{
      name: '@electron-forge/maker-dmg',
      config: {
        backgroundColor: "#000",
        format: 'ULFO',
        bin: "flashplayer",
        category: "public.app-category.utilities"
      }
    },{
      name: '@electron-forge/maker-rpm',
      config: {
        options: {
          maintainer: 'allancoding',
          homepage: 'https://github.com/allancoding/flashplayer',
          icon: './icon.png',
          bin: "flashplayer"
        },
        mimeType: ["x-scheme-handler/flashplayer"]
      }
    },{
      name: "@rabbitholesyndrome/electron-forge-maker-portable",
      config: {
        appId: "com.allancoding.flashplayer",
        icon: "./icon.ico"
      }
    },{
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
        },
        mimeType: ["x-scheme-handler/flashplayer"]
      }
    }
  ],
};
