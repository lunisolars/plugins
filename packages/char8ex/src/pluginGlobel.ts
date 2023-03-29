import type lunisolar from 'lunisolar'

export const pluginGlobel: { lunisolar: typeof lunisolar | null } = {
  lunisolar: null
}

export const getLsFactory = () => {
  if (!pluginGlobel.lunisolar) {
    throw new Error('your must install lunisolar first')
  }
  return pluginGlobel.lunisolar
}
