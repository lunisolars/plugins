import { type LunarMonth, YTM } from '@lunisolar/sx'
import { type JD } from 'lunisolar'

export const ytmCache = new Map<number, YTM>()

export const getYTM = function (year: number): YTM {
  if (ytmCache.has(year) && ytmCache.get(year) != void 0) return ytmCache.get(year) as YTM
  const res = new YTM(year)
  ytmCache.set(year, res)
  return res
}

export const getLunarNydByLmList = function (lmList: LunarMonth[]) {
  let nyd = -1
  // 历遍当年所有农历月份
  for (let i = 0; i < lmList.length; i++) {
    const lm = lmList[i]
    if (lm.month === 0) {
      nyd = lm.dayJdn - 0.5
    }
  }
  console.log('nyd', nyd)
  return nyd
}

/**
 * 取得春节在该年哪天
 * @param year 年份
 * @returns Date对象
 */
export const getLunarNewYearDay = function (year: number): JD {
  const ytm = new YTM(year)
  const { lunarMonths } = ytm.getTM(16)
  return lunisolar.utils.parseJD(getLunarNydByLmList(lunarMonths))
}
