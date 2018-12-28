import { curry } from './utils'

async function* _zipWith<input1, input2, result>(
  stream1: AsyncIterableIterator<input1>,
  stream2: AsyncIterableIterator<input2>,
  combinator: (a: input1, b: input2) => result
): AsyncIterableIterator<result> {
  while (true) {
    const [result1, result2] = await Promise.all([
      stream1.next(),
      stream2.next()
    ])
    if (result1.done || result2.done) return

    yield combinator(result1.value, result2.value)
  }
}

type zipWith = {
  <input1, input2, result>(
    stream1: AsyncIterableIterator<input1>,
    stream2: AsyncIterableIterator<input2>,
    combinator: (a: input1, b: input2) => result
  ): AsyncIterableIterator<result>
  <input1, input2, result>(
    stream1: AsyncIterableIterator<input1>,
    stream2: AsyncIterableIterator<input2>
  ): (
    combinator: (a: input1, b: input2) => result
  ) => AsyncIterableIterator<result>
  <input1, input2, result>(stream1: AsyncIterableIterator<input1>): (
    stream2: AsyncIterableIterator<input2>,
    combinator: (a: input1, b: input2) => result
  ) => AsyncIterableIterator<result>
  <input1, input2, result>(stream1: AsyncIterableIterator<input1>): (
    stream2: AsyncIterableIterator<input2>
  ) => (
    combinator: (a: input1, b: input2) => result
  ) => AsyncIterableIterator<result>
}

const zipWith: zipWith = curry(_zipWith)

export default zipWith
