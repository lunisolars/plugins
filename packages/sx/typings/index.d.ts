import { PluginFunc } from 'lunisolar'

declare module 'lunisolar' {
  export interface LunarData extends lunisolar.LunarData {
    nyd: number
    len: number
  }
  interface Lunisolar {
    yourMethod: () => string
    hello: string
  }
  export class SolarTerm extends lunisolar.SolarTerm {
    /**
    * 取得当年的节气日期列表
    * @param year 年份
    * @param flag 
      ```
      当为0时，返回是几号的日期，
      当为1时，返回jdn(精确到北京时间的日)，
      当为2时，返回jdn(精确到时)
      ```
    * @returns {number[]}
    */
    static getYearTermDayList(year: number, flag: 0 | 1 | 2 = 0): number[]
  }
}

declare const plugin: PluginFunc
export { plugin }
