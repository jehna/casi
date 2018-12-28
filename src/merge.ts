export default async function* merge<T>(
  iterators: ReadonlyArray<AsyncIterableIterator<T>>
): AsyncIterableIterator<T> {
  const alive = iterators.map(() => true)
  const needsNext = iterators.map(() => true)
  const promises: Promise<IteratorResult<T>>[] = []
  const pendingValues: T[] = []

  while (alive.some(Boolean)) {
    for (let i = 0; i < iterators.length; i++) {
      if (needsNext[i]) {
        const current = i
        promises[i] = iterators[i].next().then(value => {
          needsNext[current] = true
          alive[current] = !value.done
          if (!value.done) pendingValues.push(value.value)
          return value
        })
      }
    }

    const alivePromises = promises.filter((promise, i) => alive[i])
    await Promise.race(alivePromises)

    while (pendingValues.length > 0) {
      yield pendingValues.shift()
    }
  }
}
