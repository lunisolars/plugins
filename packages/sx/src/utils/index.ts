import { S_aLon, S_aLonT } from './xl'
import { int2 } from './func'
import { J2000, PI2 } from '../constants'
import { JD } from './jd'
import { SSQ } from './qs'
import { dtT } from './deltaT'

const jqmc = new Array(
  '冬至',
  '小寒',
  '大寒',
  '立春',
  '雨水',
  '惊蛰',
  '春分',
  '清明',
  '谷雨',
  '立夏',
  '小满',
  '芒种',
  '夏至',
  '小暑',
  '大暑',
  '立秋',
  '处暑',
  '白露',
  '秋分',
  '寒露',
  '霜降',
  '立冬',
  '小雪',
  '大雪'
)

export const qiAccurate = function (W: number) {
  var t = S_aLonT(W) * 36525
  return t - dtT(t) + 8 / 24
} //精气

export const getMonthDayLength = (year: number, month: number, Bd0: number) => {
  month++
  if (month > 12) {
    year++
    month = 1
  }
  return int2(JD.JD(year, month, 1 + ((0.1 / 60 + 0) / 60 + 12) / 24)) - J2000 - Bd0
}

export const computeSolarTerm = (date: Date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const Bd0 = int2(JD.JD(year, month, 1 + ((0.1 / 60 + 0) / 60 + 12) / 24)) - J2000 //公历月首,中午
  const Bdn = getMonthDayLength(year, month, Bd0) //本月天数(公历)
  const jd2 = Bd0 + dtT(Bd0) - 8 / 24

  //节气查找
  let w = S_aLon(jd2 / 36525, 3)
  w = (int2(((w - 0.13) / PI2) * 24) * PI2) / 24
  const res = {
    index: 0,
    d0: Bd0 + day - 1, //儒略日,北京时12:00
    y: year,
    m: month,
    Lyear0: 0,
    jqjd: 0, // 节气时刻
    jqsj: '', // 节气时间串
    jqmc: ''
  }
  let d: number

  //纪日,2000年1月7日起算
  let D = res.d0 - 6 + 9000000

  console.log('d', qiAccurate(w))
  do {
    d = qiAccurate(w)
    D = int2(d + 0.5)
    // xn为从冬至起的节气序号
    const xn = int2((w / PI2) * 24 + 24000006.01) % 24
    console.log(xn, d, D, Bdn, res.d0)
    // lunisolar的节气序号从小寒气，所以要-1
    res.index = (xn + 23) / 24
    w += PI2 / 24
    if (D >= Bd0 + Bdn) break
    if (D < Bd0) continue

    console.log(jqmc[xn])
    res.jqmc = jqmc[xn] //取得节气名称

    res.jqjd = d
    res.jqsj = JD.timeStr(d)
    if (D - Bd0 === day - 1) break
  } while (D + 12 < Bd0 + Bdn)
  return res
}
