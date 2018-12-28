import scan from './scan'
import { testIterator } from './test-utils'
import collect from './collect'

describe('scan', () => {
  it('should collect the value and pass the aggregated value', async () => {
    const stream = scan(10, (a, b) => a + b, testIterator(5))
    const result = await collect(stream)

    expect(result).toEqual([10, 11, 13, 16, 20])
  })

  it('should work as curried', async () => {
    const stream = scan<number, number>(10, (a, b) => a + b)(testIterator(5))
    const result = await collect(stream)

    expect(result).toEqual([10, 11, 13, 16, 20])
  })

  it('should work if the types is mixed', async () => {
    const stream = scan('', (a, b) => a + b, testIterator(3))
    const result = await collect(stream)

    expect(result).toEqual(['0', '01', '012'])
  })
})
