import fromArray from './from-array'
import zipWith from './zip-with'
import collect from './collect'

describe('zipWith', () => {
  it('pairwise combines values from two streams using given combinator function', async () => {
    const s1 = fromArray([1, 2, 3])
    const s2 = fromArray(['a', 'b', 'c'])
    const result = await collect(zipWith(s1, s2, (x, y) => x + y))

    expect(result).toEqual(['1a', '2b', '3c'])
  })

  it('completes as soon as possible', async () => {
    const s1 = fromArray([1])
    const s2 = fromArray(['a', 'b', 'c'])
    const result = await collect(zipWith(s1, s2, (a, b) => a + b))

    expect(result).toEqual(['1a'])
  })

  it('works with endless left stream', async () => {
    async function* forever() {
      while (true) {
        yield 'foo'
      }
    }

    const result = await collect(
      zipWith(forever(), fromArray([1, 2, 3]), (a, b) => a + b)
    )
    expect(result).toEqual(['foo1', 'foo2', 'foo3'])
  })

  it('works with endless right stream', async () => {
    async function* forever() {
      while (true) {
        yield 'bar'
      }
    }

    const result = await collect(
      zipWith(fromArray([1, 2, 3]), forever(), (a, b) => a + b)
    )
    expect(result).toEqual(['1bar', '2bar', '3bar'])
  })
})
