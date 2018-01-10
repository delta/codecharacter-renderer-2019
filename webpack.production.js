const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: ['babel-polyfill', './src/index.js'],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build'),
    publicPath: '/'
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
          test: /\.css$/,
          loader: 'style-loader'
      },
      {
          test: /\.css$/,
          loader: 'css-loader'
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
	new webpack.optimize.UglifyJsPlugin({
	  sourceMap: true
	}),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': "'production'"
    }),
	new CopyWebpackPlugin([
	  {
		from: 'src/assets',
		to: 'assets'
	  },
	  {
		from: 'src/stylesheets',
		to: 'stylesheets'
	  }
	])
  ]
};
