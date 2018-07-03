const webpack = require('webpack');
const combineLoaders = require('webpack-combine-loaders');
const extractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: [
    './src/index.js'
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        // https://github.com/jackfranklin/react-css-modules-webpack/blob/master/webpack.config.dev.js#L31
        // https://github.com/jackfranklin/react-css-modules-webpack/blob/master/webpack.config.prod.js
        loader: extractTextPlugin.extract(
          combineLoaders([
            {
              loader: 'css-loader',
              query: {
                modules: true,
                // 自動生成するclass名のルールを変更
                // TODO pathを入れるとソース構造が見えるので、OSSではないプロダクトでは使わない方がよい(あるいはreleaseビルドだけ除外)
                localIdentName: '[path][name]__[local]___[hash:base64:5]'
              }
            }
          ])
        )
      },
      {
        // Using Bootstrap in a ES6 Webpack Application
        // http://hydronitrogen.com/using-bootstrap-in-a-es6-webpack-application.html
        test: /\.(svg|ttf|woff|woff2|eot)$/,
        loader: 'url-loader?limit=5000'
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  output: {
    path: __dirname + '/dist',
    // filename: 'javascripts-[hash].js'
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.ProvidePlugin({
      'fetch': 'imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch'
    }),
    // new extractTextPlugin('styles-[hash].css'),
    new extractTextPlugin('styles.css'),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     warnings: false
    //   }
    // }),

    // Error in common.js from UglifyJs Unexpected token: name (urlParts) [common.js8648.4] · Issue #132 · webpack-contrib/uglifyjs-webpack-plugin - https://github.com/webpack-contrib/uglifyjs-webpack-plugin/issues/132#issuecomment-359031628
    new UglifyJSPlugin({
      sourceMap: true
    }),
    // new webpack.optimize.OccurenceOrderPlugin(),
    // new webpack.optimize.DedupePlugin()
    new CopyWebpackPlugin([{
      from: 'dist/index.prod.html',
      to: 'index.html'
    }])
  ]
};