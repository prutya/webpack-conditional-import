const fs = require('fs');
const path = require('path');

const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const nodeEnv = process.env.NODE_ENV;
const appEnv = process.env.APP_ENV;
const appVersion = process.env.APP_VERSION;

let config = {
  entry: {
    main: ['./src/index.js'],
  },
  output: {
    publicPath: '/',
    filename: '[name].js',
    path:  path.resolve(__dirname, './dist'),
  },
  resolve: {
    alias: {
      // NOTE: This is where the actual magic happens
      'env-static': path.resolve(__dirname, `./src/env/static/${appEnv}.js`),
      env: path.resolve(__dirname, './src/env'),
      src: path.resolve(__dirname, './src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: path.resolve(__dirname, './src'),
      },
    ]
  },
  plugins: [
    new HtmlPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, './src/index.html'),
      inject: false,
      version: appVersion ? `${appVersion}/` : '',
      injectConfig: fs.existsSync(
        path.resolve(
          __dirname,
          `./src/env/dynamic/${appEnv}.js`,
        )
      ),
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(nodeEnv),
      'process.env.APP_ENV': JSON.stringify(appEnv),
      'process.env.APP_VERSION': JSON.stringify(appVersion),
    }),
  ],
};

if (nodeEnv === 'development') {
  config = merge(config, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
      host: '0.0.0.0',
      disableHostCheck: true,
      contentBase: path.resolve(__dirname, './dist'),
      compress: true,
      hot: false,
      port: 4000,
      historyApiFallback: {
        disableDotRule: true,
      },
    },
    plugins: [
      new CopyPlugin(
        [
          // NOTE:
          // For a real production deployment you must put the appropriate
          // configuration file directly to the server somewhere in your CD
          // script and name it config.js
          {
            from: path.resolve(
              __dirname,
              `./src/env/dynamic/${appEnv}.js`,
            ),
            to: path.resolve(__dirname, './dist/config.js'),
          },
        ],
        { debug: 'info' },
      ),
    ],
  })
}

if (nodeEnv === 'production') {
  config = merge(config, {
    mode: 'production',
    optimization: {
      minimizer: [new TerserPlugin()],
    },
  });
}

module.exports = config;
