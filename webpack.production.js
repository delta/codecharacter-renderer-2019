const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: ['babel-polyfill', './src/index.js'],
  output: {
    filename: 'libpack.js',
    library: 'libpack',
    libraryTarget: 'commonjs2',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader?optional=runtime&cacheDirectory',
        query: {
          presets: ['env']
        }
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.(proto|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
        loader: 'url-loader?name=./assets/[hash].[ext]'
      }
    ]
  },
  externals: {
    'react': 'commonjs react',
    'react-dom': 'commonjs react-dom',
    'pixi.js': 'commonjs pixi.js',
    'protobufjs': 'commonjs protobufjs'
  },
  plugins: [
	new webpack.optimize.UglifyJsPlugin({
	  sourceMap: true
	}),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': "'production'"
    })
  ]
};
