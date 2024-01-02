import type lunisolar from 'lunisolar'
// import { type JD } from 'lunisolar'
// import type { DateConfigType } from 'lunisolar'
// import zh from './locale/zh'
// import { YTM, type LunarMonth } from '@lunisolar/sx'
import { Lunar } from './class/lunar'
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
      console.log('run in defineProperty lunar')
      if (this.cache.has('lunisolar:lunar')) return this.cache.get('lunisolar:lunar')
      return new Lunar(this.jd, { lang: this._config.lang, isUTC: this.isUTC() })
    }
  })
  lsFactory.Lunar = Lunar
}
