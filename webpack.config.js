/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
/* eslint-enable @typescript-eslint/no-var-requires */

const { DIR, EXT = 'ts' } = process.env;

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  entry: `./examples/${DIR}/src/index.${EXT}`,
  output: {
    publicPath: '/',
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
    }),
    new HtmlWebpackPlugin({
      template: `./examples/${DIR}/public/index.html`,
    }),
    new ReactRefreshWebpackPlugin(),
  ],
  module: {
    rules: [{
      test: /\.[jt]sx?$/,
      exclude: /node_modules/,
      use: [{
        loader: 'babel-loader',
        options: {
          plugins: ['react-refresh/babel'],
        },
      }, {
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
        },
      }],
    }],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      'react-hooks-global-state': `${__dirname}/src`,
    },
  },
  devServer: {
    port: process.env.PORT || '8080',
    contentBase: `./examples/${DIR}/public`,
    historyApiFallback: true,
    hot: true,
  },
};
