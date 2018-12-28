# casi

> Composable Asynchronous Iterators

A collection of helper functions for working with [JavaScript Asynchronous Iterators](https://github.com/tc39/proposal-async-iteration/blob/master/README.md).

## Getting started

This project is not yet available on NPM, but when it is, you can install it to
your project by running:

```shell
yarn add casi
```

This installs casi as a dependency to your project and you can require the
library in your project:

```javascript
// Using require
const { fromEvent } = require('casi')

const iterator = fromEvent(document, 'click')

// Using ES Modules
import { fromEvent } from 'casi'

const iterator = fromEvent(document, 'click')
```

### Example: Simple map and filter

You can use simple functions like `map` and `filter` to manipulate your
asynchronous iterators:

```js
import { pipe, assign, fromArray, map, filter } from 'casi'

const printOddDoubles = pipe(
  fromArray,
  filter(x => x % 2 === 1),
  map(x => x + x),
  assign(console, 'log')
)

printOddDoubles([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
// Prints 2, 6, 10, 14, 18
```

**[See live example!](https://codesandbox.io/s/r7jrom8ywp)**

This example takes an array, converts it to an asynchronous iterator with
`fromArray`, filters out even values with `filter`, doubles all the remaining
values with `map` and finally prints the values out to your console using
`assign` setter.

Notice that all of these functions are _composable_, which means you can compose
higher-order functions using tools like `compose` or `pipe`. In our example we
use `pipe` (which is a normal `compose`, but the order of the arguments is
reversed) to create a general function called `printOddDoubles`.

### Example: Simple counter

Implementing a simple counter in casi can be done in few lines. Assuming you
have a couple of buttons and an element with id `result`, you can do the
following:

```js
import { scan, assign, fromEvent, pipe, map, merge } from 'casi'

const up = fromEvent(document.getElementById('plus'), 'click')
const down = fromEvent(document.getElementById('minus'), 'click')
const result = document.getElementById('result')

const stream = merge([map(+1, up), map(-1, down)])
const assignResult = pipe(
  scan(0, (a, b) => a + b),
  assign(result, 'innerText')
)

assignResult(stream)
```

**[See live example!](https://codesandbox.io/s/4oqqyk8o7)**

This example first takes `click` events from buttons with ids `plus` and
`minus`, and converts them to `AsyncIterableIterator` streams with `fromEvent`
function.

We then use `map` to convert the values to `+1` and `-1` respectively, and we
combine those iterators to a single iterator called `stream`.

The `scan` function helps us to hold a value while incrementing/decrementing it
by the value from `stream`. Last we'll use `assign` to bind the value to element
with id `result`.

## Developing

You can run the tests in the project by running:

```shell
yarn test
```

All casi functions should be covered by automation tests.

## Features

This project is meant to be a collection of helper functions to work with
JavaScript's asynchronous iterators.

## Motivation

This project aims to make the native JavaScript asynchronous iterators more
usable while offering a bunch of functions that help to handle the concept in
your code.

The project takes heavy inspiration from existing stream-handling libraries like
[bacon.js](https://baconjs.github.io/) and [RxJS](http://reactivex.io/rxjs), so
if you're familiar with these concepts, you should have easy time following the
functions found in casi.

## Contributing

If you'd like to contribute, please fork the repository and use a feature
branch. Pull requests are warmly welcome.

## Links

- Project homepage: https://github.com/jehna/casi
- Repository: https://github.com/jehna/casi
- Issue tracker: https://github.com/jehna/casi/issues
- Related projects:
  - [Bacon.js](https://baconjs.github.io/)
  - [RxJS](https://github.com/ReactiveX/rxjs)

## Licensing

The code in this project is licensed under MIT license.
