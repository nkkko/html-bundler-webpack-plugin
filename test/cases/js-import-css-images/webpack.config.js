const path = require('path');
const HtmlBundlerPlugin = require('@test/html-bundler-webpack-plugin');

module.exports = {
  mode: 'production',

  output: {
    path: path.join(__dirname, 'dist/'),
    //publicPath: 'auto', // OK
    //publicPath: '', // OK
    //publicPath: '/', // OK
    //publicPath: '/qq.pub/', // OK
    //publicPath: '../qq.pub/', // OK
  },

  resolve: {
    alias: {
      '@images': path.join(__dirname, '../../fixtures/images'),
      '@styles': path.join(__dirname, 'src/styles'),
    },
  },

  plugins: [
    new HtmlBundlerPlugin({
      entry: {
        index: './src/views/home/index.html',
      },

      js: {
        filename: 'assets/js/[name].[contenthash:8].js',
      },

      css: {
        filename: 'assets/css/[name].[contenthash:8].css',
      },

      verbose: true,
    }),

    {
      apply(compiler) {
        const pluginName = 'myPlugin';
        compiler.hooks.compilation.tap(pluginName, (compilation) => {
          const hooks = HtmlBundlerPlugin.getHooks(compilation);

          // test hook afterEmit with imported styles in js
          hooks.afterEmit.tapAsync(pluginName, (entries, options) => {
            //console.log('\n *** ASSETS: ', compilation.assetsInfo);
            const { outputPath } = options;
            entries.forEach((entry) => {
              // TODO: generate manifest.json as flat map
              //console.dir({ _: '\n ### HOOK afterEmit: ', entry }, { depth: 5 });
            });
          });
        });
      },
    },
  ],

  module: {
    rules: [
      {
        test: /\.(css|scss)/,
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
