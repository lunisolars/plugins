import lunisolar from 'lunisolar'

import { sx } from '../src/index'

lunisolar.extend(sx)

describe('test sx', () => {
  it('test　2023-12-18', () => {
    const lsr = lunisolar('2023-12-18')
    // const lr = lsr.lunar
    // expect(lr.month).toBe(11)
    // expect(lr.day).toBe(6)
    expect(lsr.format('lY年　lMlD')).toBe('二〇二三年　十一月初六')
  })

  it('test　2023-03-23', () => {
    const lsr = lunisolar('2023-03-23')
    expect(lsr.format(`lY年　lMlD`)).toBe('二〇二三年　閏二月初二')
    expect(lsr.lunar.lunarNewYearDay.format('YYYY-MM-DD HH:mm:ss')).toBe('2023-01-22 00:00:00')
  })
})
