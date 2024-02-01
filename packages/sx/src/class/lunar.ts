import lunisolar, { JD } from 'lunisolar'
import { type YTM, type LunarMonth } from '@lunisolar/sx'
import { getLunarNewYearDay, getYTM, parseFromLunar } from '../utils'

interface LunarData extends lunisolar.LunarData {
  nyd: number
  len: number
}

/**
 * class Lunar
 */
export class Lunar extends lunisolar.Lunar {
  constructor(dateObj: lunisolar.DateConfigType, config?: lunisolar.LunarConfig) {
    super(dateObj, config)
  }

  init() {
    let year = this.jd.year
    let month = this.jd.month
    let hour = this.jd.hour
    const day = this.jd.day
    // 取得
    const jd = lunisolar.utils.parseJD(`${year}/${month}/${day} 12:00:00`, this._config.isUTC)

    // 当年的气朔 Year solar Term and new Moon
    const ytm: YTM = getYTM(jd.year)

    // 查出当年所有的节和气和农历
    const tmData = ytm.getTM(16)
    this.cache.set('tmData', tmData)
    const { lunarMonths } = tmData

    let sawNewYear = false // 用于历遍lunarMonths时是否已经历遍了正月
    let lmData: LunarMonth | null = null
    // const spData: SpData
    let leapMonth: number = 0
    let leapMonthIsBig: boolean = false
    let nyd = -1

    // 历遍当年所有农历月份
    for (let i = 0; i < lunarMonths.length; i++) {
      const lm = lunarMonths[i]
      const nextLm = i === lunarMonths.length - 1 ? undefined : lunarMonths[i + 1]
      if (lm.month === 0) {
        sawNewYear = true
        nyd = lm.dayJdn - 0.5
      }
      if (lm.dayJdn <= jd.jdn && ((nextLm && jd.jdn < nextLm.dayJdn) || nextLm === void 0)) {
        if (lmData === null) lmData = lm
      }
      if (lm.isLeap) {
        leapMonth = lm.month + 1
        leapMonthIsBig = lm.len > 29
      }
    }
    const initData: LunarData = {
      year: sawNewYear ? year : year - 1,
      month: (lmData?.month ?? -2) + 1 + (lmData?.isLeap ? 100 : 0),
      day: jd.jdn - (lmData?.dayJdn ?? 0) + 1,
      hour: (hour + 1) % 24 >> 1,
      leapMonth,
      leapMonthIsBig,
      nyd,
      len: lmData?.len ?? 0
    }
    this.cache.set(Lunar.DATA_KEY, initData)
  }

  static fromLunar(param: lunisolar.ParseFromLunarParam, config?: lunisolar.LunarConfig): Lunar {
    return new Lunar(parseFromLunar(param, config?.lang), config)
  }

  /**
   * 当年正月初一的日期
   */
  get lunarNewYearDay(): JD {
    const nyd = this.getData().nyd
    return lunisolar.utils.parseJD({ jdn: nyd })
  }

  // /**
  //  * 取得本农历年的取后一天
  //  */
  // get lastDayOfYear(): JD {
  //   const nextNewYearDay = getLunarNewYearDay(this.year + 1)
  //   return parseJD({ jdn: nextNewYearDay.jdn - 1 })
  // }

  // /**
  //  * 取得月相
  //  */
  // get phaseOfTheMoon(): string {
  //   return phaseOfTheMoon(this, _GlobalConfig.locales[this._config.lang])
  // }

  get isBigMonth(): boolean {
    return this.getData().len > 29
  }

  static getLunarNewYearDay(year: number): JD {
    return getLunarNewYearDay(year)
  }
}
