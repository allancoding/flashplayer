module.exports = {
  packagerConfig: {
    icon: './icons/icon.png',
    executableName: 'flashplayer',
    protocols: [
      {
        name: "flashplayer",
        schemes: ["flashplayer"]
      }
    ]
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        authors: 'allancoding',
        description: 'A flash player!',
        iconUrl: 'https://raw.githubusercontent.com/allancoding/flashplayer/master/icon.ico',
        setupIcon: './icon.ico',
        mimeType: ["x-scheme-handler/flashplayer"]
      }
    },
    {
      name: '@electron-forge/maker-zip'
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        options: {
          name: "Flashplayer",
          productName: "flashplayer",
          maintainer: 'allancoding',
          homepage: 'https://github.com/allancoding/flashplayer',
          icon: './icon.png',
          bin: "flashplayer",
        },
        mimeType: ["x-scheme-handler/flashplayer"]
      }
    },
    {
      name: '@electron-forge/maker-dmg',
      config: {
        backgroundColor: "#000",
        format: 'ULFO',
        bin: "flashplayer",
        category: "public.app-category.utilities"
      }
    },
    {
      name: "@rabbitholesyndrome/electron-forge-maker-portable",
      config: {
        appId: "com.allancoding.flashplayer",
        icon: "./icon.ico"
      }
    },
    {
      name: "@reforged/maker-appimage",
      config: {
        options: {
          name: "Flashplayer",
          bin: "flashplayer",
          productName: "Flashplayer",
          genericName: "Flashplayer",
          categories: ["Utility"],
          icon: "./icon.png",
          description: "A flash player!",
          AppImageKitRelease: "continuous"
        },
        mimeType: ["x-scheme-handler/flashplayer"]
      }
    }
  ]
};
