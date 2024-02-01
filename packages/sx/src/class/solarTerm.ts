// import { FIRST_YEAR, TERM_MINIMUM_DATES, TERM_SAME_HEX, TERM_LIST } from '../constants/lunarData'
// import { parseJD } from '../utils'
import lunisolar from 'lunisolar'
// const _GlobalConfig = lunisolar._globalConfig
import { YTM } from '@lunisolar/sx'
import { getYTM } from '../utils'


export class SolarTerm extends lunisolar.SolarTerm {
  constructor(value: number | string | SolarTerm, config?: lunisolar.ClassCommonConfig) {
    super(value, config)
  }

  /**
   * 取得当年的节气日期列表
   * @param year 年份
   * @param flag 当为0时，返回是几号的日期，当为1时，返回jdn(精确到北京时间的日)，当为2时，返回jdn(精确到时)
   * @returns {number[]}
   */
  static getYearTermDayList(year: number, flag: 0 | 1 | 2 = 0): number[] {
    const ytm: YTM = getYTM(year)
    const stFlag = flag === 2 ? 0 : 1
    const solarTerms = ytm.getSolarTerms(stFlag)
    let yearStarted = false
    const res: number[] = []
    for (let i = 0; i < solarTerms.length; i++) {
      const item = solarTerms[i]
      if (yearStarted === false && item.value === 0) yearStarted = true
      if (yearStarted) {
        const jd = new lunisolar.JD({ jdn: item.jdn })
        if (flag === 0) {
          res.push(Number(jd.format('D')))
        } else {
          res.push(item.jdn)

        }
        if (res.length > 23) break
      }
    }    
    return res
  }

  /**
   * 取得某年某月的两个节气的日期
   * @param year 年
   * @param month 月
   * @returns {[number, number]} [节, 气]
   */
  static getMonthTerms(year: number, month: number, flag: 0 | 1 | 2 = 0): [number, number] {
    const yTermsList = SolarTerm.getYearTermDayList(year, flag)
    // TODO: 
    return [0, 0]
    // js 位运算最大只支持32位，所以要先转成字符串截取
    // const data = TERM_SAME_HEX[TERM_LIST[year - FIRST_YEAR]].toString(2).padStart(48, '0')
    // const cutLen = (month - 1) * 4
    // const monthTermData = parseInt(data.slice(data.length - cutLen - 4, data.length - cutLen), 2)
    // const term1 = (monthTermData & 3) + TERM_MINIMUM_DATES[(month - 1) * 2]
    // const term2 = ((monthTermData >> 2) & 3) + TERM_MINIMUM_DATES[(month - 1) * 2 + 1]
    // return [term1, term2]
  }

  // 查出指定节气的日期 [year, month, day]
  static findDate(
    year: number,
    termValue: number | string | SolarTerm,
    config?: lunisolar.ClassCommonConfig
  ): [number, number, number] {
    // const lang = config && config.lang ? config.lang : _GlobalConfig.lang
    // if (termValue instanceof SolarTerm) termValue = termValue.value
    // termValue =
    //   typeof termValue === 'string'
    //     ? _GlobalConfig.locales[lang].solarTerm.indexOf(termValue)
    //     : termValue % 24
    // const month = termValue >> 1
    // const dayList = SolarTerm.getYearTermDayList(year)
    // const day = dayList[termValue]
    // return [year, month + 1, day]
    return [0, 0, 0]
  }

  /**
   * 查出指定日期属于哪个节或气之后，并返回该节气及该节气日期
   * @param date 日期
   * @param config 设置
      - nodeFlag: number
      - lang: string
      - isUTC: boolean
   * @returns {[Term | number, number]} [节气, 节气日期]
   */
  // static findNode<T extends boolean = false>(
  //   date: Date | JD,
  //   config: lunisolar.TermFindNodeConfig<T>
  // ): [T extends true ? number : SolarTerm, JD]
  // static findNode(date: Date | JD, config?: lunisolar.TermFindNodeConfig<boolean>): [SolarTerm | number, JD] {
    // const configDefault: lunisolarTermFindNodeConfig0 = {
    //   lang: _GlobalConfig.lang,
    //   returnValue: false,
    //   nodeFlag: 0,
    //   isUTC: false
    // }
    // const cfg = config ? Object.assign({}, configDefault, config) : configDefault
    // const { returnValue, nodeFlag } = cfg
    // if (nodeFlag > 2) throw new Error('Invalid nodeFlag')
    // const newSolarTermConfig = {
    //   lang: cfg.lang || _GlobalConfig.lang
    // }
    // const jd = parseJD(date, cfg.isUTC, undefined, true)

    // let year = jd.year
    // let month = jd.month - 1
    // const d = jd.day
    // const h = jd.hour
    // let termValue = (month * 2 + 24) % 24 // 取得该月的节的value值

    // let [termDay1, termDay2] = SolarTerm.getMonthTerms(year, month + 1)
    // let usePreMonth = false
    // let beforeTerm2 = false
    // if (d < termDay1 && !(d === termDay1 - 1 && h >= 23)) {
    //   // 当日期在节前, 则取上一个月
    //   usePreMonth = true
    // } else if (d < termDay2 && !(d === termDay2 - 1 && h >= 23)) {
    //   beforeTerm2 = true
    //   // 当日期在气之前节之后，前且nodeFlag要求返回气，则取上一个月
    //   if (nodeFlag === 1) usePreMonth = true
    // }
    // let termDay: number
    // let returnTerm2 = false
    // if (usePreMonth) {
    //   if (month - 1 < 0) {
    //     year--
    //     month = 11
    //   } else {
    //     month--
    //   }
    //   termValue = (month * 2 + 24) % 24
    //   ;[termDay1, termDay2] = SolarTerm.getMonthTerms(year, month + 1)
    //   if (nodeFlag > 0) returnTerm2 = true
    // } else if (nodeFlag === 1 || (nodeFlag === 2 && !beforeTerm2)) returnTerm2 = true
    // termDay = returnTerm2 ? termDay2 : termDay1
    // termValue = returnTerm2 ? (termValue + 1) % 24 : termValue
    // const termDate = parseJD(`${year}-${month + 1}-${termDay}`, cfg.isUTC)
    // if (returnValue) return [termValue, termDate]
    // return [new SolarTerm(termValue, newSolarTermConfig), termDate]
  }

  // valueOf() {
  //   return this.value
  // }

  // toString() {
  //   return this.name
  // }
// }
