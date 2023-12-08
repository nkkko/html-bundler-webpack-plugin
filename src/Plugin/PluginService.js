/**
 * The plugin services for common usage.
 * The instance is available both in the plugin and loader.
 */

const Preprocessor = require('../Loader/Preprocessor');

class PluginService {
  // TODO: add methods to set this properties
  static plugin;
  static compilation;

  /** @type {OptionPluginInterface | {}} Provide to use the plugin option instance in the loader. */
  static #PluginOption = null;

  // options defined in the plugin but provided to the loader
  static #loaderOptions = {};

  // cached loader options
  static #loaderCache = new Map();
  static #used = false;
  static #watchMode;
  static #hotUpdate;
  static #contextCache = new Set();
  static dataFiles = new Map();

  // dependency injected instances
  static Dependency = null;

  // entry files where js file was not resolved,
  // used to try to rebuild the entry module when a missing js file is added or renamed to the required name
  static missingFiles = new Set();

  /**
   * Set use state of the plugin.
   *
   * If the plugin is used, then this method will be called by the plugin initialization
   * to disable some features of the plugin, because never used with the plugin,
   * but require additional compilation time.
   *
   * @param {OptionPluginInterface} PluginOption The plugin options instance.
   */
  static init(PluginOption) {
    const pluginOptions = PluginOption.get();
    const loaderOptions = pluginOptions.loaderOptions || {};

    // add reference for data to the loader options
    if (pluginOptions.data && !loaderOptions.data) {
      loaderOptions.data = pluginOptions.data;
    }

    // add reference for beforePreprocessor to the loader options
    if (pluginOptions.beforePreprocessor != null && loaderOptions.beforePreprocessor == null) {
      loaderOptions.beforePreprocessor = pluginOptions.beforePreprocessor;
    }

    // add reference for the preprocessor option into the loader options
    if (pluginOptions.preprocessor != null && loaderOptions.preprocessor == null) {
      loaderOptions.preprocessor = pluginOptions.preprocessor;

      if (pluginOptions.preprocessorOptions && !loaderOptions.preprocessorOptions) {
        loaderOptions.preprocessorOptions = pluginOptions.preprocessorOptions;
      }
    }

    this.#used = true;
    this.#watchMode = false;
    this.#hotUpdate = pluginOptions.hotUpdate;
    this.#PluginOption = PluginOption;
    this.#loaderOptions = loaderOptions;
    this.#loaderCache.clear();
  }

  /**
   * Whether the plugin is defined in Webpack configuration.
   * @return {boolean}
   */
  static isUsed() {
    return this.#used;
  }

  /**
   * @return {boolean}
   */
  static isWatchMode() {
    return this.#watchMode;
  }

  static isCached(context) {
    if (this.#contextCache.has(context)) return true;
    this.#contextCache.add(context);

    return false;
  }

  /**
   * @return {boolean}
   */
  static useHotUpdate() {
    return this.#hotUpdate;
  }

  static setDependencyInstance(Dependency) {
    this.Dependency = Dependency;
  }

  /**
   * @returns {HtmlBundlerPlugin.Hooks} The plugin hooks.
   */
  static getHooks() {
    return this.plugin.getHooks(this.compilation);
  }

  /**
   * Returns plugin options instance.
   *
   * TODO: rename to getOptionInstance()
   *
   * @return {OptionPluginInterface}
   */
  static getOptions() {
    return this.#PluginOption;
  }

  /**
   * Returns options defined in the plugin but provided for the loader.
   *
   * @return {Object}
   */
  static getLoaderOptions() {
    return this.#loaderOptions;
  }

  /**
   * Get cached loader options defined in rules.
   *
   * @param {string} id
   * @return {Object}
   */
  static getLoaderCache(id) {
    return this.#loaderCache.get(id);
  }

  /**
   * Save initialized loader options in cache to avoid double initialization
   * when many templates loaded with same loader options.
   *
   * @param {string} id
   * @param {Object} cache
   */
  static setLoaderCache(id, cache) {
    this.#loaderCache.set(id, cache);
  }

  /**
   * @param {boolean} mode The mode is true when Webpack run as watch/serve.
   */
  static setWatchMode(mode) {
    this.#watchMode = mode;
  }

  /**
   * Called before each new compilation, in the serve/watch mode.
   */
  static watchRun() {
    for (const [id, options] of this.#loaderCache) {
      Preprocessor.watchRun(options);
    }
  }

  /**
   * Reset settings.
   * Called before each new compilation after changes, in the serve/watch mode.
   */
  static reset() {}

  /**
   * Called when the compiler is closing.
   * Used for tests to reset data after each test case.
   */
  static shutdown() {
    this.#used = false;
    this.#contextCache.clear();
    this.dataFiles.clear();
    this.Dependency && this.Dependency.shutdown();
  }
}

module.exports = PluginService;
