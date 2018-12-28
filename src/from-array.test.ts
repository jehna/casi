import first from './first'
import fromArray from './from-array'
import collect from './collect'

describe('fromArray', () => {
  it('should return no results if empty array is provided', async () => {
    const result = await first(fromArray([]))
    expect(result).toBe(undefined)
  })

  it('should work with a single item', async () => {
    const result = await collect(fromArray(['foo']))
    expect(result).toEqual(['foo'])
  })

  it('should work with multiple items', async () => {
    const input = [1, 2, 5, 6, 7, 8, 22, 44, 67]
    const result = await collect(fromArray(input))
    expect(result).toEqual(input)
  })

  it('should work with iterables', async () => {
    function* iter() {
      let i = 10
      while (--i) {
        yield i
      }
    }

    const result = await collect(fromArray(iter()))
    expect(result).toEqual([9, 8, 7, 6, 5, 4, 3, 2, 1])
  })

  it('should work with array.keys iterable', async () => {
    const result = await collect(fromArray(Array(3).keys()))
    expect(result).toEqual([0, 1, 2])
  })
})
