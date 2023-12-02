const { loadModule } = require('../../../Common/FileUtils');
const { stringifyData } = require('../../Utils');

// replace the partial file and data to load nested included template via the Webpack loader
// include("./file.html")                   => require("./file.eta")({...locals, ...{}})
// include('./file.html', { name: 'Siri' }) => require('./file.eta')({...locals, ...{name: 'Siri'}})
const includeRegexp = /include\((.+?)(?:\)|,\s*{(.+?)}\))/g;

/**
 * Transform the raw template source to a template function or HTML.
 *
 * @param {BundlerPluginLoaderContext} loaderContext
 * @param {{}} options
 * @return {{compile: (function(string, {resourcePath: string, data?: {}}): *), render: (function(string, {resourcePath: string, data?: {}}): *), export: (function(string, {data: {}}): string)}}
 */
const preprocessor = (loaderContext, options) => {
  const Ejs = loadModule('ejs');
  const { rootContext } = loaderContext;

  return {
    /**
     * Render template into HTML.
     * Called for rendering of template defined as entry point.
     *
     * @param {string} source The template source code.
     * @param {string} resourcePath
     * @param {{}} data
     * @return {string}
     */
    render(source, { resourcePath, data = {} }) {
      return Ejs.render(source, data, {
        async: false,
        root: rootContext, // root path for includes with an absolute path (e.g., /file.html)
        ...options,
        filename: resourcePath, // allow including a partial relative to the template
      });
    },

    /**
     * Compile template into template function.
     * Called when a template is loaded in JS in `compile` mode.
     *
     * @param {string} source The template source code.
     * @param {string} resourcePath
     * @param {{}} data
     * @return {string}
     */
    compile(source, { resourcePath, data = {} }) {
      return Ejs.compile(source, {
        compileDebug: false,
        root: rootContext,
        ...options,
        client: true,
        async: false,
        filename: resourcePath, // allow including a partial relative to the template
        context: data,
      })
        .toString()
        .replaceAll(includeRegexp, `require($1)({...locals, ...{$2}})`);
    },

    /**
     * Export the compiled template function contained resolved source asset files.
     * Note: this method is required for `compile` mode.
     *
     * @param {string} templateFunction The source code of the template function.
     * @param {{}} data The object with variables passed in template.
     * @return {string} The exported template function.
     */
    export(templateFunction, { data }) {
      // the name of template function in generated code
      const exportFunction = 'anonymous';
      const exportCode = 'module.exports=';

      return `${templateFunction};
        var __data__ = ${stringifyData(data)};
        var template = (context) => ${exportFunction}(Object.assign(__data__, context));
        ${exportCode}template;`;
    },
  };
};

module.exports = preprocessor;
module.exports.test = /\.(html|ejs)$/;
