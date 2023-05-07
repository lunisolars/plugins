import { S_aLon, MS_aLon } from './sx/xl'
import { int2 } from './sx/func'
import { J2000, PI2 } from '../constants'
import { JD, JDR } from './sx/jd'
// import { SSQ } from './qs'
import { dtT } from './sx/deltaT'
import { qiAccurate, soAccurate } from './sx/qs'

import { jqmc } from './yearqs'

const yxmc = new Array('朔', '上弦', '望', '下弦') //月相名称表

export const getMonthDayLength = (year: number, month: number, Bd0: number) => {
  month++
  if (month > 12) {
    year++
    month = 1
  }
  return int2(JD.JD(year, month, 1 + ((0.1 / 60 + 0) / 60 + 12) / 24)) - J2000 - Bd0
}

type ComputeSolarTermResItem = {
  index: number
  d0: number
  date: JDR
  d: number
  jd: number
  timeStr: string
  name: string
}

/**
 * 计算出指定年月的节气信息
 * @param year 年
 * @param month 月, 如果当前参数为undifined，则返回全年的节气信息
 * @returns {ComputeSolarTermResItem[]}
 */
export function computeSolarTerm(year: number): ComputeSolarTermResItem[][]
export function computeSolarTerm(year: number, month: number): ComputeSolarTermResItem[]
export function computeSolarTerm(
  year: number,
  month?: number
): ComputeSolarTermResItem[][] | ComputeSolarTermResItem[] {
  if (month === void 0) {
    const res: ComputeSolarTermResItem[][] = new Array(12)
    for (let i = 0; i < 12; i++) {
      res[i] = computeSolarTerm(year, i + 1)
    }
    return res
  }
  const res: ComputeSolarTermResItem[] = []

  const Bd0 = int2(JD.JD(year, month, 1 + ((0.1 / 60 + 0) / 60 + 12) / 24)) - J2000 //公历月首,中午
  const Bdn = getMonthDayLength(year, month, Bd0) //本月天数(公历)
  const jd2 = Bd0 + dtT(Bd0) - 8 / 24

  //节气查找
  let w = S_aLon(jd2 / 36525, 3)
  w = (int2(((w - 0.13) / PI2) * 24) * PI2) / 24
  let d: number

  //纪日,2000年1月7日起算
  let D = Bd0 - 6 + 9000000

  do {
    d = qiAccurate(w)
    D = int2(d + 0.5)
    // xn为从冬至起的节气序号
    const xn = int2((w / PI2) * 24 + 24000006.01) % 24
    console.log(xn, d, D, Bdn, Bd0)
    // lunisolar的节气序号从小寒气，所以要-1
    const idx = (xn + 23) % 24
    w += PI2 / 24
    if (D >= Bd0 + Bdn) break
    if (D < Bd0) continue
    const jd = 2451545 + d
    const date = JD.DD(jd)
    res.push({
      d0: Bd0 + date.D - 1,
      index: idx,
      name: jqmc[xn],
      date,
      timeStr: JD.timeStr(d),
      d,
      jd
    })
  } while (D + 12 < Bd0 + Bdn)
  return res
}

function computeMoonPhase(year: number, month: number) {
  const Bd0 = int2(JD.JD(year, month, 1 + ((0.1 / 60 + 0) / 60 + 12) / 24)) - J2000 //公历月首,中午
  const Bdn = getMonthDayLength(year, month, Bd0) //本月天数(公历)
  const jd2 = Bd0 + dtT(Bd0) - 8 / 24
  //月相查找
  let d: number
  let w = MS_aLon(jd2 / 36525, 10, 3)
  w = (int2(((w - 0.78) / Math.PI) * 2) * Math.PI) / 2
  let D = Bd0 - 6 + 9000000
  do {
    d = soAccurate(w)
    D = int2(d + 0.5)
    const xn = int2((w / PI2) * 4 + 4000000.01) % 4
    w += PI2 / 4
    if (D >= Bd0 + Bdn) break
    if (D < Bd0) continue
    const name = yxmc[xn] //取得月相名称
    ob.yxjd = d
    ob.yxsj = JD.timeStr(d)
  } while (D + 5 < Bd0 + Bdn)
}
