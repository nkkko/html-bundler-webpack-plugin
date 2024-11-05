const path = require('path');
const HtmlBundlerPlugin = require('html-bundler-webpack-plugin');

module.exports = [
  {
    name: 'config1',
    mode: 'production',
    output: {
      path: path.join(__dirname, 'dist'),
      clean: false,
    },
    cache: {
      type: 'filesystem',
      cacheDirectory: path.join(__dirname, '.cache'),
    },
    plugins: [
      new HtmlBundlerPlugin({
        entry: {
          index: './src/index.html',
        },
      }),
    ],
    module: {
      rules: [
        {
          test: /\.(png|jpe?g|webp|ico)$/i,
          type: 'asset/resource',
        },
      ],
    },
  },

  {
    name: 'config2',
    mode: 'production',
    output: {
      path: path.join(__dirname, 'dist'),
      clean: false,
    },
    cache: {
      type: 'filesystem',
      cacheDirectory: path.join(__dirname, '.cache'),
    },
    plugins: [
      new HtmlBundlerPlugin({
        entry: {
          about: './src/about.html',
        },
      }),
    ],
    module: {
      rules: [
        {
          test: /\.(png|jpe?g|webp|ico)$/i,
          type: 'asset/resource',
        },
      ],
    },
  },
];
