export default async function* fromCallback<T>(
  callbackFunction: (callback: (err?: any, val?: T) => any) => any
): AsyncIterableIterator<T> {
  let resolve: (value?: T | PromiseLike<T>) => void
  let reject: (reason?: any) => void

  let promise = new Promise<T>((newResolve, newReject) => {
    resolve = newResolve
    reject = newReject
  })

  callbackFunction((err, val) => {
    if (err) {
      reject(err)
    } else {
      resolve(val)
    }
  })

  while (true) {
    const result = await promise
    promise = new Promise<T>((newResolve, newReject) => {
      resolve = newResolve
      reject = newReject
    })
    yield result
  }
}
