const path = require('path');
const webpackNodeExternals = require('webpack-node-externals');

module.exports = {
  target: 'node',
  externals: [
    webpackNodeExternals({
      whitelist: [
        /^lodash/
      ]
    })
  ],
  entry: {
    'server': './src/server/index.ts',
  },
  output: {
    path: path.resolve('./dist/server'),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.js', '.ts']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader']
      },
      {
        test: /\.ts$/,
        use: ['babel-loader', 'awesome-typescript-loader', 'angular2-template-loader']
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
        use: ['to-string-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        use: 'null-loader'
      }
    ]
  }
};
