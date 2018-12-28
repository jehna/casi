import { testIterator } from './test-utils'
import first from './first'

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
