import { map, collect, first, filter } from './index'

async function* testIterator(num): AsyncIterableIterator<number> {
  for (let i = 0; i < num; i++) {
    yield await Promise.resolve(i)
  }
}

describe('testIterator', () => {
  it('should iterate through promises', async () => {
    const results = []
    for await (let i of testIterator(5)) {
      results.push(i)
    }
    expect(results).toEqual([0, 1, 2, 3, 4])
  })
})

describe('collect', () => {
  it('should collect all values from iterator and only call the callback on end', async () => {
    for await (let i of collect(testIterator(3))) {
      expect(i).toEqual([0, 1, 2])
    }
  })

  it('should only call itself once', async () => {
    const lock = jest.fn()
    for await (let i of collect(testIterator(100))) {
      lock()
    }
    expect(lock).toBeCalledTimes(1)
  })
})

describe('first', () => {
  it('should return the first occurrance as promise', async () => {
    const result = await first(testIterator(100))
    expect(result).toEqual(0)
  })

  it('should not run the anything else than the first iteration', async () => {
    const spy = jest.fn()
    const iter = async function*() {
      yield 1
      spy()
      yield 2
    }
    const result = await first(iter())
    expect(result).toEqual(1)
    expect(spy).not.toHaveBeenCalled()
  })
})

describe('map', () => {
  it('should run the callback to all values from iterator', async () => {
    const results = await first(collect(map(i => i + 1, testIterator(3))))
    expect(results).toEqual([1, 2, 3])
  })

  it('should work with async values', async () => {
    const results = await first(
      collect(map(i => Promise.resolve(i + 2), testIterator(3)))
    )
    expect(results).toEqual([2, 3, 4])
  })
})

describe('filter', () => {
  it('should exclude falsy values from iterator', async () => {
    const results = await first(
      collect(filter(i => i % 2 === 0, testIterator(10)))
    )
    expect(results).toEqual([0, 2, 4, 6, 8])
  })
})
