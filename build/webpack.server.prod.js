const webpack = require('webpack');
const webpackMerge = require('webpack-merge');

const commonConfig = require('./webpack.server.common.js');

module.exports = webpackMerge(commonConfig, {
  devtool: 'source-map',
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.UglifyJsPlugin({ sourceMap: true }),
    new webpack.NormalModuleReplacementPlugin(
      /environments\/environment/,
      require.resolve('../src/environments/environment.prod.ts')
    )
  ]
});
