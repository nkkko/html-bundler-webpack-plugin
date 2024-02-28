const path = require('path');
const HtmlBundlerPlugin = require('@test/html-bundler-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',

  output: {
    path: path.join(__dirname, 'dist/'),
  },

  entry: {
    index: './src/index.html',
  },

  plugins: [new HtmlBundlerPlugin()],

  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        use: ['css-loader', 'sass-loader'],
      },
    ],
  },
};
