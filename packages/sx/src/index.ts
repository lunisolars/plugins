import type lunisolar from 'lunisolar'
// import { type JD } from 'lunisolar'
// import type { DateConfigType } from 'lunisolar'
// import zh from './locale/zh'
// import { YTM, type LunarMonth } from '@lunisolar/sx'
import { Lunar } from './class/lunar'
import { SolarTerm } from './class/solarTerm'
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
  // lsFactory.locale(zh, true)

  const lsProto = lsClass.prototype
  Object.defineProperty(lsProto, 'lunar', {
    get() {
      const cacheKey = 'lunisolar:lunar'
      if (this.cache.has(cacheKey)) return this.cache.get(cacheKey)
      const lnr = new Lunar(this.jd, { lang: this._config.lang, isUTC: this.isUTC() })
      this.cache.set(cacheKey, lnr)
      return lnr
    }
  })

  Object.defineProperty(lsProto, 'solarTerm', {
    // get() {
    //   const cacheKey = 'lunisolar:solarTerm'
    //   if (this.cache.has(cacheKey)) return this.cache.get(cacheKey)
    //   const year = this.year
    //   const month = this.month
    //   const date = this.day
    //   const [term1, term2] = SolarTerm.getMonthTerms(year, month)
    //   const config = {
    //     lang: this._config.lang
    //   }
    //   if (date === term1) return new SolarTerm((month - 1) * 2, config)
    //   else if (date === term2) return new SolarTerm((month - 1) * 2 + 1, config)
    //   else return null 
    //   // return new Lunar(this.jd, { lang: this._config.lang, isUTC: this.isUTC() })
    // }
  })

  lsFactory.Lunar = Lunar

  lsFactory.SolarTerm = SolarTerm


}

sx.$name = '@lunisolar/plugin-sx'
