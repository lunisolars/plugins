import lunisolar from 'lunisolar'
import { char8ex } from '../src/index'

lunisolar.extend(char8ex)
lunisolar.config({ lang: 'zh' })

describe('plugins/char8ex', () => {
  it('2023-01-15 12:26', () => {
    const lsr = lunisolar('2023-01-15 12:26')
    const c8ex = lsr.char8ex(1)
    expect(c8ex.gods.year.map(item => item.name)).toEqual(
      expect.arrayContaining(['文昌貴人', '金輿', '天廚貴人', '劫煞'])
    )
    expect(c8ex.gods.day.map(item => item.key)).toEqual(expect.arrayContaining(['元辰', '金神']))
    expect(c8ex.hour.gods.map(item => item.key)).toEqual(
      expect.arrayContaining(['將星', '桃花', '帝座'])
    )
  })

  it('2023-01-11 14:19', () => {
    const lsr = lunisolar('2023-01-11 14:19')
    const c8ex = lsr.char8ex(1)
    expect(c8ex.gods.year.map(item => item.key)).toEqual(
      expect.arrayContaining(['文昌貴人', '國印貴人', '天廚貴人', '劫煞'])
    )
    expect(c8ex.gods.month.map(item => item.key)).toEqual(expect.arrayContaining(['寡宿', '華蓋']))
  })

  it('2023-01-22 15:19', () => {
    const lsr = lunisolar('2023-01-22 15:19')
    const c8ex = lsr.char8ex(1)
    expect(c8ex.gods.day.map(item => item.key)).toEqual(
      expect.arrayContaining(['魁罡貴人', '天德', '日德'])
    )
  })

  it('2023-01-15 12:26', () => {
    const lsr = lunisolar('2023-01-15 12:26')
    const c8ex = lsr.char8ex(1)
    expect(c8ex.embryo().name).toBe('甲辰')
    expect(c8ex.ownSign().name).toBe('庚戌')
    expect(c8ex.bodySign().name).toBe('戊申')

    expect(c8ex.year.stemTenGod.name).toBe('劫財')
    expect(c8ex.month.stemTenGod.name).toBe('比肩')
    expect(c8ex.day.stemTenGod.name).toBe('日主')
    expect(c8ex.hour.stemTenGod.name).toBe('正官')

    expect(c8ex.year.branchTenGod.map(i => i.name)).toEqual(['傷官', '正財', '正官'])
    expect(c8ex.month.branchTenGod.map(i => i.name)).toEqual(['七殺', '比肩', '梟神'])
    expect(c8ex.day.branchTenGod.map(i => i.name)).toEqual(['梟神'])
    expect(c8ex.hour.branchTenGod.map(i => i.name)).toEqual(['偏財', '七殺'])
  })

  it('测试年支神煞， 1990-12-21 7:00', () => {
    const lsr = lunisolar('1990-12-21 7:00')
    const c8ex = lsr.char8ex(1)
    expect(c8ex.year.gods.map(i => i.name)).toEqual(['天印貴人'])
    expect(c8ex.month.gods.map(i => i.name)).toEqual(['德', '將星', '災煞'])
  })
})
