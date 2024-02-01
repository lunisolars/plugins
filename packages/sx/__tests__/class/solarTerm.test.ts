import lunisolar from 'lunisolar'

import { SolarTerm } from '../../src/class/solarTerm'


describe('test solarTerm', () => {
  const terms = [
      ['小寒', '2024-01-06 04:49'],
      ['大寒', '2024-01-20 22:07'],
      ['立春', '2024-02-04 16:27'],
      ['雨水', '2024-02-19 12:13'],
      ['驚蟄', '2024-03-05 10:22'],
      ['春分', '2024-03-20 11:06'],
      ['清明', '2024-04-04 15:02'],
      ['穀雨', '2024-04-19 21:59'],
      ['立夏', '2024-05-05 08:10'],
      ['小滿', '2024-05-20 20:59'],
      ['芒種', '2024-06-05 12:09'],
      ['夏至', '2024-06-21 04:50'],
      ['小暑', '2024-07-06 22:20'],
      ['大暑', '2024-07-22 15:44'],
      ['立秋', '2024-08-07 08:09'],
      ['處暑', '2024-08-22 22:55'],
      ['白露', '2024-09-07 11:11'],
      ['秋分', '2024-09-22 20:43'],
      ['寒露', '2024-10-08 02:59'],
      ['霜降', '2024-10-23 06:14'],
      ['立冬', '2024-11-07 06:20'],
      ['小雪', '2024-11-22 03:56'],
      ['大雪', '2024-12-06 23:17'],
      ['冬至', '2024-12-21 17:20']
    ]
  it('test　SolarTerm.getYearTermDayList 2024 2', () => {
    
    const termList = SolarTerm.getYearTermDayList(2024, 2)
    const res = []
    const names = SolarTerm.getNames()
    for (let i = 0; i < termList.length; i++) {
      const name = names[i]
      const jd = new lunisolar.JD(termList[i])
      res.push([name, jd.format('YYYY-MM-DD HH:mm')])
     }

    expect(res).toEqual(terms)
    
  })

  it('test　SolarTerm.getYearTermDayList 2024 0', () => {
    
    const termList = SolarTerm.getYearTermDayList(2024, 0)
    const res = []
    const names = SolarTerm.getNames()
    for (let i = 0; i < termList.length; i++) {
      const name = names[i]
      const d = String(termList[i]).padStart(2, '0')
      const m = String(Math.floor(i / 2) + 1).padStart(2, '0')
      res.push([name, `2024-${m}-${d}`])
     }

    expect(res).toEqual(terms.map((item) => {
      return [
        item[0],
        item[1].split(' ')[0]
      ]
    }))
    
  })


})
