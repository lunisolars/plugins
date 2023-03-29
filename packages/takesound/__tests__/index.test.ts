import lunisolar from 'lunisolar'

import { takeSound } from '../src/index'

lunisolar.extend(takeSound)

describe('test takeSound', () => {
  it('2022-07-08', () => {
    const lsr = lunisolar('2022-07-08')
    expect(lsr.takeSound).toBe('大海水')
    expect(lsr.char8.year.takeSound).toBe('金箔金')
    expect(lsr.char8.day.takeSound).toBe('大海水')

    const lsr2 = lunisolar('2016-05-17')
    expect(lsr2.takeSound).toBe('平地木')

    const lsr3 = lunisolar('2022-1-1')
    expect(lsr3.takeSound).toBe('大溪水')
  })
})
