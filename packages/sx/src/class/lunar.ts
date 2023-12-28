import lunisolar from 'lunisolar'
import { YTM, type LunarMonth } from '@lunisolar/sx'

const ytmCache = new Map<number, YTM>()

const getYTM = function (year: number): YTM {
  if (ytmCache.has(year) && ytmCache.get(year) != void 0) return ytmCache.get(year) as YTM
  const res = new YTM(year)
  ytmCache.set(year, res)
  return res
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
    let month = this.jd.month - 1
    let hour = this.jd.hour
    const day = this.jd.day
    // 取得
    const jd = lunisolar.utils.parseJD(`${year}/${month + 1}/${day}`, this._config.isUTC)

    // 当年的气朔 Year solar Term and new Moon
    const ytm: YTM = getYTM(jd.year)

    // 查出当年所有的节和气
    const tmData = ytm.getTM(16)
    // this.
    this.cache.set('tmData', tmData)
    const { lunarMonths } = tmData

    let sawNewYear = false // 用于历遍lunarMonths时是否已经历遍了正月
    let lmData: LunarMonth | null = null
    // const spData: SpData
    let leapMonth: number = 0
    let leapMonthIsBig: boolean = false

    // 历遍当年所有农历月份
    for (let i = 0; i < lunarMonths.length; i++) {
      const lm = lunarMonths[i]
      const nextLm = i === lunarMonths.length - 1 ? undefined : lunarMonths[i + 1]
      if (lm.month === 0) sawNewYear = true
      if (lm.dayJdn <= jd.jdn && ((nextLm && jd.jdn < nextLm.dayJdn) || nextLm === void 0)) {
        if (lmData === null) lmData = lm
      }
      if (lm.isLeap) {
        leapMonth = lm.month + 1
        leapMonthIsBig = lm.len > 29
      }
    }

    const initData = {
      year: sawNewYear ? year : year - 1,
      month: lmData?.month ?? -1,
      day: jd.jdn - (lmData?.dayJdn ?? 0),
      hour: (hour + 1) % 24 >> 1,
      leapMonth,
      leapMonthIsBig
    }
    this.cache.set('lunar:initData', initData)
  }
  // static fromLunar(param: ParseFromLunarParam, config?: LunarConfig): Lunar {
  //   const date = parseFromLunar(param, config?.lang)
  //   return new Lunar(date, config)
  // }

  // constructor(dateObj: DateConfigType | JDDict, config?: LunarConfig) {
  //   super()
  //   if (config) {
  //     this._config = Object.assign({}, this._config, config)
  //   }
  //   const offset = dateObj instanceof JD ? dateObj._config.offset : 0
  //   this.jd = parseJD(dateObj, this._config.isUTC, offset)
  //   let year = this.jd.year
  //   let month = this.jd.month - 1
  //   let hour = this.jd.hour
  //   const day = this.jd.day
  //   const date = parseJD(`${year}/${month + 1}/${day}`, this._config.isUTC)

  //   // 計算年份
  //   if (
  //     year < FIRST_YEAR ||
  //     year > LAST_YEAR ||
  //     (year === FIRST_YEAR && month < 1) ||
  //     (year === FIRST_YEAR && month === 1 && date.day < 19)
  //   ) {
  //     throw new Error('Invalid lunar year: out of range')
  //   }

  //   let dateDiff = getDateDiff(getLunarNewYearDay(year), date)
  //   if (date && hour === 23) dateDiff += 1

  //   if (dateDiff < 0) {
  //     year = year - 1
  //     dateDiff = getDateDiff(getLunarNewYearDay(year), date)
  //   }

  //   this.year = year
  //   // 取得當年的闰月
  //   const [leapMonth, leapMonthIsBig] = getYearLeapMonth(year)
  //   this.leapMonth = leapMonth
  //   this.leapMonthIsBig = leapMonthIsBig
  //   // 計算年和月
  //   ;[this.month, this.day] = getLunarMonthDate(year, dateDiff, [leapMonth, leapMonthIsBig])
  //   // 計算時辰 0 ~ 11
  //   this.hour = (hour + 1) % 24 >> 1
  // }

  // get isLeapMonth(): boolean {
  //   return this.month > 100
  // }

  // get isBigMonth(): boolean {
  //   const monthData = LUNAR_MONTH_DATAS[this.year - FIRST_YEAR]
  //   if (this.isLeapMonth) {
  //     return ((monthData >> 12) & 1) === 1
  //   } else {
  //     return ((monthData >> (this.month - 1)) & 1) === 1
  //   }
  // }

  // get isLastDayOfMonth(): boolean {
  //   if (this.isBigMonth && this.day === 30) return true
  //   if (!this.isBigMonth && this.day === 29) return true
  //   return false
  // }

  // /**
  //  * 当年正月初一的日期
  //  */
  // get lunarNewYearDay(): JD {
  //   return getLunarNewYearDay(this.year)
  // }

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

  // toDate(): Date {
  //   return this.jd.toDate()
  // }

  // getYearName(): string {
  //   let res = ''
  //   let year = this.year
  //   const numerals = _GlobalConfig.locales[this._config.lang].numerals
  //   while (year) {
  //     const s = numerals[year % 10]
  //     res = s + res
  //     year = Math.floor(year / 10)
  //   }
  //   return res
  // }

  // getMonthName(): string {
  //   const LunarMonthNames = _GlobalConfig.locales[this._config.lang].lunarMonths
  //   const leapStr = _GlobalConfig.locales[this._config.lang].leap
  //   return (this.isLeapMonth ? leapStr : '') + LunarMonthNames[(this.month % 100) - 1]
  // }

  // getDayName(): string {
  //   const lunarDayNames = _GlobalConfig.locales[this._config.lang].lunarDays
  //   return lunarDayNames[this.day - 1]
  // }

  // getHourName(): string {
  //   return _GlobalConfig.locales[this._config.lang].branchs[this.hour]
  // }

  // toString(): string {
  //   const locale = _GlobalConfig.locales[this._config.lang]
  //   return `${this.getYearName()}${
  //     locale.lunarYearUnit
  //   }${this.getMonthName()}${this.getDayName()}${this.getHourName()}${locale.lunarHourUnit}`
  // }

  // valueOf(): number {
  //   return this.jd.timestamp
  // }

  // static getLunarNewYearDay(year: number): JD {
  //   return getLunarNewYearDay(year)
  // }
}
