const path = require('path');
const HtmlBundlerPlugin = require('@test/html-bundler-webpack-plugin');

module.exports = {
  mode: 'production',
  devtool: 'source-map',

  output: {
    path: path.join(__dirname, 'dist/'),
  },

  entry: {
    styles: './src/styles/main.scss',
  },

  plugins: [
    new HtmlBundlerPlugin({
      css: {
        filename: 'css/[name].[contenthash:8].css',
      },
    }),
  ],

  module: {
    rules: [
      {
        test: /\.(css|sass|scss)$/,
        //use: ['css-loader', 'sass-loader'], // sass-loader <= 15.0.0
        use: [
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                // include the sources in the generated source map (required since sass-loader >= 16.0.0)
                sourceMapIncludeSources: true,
              },
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf|svg)$/i,
        type: 'asset/resource',
        include: path.resolve(__dirname, './src/fonts'),
        generator: {
          filename: 'fonts/[name].[hash:8][ext][query]',
        },
      },
    ],
  },
};
