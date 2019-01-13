import flatMap from './flat-map'
import { testIterator } from './test-utils'
import collect from './collect'
import map from './map'
import fromArray from './from-array'

describe('flatMap', () => {
  it('should map synchronous, flat items same as map', async () => {
    const mapper = i => i ** 5
    const mapped = await collect(map(mapper, testIterator(10)))
    const flatMapped = await collect(flatMap(mapper, testIterator(10)))

    expect(mapped).toEqual(flatMapped)
  })

  it('should flatten any synchronous results', async () => {
    const input = [1, [2, 3], [4]]
    const result = await collect(flatMap(i => i, fromArray(input)))
    expect(result).toEqual([1, 2, 3, 4])
  })

  it('should flatten deeply nested synchronous results', async () => {
    const input = [1, [2, [3, [4, 5, [6]], [[[7]]]]]]
    const result = await collect(flatMap(i => i, fromArray(input)))
    expect(result).toEqual([1, 2, 3, 4, 5, 6, 7])
  })

  it('should flatten an asynchronous result', async () => {
    const input = [2, 3, 4]
    const result = await collect(
      flatMap(i => Promise.resolve([i, i ** 2, i ** 3]), fromArray(input))
    )
    expect(result).toEqual([2, 4, 8, 3, 9, 27, 4, 16, 64])
  })

  it('should work curried', async () => {
    const input = map(i => i + 1, testIterator(20))
    const fizzbuzz = (input: number) =>
      input % 3 === 0 && input % 5 === 0
        ? Promise.resolve(['FizzBuzz'])
        : input % 3 === 0
        ? ['Fizz']
        : input % 5 === 0
        ? Promise.resolve('Buzz')
        : input.toString()

    const fizzBuzzify = flatMap(fizzbuzz)
    const result = await collect(fizzBuzzify(input))

    expect(result).toEqual([
      '1',
      '2',
      'Fizz',
      '4',
      'Buzz',
      'Fizz',
      '7',
      '8',
      'Fizz',
      'Buzz',
      '11',
      'Fizz',
      '13',
      '14',
      'FizzBuzz',
      '16',
      '17',
      'Fizz',
      '19',
      'Buzz'
    ])
  })
})
