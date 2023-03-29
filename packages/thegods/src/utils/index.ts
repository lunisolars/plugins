import { YMDH_SINGLE_LOWER_SET } from '../constants'

export const getYmdhSB = (
  lsr: lunisolar.Lunisolar,
  ymdh: YMDH,
  buildFlag: 0 | 1 = 0
): lunisolar.SB => (ymdh === 'month' ? lsr.getMonthBuilder(buildFlag)[0] : lsr.char8[ymdh])

// 取地支值
export const getBranchValue: StemOrBranchValueFunc = (
  lsr: lunisolar.Lunisolar,
  ymdh: YMDH,
  div?: number
) => {
  let sb = getYmdhSB(lsr, ymdh, 0)
  return div ? sb.branch.value % div : sb.branch.value
}

// 取天干值
export const getStemValue: StemOrBranchValueFunc = (
  lsr: lunisolar.Lunisolar,
  ymdh: YMDH,
  div?: number
) => {
  let sb = getYmdhSB(lsr, ymdh, 0)
  return div ? sb.stem.value % div : sb.stem.value
}
/**
 * 取得譯文
 * @param key 譯文key
 */
export function getTranslation<T = any, U = LocaleData>(locale: U, key: string): T | string {
  const keySplit = key.split('.')
  let curr: any = locale
  let res = key
  const resAsCurr = (curr: any) => {
    if (typeof curr === 'string' || typeof curr === 'number' || typeof curr === 'function') {
      res = curr
      return true
    }
    return false
  }
  while (keySplit.length >= 0) {
    if (resAsCurr(curr)) break
    if (keySplit.length === 0) break
    const currKey = keySplit.shift()
    if (currKey === undefined) return ''
    if (Array.isArray(curr)) {
      const idx = Number(currKey)
      if (isNaN(idx) || idx >= curr.length) return ''
      curr = curr[idx]
      res = curr
    } else if (curr.hasOwnProperty(currKey)) {
      curr = curr[currKey]
    } else {
      return keySplit[keySplit.length - 1] || currKey
    }
  }
  return res
}

export function isNumber(value: number | string): boolean {
  return !isNaN(Number(value))
}

/**
 * 通过天干和地支索引值，计算60个天干地支组合的索引
 * @param stemValue 天干索引值
 * @param branchValue 地支索引值
 */
export const computeSBValue = (stemValue: number, branchValue: number): number => {
  // 如果一个为奇数一个为偶数，则不能组合
  if ((stemValue + branchValue) % 2 !== 0) throw new Error('Invalid SB value')
  return (stemValue % 10) + ((6 - (branchValue >> 1) + (stemValue >> 1)) % 6) * 10
}

export function cacheAndReturn<T = unknown>(
  key: string,
  getDataFn: () => T,
  cache: Map<string, T>
): T {
  if (cache.has(key)) return cache.get(key) as T
  const res = getDataFn()
  cache.set(key, res)
  return res
}

// 取天干八卦
export const getStemTrigram8Value: StemOrBranchValueFunc = (
  lsr: lunisolar.Lunisolar,
  ymdh: 'year' | 'month' | 'day' | 'hour',
  div?: number
) => {
  let sb = getYmdhSB(lsr, ymdh, 0)
  const res = sb.stem.trigram8.valueOf()
  return div ? res % div : res
}

/**
  * 五鼠遁计算天干
  ```
  ---- 五鼠遁 ---
  甲己还加甲，乙庚丙作初。
  丙辛从戊起，丁壬庚子居。
  戊癸起壬子，周而复始求。
  ```
  * @param fromStemValue 起始天干 (计算时柱天干则此处应为日柱天干)
  * @param branchValue 目标地支 （计算时柱天干，时处应为时柱地支）
  * @returns {SB} 返回天地支对象
*/
export function computeRatStem(fromStemValue: number, branchValue: number = 0): number {
  const h2StartStemNum = (fromStemValue % 5) * 2
  return (h2StartStemNum + branchValue) % 10
}

/**
 * 把两个列表分别作为key为value合并成字典
 * @param keyList key列表数组
 * @param valueList value列表数组
 */
export function twoList2Dict<T = any>(keyList: string[], valueList: T[]): { [key: string]: T } {
  const res: { [key: string]: T } = {}
  for (let i = 0; i < keyList.length; i++) {
    const key = keyList[i]
    const value = valueList[i]
    res[key] = value
  }
  return res
}

// 處理getGods方法的ymdh參數
export function prettyGetGodsYMDH(ymdh: YmdhSu | string, defaultNull: true): YmdhSl | null
export function prettyGetGodsYMDH(ymdh: YmdhSu | string, defaultNull: false): YmdhSl | string
export function prettyGetGodsYMDH(ymdh: YmdhSu | string, defaultNull: boolean = false) {
  ymdh = ymdh.toLowerCase()
  const u: { [key: string]: YmdhSl } = {
    year: 'y',
    month: 'm',
    d: 'd',
    h: 'h'
  }
  return u.hasOwnProperty(ymdh)
    ? u[ymdh]
    : YMDH_SINGLE_LOWER_SET.has(ymdh) || !defaultNull
    ? ymdh
    : null
}

// 神煞地支順行
export function branchAscGodFunc(offset: number): CheckGodFunc {
  return getCheckGodFunc(
    (lsr, ymdh) => (getBranchValue(lsr, ymdh ?? 'month') + offset) % 12,
    getBranchValue
  )
}

// 神煞地支逆行
export function branchDescGodFunc(offset: number): CheckGodFunc {
  return getCheckGodFunc(
    (lsr, ymdh) =>
      ([0, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1][getBranchValue(lsr, ymdh ?? 'month')] + offset) % 12,
    getBranchValue
  )
}

// 神煞天干順行
export function stemAscGodFunc(offset: number): CheckGodFunc {
  return getCheckGodFunc(
    (lsr, ymdh) => (getStemValue(lsr, ymdh ?? 'month') + offset) % 10,
    getStemValue
  )
}

// 月神随月将地支逆行
export function monthGeneralDescGodFunc(offset: number): CheckGodFunc {
  // 子月月将顺序为从丑开始逆行。-> 丑	子	亥	戌	酉	申	未	午	巳	辰	卯	寅
  return getCheckGodFunc(
    lsr =>
      ([1, 0, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2][lsr.getMonthBuilder(0)[0].branch.value] +
        offset +
        12) %
      12,
    getBranchValue
  )
}

export function getCheckGodFunc<T = number>(
  resFrom: (lsr: lunisolar.Lunisolar, ymdh?: YMDH) => T,
  resTo: (lsr: lunisolar.Lunisolar, ymdh: YMDH) => T
): CheckGodFunc
export function getCheckGodFunc<T = number, U = T>(
  resFrom: (lsr: lunisolar.Lunisolar, ymdh?: YMDH) => T,
  resTo: (lsr: lunisolar.Lunisolar, ymdh: YMDH) => U,
  compareSymbol: 'includes'
): CheckGodFunc
export function getCheckGodFunc<T = number, U = T>(
  resFrom: (lsr: lunisolar.Lunisolar, ymdh?: YMDH) => T,
  resTo: (lsr: lunisolar.Lunisolar, ymdh: YMDH) => U,
  compareSymbol: string = '='
): CheckGodFunc {
  function func<V = number>(lsr: lunisolar.Lunisolar, fromYmdh?: YMDH): V
  function func<V = number>(lsr: lunisolar.Lunisolar, fromYmdh: YMDH | undefined, toYmdh: null): V
  function func(lsr: lunisolar.Lunisolar, fromYmdh: YMDH | undefined, toYmdh: YMDH): boolean
  function func(
    lsr: lunisolar.Lunisolar,
    fromYmdh: undefined | YMDH,
    toYmdh: null | YMDH = null
  ): T | boolean {
    const res = resFrom(lsr, fromYmdh) as T | boolean
    if (!toYmdh) return res
    if (res === null || res === false) return false
    const to = resTo(lsr, toYmdh)
    return compareSymbol === 'includes' && Array.isArray(res)
      ? res.length === 1
        ? res[0] === to
        : res.includes(to)
      : res === (to as unknown as T)
  }
  return func
}

export function getCommonCheckGodFunc(
  ruleArray: (number | null)[] | string,
  compareFromFunc: StemOrBranchValueFunc,
  fromDiv: number,
  fromDefaultYmdh: YMDH = 'month',
  compareToFunc?: StemOrBranchValueFunc
): CheckGodFunc {
  return getCheckGodFunc(
    (lsr, ymdh) => Number(ruleArray[compareFromFunc(lsr, ymdh ?? fromDefaultYmdh, fromDiv)]),
    compareToFunc || compareFromFunc
  )
}

export function actKT(acts: string[], isReturnKey: boolean, lang: string) {
  return acts.map(i => (isReturnKey ? i : trans(i, lang, 'acts')))
}

export const removeSetByList = function (setData: Set<string>, removes: string[]) {
  for (const item of removes) setData.delete(item)
}

export const filterActsNotInSet = function (acts: ActsSet, filterList: string[]) {
  const good = new Set<string>()
  const bad = new Set<string>()
  for (const item of filterList) {
    if (acts.good.has(item)) good.add(item)
    if (acts.bad.has(item)) bad.add(item)
  }
  acts.good = good
  acts.bad = bad
  return acts
}

// act replacer to string
export const arToString = function (replacer: { [key: string]: string }): string {
  let res = ''
  for (const key in replacer) {
    res += `${key}${replacer[key]}`
  }
  return res
}

export const checkQueryString = function (
  queryString: string,
  checkString: string,
  lang: string
): boolean {
  return queryString === checkString || queryString === trans(checkString, lang, 'queryString')
}

export const theGodsGlobal: { locales: { [key: string]: any } } = {
  locales: {}
}

export const setTheGodsLocales = function (locales: { [key: string]: any }) {
  theGodsGlobal.locales = locales
}

export const trans = function (
  key: string,
  lang: string = 'zh',
  type?: 'acts' | 'gods' | 'queryString'
) {
  const locale = theGodsGlobal.locales[lang]
  if (!locale) return key
  const tKey = type ? `theGods.${type}.${key}` : key
  return getTranslation(locale, tKey)
}
