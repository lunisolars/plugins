import type { Stem, Branch, Element5, SB } from 'lunisolar'
import { TenGod } from './tenGod'
import { C8God } from './c8God'
import { computeTenGodByStem } from '../utils'

import { cache } from '@lunisolar/utils'

interface PillarDataParam {
  sb: SB
  cate: YMDH | 'BigMoves'
  me: Stem
  lang?: string
}

export class Pillar {
  readonly _sb: SB
  readonly _me: Stem
  readonly _cate: YMDH | 'BigMoves'
  readonly _lang: string = 'zh'
  readonly gods: C8God[] = []
  readonly cache = new Map<string, unknown>()
  constructor(data: PillarDataParam) {
    this._sb = data.sb
    this._cate = data.cate
    this._me = data.me
    if (data.lang) {
      this._lang = data.lang
    }
  }

  _pushGods(gods: C8God[]) {
    this.gods.push(...gods)
  }

  get stem(): Stem {
    return this._sb.stem
  }

  get branch(): Branch {
    return this._sb.branch
  }

  get value(): number {
    return this._sb.value
  }

  get name(): string {
    return this._sb.name
  }

  get takeSound(): string {
    return this._sb.takeSound
  }

  get takeSoundE5(): Element5 {
    return this._sb.takeSoundE5
  }

  @cache('pillar:stemTenGod')
  get stemTenGod(): TenGod {
    if (this._cate === 'day') return TenGod.create('日主', { lang: this._lang })
    return computeTenGodByStem(this._me, this.stem, this._lang)
  }

  @cache('pillar:branchTenGod')
  get branchTenGod(): TenGod[] {
    return this.branch.hiddenStems.map(item => {
      return computeTenGodByStem(this._me, item, this._lang)
    })
  }

  get missing(): [Branch, Branch] {
    return this._sb.missing
  }

  valueOf() {
    return this._sb.valueOf()
  }

  toString() {
    return this._sb.toString()
  }
}
