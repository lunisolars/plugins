/** ==========
 * 神煞匹配：
 * 1. 每柱分别历遍godDict的所有key, 按指定规则检查该神煞key是否命中该柱。
 * 2. 匹配时，以start对比end，如华盖年支见支者，start为年支，其它柱各支为end, 
 * rule为数组时，数组下标即为stat的天干或地支的顺序索引值，其下标对应的value为end的天干或地支的顺序索引。
=========== */

import { C8God } from './../class/c8God'
import { Pillar } from './../class/pillar'
import type { Char8Ex } from '../class/char8ex'
import { godDict, godKeys, godKeysSet } from '../constants/godDict'
import type { GodRuleItem, GodRule } from '../constants/godDict'

type CheckResItem = (YMDH | 'null')[]
type RuleRes = [CheckResItem, CheckResItem, CheckResItem, CheckResItem]
type CheckC8GodReturn = {
  luckLevel: number
  res: RuleRes
  isHasTrue: boolean
}

const ymdhList: YMDH[] = ['year', 'month', 'day', 'hour']

/**
 * 检查八字是否含有指定神煞
 * @param c8ex 八字对象
 * @param godKey 神煞key
 * @returns {CheckC8GodReturn} `{luckLevel: 吉凶等级, res: 各柱的匹配结果，isHasTrue: 是否有匹配成功的}`
 */
export const checkC8God = (c8ex: Char8Ex, godKey: string): CheckC8GodReturn => {
  if (!godKeysSet.has(godKey)) throw new Error(`Error C8God key: ${godKey}`)
  const { luckLevel, rules } = godDict[godKey]
  const allRes: RuleRes = [[], [], [], []]
  let hasTrue = false
  for (const rule of rules) {
    const { res, isHasTrue } = checkC8RuleItem(c8ex, rule)
    if (rules.length === 1) return { luckLevel, res, isHasTrue }
    for (let i = 0; i < allRes.length; i++) {
      allRes[i].push(...res[i])
    }
    hasTrue = hasTrue || isHasTrue
  }
  return { luckLevel, res: allRes, isHasTrue: hasTrue }
}

/**
 * 通过神煞规则计算八字是否包含该神煞
 * @param c8ex 八字实例
 * @param ruleItem 单条规则
 * @returns {(YMDH | 'null')[]}
 */
export const checkC8RuleItem = (c8ex: Char8Ex, ruleItem: GodRuleItem) => {
  const { startPillar, startAO } = ruleItem
  const isAnd = startAO === 'and'
  // 存放年月日时各柱是否含神煞结果。
  const res: RuleRes = [[], [], [], []]
  const resTemp: [{ [key in YMDH[number]]: boolean }, boolean][] = []
  let isAllTrue = true
  let isHasTrue = false
  for (const sp of startPillar) {
    const [spRes, isSpAllTrue, isSpHasTrue] = checkPerStartPillar(c8ex, ruleItem, sp)
    resTemp.push([spRes, isSpAllTrue])
    isAllTrue = isAllTrue && isSpAllTrue
    isHasTrue = isHasTrue || isSpHasTrue
  }
  for (let i = 0; i < resTemp.length; i++) {
    const [spRes] = resTemp[i]
    const sp = startPillar[i]
    const spSplit = sp.split(':')
    const startP = spSplit[0] as YMDH | 'null'
    if (isAnd && !isAllTrue) break
    for (let j = 0; j < 4; j++) {
      const ymdh = ymdhList[j]
      if (spRes[ymdh]) {
        res[j].push(startP)
      }
    }
  }
  return {
    res,
    isAllTrue,
    isHasTrue
  }
}

/**
 * 以单个startPillar验证神煞规则
 * @param c8ex 八字实例
 * @param ruleItem 单条起神煞规则
 * @param sp 哪个柱起神煞，如'year','month'等
 * @returns [{year: boolean, month: boolean, day: boolean, hour: boolean}年月日时分别是否命中, 是否全部命中，是否有命中]
 */
export const checkPerStartPillar = (
  c8ex: Char8Ex,
  ruleItem: GodRuleItem,
  sp: string
): [{ [key in YMDH[number]]: boolean }, boolean, boolean] => {
  const { startBy, startMapping, findBy, sbFormatter, ruleParams, rule } = ruleItem
  const spSplit = sp.split(':') // 如果有冒号，下标0者为起神的柱，下标1者为查神的柱
  const startP = spSplit[0] as YMDH | 'null'
  const endPs = (spSplit[1] ? [spSplit[1]] : ymdhList) as YMDH[]
  let resDict: { [key in YMDH[number]]: boolean } = {
    year: false,
    month: false,
    day: false,
    hour: false
  }
  let isAllTrue = false
  let isHasTrue = false
  let ruleRes: GodRule
  if (typeof rule === 'function') {
    const params = getRuleParams(c8ex, ruleParams)
    ruleRes = rule(...params)
  } else {
    ruleRes = rule
  }

  if (startP === 'null') {
    // 当startP为null时，只要endP合rull即可
    const ruleSet = new Set(ruleRes)
    return getPillarCheckRes(c8ex, endPs, findBy, ruleSet, startBy, startP)
  } else {
    const startPO = c8ex[startP]
    let startValue: number
    if (startBy === 'season') startValue = c8ex.lsr.getSeasonIndex()
    else if (startBy === 'takeSoundE5') startValue = startPO.takeSoundE5.valueOf()
    else if (startBy === 'sb') startValue = startPO.value
    else if (startBy === 'stem' || startBy === 'branch') {
      let [sv, bv] = [startPO.stem.value, startPO.branch.value]
      if (typeof sbFormatter === 'function') [sv, bv] = sbFormatter(sv, bv)
      startValue = startBy === 'stem' ? sv : bv
    } else {
      throw new Error(`Error value RuleItem.startBy: ${startBy}`)
    }
    // 如果存在startMapping则跟据startMapping取值
    if (startMapping) startValue = useStartMappingValue(startValue, startMapping)

    const ruleHit = ruleRes[startValue]
    if (ruleHit === null) return [resDict, isAllTrue, isHasTrue]
    const ruleSet = Array.isArray(ruleHit) ? new Set(ruleHit) : new Set([ruleHit])

    return getPillarCheckRes(c8ex, endPs, findBy, ruleSet, startBy, startP)
  }
}

export const useStartMappingValue = (
  startValue: number,
  startMapping: number[] | number[][]
): number => {
  for (let i = 0; i < startMapping.length; i++) {
    const mapItem = startMapping[i]
    if (typeof mapItem === 'number') {
      if (startValue === mapItem) return i
    } else if (Array.isArray(mapItem)) {
      if ((mapItem as number[]).includes(startValue)) return i
    }
  }
  return startValue
}

export const getRuleParams = (c8ex: Char8Ex, ruleParams?: string[] | null) => {
  if (ruleParams === null || ruleParams === void 0) return []
  return ruleParams.map(item => getObjectProperties(c8ex, item))
}

export const getObjectProperties = (obj: Object, propsString: string): unknown => {
  const props = propsString.split('.')
  let res: any = obj
  while (props.length > 0) {
    const curr = props.shift()
    if (curr === void 0 || res[curr] === void 0) return undefined
    res = res[curr]
  }
  return res
}

/**
 * 取得end的查例目标值
 * @param endPO end 四柱实例
 * @param findBy 用什么查例
 * @returns 目标值
 */
export const getEndTarget = (
  endPO: Pillar,
  findBy: 'branch' | 'stem' | 's,b' | 'sb'
): number | [string, string] => {
  let target: number | [string, string]
  if (findBy === 's,b') target = [`s${endPO.stem.value}`, `b${endPO.branch.value}`]
  else if (findBy === 'sb') target = endPO.value
  else if (findBy === 'stem') target = endPO.stem.value
  else if (findBy === 'branch') target = endPO.branch.value
  else throw new Error(`Error godDict prop: findBy ${findBy}`)
  return target
}

/**
 * 取得各柱是否命中规则
 * @param c8ex 八字实例
 * @param endPs 找哪一个柱
 * @param findBy 是查该柱的年支还是天干
 * @param ruleSet 把rule数组转为set类型传入
 * @param startBy 以什么起神煞，用于排除指定柱起例，如年支见支，查例时要排除年支
 * @param startP 用哪个柱起例
 * @returns [{year: boolean, month: boolean, day: boolean, hour: boolean}年月日时分别是否命中, 是否全部命中，是否有命中]
 */
export const getPillarCheckRes = (
  c8ex: Char8Ex,
  endPs: YMDH[],
  findBy: 'branch' | 'stem' | 's,b' | 'sb',
  ruleSet: Set<number | number[] | null | string>,
  startBy: 'branch' | 'stem' | 'takeSoundE5' | 'season' | 'sb' | null,
  startP: string
): [{ [key in YMDH[number]]: boolean }, boolean, boolean] => {
  const resDict = {
    year: false,
    month: false,
    day: false,
    hour: false
  }
  let allTrue = true
  let hasTrue = false
  for (const endP of endPs) {
    if (startP !== null && startP === endP && startBy === findBy) continue
    const endPO = c8ex[endP] // end的四柱实例 End Pillar Object
    const target = getEndTarget(endPO, findBy)
    let isHit = false // 是否命中规则
    if (Array.isArray(target)) {
      for (const t of target) {
        if (ruleSet.has(t)) {
          resDict[endP] = true
          isHit = true
          break
        }
      }
    } else if (ruleSet.has(target)) {
      isHit = true
      resDict[endP] = true
    }
    if (!isHit) allTrue = false
    else hasTrue = true
  }
  return [resDict, allTrue, hasTrue]
}

export const getGodLuckLevel = (godKey: string) => {
  if (!godKeysSet.has(godKey)) throw new Error(`Error C8God key: ${godKey}`)
  const { luckLevel } = godDict[godKey]
  return luckLevel
}

/**
 * 生成所有八字神煞
 * @param c8ex 八字对象实例
 * @returns {year: C8God[], month: C8God[], day: C8God[], hour: C8God[]}
 */
export const createAllC8Gods = (c8ex: Char8Ex) => {
  const allGodsRes: { [x in YMDH]: C8God[] } = {
    year: [],
    month: [],
    day: [],
    hour: []
  }
  const godSet: { [x in YMDH]: Set<string> } = {
    year: new Set<string>(),
    month: new Set<string>(),
    day: new Set<string>(),
    hour: new Set<string>()
  }
  for (const key of godKeys) {
    const { res } = checkC8God(c8ex, key)
    for (let i = 0; i < 4; i++) {
      const ymdh = ymdhList[i]
      if (res[i].length > 0 && !godSet[ymdh].has(key)) {
        const god = new C8God(key, { lang: c8ex.lsr.getConfig().lang })
        godSet[ymdh].add(key)
        allGodsRes[ymdh].push(god)
      }
    }
  }
  return allGodsRes
}
