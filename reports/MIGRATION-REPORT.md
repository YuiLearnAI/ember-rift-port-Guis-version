# 余烬裂隙扩展包 · v19 迁移报告

> 目标：把基于「憨憨问号改版 18.0.3」的扩展包，全量迁移到官方线上最新版 `https://ember-rift.pages.dev/`（v19）基底，并同步更新修改器。

---

## 一、诊断结论

| 项目 | v18.0.3（旧基底） | v19（线上最新） |
|---|---|---|
| 主脚本字符数 | 1,101,757 | 1,249,993 |
| 顶层符号数 | 1,868 | 2,227 |
| 顶层函数数 | 1,293 | 1,517 |
| 与对方的函数体完全一致数 | — | 259 / 1,274（**已大重构**） |
| 顶层符号位置重合度 | — | **0.1%**（不同压缩产物） |

**关键判断**：这不是小版本升级。v19 全部符号重新压缩命名，位置重合度仅 0.1%，按名字对齐完全不可行；且函数体大量重写，属于结构性重构。

**但存在两条可利用的稳定通道：**

1. **语义导出表**：两侧底包都有 `N(Module,{SEMANTIC:()=>symbol})` 形式的导出表，共 **1011 个语义名可 100% 精确对齐**（如 `AFF→Yt`、`cv→ot`）。这是比函数指纹更可靠的映射依据。
2. **官方 `window.__rift`**：v19 底包原生暴露一个 Proxy，遍历全部模块导出，可用 **1296 个语义名**访问内部数据/函数。修改器因此几乎无需适配逻辑。

---

## 二、迁移方案

### 2.1 符号重映射（核心）

```
block_new.js (18.0.3 符号)
   ├─ 词法作用域分析（acorn）→ 提取「真正指向底包的自由引用」
   ├─ 1696 条符号映射（指纹 1612 + 导出表 1011 + 字符串锚点 20）
   └─ 按 AST range 逆序替换 → block_v19.js
```

映射分三档来源，优先级从高到低：

| 来源 | 数量 | 说明 |
|---|---|---|
| 语义导出表 | 1011 | 同名语义精确对齐，最高可信 |
| 函数指纹（symmap） | 1612 | 规范化函数体比对，高置信 1504 |
| 字符串锚点 / 相邻语句 | 20 | 手工人肉定位小 token 绑定（`Ln→$r`、`K3→l$` 等） |

**结果**：移植块引用 366 个底包全局符号，**365 个完成映射**（唯一未映射的 `Int16Array` 是 JS 内置）；共替换 **5524 处**。

> 作用域分析里踩过两个坑，都已修复：`for (let x of ...)` 的循环变量、`catch (e)` 的异常参数。

### 2.2 构建链改造

原 `build.mjs` 的 7 个加固注入点全部基于 18.0.3 的压缩符号（如 `o.Z.img`、`function F3(e)`），在 v19 全部命中 0 次。新 `build-v19.mjs`：

- 注入点改为**命中才注入**，未命中记录为 skipped 而不阻断构建；
- 按 v19 实际代码重写锚点（`o→n`、`zt→Jt`、`hr→ci`、`Ya→Ga`、`he→pe`、`F3→YT`），恢复 3 条防崩加固；
- 修正抗性上限补丁的锚点（v19 里全局对象与局部参数名互换）；
- **修复热修注入位置**：原逻辑 `lastIndexOf("<script")` 会命中页面底部的 Cloudflare 统计脚本，导致热修被插到主脚本之后、移植块读不到 `window.HOTFIX` 而静默失效。改为用主脚本内容锚点定位。

### 2.3 修改器同步

- `@match` 增加 `https://ember-rift.pages.dev/*`（保留 itch 旧域名）；
- 版本 1.0 → 1.1；
- **API 层零改动**：实测 v19 的 `__rift` 提供了修改器需要的全部 22 个接口，且类型正确（`CUR` 109 项、`AFF` 51 项、`BASES` 72 项、`TH_MUL` 1.5）。

---

## 三、验证结果

| 门禁 | 结果 |
|---|---|
| 语法门（acorn 逐块编译） | **ALL OK**（2 个 inline 块） |
| 玩法回归（jsdom，397 条断言） | **RESULT: ALL PASS** |
| 发布版冒烟（无测试钩子） | eval OK · 30+120 帧无异常 · `window.onerror: none` · `riftErrors: 0` |
| 发布版进入游戏 | 9 个职业卡片正常 · `state: play` · `player: true` |
| 热修链路 | `__HOTFIX_APPLIED = 2.2.0 = HOTFIX.version`（修复前为 2.1.0 ≠ 2.2.0，即未生效） |
| 修改器注入 | 面板挂载 · 5 个标签页全渲染 · 背包读取正确 · **0 报错** |

**测试环境本身也修了 3 个历史缺陷**（交接文档里记录过但一直没修）：
1. harness 只执行最后一个 inline 块 → 改为按顺序执行全部（这正是「mods 未加载 → 选角读 undefined.n」的根因）；
2. jsdom / hotfix.json 的 Windows 硬编码路径 → 改为包内相对路径；
3. 图谱数量断言写死 56 → v19 官方已扩到 77，改为以当前基底实测数为基线。

---

## 四、已知限制

1. **3 条循环级 try-catch 未注入**（逐对象 / 逐掉落 / 逐实体）。v19 渲染管线已重构（视野判定由 `T()` 改为 `M()`，循环边界不同），原锚点语义不存在，强行包裹需重写循环边界、风险高于收益。v19 自身已有 `Zs()`/`zf()` 等逐项判定。**残余风险**：若某个对象绘制抛异常，理论上仍可能中断该帧。建议真机长时间刷图观察。
2. **符号对得上 ≠ 语义对得上**。v19 有 1000+ 个函数体被重写，移植块对某些函数的 monkey patch 可能在边界情况下行为漂移。397 条断言覆盖了主要玩法路径，但不等价于全量回归。
3. **jsdom 的 canvas 是 stub**，绘制类问题只有在真浏览器里才暴露。本次未做真机验证。
4. 版本号统一为 **2.2.0**（`version.json` / 发布文件名 / 热修 version）。

---

## 五、交付物

| 文件 | 说明 |
|---|---|
| `build/余烬裂隙-异界内容扩展-v2.2.0-v19.html` | **发布版**，单文件 4.43MB，含 mods + 热修 |
| `build/test-v19.html` | 测试版，含 expose 钩子，供回归用 |
| `build/block_v19.js` | v19 版移植块（唯一手改源） |
| `build/expose_v19.js` | 测试 API 桥 |
| `base/v19-online.html` | 官方 v19 原始底包（对照/回滚基线） |
| `tools/remap.mjs` | 符号重映射工具（可复用于下次升版） |
| `tools/build-v19.mjs` | v19 构建脚本 |
| `tools/harness_v19.cjs` | macOS 可跑的 jsdom 回归 |
| `tools/smoke-v19.cjs` | 发布版冒烟（无测试钩子） |
| `out/symbol_map_18to19.json` | 1696 条符号映射（下次升版的核心资产） |
| `cheat/ember-rift-gui.user.js` | 修改器 v1.1 |

### 下次官方再升版时怎么做

已实测的流程见下一节「六、v19.1 → v19.2 升版实录」，照抄改参数即可。

---

## 六、v19.1 → v19.2 升版实录（2026-11-01 · EMB-110 / EMB-111）

官方 2026-11-01 把线上版本从 **v19.1** 升到 **v19.2 踏麟 · 真言**（3,844,490 → 3,987,315 bytes）。
这一步的全部动作与实测数据记录在此，下次升版可直接复用。

### 6.1 这次最关键的发现：压缩名会被整体重排

先量化再动手。把两版主内联脚本抽出来，按 AST 取 IIFE 顶层绑定：

| 指标 | v19.1 | v19.2 |
|---|---|---|
| 主脚本字符数 | 1,249,993 | 1,301,398 |
| IIFE 顶层声明 | 2,226 | 2,334 |
| 两版同名集合 | — | 2,182（旧名 98% 还在） |
| **同名且定义体字节完全相同** | — | **仅 20 个** |
| 同名但定义体内容不同 | — | **2,162 个** |

结论：**「名字还在」不等于「还是同一个东西」**。压缩器按新代码重新分配短名，同一个 `d`
在 v19.1 是 canvas 2d context，在 v19.2 可能是别的对象的属性。任何"名字没变就不改"的省事做法都会
产出**能构建、能启动、但行为错乱**的包。必须走完整符号推导。

### 6.2 操作序列

```bash
# 0. 抓新底包与 wiki 快照（旧快照先另存，第 1 步要用它当 old 侧）
cp base/v19-online.html /tmp/v19.1-online.html
curl -sSL https://ember-rift.pages.dev/      -o base/v19-online.html
curl -sSL https://ember-rift.pages.dev/wiki/ -o base/wiki-online.html

# 1. 抽两版主脚本（跳过 src 脚本，取最后一个内联块）
#    → /tmp/sync/old.js（v19.1） /tmp/sync/new.js（v19.2）

# 2. 拷贝 symmap 到隔离工作区跑推导（它按 out/old.js、out/new.js、out/cur.js 读文件）
mkdir -p /tmp/symmap-work/{tools,out} /tmp/symmap-work/tools/jstools/node_modules
cp pack/余烬裂隙-PoE2内容扩展包v2.0.5/迁移工具/tools/symmap.mjs /tmp/symmap-work/tools/
ln -s "$PWD/tools/jstools/node_modules/acorn" /tmp/symmap-work/tools/jstools/node_modules/acorn
cp /tmp/sync/old.js /tmp/symmap-work/out/old.js
cp /tmp/sync/new.js /tmp/symmap-work/out/new.js
cp /tmp/sync/new.js /tmp/symmap-work/out/cur.js      # 没有第三版时 cur = new
cd /tmp/symmap-work && node tools/symmap.mjs run      # → out/symbol_map.json

# 3. 落库 + 重映射
cp /tmp/symmap-work/out/symbol_map.json out/symbol_map_19to192.json
node tools/remap.mjs build/block_v19.js  out/symbol_map_19to192.json build/block_v19.js  reports/remap-19to192.json
node tools/remap.mjs build/expose_v19.js out/symbol_map_19to192.json build/expose_v19.js reports/remap-expose-19to192.json

# 4. 校验映射目标真实存在（改了默认映射文件路径）
node tools/verify_map.mjs

# 5. 重建构建锚点（见 6.4），再出包 + 全量门禁
npm run build && npm run verify
```

> 坑：`symmap.mjs` 里 `require("./jstools/node_modules/acorn")` 是相对**脚本所在目录**解析的，
> 所以 acorn 必须软链到 `tools/jstools/node_modules/acorn`，不是工作区根目录。

### 6.3 推导质量

| 阶段 | 条目 |
|---|---|
| symmap 自动推导 | 1,940（high 1,823 / medium 117 / **conflicts 0**） |
| 人工补 6 条 | `l$→KA`、`Al→Ul`、`V2→ik`、`rL→r9`、`d7→sL`、`Ph→Mm` |
| 认定恒等 3 条 | `d`、`u`、`pe`（名字与语义都没变，symmap 不输出恒等项） |
| **最终映射** | **1,946 条**，`verify_map` 目标缺失 **0** |

人工补的 6 条都用两种可复核的方法定位，证据写在 `out/symbol_map_19to192.json` 的 `evidence` 字段：

1. **定义式规范化匹配** —— 把旧 init 里已知映射的标识符替换成 `@原名`，新侧反向替换，文本一致即命中。
   `l$`（`new Set(["pop","cflash","zip"])`）与 `Al`（`()=>Re.k>0`）靠它唯一定位。
2. **规范化词袋 Dice 系数** —— 函数体改过时，用 `@原名` 归一后做 IDF 加权词袋比对，取最高且与次选有明显差距者。
   `d7→sL` 0.952（次选 0.862），`Ph→Mm` 0.964（次选 0.460），`V2→ik` 0.794，`rL→r9` 0.823（次选 0.384）。
   四条都对得上结构特征：`sL` 同样含 `C("#treecv").getBoundingClientRect()` 与 `ie.uiZ`，
   `Mm` 同样是 `ro(z$(e)+":"+(e.ops||0))` 的计数键模式。

`u`（玩家对象，块内引用 592 次）用**属性访问签名**验证：62 个属性名在两版完全一致，
IDF 加权重合度 0.984，次选 0.015 —— 判为恒等是安全的。

### 6.4 构建锚点全部重建

`build-v19.mjs` 的 `tryPatch` 锚点是**压缩后的字面片段**，官方一换名就静默 skipped。
这次 10 处锚点里 6 处失配，按「属性名 / 字符串字面量这些不变量」重新定位：

| 锚点 | v19.1 | v19.2 | 变化 |
|---|---|---|---|
| `res-cap-server/ui/badge/badge2` | 原文 | 原文 | **未变**，仍命中 |
| `gem-cap-lt` / `gem-cap-gte` | `lvl<20` / `lvl>=20` | 同 | **未变**，命中 1 / 3 次（与基线一致） |
| `guard:bg-draw` | `d.drawImage(n.Z.img,k,g,v,w,...)` | `d.drawImage(n.Z.img,v,g,k,x,...)` | 局部变量重排，`drawImage` 目标表达式不变 |
| `guard:loot-icon-cur` | `ci[R.cur]` | `Si[R.cur]` | 通货图标表改名；`Si` 在 v19.2 是按需生成的缓存 |
| `guard:loot-icon-base` | `Ga[...]` | `Ha[...]` | 底材图标表改名 |
| `guard:mon-sprite` | `Jt[e.spr]` | `Xt[e.spr]` | 贴图表改名 |

补充观察：v19.2 新增了 `var bi={mode:0}` 渲染开关（v19.1 无 `bi.mode`），但**主场景仍是 2D 路径**
（`d.drawImage(n.Z.img,...)` 后接 `let M=(y,R,j)=>` 视锥判定仍在），所以 `__portDrawGroundCustom`
的挂载点依然有效。`bi.mode` 只影响预览/剪影分支。

### 6.5 结果

| 门禁 | 结果 |
|---|---|
| 语法门 | 2 个 inline 块 ALL OK |
| 映射校验 | 1,946 条，目标缺失 **0** |
| 构建补丁 | applied **10** / skipped **3**（与 v19.1 基线完全一致） |
| 玩法回归 | **399 条断言 ALL PASS** |
| 发布版冒烟 | `frame loop: OK` · `window.onerror: none` · `riftErrors: 0` · 9 职业 · `state: play` |
| 修改器 | review ERROR 0 / WARN 0 · 161 逻辑 + 47 界面断言全过 |

### 6.6 Wiki 侧同步

官方 wiki 从 4,550,974 涨到 4,835,522 bytes，页面结构、`window.RIFT` 契约（202 个键）、
`PAGES/NAV/SRCN/buildIndex` 全局词法绑定**都没变**，插件不用改，只有两处构建侧要动：

1. **meta description 改成前缀锚点**。官方每次升版都会改这行末尾的版本别名与页签清单
   （`v19.0.1 万象` → `v19.2 踏麟 · 真言`，并新增「魔化地图」），写死整行必失效。
   现在只匹配 `(<meta name="description" content="余烬裂隙玩家百科\()v[\d.]+ [^)]*(\): )`，
   把版本别名换成本改版标识，后面列了哪些页签不管。
2. **修正 `patch()` 的正则计数**。带捕获组时 `String.match()` 返回 `[整体, g1, g2]`，
   `length` 是 3 不是命中次数，会把「命中 1 次」误判成「命中 3 次，预期 1 次」而让构建失败。
   改为按 `g` 标志重新 `match` 计数。

并入前逐条核对过：5 件扩展暗金、1 技能、1 辅助、1 通货在官方 v19.2 数据里**都不存在**，
所以是净新增，不会覆盖官方条目（`R.UNIQ`/`R.SK`/`R.SUP`/`R.CUR` 的去重守卫只是保险）。

---

## 七、v19.2 传奇珠宝显示缺陷与基底一致性加固（2026-11-01 · EMB-112）

### 7.1 现象

官方 v19.2 新增三件传奇珠宝（逆流之玉 / 招魂之玉 / 盈虚之玉，`ca` 表 `niliu` /
`zhaohun` / `yingxu`）。在改版里它们在背包**看不出是什么**：图标空白、格子丢了传奇
稀有度边框、悬浮只显示「珠宝 · 天赋珠宝 · T1 · 可镶嵌在高级天赋树的珠宝栏位」，
看不到词缀、天赋转换表与风味文字。官方原版显示正常。

### 7.2 根因

扩展块（`build/block_v19.js`）为了给自己的珠宝加图标 / 格子 / 说明，接管了宿主的三个
渲染函数，判据是 `kind === "jewel"`：

```js
var _rpJewel = Ym;  Ym = function (it) { if (it && it.kind === "jewel") return 扩展图标; … };
var _$sJewel = Mo;  Mo = function (it) { if (it && it.kind === "jewel") return 扩展格子; … };
var _asJewel = qs;  qs = function (it) { if (it && it.kind === "jewel") return JewelTooltip(it); … };
```

官方 v19.2 的传奇珠宝 `kind` 同样是 `"jewel"`（另有 `uj` / `jt` / `th` 字段），于是被
整类截胡，官方 `Tx()`——v19.2 专门为珠宝写的 tooltip，含传奇珠宝的转换表、腐化、
破溃、插槽提示——从头到尾没被调用过一次。

`qs` 还有第二层：扩展块整体复刻了一份旧版 `qs`（69 行），第一行就是同一个宽判据。

### 7.3 判据怎么定

官方珠宝：`kind:"jewel"` + `uj`（传奇珠宝 id）+ `jt`（n/b）+ `th`（大珠宝分支），无 `jid`。
扩展珠宝：`kind:"jewel"` + `jid`（对应 `window.RIFT_EXTRA_JEWELS` 的 id），无 `uj`。

```js
function PortIsExtJewel(e) {
  return !!(e && e.kind === "jewel" && typeof e.jid === "string" && e.jid && !e.uj && JewelDef(e.jid));
}
```

`JewelDef()` 兜住「jid 存在但定义被删」的情况，避免残档被误认。四处判据（`Ym` / `Mo` /
`qs` wrapper + 复刻 `qs` 的珠宝分支）全部改用该函数，官方珠宝一律
`return 原实现.apply(this, arguments)`。

### 7.4 实测（红-绿对照）

| 版本 | `npm run verify:jewel` |
|---|---|
| 旧判据（`kind === "jewel"`） | 10 / 28 FAILED |
| 修复后 | 28 / 28 ALL PASS |

### 7.5 连带审计：官方内容到底有没有被动

三道自动审计（`npm run verify` 已包含前两道）：

**① 文本层** `tools/audit-parity.mjs`

产物剥掉四类注入（移植块 698,985 B / HOTFIX 6,995 B / mods 31,680 B / 扩展 CSS
14,894 B），再对基底施加十条白名单补丁，与 `base/v19-online.html` 逐字节比对：

```
✅ 剥离注入并施加白名单补丁后，与官方基底逐字节一致（3814894 字符）
```

**② 数据层** `tools/audit-runtime.mjs`

同一段探针分别注入官方基底与产物，各跑一次 jsdom，比对键集合与逐键内容：

| 表 | 官方键 | 产物键 | 新增 | 内容改写 | 丢失 | 权重调整 |
|---|---|---|---|---|---|---|
| `se` 技能 | 79 | 80 | 1 | 0 | 0 | — |
| `ne` 辅助 | 49 | 50 | 1 | 0 | 0 | — |
| `He` 增益 | 9 | 9 | 0 | 0 | 0 | — |
| `Ze` 元技能 | 4 | 4 | 0 | 0 | 0 | — |
| `pe` 底材 | 72 | 72 | 0 | 0 | 0 | — |
| `Ua` 暗金 | 51 | 56 | 5 | 0 | 0 | — |
| `ca` 传奇珠宝 | 3 | 3 | 0 | 0 | 0 | — |
| `ns` 词缀 | 33 | 33 | 0 | 0 | 0 | — |
| `q` 通货 | 38 | 113 | 75 | 0 | 0 | 19 |
| `bt` 大珠宝分支 | 5 | 5 | 0 | 0 | 0 | — |

19 项权重调整全部只动 `w`：`chaos` 42→30.24、`annul` 8→5.76、`exalt` 18→12.96、
`divine` 4→2.88（×0.72）；六种符文 12/16→15/20、九种精华 5→6.25（×1.25）。
这是扩展包 `DropMulCfg` 的既定平衡设计，名称 / 描述 / 价值 / 颜色一字未改。

**③ 接管层** `tools/audit-hijack.mjs`

AST + 作用域分析（区分块内局部变量与宿主符号）列出扩展对宿主的全部写入：
**91 个符号**（其中 84 个 function 包装、7 个非函数替换）。清单不判对错，用途是
升版复审——新出现的接管点必须逐条确认只做加法。第一版审计用「全部赋值」口径报
136 个，抓进来一堆块内 `var n = 0` 这类影子变量，加作用域分析后降到 91。

### 7.6 为什么之前没暴露

v19.1 基底里没有传奇珠宝，`kind === "jewel"` 这个判据在当时的官方数据上恰好等价于
「扩展自己的珠宝」。官方 v19.2 把传奇珠宝做进同一套 `kind` 命名空间后，宽判据立刻
变成数据劫持。**教训：共享作用域里的接管，判据只能认自己的数据特征，不能认类型名。**

---

## 八、天赋树标签排版、修改器数值与插槽（2026-11-01 · EMB-113）

四个问题一起处理：三个缺陷（天赋树压字 / 传奇数值改不动 / 提示气泡空白）+ 一个新功能
（任意装备改插槽数量）。

### 8.1 天赋树节点名压字

**现象**：图谱 → 异界天赋树，中心区节点名互相盖住；画布左上那行「可用 / 已获得 / 已分配」
也压在第一批名字上。

**根因**：`AtlasDraw` 把名字一律画在节点正上方，而且是**世界坐标**绘制：

```js
ctx.font = (tier === "keystone" ? "700 11px " : "10px ") + "monospace";
ctx.fillText(node.n, node.x, node.y - r - 5 / scale);   // 字号随缩放变，位置只有一个
```

节点间距 42 世界单位（`cos(ang) * (95 + i * 42)`），中文节点名 4–6 字宽 40–60px，
相邻节点必然压字；HUD 又在同一坐标系左上角从 (10,16) 开始画，正好压住第一条分支的名字。

**改法**：标签改到**屏幕坐标**里排，固定字号（10px，关键节点 11px 粗体），并做碰撞避让。

- 先把所有可见节点圆、HUD 的矩形塞进 `blocked`
- 每个标签按「上 / 下 / 右 / 左」4 方向 × 5 档距离 × 3 种错位 = 60 个候选位
- 用 `AtlasRectOverlap` 算重叠面积，取最小者；候选序号只作 0.02 的偏好项，
  所以只要存在完全不重叠的候选就一定胜出
- 全部放完后再做最多 3 轮**修复**：把仍有重叠的标签摘出来重放（先放的标签可能占了后来者唯一的空位）
- 矩形带 2px 内边距参与判定，「刚好贴边」也算冲突——贴成一排虽然没压字，读起来仍是一团
- 文字加 3px 深色描边当底衬，压在连线/节点边缘上也读得清；HUD 加了自带底片

**验证**：新增 `npm run verify:atlas`，真跑产物、5 组缩放/平移（1.0 / 0.75 / 1.6 / 0.45 / 平移），
断言标签之间、标签与 HUD、标签与节点圆的重叠面积恒为 0。红绿对照：把候选位退化回「只有正上方」
→ 23/32 FAILED；修复后 32/32 ALL PASS。

### 8.2 新增 5 件传奇的传奇数值改不动

**现象**：猎首 / 法师之血 / 时空之肌 / 冈姆的壮志 / 献祭之心，tooltip 里的
「将所受伤害的 20% 吸纳为生命」「技能的冷却时间 -1 秒」这类行没有任何输入框。

**根因**：这 5 件是扩展包加的，它们的「传奇专属数值」不走 `item.mods`，而是走
`item.ur` —— 一个与 `def.sr` 等长的数组，`def.srt` 里的 `{0}` 就是它：

```js
var _v3061 = Kt;                      // makeUnique
Kt = function (def, ilvl) { var it = _v3061.apply(this, arguments);
  if (it && def && def.sr) it.ur = _v3041(def);   // 按 def.sr 逐个 de(min,max)
  return it; };
```

修改器只编辑 `mods`，所以这块数据完全够不着。

**改法**：装备详情页新增「传奇数值」区。判据用 `rarity===3 && item.uniq && def.sr`
（官方传奇没有 `sr`，不会被误开）。写入时**只改单格、保持数组长度**——扩展块在
`ur.length !== sr.length` 时会按 uid 重随，长度写坏会让整件装备的数值被重置。
缺 `ur` 时优先调 `window.__TEMPORALIS_ROLL(item)` 借扩展块自己的惰性补齐，保证与掉落同算法。

### 8.3 提示气泡看不见内容

**现象**：「已清除全部腐化」这类提示，气泡出来了，字跟底色几乎一样。

**根因**：气泡 `append` 到 `document.body`，而它用的 `--ink` / `--divide` 定义在 `#er-gui{}`：

```css
.er-toast{ background:rgba(245,245,247,.9); color:var(--ink); }  /* 变量在面板外取不到 */
```

`var(--ink)` 取不到变量时，整条 `color` 声明在计算值阶段失效 → 颜色回退为继承值
（游戏页面的浅色）→ 浅色字压浅色底。**教训：挂到 body 上的浮层不能引用面板作用域的变量。**

**改法**：配色写死（深底 `rgba(29,29,31,.95)` + 浅字 `#f5f5f7` + 22% 白描边），
`color` / `background` 加 `!important` 压过游戏样式表；顺带补 `pointer-events:none`
（原先透明状态下仍会挡住右下角的点击）和 `role="status"`。

### 8.4 新功能：任意装备改插槽数量

官方编辑面板的插槽下拉是 `[0,1,2].filter(w => w <= Math.max(1, Ol(slot)))`，
写入口径是 `o.rsock = +v, o.runes = (o.runes||[]).slice(0, o.rsock)`。

修改器照同一口径实现，只把上限放到 0–6：写 `item.rsock`，`runes` 同步裁剪，不补假数据
（tooltip 对空位本来就会画「◇ 空符文插槽」）。`rsock>=2` 时官方会额外画符文组（`Sw`），
`Sw` 已按 `rsock` 循环，3 槽以上不会崩——`y1()` 只取前 2(+1) 枚算真言。

### 8.5 门禁与实测

```
npm run verify
  RESULT: ALL OK                          语法门
  目标符号缺失 0
  RESULT: ALL PASS                        399 条玩法断言
  window.onerror: none                    riftErrors: 0
  珠宝渲染 28/28 ALL PASS
  天赋树标签排版 32/32 ALL PASS            ← 新增
  ✅ 与官方基底逐字节一致（3814894 字符）
  ✅ 官方数据零丢失、零内容改写

npm run wiki                      RESULT: ALL PASS
npm run cheat:test                review ERROR 0 · WARN 0
                                  smoke 161/0 · ui 69/0     ← ui 由 47 增至 69
```

`cheat:ui` 新增 22 条断言：气泡样式不再引用面板变量、深底浅字、有文字、不拦鼠标；
传奇数值两条 `sr` 各有输入框、改写单格、长度不变、越界提示、非法输入被拒；
插槽 0→4→2→0、减少时裁剪 `runes`、超上限被拒。

三道新门（`verify:atlas` / `cheat:test`）已进 `.github/workflows/delivery-gate.yml`。
