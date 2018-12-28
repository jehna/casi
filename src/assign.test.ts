import assign from './assign'
import fromArray from './from-array'

describe('assign', () => {
  it('should call the property with single value', async () => {
    const stream = fromArray(['hello'])
    const spy = jest.fn()
    const obj = { spy }

    await assign(obj, 'spy', stream)

    expect(spy).toBeCalledWith('hello')
  })

  it('should call the property with multiple values', async () => {
    const values = [100, 22, 33, 444, 5, 66, 7777, 88, 9]
    const stream = fromArray(values)
    const spy = jest.fn()
    const obj = { spy }

    await assign(obj, 'spy', stream)

    values.forEach((value, nth) =>
      expect(spy).toHaveBeenNthCalledWith(nth + 1, value)
    )
    expect(spy).toHaveBeenCalledTimes(values.length)
  })

  it('should assign value to prop if prop is not a setter', async () => {
    const stream = fromArray(['bar'])
    const obj = { foo: 'set me!' }

    await assign(obj, 'foo', stream)

    expect(obj.foo).toEqual('bar')
  })

  it('should work as curried', async () => {
    const stream = fromArray(['bar'])
    const obj = { foo: 'set me!' }

    await assign(obj, 'foo')(stream)

    expect(obj.foo).toEqual('bar')
  })
})
