const path = require('path');
const HtmlBundlerPlugin = require('@test/html-bundler-webpack-plugin');

module.exports = {
  mode: 'production',

  output: {
    path: path.join(__dirname, 'dist/'),
  },

  resolve: {
    alias: {
      '@images': path.join(__dirname, '../../../fixtures/images'),
    },
  },

  plugins: [
    new HtmlBundlerPlugin({
      entry: {
        index: {
          import: './src/views/pages/home.hbs',
          data: {
            title: 'Home',
            headline: 'Breaking Bad',
            people: ['Walter White', 'Jesse Pinkman'],
          },
        },
      },

      preprocessor: 'handlebars',
      preprocessorOptions: {
        partials: [
          // absolute path to partials
          path.join(__dirname, 'src/views/includes'),
          // relative path to partials
          'src/views/partials/',
        ],
      },
    }),
  ],

  module: {
    rules: [
      {
        test: /\.(png|svg|jpe?g|webp)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/img/[name].[hash:8][ext]',
        },
      },
    ],
  },
};
