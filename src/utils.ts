export function curryN(func, numArguments) {
  return (...args) => {
    if (args.length === numArguments) {
      return func(...args)
    } else {
      return curryN(
        (...a2) => func(...args.concat(a2)),
        numArguments - args.length
      )
    }
  }
}

export function curry(func) {
  return curryN(func, func.length)
}
