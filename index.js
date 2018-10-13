const regexpTree = require('regexp-tree');

module.exports = function (re, opts) {
  if (!opts) opts = {};
  const replimit = opts.limit === undefined ? 25 : opts.limit;

  let pattern = null;
  if (isRegExp(re)) pattern = re.source;
  else if (typeof re === 'string') pattern = re;
  else pattern = String(re);

  let ast = null;
  try {
    ast = regexpTree.parse(pattern);
  } catch (err) {
    try {
      ast = regexpTree.parse(`/${pattern}/`); }
    catch (err) {
      return false;
    }
  }

  let currentStarHeight = 0;
  let maxObservedStarHeight = 0;

  let repetitionCount = 0;

  regexpTree.traverse(ast, {
    'Repetition': {
      pre ({node}) {
        repetitionCount++;

        currentStarHeight++;
        if (maxObservedStarHeight < currentStarHeight) {
          maxObservedStarHeight = currentStarHeight;
        }
      },

      post ({node}) {
        currentStarHeight--;
      }
    }
  });

  return (maxObservedStarHeight <= 1) && (repetitionCount <= replimit);
};

function isRegExp (x) {
    return {}.toString.call(x) === '[object RegExp]';
}
