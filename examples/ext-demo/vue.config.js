const base = require('./base.config')

// 主应用会提供的组件库，需要在打包扩展点时排除
// 参考：https://webpack.docschina.org/configuration/externals
module.exports = base({
  // axios: 'axios' // key 为包，value 为 window 上注入的变量
  vue: 'Vue'
})
