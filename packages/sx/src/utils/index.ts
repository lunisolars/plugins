import { type LunarMonth, YTM } from '@lunisolar/sx'
import lunisolar, { type JD } from 'lunisolar'

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
      break
    }
  }
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

/**
 * 从阴历解释数据
 * @param lunarData 阴历数据
 * @returns Date对象
 */
export const parseFromLunar = function (
  lunarData: lunisolar.ParseFromLunarParam,
  lang?: string,
  isUTC = false
): JD {
  lunisolar.utils.prettyLunarData(lunarData, lang)
  const nowJD = new lunisolar.JD()
  const year: number = lunarData.year ?? nowJD.year
  let month: number = lunarData.month
  const day: number = lunarData.day
  const hour: number = lunarData.hour ?? 0
  let isLeapMonth = lunarData.isLeapMonth ?? false
  if (month > 100) {
    month -= 100
    isLeapMonth = true
  }
  // 計算年份
  if (month < 1) throw new Error('Invalid lunar month')
  const ytm = new YTM(year)
  const { lunarMonths } = ytm.getTM(16)
  let sawNewYear = false
  // let targetMonth = -1
  let monthData: LunarMonth | null = null
  // 历遍当年所有农历月份
  for (let i = 0; i < lunarMonths.length; i++) {
    const lm = lunarMonths[i]
    if (lm.month === 0) sawNewYear = true
    // 取得当前阴历月
    if (sawNewYear && lm.month + 1 === month && lm.isLeap === isLeapMonth) {
      monthData = lm
    }
    if (sawNewYear && lm.month > month) {
      break
    }
  }
  if (monthData === null) throw new Error('Invalid lunar date （输入的阴历日期似乎不存在）')
  return lunisolar.utils.parseJD({ jdn: monthData.dayJdn - 0.5 + day + (hour * 2) / 24 - 1 }, isUTC)
}
