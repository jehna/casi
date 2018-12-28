export default async function* fromArray<T>(
  array: IterableIterator<T> | ReadonlyArray<T>
): AsyncIterableIterator<T> {
  for (const item of array) {
    yield item
  }
}
