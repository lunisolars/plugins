import { PluginFunc } from 'lunisolar'

declare module 'lunisolar' {
  interface Lunisolar {
    yourMethod: () => string
    hello: string
  }
}

declare const plugin: PluginFunc
export { plugin }
