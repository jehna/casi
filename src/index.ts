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
