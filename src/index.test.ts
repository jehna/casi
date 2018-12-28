import { closer, fromArray, zip } from './index'
import collect from './collect'
import first from './first'
import merge from './merge'

describe('closer', () => {
  it('should close a stream when close is called', async () => {
    const iterator = closer()
    const results = collect(iterator)
    iterator.close()
    expect(await results).toEqual([])
  })

  it('should close a stream when close is called', async () => {
    const iterator = closer()
    const results = collect(iterator)
    iterator.close()
    expect(await results).toEqual([])
  })

  it('should close the whole merged stream', async () => {
    const iter1 = closer()
    async function* dummyIterator() {
      let i = 0
      yield ++i
      yield ++i
      iter1.close()
      yield ++i
      yield ++i
    }

    const iter2 = dummyIterator()
    const conbined = merge([iter1, iter2])

    const results = collect(conbined)
    expect(await results).toEqual([1, 2])
  })
})

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

describe('zip', () => {
  it('pairwise combines values from two streams using given combinator function', async () => {
    const s1 = fromArray([1, 2, 3])
    const s2 = fromArray(['a', 'b', 'c'])
    const result = await collect(zip(s1, s2, (x, y) => x + y))

    expect(result).toEqual(['1a', '2b', '3c'])
  })

  it('should zip to array if no combinator is given', async () => {
    const s1 = fromArray([1, 2, 3])
    const s2 = fromArray(['a', 'b', 'c'])
    const result = await collect(zip(s1, s2))

    expect(result).toEqual([[1, 'a'], [2, 'b'], [3, 'c']])
  })

  it('completes as soon as possible', async () => {
    const s1 = fromArray([1])
    const s2 = fromArray(['a', 'b', 'c'])
    const result = await collect(zip(s1, s2))

    expect(result).toEqual([[1, 'a']])
  })

  it('works with endless left stream', async () => {
    async function* forever() {
      while (true) {
        yield true
      }
    }

    const result = await collect(zip(forever(), fromArray([1, 2, 3])))
    expect(result).toEqual([[true, 1], [true, 2], [true, 3]])
  })

  it('works with endless right stream', async () => {
    async function* forever() {
      while (true) {
        yield 'foo'
      }
    }

    const result = await collect(zip(fromArray([1, 2, 3]), forever()))
    expect(result).toEqual([[1, 'foo'], [2, 'foo'], [3, 'foo']])
  })
})
