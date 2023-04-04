import { computeSolarTerm } from '../../src/utils/'
import lunisolar from 'lunisolar'

describe('test computeSolarTerm', () => {
  it('2023-04-05', () => {
    const stRes = computeSolarTerm(lunisolar('2023-04-05').toDate())
    expect(stRes.timeStr).toBe('09:13:03')
  })
  it('2023-04-20', () => {
    const stRes = computeSolarTerm(lunisolar('2023-04-20').toDate())
    console.log('stRes', stRes)
    expect(stRes.timeStr).toBe('16:13:36')
  })
  it('2023-04-19', () => {
    const stRes = computeSolarTerm(lunisolar('2023-04-19').toDate())
    expect(stRes.timeStr).toBe('')
  })
})
