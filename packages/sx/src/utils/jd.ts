import { int2 } from './func'
//=================================日期计算--=======================================
//==================================================================================
type R = {
  Y: number
  M: number
  D: number
  h: number
  m: number
  s: number
}
export const JD = {
  //日期元件
  JD: function (y: number, m: number, d: number) {
    //公历转儒略日
    let n = 0,
      G = 0
    if (y * 372 + m * 31 + int2(d) >= 588829) G = 1 //判断是否为格里高利历日1582*372+10*31+15
    if (m <= 2) (m += 12), y--
    if (G) (n = int2(y / 100)), (n = 2 - n + int2(n / 4)) //加百年闰
    return int2(365.25 * (y + 4716)) + int2(30.6001 * (m + 1)) + d + n - 1524.5
  },
  DD: function (jd: number) {
    //儒略日数转公历
    const r: R = {
      Y: 0,
      M: 0,
      D: 0,
      h: 0,
      m: 0,
      s: 0
    }
    let D = int2(jd + 0.5),
      F = jd + 0.5 - D,
      c //取得日数的整数部份A及小数部分F
    if (D >= 2299161) (c = int2((D - 1867216.25) / 36524.25)), (D += 1 + c - int2(c / 4))
    D += 1524
    r.Y = int2((D - 122.1) / 365.25) //年数
    D -= int2(365.25 * r.Y)
    r.M = int2(D / 30.601) //月数
    D -= int2(30.601 * r.M)
    r.D = D //日数
    if (r.M > 13) (r.M -= 13), (r.Y -= 4715)
    else (r.M -= 1), (r.Y -= 4716)
    //日的小数转为时分秒
    F *= 24
    r.h = int2(F)
    F -= r.h
    F *= 60
    r.m = int2(F)
    F -= r.m
    F *= 60
    r.s = F
    return r
  },
  DD2str: function (r: R) {
    //日期转为串
    let Y = '     ' + r.Y,
      M = '0' + r.M,
      D = '0' + r.D
    let h = r.h,
      m = r.m,
      s = int2(r.s + 0.5)
    if (s >= 60) (s -= 60), m++
    if (m >= 60) (m -= 60), h++

    Y = Y.slice(-5)
    M = M.slice(-2)
    D = D.slice(-2)
    const hString = ('0' + h).slice(-2)
    const mString = ('0' + m).slice(-2)
    const sString = ('0' + s).slice(-2)
    return Y + '-' + M + '-' + D + ' ' + hString + ':' + mString + ':' + sString
  },
  JD2str: function (jd: number) {
    //JD转为串
    return this.DD2str(this.DD(jd))
  },

  Y: 2000,
  M: 1,
  D: 1,
  h: 12,
  m: 0,
  s: 0,
  toJD: function () {
    return this.JD(this.Y, this.M, this.D + ((this.s / 60 + this.m) / 60 + this.h) / 24)
  }, //公历转儒略日
  setFromJD: function (jd: number) {
    const r = this.DD(jd)
    ;(this.Y = r.Y), (this.M = r.M), (this.D = r.D), (this.m = r.m), (this.h = r.h), (this.s = r.s)
  }, //儒略日数转公历

  timeStr: function (jd: number) {
    //提取jd中的时间(去除日期)
    let h, m, s
    jd += 0.5
    jd = jd - int2(jd)
    s = int2(jd * 86400 + 0.5)
    h = int2(s / 3600)
    s -= h * 3600
    m = int2(s / 60)
    s -= m * 60
    h = '0' + h
    m = '0' + m
    s = '0' + s
    return (
      h.substr(h.length - 2, 2) + ':' + m.substr(m.length - 2, 2) + ':' + s.substr(s.length - 2, 2)
    )
  },
  //星期相关
  Weeks: new Array('日', '一', '二', '三', '四', '五', '六', '七'),
  getWeek: function (jd: number) {
    return int2(jd + 1.5 + 7000000) % 7
  }, //星期计算
  nnweek: function (y: number, m: number, n: number, w: number) {
    //求y年m月的第n个星期w的儒略日数
    const jd = JD.JD(y, m, 1.5) //月首儒略日
    const w0 = (jd + 1 + 7000000) % 7 //月首的星期
    let r = jd - w0 + 7 * n + w //jd-w0+7*n是和n个星期0,起算下本月第一行的星期日(可能落在上一月)。加w后为第n个星期w
    if (w >= w0) r -= 7 //第1个星期w可能落在上个月,造成多算1周,所以考虑减1周
    if (n == 5) {
      m++
      if (m > 12) (m = 1), y++ //下个月
      if (r >= JD.JD(y, m, 1.5)) r -= 7 //r跑到下个月则减1周
    }
    return r
  }
}
