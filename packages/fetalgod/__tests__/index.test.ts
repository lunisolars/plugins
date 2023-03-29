import lunisolar from 'lunisolar'

import { fetalGod } from '../src/index'

lunisolar.extend(fetalGod)

describe('test plugins-fetalGod ', () => {
  it('2022-07-08', () => {
    const lsr = lunisolar('2022-07-08')
    expect(lsr.fetalGod).toBe('倉庫棲外東南')
    expect(lsr.fetalGodData.stemPlace).toBe('倉庫')
    expect(lsr.fetalGodData.branchPlace).toBe('雞棲')
    expect(lsr.fetalGodData.description).toBe('倉庫棲外東南')
    expect(lsr.fetalGodData.direction).toBe('外東南')
  })
  it('2023-02-23', () => {
    const lsr = lunisolar('2023-02-23')
    expect(lsr.fetalGod).toBe('倉庫碓外東北')
    expect(lsr.fetalGodData.stemPlace).toBe('倉庫')
    expect(lsr.fetalGodData.branchPlace).toBe('碓')
    expect(lsr.fetalGodData.description).toBe('倉庫碓外東北')
    expect(lsr.fetalGodData.direction).toBe('外東北')
    expect(lsr.fetalGodData.directionValue).toBe(8)
  })

  it('2023-02-16', () => {
    const lsr = lunisolar('2023-02-16')
    expect(lsr.fetalGod).toBe('碓磨床房内東')
    expect(lsr.fetalGodData.stemPlace).toBe('碓磨')
    expect(lsr.fetalGodData.branchPlace).toBe('床')
    expect(lsr.fetalGodData.description).toBe('碓磨床房内東')
    expect(lsr.fetalGodData.direction).toBe('内東')
    expect(lsr.fetalGodData.directionValue).toBe(-3)
  })
})
