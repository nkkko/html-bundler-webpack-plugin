const path = require('path');
const HtmlBundlerPlugin = require('html-bundler-webpack-plugin');

module.exports = {
  mode: 'production',
  //mode: 'development',
  // stats: {
  //   preset: 'normal',
  //   children: true,
  // },

  output: {
    path: path.join(__dirname, 'dist/'),
    clean: false,
  },

  plugins: [
    new HtmlBundlerPlugin({
      entry: {
        index: {
          import: './src/index.html',
          filename: (pathData) => {
            //console.log('\n\n*** entry.index.filename: : ', { pathData });
            return '[name].html';
          },
        },
      },

      // filename: (pathData) => {
      //   console.log('\n\n*** plugin.filename: : ', { pathData });
      //   return '[name].html';
      // },

      js: {
        filename: (pathData) => {
          //console.log('\n\n*** js.filename: : ', { pathData });
          return '[name].[contenthash:8].js';
        },
      },
    }),
  ],

  // test filesystem cache
  cache: {
    type: 'filesystem',
    cacheDirectory: path.join(__dirname, '.cache'),
  },
};
