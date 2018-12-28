export default async function* fromEvent(
  eventSource: EventTarget,
  eventName: string
): AsyncIterableIterator<Event> {
  let resolve: (value: Event) => void
  const listener = (val: Event) => {
    resolve(val)
  }

  eventSource.addEventListener(eventName, listener)

  try {
    while (true) {
      yield await new Promise(newResolve => {
        resolve = newResolve
      })
    }
  } finally {
    eventSource.removeEventListener(eventName, listener)
  }
}
