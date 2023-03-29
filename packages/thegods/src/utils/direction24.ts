type StemsAndBranchs = { stem: number[]; branch: number[] }

type DirectionList = { type: 'Branch' | 'Stem' | 'Trigram8'; value: number }[]

export const getDirection24List = (lang: string = 'zh'): DirectionList => {
  const res: DirectionList = [
    { type: 'Branch', value: 0 }, // 0 子
    { type: 'Stem', value: 9 }, // 1 癸
    { type: 'Branch', value: 1 }, // 2 丑
    { type: 'Trigram8', value: 4 }, // 3 艮
    { type: 'Branch', value: 2 }, // 4寅
    { type: 'Stem', value: 0 }, // 5 甲
    { type: 'Branch', value: 3 }, // 6卯
    { type: 'Stem', value: 1 }, // 7乙
    { type: 'Branch', value: 4 }, // 8辰
    { type: 'Trigram8', value: 6 }, // 9巽
    { type: 'Branch', value: 5 }, // 10巳
    { type: 'Stem', value: 2 }, // 11丙
    { type: 'Branch', value: 6 }, // 12午
    { type: 'Stem', value: 3 }, // 13丁
    { type: 'Branch', value: 7 }, // 14未
    { type: 'Trigram8', value: 0 }, // 15坤
    { type: 'Branch', value: 8 }, // 16申
    { type: 'Stem', value: 6 }, // 17庚
    { type: 'Branch', value: 9 }, // 18酉
    { type: 'Stem', value: 7 }, // 19辛
    { type: 'Branch', value: 10 }, // 20戌
    { type: 'Trigram8', value: 7 }, // 21乾
    { type: 'Branch', value: 11 }, // 22亥
    { type: 'Stem', value: 8 } // 23壬
  ]
  return res
}

// 取得月厌位所在的24山的索引值
export const getMonthHateAtDrt24 = (branchValue: number): number => {
  // [0, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
  return [0, 22, 20, 18, 16, 14, 12, 10, 8, 6, 4, 2][branchValue]
}

// 取得厌前厌后
export const getHateFrontAndBack = (
  branchValue: number,
  lang: string = 'zh'
): [StemsAndBranchs, StemsAndBranchs] => {
  const hate = getMonthHateAtDrt24(branchValue) // 月厌位
  const hateOp = (hate + 12) % 24 // 厌对位
  const hill24 = getDirection24List(lang)
  const ying: StemsAndBranchs = { stem: [], branch: [] }
  const yang: StemsAndBranchs = { stem: [], branch: [] }
  for (let i = 0; i < 24; i++) {
    if (i === hate || i === hateOp) continue
    const item = hill24[i]
    // 月厌逆行十二辰为阳
    if (
      (hate > hateOp && i < hate && i > hateOp) ||
      (hate < hateOp && ((0 <= i && i < hate) || (hateOp < i && i <= 23)))
    ) {
      if (item.type === 'Stem') yang.stem.push(item.value)
      if (item.type === 'Branch') yang.branch.push(item.value)
    } else {
      if (item.type === 'Stem') ying.stem.push(item.value)
      if (item.type === 'Branch') ying.branch.push(item.value)
    }
  }
  return [yang, ying]
}
