import { defineConfig, Plugin } from 'rollup'
import del from 'rollup-plugin-delete'
import ts from 'rollup-plugin-typescript2'
import terser from '@rollup/plugin-terser'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import filesize from 'rollup-plugin-filesize'
import resolve from '@rollup/plugin-node-resolve'
import dts from 'rollup-plugin-dts'
import path from 'path'
import fs from 'fs'

const pkg = JSON.parse(fs.readFileSync('./package.json', { encoding: 'utf8' }))

const upCaseFirst = (str: string) => (str[0] ? str[0].toUpperCase() + str.slice(1) : '')
const formatName = (n: string) => {
  return n
    .trim()
    .replace(/\.(js|ts)$/, '')
    .split('-')
    .map((v, i) => (i === 0 ? v.trim() : upCaseFirst(v.trim())))
    .join('')
}

const input = 'src/index.ts'
const pluginGlobelName = 'lunisolarPlugin_char8ex'
const rollupConfig = [
  defineConfig({
    input,
    output: [
      {
        format: 'iife',
        name: pluginGlobelName,
        file: 'dist/index.iife.js'
      },
      {
        format: 'cjs',
        file: pkg.main,
        exports: 'named',
        footer: 'module.exports = Object.assign(exports?.default ?? {}, exports);',
        sourcemap: true
      },
      {
        format: 'es',
        file: pkg.module,
        sourcemap: true
      }
    ],
    plugins: [
      peerDepsExternal() as Plugin,
      del({ targets: ['dist/*', 'locale/*'] }),
      resolve(),
      ts({ clean: true }),
      terser(),
      filesize()
    ]
  })
]

// packing locales
;(() => {
  const dirPath = path.join(path.resolve('./src'), 'locale')
  const outputDir = path.resolve('./locale')
  if (!fs.existsSync(dirPath)) return
  const dirNames = fs.readdirSync(dirPath)
  // if (dirName)
  for (const dirName of dirNames) {
    const input = path.join(dirPath, dirName)
    const fileName = /\.(js|ts)$/.test(dirName) ? dirName.slice(0, -3) : dirName
    const stat = fs.statSync(input)
    if (!stat.isDirectory()) {
      rollupConfig.push(
        defineConfig({
          input,
          output: {
            name: `${pluginGlobelName}_locale_${formatName(fileName)}`,
            file: path.join(outputDir, `${fileName}.js`),
            format: 'umd'
          },
          plugins: [ts(), terser()]
        }),
        defineConfig({
          input,
          output: {
            file: path.join(outputDir, `${fileName}.d.ts`),
            format: 'es'
          },
          plugins: [dts()]
        })
      )
    }
  }
})()

export default rollupConfig
