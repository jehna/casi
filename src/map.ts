import { curry } from './utils'

export async function* _map<T, K>(
  mapper: ((input: T) => K | Promise<K>) | K,
  iterator: AsyncIterableIterator<T>
): AsyncIterableIterator<K> {
  for await (let result of iterator) {
    if (mapper instanceof Function) {
      yield await mapper(result)
    } else {
      yield mapper
    }
  }
}

type map = {
  <T, K>(
    mapper: ((input: T) => K | Promise<K>) | K,
    iterator: AsyncIterableIterator<T>
  ): AsyncIterableIterator<K>
  <T, K>(mapper: ((input: T) => K | Promise<K>) | K): (
    iterator: AsyncIterableIterator<T>
  ) => AsyncIterableIterator<K>
}

const map: map = curry(_map)
export default map
