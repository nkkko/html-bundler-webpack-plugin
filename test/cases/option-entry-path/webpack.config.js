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
      '@scripts': path.join(__dirname, 'src/assets/scripts'),
      '@styles': path.join(__dirname, 'src/assets/styles'),
    },
  },

  plugins: [
    new HtmlBundlerPlugin({
      // test the dynamic entry as the path to templates
      entry: 'src/views/pages/',

      filename: ({ filename, chunk: { name } }) => {
        // transform 'home/index' filename to output file 'index.html'
        // note: compare the name with the valid path on windows
        if (name === path.join('home', 'index')) {
          return 'index.html'; // save as index.html in output directory
        }
        // bypass the original structure
        return '[name].html';
      },

      js: {
        filename: 'assets/js/[name].[contenthash:8].js',
      },

      css: {
        filename: 'assets/css/[name].[contenthash:8].css',
      },
    }),
  ],

  module: {
    rules: [
      {
        test: /\.(css|sass|scss)$/,
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
