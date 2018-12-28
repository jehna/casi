import first from './first'
import fromEvent from './from-event'

describe('fromEvent', () => {
  it('should start listening events from event target', () => {
    let sendEvent
    const eventTarget: EventTarget = {
      addEventListener: jest.fn((name, listener) => {
        sendEvent = listener
      }),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn()
    }

    const event = new Event('foo')
    const listener = first(fromEvent(eventTarget, 'foo'))
    sendEvent(event)

    return listener.then(receivedEvent => expect(receivedEvent).toEqual(event))
  })
})
