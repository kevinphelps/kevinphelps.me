const webpackMerge = require('webpack-merge');

const commonConfig = require('./webpack.server.common.js');

module.exports = webpackMerge(commonConfig, {
  devtool: 'source-map',
});
