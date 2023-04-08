module.exports = {
  packagerConfig: {},
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin', 'linux'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
    { name: '@electron-forge/maker-pkg', config: {}},
    { name: '@electron-forge/maker-wix', config: {}},
    { name: '@electron-forge/maker-flatpak', config: { options: { categories: ['Video'], mimeType: ['video/h264'] }} },
    { name: '@rabbitholesyndrome/electron-forge-maker-portable' }
  ],
};
