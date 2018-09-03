/*
    ./webpack.config.js
*/
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    // main: './src/render/app.js',
    login: './src/render/login.js',
    dashboard: './src/render/dashboard.js'
  },
  output: {
    path: path.resolve(__dirname, "static/"),
    filename: 'js/[name].js'
  },
  module: {
    rules: [
      { test: /\.js$/, use: 'babel-loader', exclude: /node_modules/ },
      { test: /\.jsx$/, use: 'babel-loader', exclude: /node_modules/ }
    ]
  },
  plugins: [
    new UglifyJsPlugin()
  ]
};