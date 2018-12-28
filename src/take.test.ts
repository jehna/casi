import collect from './collect'
import { testIterator } from './test-utils'
import take from './take'

describe('take', () => {
  it('should take n first items from stream', async () => {
    const result = await collect(take(4, testIterator(10)))
    expect(result).toEqual([0, 1, 2, 3])
  })

  it('should end the stream after the nth iteration', async () => {
    async function* forever() {
      let i = 0
      while (true) {
        yield i++
      }
    }

    const result = await collect(take(10, forever()))
    expect(result).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
  })
})
