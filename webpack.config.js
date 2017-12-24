const path = require('path');

module.exports = {
  entry: './src/javascripts/driver.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build'),
    publicPath: '/javascripts/'
  }
};
