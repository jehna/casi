interface AsyncIterableIteratorWithClose extends AsyncIterableIterator<any> {
  close: () => void
}

export default function closer(): AsyncIterableIteratorWithClose {
  let close
  const promise: Promise<IteratorResult<any>> = new Promise(
    (resolve, reject) => {
      close = reject
    }
  )

  const iterator = {
    [Symbol.asyncIterator]: () => iterator,
    next: () => promise,
    close: () => close()
  }
  return iterator
}
