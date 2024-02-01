// import lunisolar from 'lunisolar'

import { parseFromLunar } from '../../src/utils/index'

describe('test parseFromLunar function', () => {
  it('test　 阴历反查', () => {
    expect(
      parseFromLunar({
        year: 2022,
        month: 10,
        day: 25,
        hour: 1
      }).format('YYYY-MM-DD HH:mm:ss')
    ).toBe('2022-11-18 02:00:00')

    expect(
      parseFromLunar({
        year: 2020,
        month: 104,
        day: 24
      }).format('YYYY-MM-DD')
    ).toBe('2020-06-15')

    expect(
      parseFromLunar({
        year: '二〇二零',
        month: '閏四月',
        day: '廿四'
      }).format('YYYY-MM-DD')
    ).toBe('2020-06-15')

    expect(
      parseFromLunar({
        year: 2020,
        month: 4,
        day: '廿四'
      }).format('YYYY-MM-DD')
    ).toBe('2020-05-16')

    expect(
      parseFromLunar({
        year: 1800,
        month: 7,
        day: 2
      }).format('YYYY-MM-DD')
    ).toBe('1800-08-21')

    expect(
      parseFromLunar({
        year: 0,
        month: 7,
        day: 2
      }).format('YYYY-MM-DD')
    ).toBe('0000-08-20')
  })
})
