// @ts-check

import { TAKE_SOUND_ELEMENT5 } from './constants'
import type lunisolar from 'lunisolar'

import zh from './locale/zh'

export const takeSound: lunisolar.PluginFunc = async (options, lsClass, lsFactory) => {
  lsFactory.locale(zh, true)
  const lsProto = lsClass.prototype
  // **** 纳音 ****
  const sbProto = lsFactory.SB.prototype
  // takeSound
  Object.defineProperty<lunisolar.SB>(sbProto, 'takeSound', {
    get(): string {
      const locale = lsFactory.getLocale(this._config.lang)
      if (this._takeSoundValue === undefined) {
        this._takeSoundValue = (this.value >> 1) % 30
      }
      return locale.takeSound[this._takeSoundValue]
    }
  })
  // takeSoundE5
  Object.defineProperty<lunisolar.SB>(sbProto, 'takeSoundE5', {
    get(): lunisolar.Element5 {
      if (this._takeSoundValue === undefined) {
        this._takeSoundValue = (this.value >> 1) % 30
      }
      return new lsFactory.Element5(TAKE_SOUND_ELEMENT5[this._takeSoundValue], {
        lang: this._config.lang
      })
    }
  })
  // 加到Lunisolar对象中
  Object.defineProperty<lunisolar.Lunisolar>(lsProto, 'takeSound', {
    get(): string {
      return this.char8.day.takeSound
    }
  })
}
