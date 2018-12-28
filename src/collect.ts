export default async function collect<T>(
  iterator: AsyncIterableIterator<T>
): Promise<T[]> {
  const arr: T[] = []
  try {
    for await (const result of iterator) {
      arr.push(result)
    }
  } finally {
    return arr
  }
}
