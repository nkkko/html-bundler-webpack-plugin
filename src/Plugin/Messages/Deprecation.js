const { red, green, black } = require('ansis');
const { pluginName } = require('../../config');
const { outToConsole } = require('../../Common/Helpers');

const header = `\n${black.bgYellow` ${pluginName} `}${black.bgAnsi(227)` DEPRECATE `} `;

// Example for deprecations

// const deprecateSomeOption = () => {
//   outToConsole(header + `Use the '${green`css`}' option name instead of the '${red`deprecate`}'.\n`);
// };
//
// module.exports = {
//   deprecateSomeOption,
// };
