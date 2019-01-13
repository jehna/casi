export default function debounce<T>(
  delay: number,
  iterator: AsyncIterableIterator<T>
): AsyncIterableIterator<T> {
  let next: Promise<IteratorResult<T>>
  const debounced: AsyncIterableIterator<T> = {
    [Symbol.asyncIterator]: () => {
      return debounced
    },
    next: () => {
      return new Promise((resolve, reject) => {
        let timeout: number
        let resolved = false
        if (!next) next = iterator.next()
        next
          .then(function onNext(value) {
            if (resolved) return

            if (value.done) {
              setTimeout(() => resolve(value), delay)
              return
            }

            clearTimeout(timeout)
            timeout = setTimeout(() => {
              resolved = true
              resolve(value)
            }, delay)

            next = iterator.next()
            next.then(onNext)
          })
          .catch(reject)
      })
    }
  }
  return debounced
}
