const regexpTree = require('regexp-tree');

module.exports = function (re, opts) {
  if (!opts) opts = {};
  const replimit = opts.limit === undefined ? 25 : opts.limit;

  // Build an AST
  let myRegExp = null;
  let ast = null;
  try {
    // Construct a RegExp object
    if (re instanceof RegExp) {
      myRegExp = re;
    } else if (typeof re === 'string') {
      myRegExp = new RegExp(re);
    } else {
      myRegExp = new RegExp(String(re));
    }

    // Build an AST
    ast = regexpTree.parse(myRegExp);
  } catch (err) {
    // Invalid or unparseable input
    return false;
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
