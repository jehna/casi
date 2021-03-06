import map from './map'
import { testIterator } from './test-utils'
import collect from './collect'

describe('map', () => {
  it('should run the callback to all values from iterator', async () => {
    const results = await collect(map(i => i + 1, testIterator(3)))
    expect(results).toEqual([1, 2, 3])
  })

  it('should work with async values', async () => {
    const results = await collect(
      map(i => Promise.resolve(i + 2), testIterator(3))
    )

    expect(results).toEqual([2, 3, 4])
  })

  it('should work with constant values', async () => {
    const results = await collect(map('foo', testIterator(3)))
    expect(results).toEqual(['foo', 'foo', 'foo'])
  })

  it('should work as curried', async () => {
    const curried = map('bar')
    const results = await collect(curried(testIterator(2)))
    expect(results).toEqual(['bar', 'bar'])
  })
})
