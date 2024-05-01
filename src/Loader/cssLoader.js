/**
 * The CSS loader is needed only for styles imported in JavaScript.
 *
 * Note: styles specified directly in HTML template are extracted without any loader.
 */

const Collection = require('../Plugin/Collection');
const { baseUri, urlPathPrefix, cssLoaderName } = require('./Utils');

/**
 * @this {import("webpack").LoaderContext<LoaderOption>}
 * @param {string} content
 */
const loader = function (content) {
  /* istanbul ignore next */
  if (this._compiler.options?.experiments?.css && this._module?.type === 'css') {
    return content;
  }
};

/**
 * @this {import("webpack").LoaderContext<LoaderOption>}
 * @param {string} remaining
 */
const pitchLoader = async function (remaining) {
  // TODO: find the module from this._compilation, because this._module is deprecated
  const { resource, resourcePath, _module: module } = this;
  const options = this.getOptions() || {};
  const isUrl = module.resourceResolveData?.query.includes('url');
  const exportComment = '/* extracted by HTMLBundler CSSLoader */';
  const isHot = this.hot;

  console.log('###CSS LOADER1: ', { remaining });

  remaining += resource.includes('?') ? '&' : '?';

  // create a unique request different from the original to avoid cyclic loading of the same style file
  const request = `${resourcePath}.webpack[javascript/auto]!=!!!${remaining}${cssLoaderName}`;

  const result = await this.importModule(request, {
    layer: options.layer,
    publicPath: urlPathPrefix,
    baseUri,
  });

  // defaults, the css-loader option `esModule` is `true`
  const esModule = result.default != null;
  let styles;

  if (esModule) {
    const exports = Object.keys(result).filter((key) => key !== 'default');

    if (exports.length > 0) {
      styles = {};
      for (const className of exports) {
        styles[className] = result[className];
      }
    }
  } else if ('locals' in result) {
    styles = result.locals;
  }

  Collection.setImportStyleEsModule(esModule);

  const cssSource = esModule ? result.default : result;
  if (!isHot) {
    module._cssSource = cssSource;
  }

  // support for lazy load CSS in JavaScript, see the test js-import-css-lazy-url
  if (isUrl) {
    return exportComment + cssSource;
  }

  let hmr = '';

  if (isHot) {
    const loaderContext = this;
    const css = result.default.toString().replaceAll('\n', '');
    const modulePath = JSON.stringify(loaderContext.utils.contextify(loaderContext.context, `!!${remaining}`));

    hmr = `
const css = \`${css}\`;
const isDocument = typeof document !== 'undefined';

if (!isDocument) {
  console.log('CSS HMR does not work!');
}

console.log('### CSS HMR!');

if (isDocument && module.hot) { 
  module.hot.accept(undefined, function () {
    // Do something ...
  });
  
  document._cssHmr = document._cssHmr || { idx: 1, styleIds: new Map() };
  const hmrMod = document._cssHmr;
  const moduleId = module.id;

  let styleId = hmrMod.styleIds.get(moduleId);
  let styleElm;

  if (styleId) {
    styleElm = document.getElementById(styleId);
  } else {
    styleId = 'hot-update-' + hmrMod.idx++;
    styleElm = document.createElement('style');
    styleElm.setAttribute('id', styleId);
    document.head.appendChild(styleElm);
    hmrMod.styleIds.set(moduleId, styleId);
  }

  if (styleElm) {
     styleElm.innerText = css;
  }

  console.log('### module.hot: ', { modId: module.id, styleId, styleElm }, hmrMod);
}
`;
  }

  //console.log('###CSS LOADER: ', { remaining, request, styles }, hmr);

  return styles ? (esModule ? 'export default' : 'module.exports = ') + JSON.stringify(styles) : exportComment + hmr;
};

module.exports = loader;
module.exports.pitch = pitchLoader;
