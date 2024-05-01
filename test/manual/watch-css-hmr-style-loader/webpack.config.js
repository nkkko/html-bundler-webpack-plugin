const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  stats: false,

  output: {
    path: path.join(__dirname, 'dist/'),
    //filename: '[name].[contenthash:8].js',
    clean: true,
  },

  entry: {
    // BUG: Webpack does not recognize changes by HMR Checking for updates on the server
    'style-a': './src/style-a.css', // BUG: after changes - Nothing hot updated
    'style-b': './src/style-b.css', // OK: Updated modules ... (HMR works only by last entrypoint)
    // 'style-a': {
    //   library: {
    //     name: ' ',
    //     type: 'jsonp',
    //     //type: 'commonjs2',
    //   },
    //   import: './src/style-a.css',
    //   filename: 'style-a.js',
    // },
    // 'style-b': {
    //   library: {
    //     name: ' ',
    //     type: 'jsonp',
    //     //type: 'commonjs2',
    //   },
    //   import: './src/style-b.css',
    //   filename: 'style-b.js',
    // },
    //
    // the same bug
    //'main-a': './src/main-a.js',
    //'main-b': './src/main-b.js',
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './src/home.html',
      filename: path.join(__dirname, 'dist', 'index.html'),
    }),
  ],

  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },

  target: 'web',

  //hotOnly: true, // TODO: where is correct place?
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    hot: true, // enable HMR
    // liveReload: false,
    // watchFiles: {
    //   paths: ['src/**/*.*'],
    //   options: {
    //     //usePolling: true,
    //     usePolling: false,
    //   },
    // },
  },
};
