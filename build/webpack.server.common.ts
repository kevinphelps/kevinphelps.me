import { resolve } from 'path';

const webpackNodeExternals = require('webpack-node-externals');

export const commonConfig = {
  target: 'node',
  externals: [
    webpackNodeExternals()
  ],
  entry: {
    'server': './src/server/index.ts'
  },
  output: {
    path: resolve('./dist/server'),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.js', '.ts']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ['awesome-typescript-loader', 'angular2-template-loader']
      },
      {
        test: /\.html$/,
        use: ['raw-loader']
      },
      {
        test: /\.css$/,
        use: ['exports-loader?module.exports.toString()', 'css-loader']
      },
      {
        test: /\.scss$/,
        use: ['exports-loader?module.exports.toString()', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(eot|svg)$/,
        loader: 'file-loader?emitFile=false&name=[name].[hash:20].[ext]'
      },
      {
        test: /\.(jpg|png|gif|otf|ttf|woff|woff2|cur|ani)$/,
        loader: 'url-loader?emitFile=false&name=[name].[hash:20].[ext]&limit=10000'
      }
    ]
  }
};
