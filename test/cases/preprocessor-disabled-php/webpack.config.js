const path = require('path');
const HtmlBundlerPlugin = require('@test/html-bundler-webpack-plugin');

module.exports = {
  mode: 'production',

  output: {
    path: path.join(__dirname, 'dist/'),
  },

  resolve: {
    alias: {
      '@images': path.join(__dirname, '../../fixtures/images'),
    },
  },

  plugins: [
    new HtmlBundlerPlugin({
      test: /\.php$/i,
      filename: () => '[name].php',
      entry: {
        'main.bundle': 'src/main.scss', // test the non-template entry file
        index: './src/index.php', // test the processing of php templates
        'pages/about': {
          import: './src/about.php',
          filename: () => '[name].phtml',
        },
      },
      js: {
        filename: 'assets/js/[name].[contenthash:8].js',
      },
      css: {
        filename: 'assets/css/[name].[contenthash:8].css',
      },
      preprocessor: false,
    }),
  ],

  module: {
    rules: [
      {
        test: /\.s?css$/,
        use: ['css-loader', 'sass-loader'],
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
};
