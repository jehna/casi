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
const {fromEvent} = require('casi')

const iterator = fromEvent(document, 'click')

// Using ES Modules
import { fromEvent } from 'casi'

const iterator = fromEvent(document, 'click')
```

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
