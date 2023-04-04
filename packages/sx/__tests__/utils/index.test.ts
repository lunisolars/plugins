import { computeSolarTerm } from '../../src/utils/'
import lunisolar from 'lunisolar'

describe('test computeSolarTerm', () => {
  expect(computeSolarTerm(lunisolar('2023-04-05').toDate())).toBe({})
})
