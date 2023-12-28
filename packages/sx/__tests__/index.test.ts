import lunisolar from 'lunisolar'

import { sx } from '../src/index'

lunisolar.extend(sx)

describe('test sx', () => {
  it('test', () => {
    const lsr = lunisolar('2023-12-18')
    const lr = lsr.lunar
    expect(lr.month).toBe(11)
    expect(lr.day).toBe(6)
  })
})
