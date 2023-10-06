module.exports = {
  packagerConfig: {
    asar: true,
    name: 'E齿盟',
    icon: './images/icon'
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        iconUrl: 'http://m.epdent.cn/static/icon.ico'
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: '451165072@qq.com',
          name: 'electron'
        },
        authToken: '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',
        prerelease: false,
        draft: true
      }
    }
  ]
};
