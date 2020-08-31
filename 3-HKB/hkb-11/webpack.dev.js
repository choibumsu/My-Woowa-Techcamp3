const path = require('path')
const common = require('./webpack.common.js')
const { merge } = require('webpack-merge')
module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
  devServer: {
    index: 'index.html',
    historyApiFallback: true,
    contentBase: path.join(__dirname, './frontend/static'),
    port: 9000,
    hot: true,
    proxy: {
      '/api/': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
      },
    },
  },
})
