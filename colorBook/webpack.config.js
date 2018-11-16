/*
    ./webpack.config.js
*/
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    timePunch: './src/render/timePunch.js',
    login: './src/render/login.js',
    createAJob: './src/render/createAJob.js'
  },
  output: {
    path: path.resolve(__dirname, "static/"),
    filename: 'js/[name].js'
  },
  module: {
    rules: [
      { test: /\.js$/, use: 'babel-loader', exclude: /node_modules/ },
      { test: /\.jsx$/, use: 'babel-loader', exclude: /node_modules/ },
      { test: /\.css$/, use: [ 'style-loader', 'css-loader' ]}
    ]
  },
  plugins: [
    new UglifyJsPlugin()
  ]
};