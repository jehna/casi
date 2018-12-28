import { testIterator } from './test-utils'

describe('testIterator', () => {
  it('should iterate through promises', async () => {
    const results = []
    for await (let i of testIterator(5)) {
      results.push(i)
    }
    expect(results).toEqual([0, 1, 2, 3, 4])
  })
})
