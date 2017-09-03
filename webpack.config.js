var path = require('path');
var webpack = require('webpack');

module.exports = {
  context: __dirname + '/app',
  entry: {kottans_github: ['./scripts/kottans_github.js']},
  output: {
    path: __dirname + '/build',
    filename: '[name].js',
    libraryTarget: 'umd',
    library: '[name]'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }, {
        test: /\.(css|scss)$/,
        loader: 'style!css!sass'
      }
    ],
    resolve: {
      extensions: ['.js', '.jsx', '.scss']
    }
  }
};
