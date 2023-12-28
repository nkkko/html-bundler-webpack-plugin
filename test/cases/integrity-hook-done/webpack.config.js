const fs = require('fs');
const path = require('path');
const HtmlBundlerPlugin = require('@test/html-bundler-webpack-plugin');

module.exports = {
  mode: 'production',

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
        chunkFilename: '[name].[contenthash:8].chunk.js',
      },

      css: {
        filename: '[name].[contenthash:8].css',
        chunkFilename: '[name].[contenthash:8].chunk.css',
      },

      integrity: 'auto',
    }),
    {
      apply(compiler) {
        const pluginName = 'extract-integrity';

        // test compatibility for webpack-subresource-integrity, which saves integrity in stats

        // test promise hook - OK
        compiler.hooks.done.tapPromise(pluginName, (stats) => {
          return new Promise((resolve) => {
            const saveAs = path.join(__dirname, 'dist/integrity.json');
            const hashes = {};

            for (const { name, integrity } of stats.toJson().assets) {
              if (integrity) hashes[name] = integrity;
            }

            fs.writeFileSync(saveAs, JSON.stringify(hashes, null, '  '));
            resolve();
          });
        });

        // test sync hook - OK
        // compiler.hooks.done.tap(pluginName, (stats) => {
        //   const saveAs = path.join(__dirname, 'dist/integrity.json');
        //   const hashes = {};
        //
        //   for (const { name, integrity } of stats.toJson().assets) {
        //     if (integrity) hashes[name] = integrity;
        //   }
        //
        //   fs.writeFileSync(saveAs, JSON.stringify(hashes, null, '  '));
        // });
      },
    },
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
          filename: 'img/[name].[hash:8][ext]',
        },
      },
    ],
  },

  optimization: {
    // test split chunks for dynamic loaded modules OK
    splitChunks: {
      minSize: 100,
    },
  },
};
