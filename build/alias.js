const path = require('path')

const resolve = p => path.resolve(__dirname, '../', p)

module.exports = {
  compiler: resolve('src/compiler'),
  core: resolve('src/core'),
  shared: resolve('src/shared'),
  'mvvm$': resolve('src/core/index.js'),
  'src': resolve('src')
}
