import { curryN, curry } from './utils'

describe('curryN', () => {
  it('should return a function that runs the function if enough arguments are passed', () => {
    const spy = jest.fn((a, b, c) => a + b + c)
    const curried = curryN(spy, 3)
    const result = curried(1, 2, 3)
    expect(spy).toBeCalledWith(1, 2, 3)
    expect(result).toEqual(6)
  })

  it('should return a new function if not enough params are called', () => {
    const spy = jest.fn()
    const curried = curryN(spy, 3)
    const result = curried(1, 2)
    expect(spy).not.toBeCalled()
    expect(result).toBeInstanceOf(Function)
  })

  it('should call the function with arguments when all arguments are passed', () => {
    const spy = jest.fn((a, b, c, d, e) => a + b + c + d + e)
    const curried = curryN(spy, 5)
    const result = curried(1)(2, 3)(4)(5)
    expect(spy).toBeCalledWith(1, 2, 3, 4, 5)
    expect(result).toEqual(15)
  })
})

describe('curry', () => {
  it("should curry function according to its arguments' length", () => {
    const spy = jest.fn((a, b, c, d, e) => a + b + c + d + e)
    const target = (a, b, c, d, e) => spy(a, b, c, d, e) // Target with 5 arguments
    const curried = curry(target)
    const result = curried(-1, -2, -3)(-4)(-5)
    expect(spy).toBeCalledWith(-1, -2, -3, -4, -5)
    expect(result).toEqual(-15)
  })
})
