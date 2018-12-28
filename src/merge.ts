function createLock(): {
  lock: Promise<void>
  release: () => void
} {
  let release
  const lock = new Promise<void>((resolve, reject) => (release = resolve))
  return { lock, release }
}

export default async function* merge<T>(
  iterators: ReadonlyArray<AsyncIterableIterator<T>>
): AsyncIterableIterator<T> {
  let lock = createLock()
  let aborted = false
  const alive = iterators.map(() => true)
  const pendingValues: T[] = []

  const abort = () => {
    aborted = true
    lock.release()
  }

  const bindOnNext = (iterator: AsyncIterableIterator<T>, i: number) => (
    value: IteratorResult<any>
  ) => {
    alive[i] = !value.done
    if (!value.done && !aborted) {
      pendingValues.push(value.value)
      iterator
        .next()
        .then(bindOnNext(iterator, i))
        .catch(abort)
    }
    lock.release()
  }

  iterators.forEach((iterator, i) =>
    iterator
      .next()
      .then(bindOnNext(iterator, i))
      .catch(abort)
  )

  while (!aborted && alive.some(Boolean)) {
    await lock.lock
    while (pendingValues.length > 0) {
      yield pendingValues.shift()
    }

    lock = createLock()
  }
}
