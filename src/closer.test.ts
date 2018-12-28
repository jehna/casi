import collect from './collect'
import merge from './merge'
import closer from './closer'

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
