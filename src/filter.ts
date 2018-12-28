import { curry } from './utils'

async function* _filter<T>(
  callback: (input: T) => boolean,
  iterator: AsyncIterableIterator<T>
): AsyncIterableIterator<T> {
  for await (let result of iterator) {
    if (callback(result)) yield result
  }
}

type filter = {
  <T>(
    callback: (input: T) => boolean,
    iterator: AsyncIterableIterator<T>
  ): AsyncIterableIterator<T>
  <T>(callback: (input: T) => boolean): (
    iterator: AsyncIterableIterator<T>
  ) => AsyncIterableIterator<T>
}
const filter: filter = curry(_filter)

export default filter
