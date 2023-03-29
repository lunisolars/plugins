// @ts-check

import { FETAL_GOD_DAY_DIRECTION } from './constants'

import zh from './locale/zh'

/**
 * 九宫数方向映射
```
['中', '東', '東南', '南', '西南', '西', '西北', '北', '東北']
to
['', '北', '西南', '東', '東南', '中', '西北', '西', '東北', '南'],
```
*/
const grid9 = [5, 3, 4, 9, 2, 7, 6, 1, 8]

const fetalGod: lunisolar.PluginFunc = async (options, lsClass, lsFactory) => {
  lsFactory.locale(zh, true)
  const lsProto = lsClass.prototype
  // **** 胎神 ****
  Object.defineProperty(lsProto, 'fetalGodData', {
    get(): FetalGodData {
      if (this._fetalGodData) return this._fetalGodData
      const locale = this.getLocale() as typeof zh
      const daySb = this.char8.day as lunisolar.SB
      const stemPlace = locale.stemFetalGodPlace[daySb.stem.value % 5]
      const branchPlace = locale.branchFetalGodPlace[daySb.branch.value % 6]
      let directionValue = FETAL_GOD_DAY_DIRECTION[daySb.value % 60]
      const isInside = directionValue < 0 ? -1 : 1
      const inOrOutSide =
        directionValue === 0
          ? ''
          : directionValue > 0
          ? locale.fetalGodOutsideDesc
          : locale.fetalGodInsideDesc

      directionValue = grid9[Math.abs(directionValue)] // directionValue取九宫数
      const direction = inOrOutSide + locale.fetalGodDirection[directionValue]
      const description = locale.fetalGodDayDesc[daySb.value]
      this._fetalGodData = {
        stemPlace,
        branchPlace,
        directionValue: isInside * directionValue,
        direction,
        description
      }
      return this._fetalGodData
    }
  })
  Object.defineProperty(lsProto, 'fetalGod', {
    get(): string {
      return this.fetalGodData.description
    }
  })
}
export { fetalGod }
