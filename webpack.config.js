const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const workboxPlugin = require('workbox-webpack-plugin');

module.exports = {
  entry: {
    main: './src/index.js',
  },
  output: {
    filename: '[name].js',
    publicPath: '/',
    path: path.resolve(__dirname, 'src'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        }
        ],
      },
      {
        test: /\.css$/,
        exclude: /(node_modules)/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(woff(2)?|ico|svg|gif|png|jpe?g)$/,
        use: [ {
          loader: 'url-loader',
          options: {
            fallback: 'file-loader',
            publicPath: './img',
            outputPath: './img',
            name: '[name].[ext]',
          }
        }],
      },
    ],
  },
  devServer: {
    publicPath: '/',
    contentBase: path.resolve(__dirname, 'src'),
  },
  plugins: [
    new StyleLintPlugin(options = {
      files: 'src/styles/*.css'
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      title: 'PWA Landing Page',
      template: './src/index.html',
      favicon: false,
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new workboxPlugin.GenerateSW({
      swDest: 'sw.js',
      clientsClaim: true,
      skipWaiting: true,
      runtimeCaching: [{
        urlPattern: new RegExp('^https:\/\/fonts\.googleapis\.com/'),
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'google-fonts',
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      }],
    }),
  ],
};