const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    'my/my' : './app/my/my.js',
    'market/market' : './app/market/market.js',
    'help/help' : './app/help/help.js',
    'admin/admin' : './app/admin/admin.js'
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js'
  },
  plugins: [
    // Copy our app's index.html to the build folder.
    new CopyWebpackPlugin([
      { from: './app/*.html', to: "./[name].html" },
      { from: './app/my/index.html', to: "my/index.html" },
      { from: './app/market/index.html', to: "market/index.html" },
      { from: './app/help/index.html', to: "help/index.html" },
      { from: './app/admin/index.html', to: "admin/index.html" },
      { from: './app/my/main.css', to: "my/main.css"},
      { from: './app/font', to: "my/font"}

    ])
  ],
  module: {
    rules: [
      {
       test: /\.css$/,
       use: [ 'style-loader', 'css-loader' ]
      }
    ],
    loaders: [
      { test: /\.json$/, use: 'json-loader' },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015'],
          plugins: ['transform-runtime']
        }
      }
    ]
  }
}
