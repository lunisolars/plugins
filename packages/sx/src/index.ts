import type lunisolar from 'lunisolar'
// import { type JD } from 'lunisolar'
// import type { DateConfigType } from 'lunisolar'
import zh from './locale/zh'
import { YTM, type LunarMonth } from '@lunisolar/sx'
// import { type JD } from 'lunisolar'

// interface SpData {
//   isLeapMonth: boolean
//   monthLen: number
//   lunarNewYearDay: JD
// }

// interface NewLunar {
//   _config: any
//   jd: JD
//   cache: Map<string, unknown>
//   year: number
//   month: number
//   day: number
//   hour: number
//   leapMonth: number
//   leapMonthIsBig: boolean
// }

export const sx: lunisolar.PluginFunc = async (options, lsClass, lsFactory) => {
  // lsFactory.utils
  // const getDateJD = function (dateObj: lunisolar.DateConfigType, isUTC?: boolean, offset?: number) {
  //   const jd = lsFactory.utils.parseJD(dateObj, isUTC, offset)
  //   let year = jd.year
  //   let month = jd.month - 1
  //   let hour = jd.hour
  //   const day = jd.day
  //   // 取得
  //   const dayJd = lsFactory.utils.parseJD(`${year}/${month + 1}/${day}`, isUTC)
  //   return { dayJd, year, month, hour, day }
  // }

  // if your plugin has a language package, please load it here.
  lsFactory.locale(zh, true)

  // 重写Lunar类的相关方法
  // 原constructor
  const lunarProto = lsFactory.Lunar.prototype
  console.log(2222)

  // lunarProto.constructor = function (
  //   dateObj: lunisolar.DateConfigType,
  //   config?: lunisolar.LunarConfig
  // ) {
  //   console.log(1111111111)
  //   if (config) {
  //     ;(this as unknown as NewLunar)._config = Object.assign({}, this._config, config)
  //   }
  //   const offset = dateObj instanceof lsFactory.JD ? dateObj._config.offset : 0
  //   ;(this as unknown as NewLunar).jd = lsFactory.utils.parseJD(dateObj, this._config.isUTC, offset)
  //   let year = this.jd.year
  //   let month = this.jd.month - 1
  //   let hour = this.jd.hour
  //   const day = this.jd.day
  //   // 取得
  //   const jd = lsFactory.utils.parseJD(`${year}/${month + 1}/${day}`, this._config.isUTC)

  //   // 当年的气朔 Year solar Term and new Moon
  //   const ytm: YTM = getYTM(jd.year)

  //   // 查出当年所有的节和气
  //   const tmData = ytm.getTM(16)
  //   ;(this as unknown as NewLunar).cache.set('tmData', tmData)
  //   const { lunarMonths } = tmData

  //   let sawNewYear = false // 用于历遍lunarMonths时是否已经历遍了正月
  //   let lmData: LunarMonth | null = null
  //   // const spData: SpData
  //   let leapMonth: number = 0
  //   let leapMonthIsBig: boolean = false

  //   // 历遍当年所有农历月份
  //   for (let i = 0; i < lunarMonths.length; i++) {
  //     const lm = lunarMonths[i]
  //     const nextLm = i === lunarMonths.length - 1 ? undefined : lunarMonths[i + 1]
  //     if (lm.month === 0) sawNewYear = true
  //     if (lm.dayJdn <= jd.jdn && ((nextLm && jd.jdn < nextLm.dayJdn) || nextLm === void 0)) {
  //       if (lmData === null) lmData = lm
  //     }
  //     if (lm.isLeap) {
  //       leapMonth = lm.month + 1
  //       leapMonthIsBig = lm.len > 29
  //     }
  //   }

  //   ;(this as unknown as NewLunar).year = sawNewYear ? year : year - 1
  //   ;(this as unknown as NewLunar).month = lmData?.month ?? -1
  //   ;(this as unknown as NewLunar).day = jd.jdn - (lmData?.dayJdn ?? 0)
  //   ;(this as unknown as NewLunar).hour = (hour + 1) % 24 >> 1
  //   console.log(year, month, day, hour)
  //   ;(this as unknown as NewLunar).leapMonth = leapMonth
  //   ;(this as unknown as NewLunar).leapMonthIsBig = leapMonthIsBig
  // }

  Object.defineProperty(lunarProto, 'constructor', {
    value: function (dateObj: lunisolar.DateConfigType, config?: lunisolar.LunarConfig) {
      if (config) {
        this._config = Object.assign({}, this._config, config)
      }
      const offset = dateObj instanceof lsFactory.JD ? dateObj._config.offset : 0
      this.jd = lsFactory.utils.parseJD(dateObj, this._config.isUTC, offset)
      let year = this.jd.year
      let month = this.jd.month - 1
      let hour = this.jd.hour
      const day = this.jd.day
      // 取得
      const jd = lsFactory.utils.parseJD(`${year}/${month + 1}/${day}`, this._config.isUTC)

      // 当年的气朔 Year solar Term and new Moon
      const ytm: YTM = getYTM(jd.year)

      // 查出当年所有的节和气
      const tmData = ytm.getTM(16)
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

      this.year = sawNewYear ? year : year - 1
      this.month = lmData?.month ?? -1
      this.day = jd.jdn - (lmData?.dayJdn ?? 0)
      this.hour = (hour + 1) % 24 >> 1
      console.log(year, month, day, hour)

      this.leapMonth = leapMonth
      this.leapMonthIsBig = leapMonthIsBig
    }
  })

  const lsProto = lsClass.prototype
  Object.defineProperty(lsProto, 'lunar', {
    get() {
      console.log('run in defineProperty lunar')
      if (this.cache.has('lunisolar:lunar')) return this.cache.get('lunisolar:lunar')
      return new lsFactory.Lunar(this.jd, { lang: this._config.lang, isUTC: this.isUTC() })
    }
  })
}
