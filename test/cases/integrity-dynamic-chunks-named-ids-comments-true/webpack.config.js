const path = require('path');
const HtmlBundlerPlugin = require('@test/html-bundler-webpack-plugin');

module.exports = {
  mode: 'production',
  target: 'web',

  output: {
    path: path.join(__dirname, 'dist/'),
    crossOriginLoading: 'anonymous', // required for test Subresource Integrity
  },

  plugins: [
    new HtmlBundlerPlugin({
      entry: {
        index: './src/index.html',
      },

      js: {
        filename: '[name].[contenthash:8].js',
      },

      extractComments: true, // test with comments

      integrity: 'auto',
    }),
  ],

  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['css-loader'],
      },

      {
        test: /\.(png|jpe?g|ico|svg)$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/img/[name].[hash:8][ext]',
        },
      },
    ],
  },

  optimization: {
    // test split chunks for dynamic loaded modules OK
    chunkIds: 'named',
  },
};
