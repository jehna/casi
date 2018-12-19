export async function* map<T, K>(
  callback: (input: T) => K,
  iterator: AsyncIterableIterator<T>
): AsyncIterableIterator<K> {
  for await (let result of iterator) {
    yield await callback(result)
  }
}

export async function* filter<T>(
  callback: (input: T) => boolean,
  iterator: AsyncIterableIterator<T>
): AsyncIterableIterator<T> {
  for await (let result of iterator) {
    if (callback(result)) yield result
  }
}

export async function* collect<T>(
  iterator: AsyncIterableIterator<T>
): AsyncIterableIterator<T[]> {
  const arr: T[] = []
  for await (let result of iterator) {
    arr.push(result)
  }
  yield arr
}

export async function first<T>(iterator: AsyncIterableIterator<T>): Promise<T> {
  for await (let result of iterator) {
    return result
  }
}
