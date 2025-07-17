const { defineConfig } = require('@vue/cli-service')

module.exports = (externals) => defineConfig({
  configureWebpack: {
    output: {
      libraryExport: 'default'
    },
    externals
  },
  css: {
    extract: false
  },
  productionSourceMap: false,
  // 请修改 `docs/.vuepress/config.js` 中的 devServer
  devServer: {}
})
