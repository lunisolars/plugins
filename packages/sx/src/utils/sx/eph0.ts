import { XL1 } from '../../constants/xl1'
import { RAD } from '../../constants'
import { int2 } from './func'

//=================================月亮星历--=======================================
//==================================================================================

export function xl1Calc(zn: number, t: number, n: number) {
  //计算月亮
  const ob = XL1[zn]
  let i,
    j,
    F,
    N,
    v = 0,
    tn = 1,
    c
  let t2 = t * t,
    t3 = t2 * t,
    t4 = t3 * t,
    t5 = t4 * t,
    tx = t - 10
  if (zn == 0) {
    v += (3.81034409 + 8399.684730072 * t - 3.319e-5 * t2 + 3.11e-8 * t3 - 2.033e-10 * t4) * RAD //月球平黄经(弧度)
    v += 5028.792262 * t + 1.1124406 * t2 + 0.00007699 * t3 - 0.000023479 * t4 - 0.0000000178 * t5 //岁差(角秒)
    if (tx > 0) v += -0.866 + 1.43 * tx + 0.054 * tx * tx //对公元3000年至公元5000年的拟合,最大误差小于10角秒
  }
  ;(t2 /= 1e4), (t3 /= 1e8), (t4 /= 1e8)
  n *= 6
  if (n < 0) n = ob[0].length
  for (i = 0; i < ob.length; i++, tn *= t) {
    F = ob[i]
    N = int2((n * F.length) / ob[0].length + 0.5)
    if (i) N += 6
    if (N >= F.length) N = F.length
    for (j = 0, c = 0; j < N; j += 6)
      c += F[j] * Math.cos(F[j + 1] + t * F[j + 2] + t2 * F[j + 3] + t3 * F[j + 4] + t4 * F[j + 5])
    v += c * tn
  }
  if (zn != 2) v /= RAD
  return v
}

export function m_coord(t: number, n1: number, n2: number, n3: number) {
  //返回月球坐标,n1,n2,n3为各坐标所取的项数
  var re = new Array()
  re[0] = xl1Calc(0, t, n1)
  re[1] = xl1Calc(1, t, n2)
  re[2] = xl1Calc(2, t, n3)
  return re
}
