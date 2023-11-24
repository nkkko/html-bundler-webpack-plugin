'use strict';

/** @typedef {import('handlebars')} Handlebars */
/** @typedef {import('handlebars').HelperOptions} HelperOptions */

/**
 * Insert the partial content as a block.
 * Note: `partial` and `block` are paar helpers.
 *
 * Usage:
 *   {{#partial 'BLOCK_NAME'}}BLOCK_CONTENT{{/partial}} - define block content
 *   {{#block 'BLOCK_NAME'}}{{/block}} - output block content
 *
 * @param {Handlebars} Handlebars
 * @return {function(string, HelperOptions, *): *}
 */
module.exports = (Handlebars) => {
  /**
   * @param {string} name The block name.
   * @param {HelperOptions} options The options passed via tag attributes into a template.
   * @return {string}
   */
  return function (name, options) {
    const partial = this._blocks[name] || options.fn;

    return partial(this);
  };
};
