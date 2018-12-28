import collect from './collect'
import { testIterator } from './test-utils'

describe('collect', () => {
  it('should collect all values from iterator and return a promise', async () => {
    const result = await collect(testIterator(3))
    expect(result).toEqual([0, 1, 2])
  })

  it('should return empty array if no values are emitted', async () => {
    const result = await collect(testIterator(0))
    expect(result).toEqual([])
  })
})
