import first from './first'
import fromCallback from './from-callback'
import collect from './collect'

const nop = () => Promise.resolve()

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
      cb(null, 1)
      await nop()
      cb(null, 2)
      await nop()
      cb(new Error('end'))
      await nop()
      cb(null, 3)
    }

    const results = await collect(fromCallback(doThing))
    expect(results).toEqual([1, 2])
  })
})
