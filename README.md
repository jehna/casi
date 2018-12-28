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

[See live example!](https://codesandbox.io/s/4oqqyk8o7)

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
