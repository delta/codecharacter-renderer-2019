const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: './src/javascripts/driver.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build'),
    publicPath: '/javascripts/'
  },
  devtool: 'inline-source-map',
  module: {
    loaders: [
      {
        enforce: 'pre',
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'eslint-loader'
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader?optional=runtime&cacheDirectory',
        query: {
          presets: ['env']
        }
      }
    ]
  },
  plugins: [],
  devServer: {
    contentBase: './src'
  }
};
