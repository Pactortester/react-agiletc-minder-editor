const path = require('path');
const webpack = require('webpack');
const webpackConfigBase = require('./webpack.base.config');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { merge } = require('webpack-merge');

function resolve(relatedPath) {
  return path.join(__dirname, relatedPath)
}

const webpackConfigDev = {
  mode: 'development',

  entry: {
    app: [resolve('../example/app.js')],
  },

  output: {
    path: resolve('../lib'),
    filename: 'editor.js',
  },

  devtool: 'cheap-module-eval-source-map',

  devServer: {
    contentBase: resolve('../lib'),
    hot: true,
    open: true,
    host: 'localhost',
    port: 8080,
    proxy: {
      '/api': 'http://localhost:8094'
    }
  },

  plugins: [
    new HtmlWebpackPlugin({ template: './public/index.html', }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
}

module.exports = merge(webpackConfigBase, webpackConfigDev)