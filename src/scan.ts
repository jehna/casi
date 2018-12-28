import { curry } from './utils'

async function* _scan<T, R>(
  initialValue: R,
  callback: (currentValue: R, input: T) => R,
  iterator: AsyncIterableIterator<T>
): AsyncIterableIterator<R> {
  let currentValue = initialValue
  for await (const value of iterator) {
    currentValue = callback(currentValue, value)
    yield currentValue
  }
}

type scan = {
  <T, R>(
    initialValue: R,
    callback: (currentValue: R, input: T) => R,
    iterator: AsyncIterableIterator<T>
  ): AsyncIterableIterator<R>
  <T, R>(initialValue: R, callback: (currentValue: R, input: T) => R): (
    iterator: AsyncIterableIterator<T>
  ) => AsyncIterableIterator<R>
  <T, R>(initialValue: R): (
    callback: (currentValue: R, input: T) => R,
    iterator: AsyncIterableIterator<T>
  ) => AsyncIterableIterator<R>
  <T, R>(initialValue: R): (
    callback: (currentValue: R, input: T) => R
  ) => (iterator: AsyncIterableIterator<T>) => AsyncIterableIterator<R>
}

const scan: scan = curry(_scan)

export default scan
