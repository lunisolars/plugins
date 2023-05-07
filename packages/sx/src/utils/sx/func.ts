// 寿星万年历工具，参考 https://github.com/sxwnl/sxwnl/
// const { PI } = Math
// import { XL0 } from '../constants/xl0'
// import { XL1 } from '../constants/xl1'
import { RAD } from '../../constants'

//=================================三角函数等=======================================
const {
  // floor,
  // PI,
  // sqrt,
  // abs,
  // sin,
  cos
  // tan,
  // asin,
  // acos,
  // atan,
  // atan2
} = Math

//==================================================================================
export function int2(v: number) {
  return Math.floor(v)
}
/**
 * 求余
 */
export function mod2(v: number, n: number) {
  return ((v % n) + n) % n
}

/**
 * 太阳光行差,t是世纪数
 */
export function gxc_sunLon(t: number) {
  var v = -0.043126 + 628.301955 * t - 0.000002732 * t * t //平近点角
  var e = 0.016708634 - 0.000042037 * t - 0.0000001267 * t * t
  return (-20.49552 * (1 + e * cos(v))) / RAD //黄经光行差
}

/**
 * 黄纬光行差
 */
export function gxc_sunLat(t: number) {
  return 0
}
/**
 * 月球经度光行差,误差0.07"
 */
export function gxc_moonLon(t: number) {
  return -3.4e-6
}
/**
 * 月球纬度光行差,误差0.006"
 */
export function gxc_moonLat(t: number) {
  return (0.063 * Math.sin(0.057 + 8433.4662 * t + 0.000064 * t * t)) / RAD
}

//传入普通纪年或天文纪年，传回天文纪年
export function year2Ayear(c: number | string): number {
  let y: string | number = String(c).replace(/[^0-9Bb\*-]/g, '')
  let q = y.slice(0, 1)
  if (q == 'B' || q == 'b' || q == '*') {
    //通用纪年法(公元前)
    y = 1 - Number(y.slice(1))
    if (y > 0) {
      throw new Error('通用纪法的公元前纪法从B.C.1年开始。并且没有公元0年')
      // return -10000
    }
  } // else y -= 0
  if (y < -4712) throw new Error('超过B.C. 4713不准')
  if (y > 9999) throw new Error('超过9999年的农历计算很不准。')
  return y as number
}
