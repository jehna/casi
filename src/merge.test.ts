import { testIterator } from './test-utils'
import merge from './merge'
import collect from './collect'
import map from './map'

describe('merge', () => {
  it('should work like an identity function if one stream is passed', async () => {
    const stream = testIterator(2)
    const merged = merge([stream])
    const result = await collect(merged)

    expect(result).toEqual([0, 1])
  })

  it('should output all values of all iterators passed', async () => {
    const stream1 = testIterator(2)
    const stream2 = map(i => i + 2, testIterator(2))
    const merged = merge([stream1, stream2])
    const result = await collect(merged)

    // In our case the result does not come in numerical order
    expect(result).toContain(0)
    expect(result).toContain(1)
    expect(result).toContain(2)
    expect(result).toContain(3)
    expect(result.length).toEqual(4)
  })
})
