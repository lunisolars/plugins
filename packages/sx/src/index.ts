// @ts-check
import type lunisolar from 'lunisolar'

import zh from './locale/zh'

export const plugin: lunisolar.PluginFunc = async (options, lsClass, lsFactory) => {
  // if your plugin has a language package, please load it here.
  lsFactory.locale(zh, true)
  // const lsProto = lsClass.prototype
}
