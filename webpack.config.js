const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: ['babel-polyfill', './src/index.js'],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build'),
    publicPath: '/'
  },
  devtool: 'inline-source-map',
  module: {
    loaders: [
      {
          test: /\.css$/,
          loader: 'style-loader!css-loader'
      },
      {
        test: /\.(proto|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
        loader: 'url-loader'
      },
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
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
		template: 'src/index.html',
    }),
  ],
  devServer: {
    contentBase: './src'
  }
};
