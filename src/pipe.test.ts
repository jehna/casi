import map from './map'
import filter from './filter'
import collect from './collect'
import { testIterator } from './test-utils'
import pipe from './pipe'

describe('compose', () => {
  it('should work as identity function if only one function is passed', () => {
    const addBar = (input: string) => input + ' bar'
    const composed = pipe(addBar)
    expect(composed('foo')).toEqual(addBar('foo'))
  })

  it('should compose a new function that runs functions from left to right', () => {
    const composed = pipe(
      (v: number) => v - 2,
      v => v * 2
    )
    expect(composed(4)).toEqual(4)
  })

  it('should work fine with mixed types', () => {
    const toBinary = (num: number) => num.toString(2)

    const composed = pipe(
      parseInt,
      toBinary,
      binary => ({ binary })
    )

    expect(composed('100')).toEqual({ binary: '1100100' })
  })

  it('should work with casi functions', async () => {
    const multiply10 = (val: number) => val * 10
    const not100s = (val: number) => val % 100 !== 0
    const stream = testIterator(12)
    const composed = pipe(
      map(multiply10),
      filter(not100s)
    )

    const result = await collect(composed(stream))
    expect(result).toEqual([10, 20, 30, 40, 50, 60, 70, 80, 90, 110])
  })
})
