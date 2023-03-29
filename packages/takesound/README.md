# @lunisolar/plugin-takesound

[lunisolar.js](https://github.com/waterbeside/lunisolar)的**五行纳音**插件

lunisolar.js文档请进入[lunisolar.js.org](https://lunisolar.js.org)

安装：

```sh
npm install @lunisolar/plugin-takesound
```

使用：

```typescript
import lunisolar from 'lunisolar'
import { takeSound } from '@lunisolar/plugin-takesound'

/**
  加载takeSound插件后，
  SB对象（天干地支对象）会添加一个takeSound属性，
 */
const lsr = lunisolar('2022-07-08')
lsr.char8.year.takeSound // 金箔金 （取得年干支的纳音）
lsr.char8.year.takeSoundE5.toString() // 金 （取得年干支的纳音五行）
// ...
lsr.char8.day.takeSound // 大海水 （取得日干支的纳音）
lsr.takeSound // 大海水 （取得日干支的纳音 等同于 lsr.char8.day.takeSound）
```
