export default async function first<T>(
  iterator: AsyncIterableIterator<T>
): Promise<T> {
  for await (let result of iterator) {
    return result
  }
}
