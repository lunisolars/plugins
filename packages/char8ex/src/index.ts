// @ts-check
import { takeSound } from '@lunisolar/plugin-takesound'
import { setLocales } from './utils'
import zh from './locale/zh'
import { Char8Ex } from './class/char8ex'
import { Pillar } from './class/pillar'
import { C8God } from './class/c8God'
import { TenGod } from './class/tenGod'
import { pluginGlobel } from './pluginGlobel'

const char8ex: lunisolar.PluginFunc = async (options, lsClass, lsFactory) => {
  lsFactory.locale(zh, true)
  setLocales(lsFactory._globalConfig.locales)
  pluginGlobel.lunisolar = lsFactory
  // 加載纳音功能
  lsFactory.extend(takeSound)
  const lsPrototype = lsClass.prototype
  Object.defineProperty(lsPrototype, 'char8ex', {
    value: function (sex: 0 | 1) {
      const cacheKey = `char8ex:sex_${sex}`
      if (this.cache.has(cacheKey)) {
        const cacheData = this.cache.get(cacheKey)
        if (cacheData instanceof Char8Ex) return cacheData
      }
      const char8ex = new Char8Ex(this, sex)
      this.cache.set(cacheKey, char8ex)
      return char8ex
    }
  })
}

export { char8ex, Char8Ex, Pillar, C8God, TenGod }
