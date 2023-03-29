import { PluginFunc } from 'lunisolar'

declare module 'lunisolar' {
  interface Lunisolar {
    takeSound: string
  }
  interface SB {
    readonly _takeSoundValue: string
    takeSound: string
    takeSoundE5: lunisolar.Element5
  }
}

declare const takeSound: PluginFunc
export { takeSound }
