const path = require('path')
const pkg = require('../../package.json')

module.exports = {
  title: pkg.name + ' 扩展点',
  plugins: [
    [
      '@vuepress/register-components',
      {
        componentsDir: [path.join(__dirname, '../../src'), path.join(__dirname, '../demos')]
      }
    ]
  ],
  configureWebpack: {
    node: {
      global: true,
      process: true
    },
    resolve: {
      alias: {
        '@src': path.join(__dirname, '../../src')
      }
    },
    // https://webpack.docschina.org/configuration/dev-server/#devserverproxy
    devServer: {}
  },
  dest: path.join(__dirname, '../../dist-docs')
}
