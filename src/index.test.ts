import {
  map,
  collect,
  first,
  filter,
  fromCallback,
  fromEvent,
  merge,
  scan,
  closer,
  take,
  fromArray,
  zip
} from './index'

const testIterator = (num: number) => fromArray(Array(num).keys())
const nop = () => Promise.resolve()

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

  it('should work with constant values', async () => {
    const results = await first(collect(map('foo', testIterator(3))))
    expect(results).toEqual(['foo', 'foo', 'foo'])
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

describe('fromCallback', () => {
  it('should callback(err, value) format to an iterator', async () => {
    const doThing = async (cb: (err: Error, value: number) => void) => {
      await nop()
      cb(null, 1)
    }

    const results = await first(fromCallback(doThing))
    expect(results).toEqual(1)
  })

  it('should terminate if the callback results in an error', async () => {
    const doThing = async (cb: (err: Error, value?: number) => void) => {
      await nop()
      cb(null, 1)
      await nop()
      cb(null, 2)
      await nop()
      cb(new Error('end'))
    }

    const results = await first(collect(fromCallback(doThing)))
    expect(results).toEqual([1, 2])
  })
})

describe('fromEvent', () => {
  it('should start listening events from event target', () => {
    let sendEvent
    const eventTarget: EventTarget = {
      addEventListener: jest.fn((name, listener) => {
        sendEvent = listener
      }),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn()
    }

    const event = new Event('foo')
    const listener = first(fromEvent(eventTarget, 'foo'))
    sendEvent(event)

    return listener.then(receivedEvent => expect(receivedEvent).toEqual(event))
  })
})

describe('merge', () => {
  it('should work like an identity function if one stream is passed', async () => {
    const stream = testIterator(2)
    const merged = merge([stream])
    const result = await first(collect(merged))

    expect(result).toEqual([0, 1])
  })

  it('should output all values of all iterators passed', async () => {
    const stream1 = testIterator(2)
    const stream2 = map(i => i + 2, testIterator(2))
    const merged = merge([stream1, stream2])
    const result = await first(collect(merged))

    // In our case the result does not come in numerical order
    expect(result).toContain(0)
    expect(result).toContain(1)
    expect(result).toContain(2)
    expect(result).toContain(3)
    expect(result.length).toEqual(4)
  })
})

describe('scan', () => {
  it('should collect the value and pass the aggregated value', async () => {
    const stream = scan(10, (a, b) => a + b, testIterator(5))
    const result = await first(collect(stream))

    expect(result).toEqual([10, 11, 13, 16, 20])
  })
})

describe('closer', () => {
  it('should close a stream when close is called', async () => {
    const iterator = closer()
    const results = first(collect(iterator))
    iterator.close()
    expect(await results).toEqual([])
  })

  it('should close a stream when close is called', async () => {
    const iterator = closer()
    const results = first(collect(iterator))
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

    const results = first(collect(conbined))
    expect(await results).toEqual([1, 2])
  })
})

describe('take', () => {
  it('should take n first items from stream', async () => {
    const result = await first(collect(take(4, testIterator(10))))
    expect(result).toEqual([0, 1, 2, 3])
  })

  it('should end the stream after the nth iteration', async () => {
    async function* forever() {
      let i = 0
      while (true) {
        yield i++
      }
    }

    const result = await first(collect(take(10, forever())))
    expect(result).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
  })
})

describe('fromArray', () => {
  it('should return no results if empty array is provided', async () => {
    const result = await first(fromArray([]))
    expect(result).toBe(undefined)
  })

  it('should work with a single item', async () => {
    const result = await first(collect(fromArray(['foo'])))
    expect(result).toEqual(['foo'])
  })

  it('should work with multiple items', async () => {
    const input = [1, 2, 5, 6, 7, 8, 22, 44, 67]
    const result = await first(collect(fromArray(input)))
    expect(result).toEqual(input)
  })

  it('should work with iterables', async () => {
    function* iter() {
      let i = 10
      while (--i) {
        yield i
      }
    }

    const result = await first(collect(fromArray(iter())))
    expect(result).toEqual([9, 8, 7, 6, 5, 4, 3, 2, 1])
  })

  it('should work with array.keys iterable', async () => {
    const result = await first(collect(fromArray(Array(3).keys())))
    expect(result).toEqual([0, 1, 2])
  })
})

describe('zip', () => {
  it('pairwise combines values from two streams using given combinator function', async () => {
    const s1 = fromArray([1, 2, 3])
    const s2 = fromArray(['a', 'b', 'c'])
    const result = await first(collect(zip(s1, s2, (x, y) => x + y)))

    expect(result).toEqual(['1a', '2b', '3c'])
  })

  it('should zip to array if no combinator is given', async () => {
    const s1 = fromArray([1, 2, 3])
    const s2 = fromArray(['a', 'b', 'c'])
    const result = await first(collect(zip(s1, s2)))

    expect(result).toEqual([[1, 'a'], [2, 'b'], [3, 'c']])
  })

  it('completes as soon as possible', async () => {
    const s1 = fromArray([1])
    const s2 = fromArray(['a', 'b', 'c'])
    const result = await first(collect(zip(s1, s2)))

    expect(result).toEqual([[1, 'a']])
  })

  it('works with endless left stream', async () => {
    async function* forever() {
      while (true) {
        yield true
      }
    }

    const result = await first(collect(zip(forever(), fromArray([1, 2, 3]))))
    expect(result).toEqual([[true, 1], [true, 2], [true, 3]])
  })

  it('works with endless right stream', async () => {
    async function* forever() {
      while (true) {
        yield 'foo'
      }
    }

    const result = await first(collect(zip(fromArray([1, 2, 3]), forever())))
    expect(result).toEqual([[1, 'foo'], [2, 'foo'], [3, 'foo']])
  })
})
