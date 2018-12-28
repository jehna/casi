import { closer, zip } from './index'
import collect from './collect'
import merge from './merge'
import fromArray from './from-array'

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
