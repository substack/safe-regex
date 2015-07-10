var parse = require('ret');
var types = parse.types;

module.exports = function (re, opts) {
    if (!opts) opts = {};
    var replimit = opts.limit === undefined ? 25 : opts.limit;

    if (isRegExp(re)) re = re.source;
    else if (typeof re !== 'string') re = String(re);

    try { re = parse(re) }
    catch (err) { return false }

    var reps = 0;
    return (function walk (node, height, starHeight) {
        if (node.type === types.REPETITION) {
            if (height > 1 || node.max !== 1)
                starHeight ++;
            reps ++;
            if (starHeight > 1) return false;
            if (reps > replimit) return false;
        }

        if (node.options) {
            for (var i = 0, len = node.options.length; i < len; i++) {
                var ok = walk({ stack: node.options[i] }, height+1, starHeight);
                if (!ok) return false;
            }
        }
        var stack = node.stack || (node.value && node.value.stack);
        if (!stack) return true;

        for (var i = 0; i < stack.length; i++) {
            var ok = walk(stack[i], height+1, starHeight);
            if (!ok) return false;
        }

        return true;
    })(re, 0, 0);
};

function isRegExp (x) {
    return {}.toString.call(x) === '[object RegExp]';
}
