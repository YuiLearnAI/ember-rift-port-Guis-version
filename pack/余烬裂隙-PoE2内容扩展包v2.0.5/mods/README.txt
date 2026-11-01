# mods 文件夹：新增技能 / 辅助宝石

这里放**数据文件**，往文件里写条目，重新构建后游戏里就会出现新宝石，和暗金一样是“数据驱动”。

- `skills.js`  —— 新主动技能宝石
- `supports.js` —— 新辅助宝石

## 用法

1. 打开对应 js 文件，复制一段 `window.RIFT_EXTRA_SKILLS.push({...})` / `window.RIFT_EXTRA_SUPPORTS.push({...})`。
2. 改 `id`（唯一）、中文名、数值、标签等。
3. 保存，然后构建：
   ```
   node 迁移工具/build/build.mjs
   ```
   或直接双击 `打包新版.bat`。
4. 构建后的发布版/开发版会把这个文件内嵌进去；进游戏在商人/调试页的宝石里就能看到。

## 注意

- `id` 不能和已有宝石重复，建议统一 `mods_` 开头。
- 主动技能目前走通用行为模板：`bh` 填 `proj`（投射物）/`melee`（近战）/`aoe`（范围），引擎会按模板生成伤害/命中/特效；复杂机制（引导、召唤、变身）需要改代码，不能只靠数据。
- 辅助宝石的 `more/proj/pierce/chain/aoe/critInc/critMulti/spd` 等字段由现有辅助结算读取；`req` 是标签限制。
- 写错格式时游戏控制台会打印 `[mods] 加载失败 ...`，把报错发我。
- 发布版是单文件内嵌，改完必须重新构建；开发版 `余烬裂隙-异界内容扩展.html` 也建议重建。

## 新通货：currencies.js

`currencies.js` 里复制 `window.RIFT_EXTRA_CURRENCIES.push({...})`：

- 必填：`id` / `n` / `d`
- 常用：`v`（混沌石价值）、`w`（掉落权重）、`col`（颜色）、`grp`（分类，默认 basic）
- `like`：可选，复制某个已有通货的**使用效果**（如 `"chaos"` / `"exalt"`），
  点新通货再点装备时按 like 的工艺生效，但消耗的是新通货。
- 没有 `like` 的新通货只是可收集/可交易物品，不会执行工艺。

新通货会进通货栏、调试“全部通货”和掉落池；同样保存后 `node 迁移工具/build/build.mjs`。

## 星图联动效果：star_effects.js

`star_effects.js` 定义「基底天赋组合 → 星图特殊词条」，星图节点本身不直接加属性。

- `id` / `n` / `region` / `d`：唯一 id、名称、对应区域、星图说明
- `require.tags`：基底已点节点要覆盖的标签（如 cold+defence）
- `require.nodes`：可选，指定基底节点 key
- `require.min`：至少匹配几个节点
- `text`：追加到基底节点的词条（`{0}` 替换 stats 第一个值）
- `stats`：可选，走现有结算键；没有对应键时只显示文案
- `enabled:false` 跳过

改完保存，`node 迁移工具/build/build.mjs` 后生效；游戏里点对应区域的「天赋节点」解锁星图区域。

## 符文之语：runewords.js

按顺序镶嵌符文激活。`window.RIFT_RUNEWORDS` 里 push 一条，字段：
`id / n / seq / req / w / a / d`（seq 是符文序号数组，w 武器效果、a 防具效果）。
文件里的条目优先于内置 14 条（同 id 覆盖）。

## 天赋树珠宝：jewels.js

`window.RIFT_EXTRA_JEWELS` 里 push 一条，字段：
`id / n / tier / w / stats / d`；会掉落到背包，镶嵌到高级天赋树的珠宝栏（点亮珠宝栏后点击选择）。
