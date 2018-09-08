# Object-Scan

[![Build Status](https://img.shields.io/travis/simlu/object-scan/master.svg)](https://travis-ci.org/simlu/object-scan)
[![Test Coverage](https://img.shields.io/coveralls/simlu/object-scan/master.svg)](https://coveralls.io/github/simlu/object-scan?branch=master)
[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=simlu/object-scan)](https://dependabot.com)
[![Dependencies](https://david-dm.org/simlu/object-scan/status.svg)](https://david-dm.org/simlu/object-scan)
[![NPM](https://img.shields.io/npm/v/object-scan.svg)](https://www.npmjs.com/package/object-scan)
[![Downloads](https://img.shields.io/npm/dt/object-scan.svg)](https://www.npmjs.com/package/object-scan)
[![Semantic-Release](https://github.com/simlu/js-gardener/blob/master/assets/icons/semver.svg)](https://github.com/semantic-release/semantic-release)
[![Gardener](https://github.com/simlu/js-gardener/blob/master/assets/badge.svg)](https://github.com/simlu/js-gardener)
[![Gitter](https://github.com/simlu/js-gardener/blob/master/assets/icons/gitter.svg)](https://gitter.im/simlu/object-scan)

Find Keys using Wildcard matching and optional value function.

## Install

Install with [npm](https://www.npmjs.com/):

    $ npm install --save object-scan

## Usage

<!-- eslint-disable-next-line import/no-unresolved, import/no-extraneous-dependencies -->
```js
const objectScan = require('object-scan');

objectScan(["a.*.f"])({ a: { b: { c: 'd' }, e: { f: 'g' } } });
// => [ 'a.e.f' ]
```

### Options

#### filterFn

Type: `function`<br>
Default: `undefined`

Takes arguments `key` (dot joined and escaped) and `value` (value for given key) and called for every potential result.
If function is defined and returns false, the entry is filtered from the result. 

#### breakFn

Type: `function`<br>
Default: `undefined`

Takes arguments `key` (dot joined and escaped) and `value` (value for given key) and called for every potential result.
If function is defined and returns true, no nested entries are checked.

#### joined

Type: `boolean`<br>
Default: `true`

Can be set to false to return each key as a list. When dealing with special characters this can be useful.

## Examples

More extensive examples can be found in the tests.

<!-- eslint-disable-next-line import/no-unresolved, import/no-extraneous-dependencies -->
```js
const objectScan = require('object-scan');

const obj = {
  a: {
    b: {
      c: 'd'
    },
    e: {
      f: 'g'
    },
    h: ["i", "j"]
  },
  k: "l"
};

// top level keys
objectScan(["*"])(obj);
// => ["a", "k"]

// nested keys
objectScan(["a.*.f"])(obj);
// => ["a.e.f"]
objectScan(["*.*.*"])(obj);
// => ["a.b.c", "a.e.f"]

// or filter
objectScan(["a.*.{c,f}"])(obj);
// => ["a.b.c", "a.e.f"]
objectScan(["a.*.{c,f}"], { joined: false })(obj);
// => [["a", "b", "c"], ["a", "e", "f"]]

// list filter
objectScan(["*.*[*]"])(obj);
// => ["a.h[0]", "a.h[1]"]
objectScan(["*[*]"])(obj);
// => []

// deep star filter
objectScan(["**"])(obj);
// => ["a", "a.b", "a.b.c", "a.e", "a.e.f", "a.h", "a.h[0]", "a.h[1]", "k"]
objectScan(["**.f"])(obj);
// => ["a.e.f"]
objectScan(["**[*]"])(obj);
// => ["a.h[0]", "a.h[1]"]

// value function
objectScan(["**"], { filterFn: (key, value) => typeof value === "string" })(obj);
// => ["a.b.c", "a.e.f", "a.h[0]", "a.h[1]", "k"]
objectScan(["**"], { breakFn: key => key === "a.b" })(obj);
// => ["a", "a.b", "a.e", "a.e.f", "a.h", "a.h[0]", "a.h[1]", "k"]);
```

## Special Characters

The following Characters are considered special and need to 
be escaped if they should be matched in a key: `[`, `]`, `{`, `}`, `,`, `.` and `*`. 

When dealing with special characters the `joined` option might be desirable to set to `false`.