import collect from './collect'
import debounce from './debounce'
import fromArray from './from-array'

// NOTE: We don't have a proper way to test the time-aware things in Jest, so let's keep the delays small

describe('debounce', () => {
  const delay = t => new Promise(done => setTimeout(done, t))

  it('should print next value only if there is delay time in between new values', async () => {
    async function* mockIterator() {
      yield 1
      await delay(10)
      yield 2
      await delay(20)
      yield 3
      await delay(11)
      yield 3
      yield 4
    }

    const result = await collect(debounce(15, mockIterator()))
    expect(result).toEqual([2, 4])
  })

  it('should wait for delay even if the last item has been sent', async () => {
    const spy = jest.fn()
    collect(debounce(15, fromArray([1]))).then(spy)
    await delay(10)
    expect(spy).not.toBeCalled()
    await delay(25)
    expect(spy).toBeCalled()
  })
})
