var baseConfig = require('./webpack.base.conf');
var merge = require('webpack-merge');

module.exports = merge(baseConfig, {
  entry: {
    mvvm: './src/core/index.js',
  },
  output: {
    filename: '[main].js',
    library: 'MVVM',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, '../dist'),
  },
  devtool: '#source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': '"production"'
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: true
    })
  ]
});
