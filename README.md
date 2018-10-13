# safe-regex

Detect potentially
[catastrophic](http://regular-expressions.mobi/catastrophic.html)
[exponential-time](http://perlgeek.de/blog-en/perl-tips/in-search-of-an-exponetial-regexp.html)
regular expressions by limiting the
[star height](https://en.wikipedia.org/wiki/Star_height) to 1.

WARNING: This module has both false positives and false negatives.
Use [vuln-regex-detector](https://github.com/davisjam/vuln-regex-detector) for improved accuracy.

[![browser support](https://ci.testling.com/substack/safe-regex.png)](https://ci.testling.com/substack/safe-regex)

[![build status](https://secure.travis-ci.org/substack/safe-regex.png)](http://travis-ci.org/substack/safe-regex)

# Example

``` js
var safe = require('safe-regex');
var regex = process.argv.slice(2).join(' ');
console.log(safe(regex));
```

```
$ node safe.js '(x+x+)+y'
false
$ node safe.js '(beep|boop)*'
true
$ node safe.js '(a+){10}'
false
$ node safe.js '\blocation\s*:[^:\n]+\b(Oakland|San Francisco)\b'
true
```

# Methods

``` js
const safe = require('safe-regex')
```

## const ok = safe(re, opts={})

Return a boolean `ok` whether or not the regex `re` is safe and not possibly
catastrophic.

`re` can be a `RegExp` object or just a string.

If the `re` is a string and is an invalid regex, returns `false`.

* `opts.limit` - maximum number of allowed repetitions in the entire regex.
Default: `25`.

# Install

With [npm](https://npmjs.org) do:

```
npm install safe-regex
```

# License

MIT
