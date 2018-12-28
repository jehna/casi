import zipWith from './zip-with'
import { curry } from './utils'

async function* _zip<input1, input2>(
  stream1: AsyncIterableIterator<input1>,
  stream2: AsyncIterableIterator<input2>
): AsyncIterableIterator<[input1, input2]> {
  for await (const result of zipWith(
    stream1,
    stream2,
    (a, b) => [a, b] as [input1, input2]
  )) {
    yield result
  }
}

type zip = {
  <input1, input2>(
    stream1: AsyncIterableIterator<input1>,
    stream2: AsyncIterableIterator<input2>
  ): AsyncIterableIterator<[input1, input2]>
  <input1, input2>(stream1: AsyncIterableIterator<input1>): (
    stream2: AsyncIterableIterator<input2>
  ) => AsyncIterableIterator<[input1, input2]>
}

const zip: zip = curry(_zip)

export default zip
