import { curry } from './utils'

// Recursive array type, inspiration taken from https://github.com/Microsoft/TypeScript/issues/3496#issuecomment-128553540
type Flattable<T> = T | RecursiveArray<T>
interface RecursiveArray<T> extends Array<Flattable<T>> {}

function flatten<T>(input: Flattable<T>): T[] {
  if (!Array.isArray(input)) {
    return [input]
  }

  return input.reduce<T[]>((prev, next) => [...prev, ...flatten(next)], [])
}

export async function* _flatMap<T, K>(
  mapper: (input: T) => Flattable<K> | Promise<Flattable<K>>,
  iterator: AsyncIterableIterator<T>
): AsyncIterableIterator<K> {
  for await (let result of iterator) {
    const mapped = await mapper(result)
    if (Array.isArray(mapped)) {
      for (const item of flatten(mapped)) {
        yield item
      }
    } else {
      yield mapped
    }
  }
}

type flatMap = {
  <T, K>(
    mapper: ((input: T) => Flattable<K> | Promise<Flattable<K>>),
    iterator: AsyncIterableIterator<T>
  ): AsyncIterableIterator<K>
  <T, K>(mapper: (input: T) => Flattable<K> | Promise<Flattable<K>>): (
    iterator: AsyncIterableIterator<T>
  ) => AsyncIterableIterator<K>
}

const flatMap: flatMap = curry(_flatMap)
export default flatMap
