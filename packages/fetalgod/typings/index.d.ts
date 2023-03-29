/// <reference path='./base.d.ts' />

import { PluginFunc } from 'lunisolar'

declare module 'lunisolar' {
  interface Lunisolar {
    fetalGod: string
    fetalGodData: FetalGodData
  }
}

declare const plugin: PluginFunc
export = plugin
