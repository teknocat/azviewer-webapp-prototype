const webpack = require('webpack');
const combineLoaders = require('webpack-combine-loaders');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: [
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/only-dev-server',
    './src/index.js'
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'react-hot-loader!babel-loader'
      },
      {
        test: /\.css$/,
        // https://github.com/jackfranklin/react-css-modules-webpack/blob/master/webpack.config.dev.js#L31
        loader: combineLoaders([
          {
            loader: 'style-loader'
          }, {
            loader: 'css-loader',
            query: {
              modules: true,
              // 自動生成するclass名のルールを変更
              // TODO pathを入れるとソース構造が見えるので、OSSではないプロダクトでは使わない方がよい(あるいはreleaseビルドだけ除外)
              localIdentName: '[path][name]__[local]___[hash:base64:5]'
            }
          }
        ])
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
    // reactjs - How to bundle a React app to a subdirectory on a server? - Stack Overflow
    // https://stackoverflow.com/questions/37396427/how-to-bundle-a-react-app-to-a-subdirectory-on-a-server
    publicPath: '/',
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: './dist',
    hot: true,
    historyApiFallback: true
  },
  plugins: [
    new webpack.ProvidePlugin({
      'fetch': 'imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('development')
      }
    }),
    new CopyWebpackPlugin([{
      from: 'dist/index.dev.html',
      to: 'index.html'
    }])
  ]
};