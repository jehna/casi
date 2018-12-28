import { curry } from './utils'

async function* _take<T>(
  count: number,
  iterator: AsyncIterableIterator<T>
): AsyncIterableIterator<T> {
  let i = 0
  for await (const result of iterator) {
    yield result
    if (++i >= count) return
  }
}

type take = {
  <T>(count: number, iterator: AsyncIterableIterator<T>): AsyncIterableIterator<
    T
  >
  <T>(count: number): (
    iterator: AsyncIterableIterator<T>
  ) => AsyncIterableIterator<T>
}

const take: take = curry(_take)

export default take
