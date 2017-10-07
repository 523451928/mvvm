
var webpack = require('webpack');
var merge = require('webpack-merge');
var devConfig = require('./webpack.dev.conf');

module.exports = merge(devConfig, {
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
