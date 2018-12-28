import fromArray from './from-array'
import collect from './collect'
import zip from './zip'

describe('zip', () => {
  it('should zip to array', async () => {
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
