# @lunisolar/plugin-fetalgod

[lunisolar.js](https://github.com/waterbeside/lunisolar)的**胎神占方**插件

lunisolar.js文档请进入[lunisolar.js.org](https://lunisolar.js.org)

安装：

```sh
npm install @lunisolar/plugin-fetalgod
```

使用：

查询胎神要先导入 fetalGod 插件，

之后可使用lunisolar().fetalGod 取得胎神描述，

也可以使用lunisolar().fetalGodData 取得胎神数据。

```typescript
import lunisolar from 'lunisolar'
import { fetalGod } from '@lunisolar/plugin-fetalgod'

lunisolar.extend(fetalGod)

const lsr = lunisolar('2022-07-08')
lsr.fetalGod // 倉庫棲外東南
lsr.fetalGodData.stemPlace // 倉庫
lsr.fetalGodData.branchPlace // 雞棲
lsr.fetalGodData.direction // 外東南
lsr.fetalGodData.description // 倉庫棲外東南
```

fetalGodData 包含以下属性

| 属性  | 描述   | 返回类型 |
| --- | ---  | --- |
| stemPlace | 根据天干推算的胎神位置，有以下五种： ['門', '碓磨', '廚灶', '倉庫', '房床'] | string |
| branchPlace  | 根据地支推算的胎神位置，有以下六种：['碓', '廁', '爐', '門', '雞棲', '床']| string |
| direction | 胎神的方向，如'外东南'、'外西'、'内中' 等 | string |
| directionValue | 返回方位对应的九宫数，外为正，内为负  | number |
| description | 胎神占方的完整描述，如："占門碓外東南" | string |
