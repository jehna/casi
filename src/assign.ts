import { curry } from './utils'

async function _assign<T>(
  object: any,
  property: string,
  iterator: AsyncIterableIterator<T>
): Promise<void> {
  const target = object[property]
  const setter =
    typeof target === 'function' ? target : v => (object[property] = v)
  for await (let result of iterator) {
    setter(result)
  }
}

type assign = {
  <T>(
    object: any,
    property: string,
    iterator: AsyncIterableIterator<T>
  ): Promise<void>
  <T>(object: any, property: string): (
    iterator: AsyncIterableIterator<T>
  ) => Promise<void>
  <T>(object: any): (
    property: string,
    iterator: AsyncIterableIterator<T>
  ) => Promise<void>
  <T>(object: any): (
    property: string
  ) => (iterator: AsyncIterableIterator<T>) => Promise<void>
}

const assign: assign = curry(_assign)

export default assign
