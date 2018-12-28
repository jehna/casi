import { first, collect } from '.'
import filter from './filter'
import { testIterator } from './test-utils'

describe('filter', () => {
  it('should exclude falsy values from iterator', async () => {
    const results = await first(
      collect(filter(i => i % 2 === 0, testIterator(10)))
    )
    expect(results).toEqual([0, 2, 4, 6, 8])
  })

  it('should work as curried', async () => {
    const curried = filter<number>(i => i % 2 === 1)
    const results = await first(collect(curried(testIterator(10))))
    expect(results).toEqual([1, 3, 5, 7, 9])
  })
})
