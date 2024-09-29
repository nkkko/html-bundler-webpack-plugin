const path = require('path');
const HtmlBundlerPlugin = require('@test/html-bundler-webpack-plugin');

module.exports = {
  mode: 'production',

  output: {
    path: path.join(__dirname, 'dist/'),
  },

  plugins: [
    new HtmlBundlerPlugin({
      entry: 'src/views/pages/',
      entryFilter: {
        includes: [/index\.hbs$/],
      },
      preprocessor: 'handlebars',
      preprocessorOptions: {
        partials: ['src/views/partials/', 'src/views/pages/'],
      },
      js: {
        filename: 'js/[name].js',
      },
      css: {
        filename: 'css/[name].css',
      },
    }),
  ],

  module: {
    rules: [
      {
        test: /\.s?css/i,
        use: ['css-loader'],
      },
    ],
  },
};
