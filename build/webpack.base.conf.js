var path = require('path');
var alias = require('./alias');

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  resolve: {
    alias: alias
  },
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
      include: [resolve('src'), resolve('test'), resolve('example')]
    }]
  }
};
