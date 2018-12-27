export async function* map<T, K>(
  mapper: ((input: T) => K) | K,
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
  try {
    for await (let result of iterator) {
      arr.push(result)
    }
  } finally {
    yield arr
  }
}

export async function first<T>(iterator: AsyncIterableIterator<T>): Promise<T> {
  for await (let result of iterator) {
    return result
  }
}

export async function* fromCallback<T>(
  callbackFunction: (callback: (err?: any, val?: T) => any) => any
): AsyncIterableIterator<T> {
  let resolve: (value?: T | PromiseLike<T>) => void
  let reject: (reason?: any) => void

  callbackFunction((err, val) => {
    if (err) {
      reject(err)
    } else {
      resolve(val)
    }
  })

  while (true) {
    yield await new Promise((newResolve, newReject) => {
      resolve = newResolve
      reject = newReject
    })
  }
}

export async function* fromEvent(
  eventSource: EventTarget,
  eventName: string
): AsyncIterableIterator<Event> {
  let resolve: (value: Event) => void
  const listener = (val: Event) => {
    resolve(val)
  }

  eventSource.addEventListener(eventName, listener)

  try {
    while (true) {
      yield await new Promise(newResolve => {
        resolve = newResolve
      })
    }
  } finally {
    eventSource.removeEventListener(eventName, listener)
  }
}

export async function assign<T>(
  object: any,
  property: string,
  iterator: AsyncIterableIterator<T>
): Promise<void> {
  const target = object[property]
  const setter =
    typeof target === 'function' ? target : v => (object[property] = v)
  for await (let result of iterator) {
    setter(result)
  }
}

export async function* merge<T>(
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

export async function* scan<In, Out>(
  initialValue: Out,
  callback: (currentValue: Out, input: In) => Out,
  iterator: AsyncIterableIterator<In>
): AsyncIterableIterator<Out> {
  let currentValue = initialValue
  for await (const value of iterator) {
    currentValue = callback(currentValue, value)
    yield currentValue
  }
}

interface AsyncIterableIteratorWithClose extends AsyncIterableIterator<any> {
  close: () => void
}

export function closer(): AsyncIterableIteratorWithClose {
  let close
  const promise: Promise<IteratorResult<any>> = new Promise(
    (resolve, reject) => {
      close = reject
    }
  )

  const iterator = {
    [Symbol.asyncIterator]: () => iterator,
    next: () => promise,
    close: () => close()
  }
  return iterator
}

export async function* take<T>(
  count: number,
  iterator: AsyncIterableIterator<T>
): AsyncIterableIterator<T> {
  let i = 0
  for await (const result of iterator) {
    yield result
    if (++i >= count) return
  }
}

export async function* fromArray<T>(
  array: IterableIterator<T> | ReadonlyArray<T>
): AsyncIterableIterator<T> {
  for (const item of array) {
    yield item
  }
}

export function zip<input1, input2>(
  stream1: AsyncIterableIterator<input1>,
  stream2: AsyncIterableIterator<input2>
): AsyncIterableIterator<[input1, input2]>
export function zip<input1, input2, result>(
  stream1: AsyncIterableIterator<input1>,
  stream2: AsyncIterableIterator<input2>,
  combinator: (a: input1, b: input2) => result
): AsyncIterableIterator<result>
export async function* zip<input1, input2, result>(
  stream1: AsyncIterableIterator<input1>,
  stream2: AsyncIterableIterator<input2>,
  combinator?: (a: input1, b: input2) => result
): AsyncIterableIterator<result | [input1, input2]> {
  while (true) {
    const [result1, result2] = await Promise.all([
      stream1.next(),
      stream2.next()
    ])
    if (result1.done || result2.done) return

    if (combinator) {
      yield combinator(result1.value, result2.value)
    } else {
      yield [result1.value, result2.value]
    }
  }
}
