'use strict';

module.exports = stringify;
stringify._space = space;

// @param {Object} options
// - indent {Number}
// - offset {Number}
function stringify (object, options) {
  options || (options = {});
  var str = JSON.stringify(object, null, options.indent || 2);
  var offset = options.offset || 0;
  var spaces = space(offset);

  str = str
  .replace(/^|\n/g, function (match) {
    return match
      // carriage return
      ? match + spaces
      // Line start
      : spaces;
  })
  .slice(offset);

  return str;
}


function space (n) {
  var output = '';
  while (n --) {
    output += ' ';
  }

  return output;
}
