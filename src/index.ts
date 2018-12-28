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
