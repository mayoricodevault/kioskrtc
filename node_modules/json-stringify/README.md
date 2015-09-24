# json-stringify [![NPM version](https://badge.fury.io/js/json-stringify.svg)](http://badge.fury.io/js/json-stringify) [![Build Status](https://travis-ci.org/kaelzhang/json-stringify.svg?branch=master)](https://travis-ci.org/kaelzhang/json-stringify) [![Dependency Status](https://gemnasium.com/kaelzhang/json-stringify.svg)](https://gemnasium.com/kaelzhang/json-stringify)

Enhanced JSON.stringify

## Install

```bash
$ npm install json-stringify --save
```

## Usage

```js
var stringify = require('json-stringify');
var array = [1, '2'];

stringify(array, {
  indent: 2,
  offset: 4
});
```

You will get 

```json
[
------1,
------"2"
----]
```

So, if we have an template

```
{
  "foo": <bar>,
  "foo2": <bar2>
}
```

And there's an object `obj`

```js
var bar = stringify({
  bee: 'boo'
}, {
  indent: 2,
  offset: 2
});

var bar2 = JSON.stringify({
  bee: 'boo'
}, null, 2);

var obj = {
  bar: bar,
  bar2: bar2
};
```

And the renderered result is:

```json
{
  "foo": {
    "bee": "boo"
  },
  "foo2": {
  "bee": "boo"
}
}
```

You must found the difference.


## Licence

MIT
<!-- do not want to make nodeinit to complicated, you can edit this whenever you want. -->