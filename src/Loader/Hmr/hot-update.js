// To enable live reload, just add an empty JS file in HTML.
// Webpack automatically inserts the hot update code into this file.

if (module.hot) {
  console.log('*** hot-update HMR: ', { modId: module.id });

  const autoApply = true;

  // module.hot
  //   .check(autoApply)
  //   .then((outdatedModules) => {
  //     // outdated modules...
  //     console.log('*** HMR outdatedModules: ', { outdatedModules });
  //   })
  //   .catch((error) => {
  //     // catch errors
  //   });

  const modules = [
    //
    '/Users/biodiscus/Devel/Projects/GitHub/webpack/html-bundler-webpack-plugin/test/manual/watch-css-hmr/src/style-a.css',
    "'/Users/biodiscus/Devel/Projects/GitHub/webpack/html-bundler-webpack-plugin/node_modules/css-loader/dist/cjs.js!/Users/biodiscus/Devel/Projects/GitHub/webpack/html-bundler-webpack-plugin/test/manual/watch-css-hmr/src/style-a.css",
    './src/style-a.css',
    './style-a.css',
  ];

  // module.hot.accept(modules, function () {
  //   // Do something with the updated library module...
  //   console.log('*** HMR accept: ', { hot: module.hot });
  // });
}
