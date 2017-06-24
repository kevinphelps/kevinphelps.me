import * as ExtractTextPlugin from 'extract-text-webpack-plugin';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import { resolve } from 'path';

const webpackNodeExternals = require('webpack-node-externals');
const HtmlWebpackExcludeAssetsPlugin = require('html-webpack-exclude-assets-plugin');

export default {
  target: 'node',
  externals: [
    webpackNodeExternals()
  ],
  entry: {
    'styles': './src/styles.scss',
    'generate-static-site': './src/index.ts'
  },
  output: {
    path: resolve('./dist'),
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
        use: ['html-loader']
      },
      {
        test: /\.css$/,
        use: ['to-string-loader', 'css-loader']
      },
      {
        test: /\.scss$/,
        use: ['to-string-loader', 'css-loader', 'sass-loader'],
        exclude: [/styles/]
      },
      {
        test: /styles\.scss$/,
        use: ExtractTextPlugin.extract({ fallback: 'style-loader',  use: ['css-loader', 'sass-loader'] })
      },
      {
        test: /\.(eot|svg)$/,
        loader: 'file-loader?name=[name].[hash:20].[ext]'
      },
      {
        test: /\.(jpg|png|gif|otf|ttf|woff|woff2|cur|ani)$/,
        loader: 'url-loader?name=[name].[hash:20].[ext]&limit=10000'
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('styles.[hash].css'),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      chunks: ['styles'],
      excludeAssets: [/style.*.js/]
    }),
    new HtmlWebpackExcludeAssetsPlugin()
  ]
};
