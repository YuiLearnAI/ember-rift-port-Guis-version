# 迁移验收工具（语法门 + 引导门）

本目录新增两个验收工具，用于「余烬裂隙」单文件 HTML 迁移过程：**每个中间产物 HTML 都必须先过这两道门**，再进入玩法级断言。

| 工具 | 作用 | 通过标准 |
|---|---|---|
| `syntax.mjs` | 提取所有 inline `<script>` 逐个编译（不执行） | `ALL OK`，退出码 0 |
| `harness_new.cjs` | jsdom 内真实加载页 + 真实 DOM 事件跑完引导流程 | `RESULT: ALL PASS`，退出码 0 |

两个工具都只读输入 HTML，**不修改任何游戏文件**，也不写入工程目录。

---

## 0. 运行环境（ASCII 路径，务必照抄）

MSYS bash 会把中文路径参数转成 GBK 传给 node.exe，导致 `ENOENT`。所以工程已准备 ASCII 副本，**一律用它们**：

```
D:\xyx\.dsh-work\port\base\new.html   新基础 v0.4/18.0.1
D:\xyx\.dsh-work\port\base\cur.html   v1.04 现版
D:\xyx\.dsh-work\port\base\old.html   v1.04 父本
```

node（v24.21.0）与 jsdom 位置：

```bash
NODE="C:/Users/33266/.dsh/dsh-runtimes/dsh-primary-runtime/dependencies/node/bin/node.exe"
# jsdom 复用旧环境: C:/Users/33266/AppData/Local/Temp/dsh-e951uk/er-dom/node_modules/jsdom (30.1.3)
# harness 内已硬编码该路径；找不到时才回退 <tools>/node_modules/jsdom -> require("jsdom")
```

后续构建产物 `D:\xyx\.dsh-work\port\build\*.html` 也是 ASCII，可直接喂给两个工具。

---

## 1. `syntax.mjs` — 语法门

### 用法

```bash
node tools/syntax.mjs <html路径>
```

无参数 = 用法错误，退出码 2；文件读不到 = 退出码 2。

### 行为

- 按文档顺序扫描所有 **inline `<script>`**，自动跳过带 `src=` 的外链脚本（正则：`<script(?![^>]*\bsrc\s*=)[^>]*>([\s\S]*?)<\/script\s*>`，与浏览器解析一致）。
- 每块用 `node:vm` 的 `new vm.Script(code, { filename, lineOffset })` **只编译不执行**；`lineOffset` 让报错行号直接等于 HTML 行号。
- 兼容任意块数：**1 块**（OLD / NEW）与 **2 块**（CUR：17 字符热修占位 + 主 IIFE）都已实测；空块记为 OK。
- 每块打印：字符数、自身行数、起始 HTML 行、`type=`（若有）。
- 失败打印：`SyntaxError` 消息、出错 HTML 行号、错误位置所在源码行 + 前 3 行堆栈。
- 退出码：全部通过 `0`；任一失败 `1`；无 inline script `1`。

### 实测

```bash
$ node tools/syntax.mjs base/new.html
script #1: OK (1981318 chars, 57138 lines, HTML line 9935)
ALL OK (1 inline script block, 1981318 chars checked)          # 退出码 0

$ node tools/syntax.mjs base/cur.html
script #1: OK (17 chars, 1 lines, HTML line 5374)
script #2: OK (2985382 chars, 48228 lines, HTML line 5376)
ALL OK (2 inline script blocks, 2985399 chars checked)         # 退出码 0

$ node tools/syntax.mjs base/old.html
script #1: OK (2833034 chars, 43899 lines, HTML line 5025)
ALL OK (1 inline script block, 2833034 chars checked)          # 退出码 0
```

负向自测（把 NEW 主脚本截断到 12 万字符的临时副本）：

```bash
$ node tools/syntax.mjs bad-syntax.html
script #1: SYNTAX ERROR (block starts at HTML line 9935)
  SyntaxError: Invalid or unexpected token
  at HTML line 12436
  stack:
  bad-syntax.html:12436
            'Opened on the offici
            ^^^^^^^^^^^^^^^^^^^^^
FAILED (1/1 inline script blocks, 120000 chars checked)        # 退出码 1
```

---

## 2. `harness_new.cjs` — 引导门（能启动）

### 用法

```bash
node tools/harness_new.cjs <html路径> [--frames N] [--fatal-only]
```

| 参数 | 默认 | 说明 |
|---|---|---|
| `<html路径>` | 必填 | 待测单文件 HTML |
| `--frames N` / `--frames=N` | `120` | 藏身处、地图各驱动多少帧（验收要求 N=120） |
| `--fatal-only` | 关 | 只按「未捕获异常 / window.onerror / console.error / unhandledrejection」判定，逐项断言省略；用于快速回归 |

退出码：`0` = `RESULT: ALL PASS`（允许仅有 WARN / SKIP）；`1` = 有 FAIL；`2` = 用法/读文件/jsdom 加载失败。

### 环境桩（全部内置，无需装包）

jsdom `runScripts:"outside-only"` + 手动 `window.eval` 每个 inline 块（**按文档顺序**，异常不阻断后续块，与浏览器一致）：

- **canvas**：`getContext` 返回 Proxy 2D/WebGL 通用桩，任何未知方法返回 noop、属性可写；`measureText`/`getImageData`/`createImageData`/渐变/`getLineDash`/`getTransform` 有确定返回值；`toDataURL` 返回 1×1 PNG；`getBoundingClientRect` 返回 1280×720；`OffscreenCanvas` 同样处理。
- **audio**：`AudioContext`/`webkitAudioContext` 假实现（gain/osc/buffer/filter/compressor/analyser/panner/delay/merger/waveshaper/decodeAudioData）、`HTMLMediaElement.prototype.play` 返回 resolved Promise；`window.Audio` 假类。
- **rAF**：只入队不自动跑，由 harness 手动逐帧驱动（帧号可归因，单帧异常记 `frame#N`）；`cancelAnimationFrame`、`requestIdleCallback` 桩。
- **storage**：`file://` 在 jsdom 里是 opaque origin，`localStorage`/`sessionStorage` 已替换为内存实现。
- 其它：`matchMedia`、`ResizeObserver`、`IntersectionObserver`、`fetch`、`URL.createObjectURL`、`crypto`（不覆盖 jsdom 自带的 getter）、`scrollTo`、`Element.animate/scrollIntoView`、`Path2D`、`ImageData`、`document.fonts`、`alert/confirm/prompt`、`navigator.language=zh-CN`、`PointerEvent`/`TouchEvent` 回退。
- 错误监听：`window.addEventListener("error")`、`unhandledrejection`；`console.error` 被 wrap 记录（不打印，避免污染；`HARNESS_VERBOSE=1` 时透传）。

### 引导流程（**只用 DOM 选择器 + DOM 事件，不引用任何游戏内部变量**）

NEW 是同一源码谱系的重新压缩构建，内部变量/函数名整套不同，因此 harness 不注入、不读任何内部符号。流程全部由页面自己渲染出的 DOM 驱动：

1. **标题界面**：`#overlay` 非空且含 `#bDbg`/`#bNew`（空 → 判白屏 FAIL，附 `bodyLen`）。
2. **标题 → 选职业**：`click(#bDbg)`（调试入口，测试用满配角色；`#bNew` 同样走此界面），等待后断言 `#overlay .clscard[data-cls]` 数量 ≥ 1，优先选 `data-cls="ranger"`。
3. **选职业 → 藏身处**：`click(.clscard)`，断言 `#zname` 有文本、`#hud` 存在、`#overlay` 清空。
4. **藏身处跑 120 帧**：逐帧驱动，任何帧抛异常 → FAIL（打印帧号 + 堆栈）；同时检查 HUD 血量文本 `#tlife`（最多等 1.5s；`#hud/#olife` 在但文本仍为空时降级为 WARN，不阻断启动判定）。
5. **藏身处 → 地图**（尽力而为，失败记 SKIP 不记 FAIL）：
   - `click(#menu [data-tab="map"])` → 断言 `#panel` 显示；
   - 地图袋为空则先点 `#pbody [data-act="free"]`（领免费 T1 地图）；
   - 点 `#pbody [data-act="mapin"]` 把地图放进装置（最多 3 次，兼容「先选中再放入」），直到 `[data-act="open"]` 不再 disabled；
   - 点 `[data-act="open"]`，边等真实定时器边驱动帧（最多 3s），成功判据：`#zname` 不再是「藏身处」且 `#btnPortal` 可见；
   - 成功后在地图里再跑 120 帧。
6. **全局断言**：inline 脚本 eval 无异常、无 `window.onerror`、无帧异常；`unhandledrejection`/`console.error` 记为 WARN（**`--fatal-only` 下记为致命**）。
7. **SNAPSHOT**：单行 JSON，方便 diff 两次构建。
8. **RESULT**：`RESULT: ALL PASS` 或 `RESULT: FAIL` + `FAILED ITEMS` 明细（失败断言名 + 详情）。

> 关键实现说明：进图/切场景的过渡由页面里的 `setTimeout` 驱动，纯同步逐帧驱动等不到；所以每次操作后用 `drain(ms)` **同时**真实 `sleep` 与小步驱动帧，让定时器和 rAF 都前进。这也是为什么单次运行约 4–5s。

### 实测（2026-10-26，node v24.21.0 / jsdom 30.1.3）

```bash
$ node tools/harness_new.cjs base/new.html
=== harness_new.cjs  base/new.html
env: node v24.21.0  jsdom 30.1.3  (C:/Users/33266/AppData/Local/Temp/dsh-e951uk/er-dom/node_modules/jsdom)
load: 1 inline block(s) [1981318 chars]  #0: OK

CHECK title screen renders               PASS   #overlay 1852 chars, buttons=#bDbg,#bNew,#bImp
CHECK title -> class select              PASS   9 class cards, pick=ranger
CHECK class select -> hideout            PASS   zone="藏身处" overlay cleared
CHECK hideout frames x120                PASS   no exception in 120 frames
CHECK hideout HUD alive                  PASS   hp=79 buffs=0
CHECK hideout -> map tab                 PASS   #panel visible, pbody=4018 chars
CHECK hideout -> map                     PASS   zone="T2 腐烂沼泽" portal visible, panelHidden=true
CHECK map frames x120                    PASS   no exception in 120 frames, zone="T2 腐烂沼泽"
CHECK inline scripts evaluate            PASS   1 block(s) evaluated
CHECK no window.onerror                  PASS   0 uncaught errors
CHECK no frame exceptions                PASS   286 frames driven

SNAPSHOT {"screen":"map","overlayBox":"","zone":"T2 腐烂沼泽","zoneInfo":"区域等级 6 · 物品数量 +0% · 物品稀有度 +0%","zoneMods":"冰晶柱 · 冰封宝藏 · 霜冠女王","panelVisible":false,"panelTab":"地图装置 M","hp":"79","mana":"65","buffs":0,"bossVisible":false,"bossName":"","portalVisible":true,"toasts":1,"framesDriven":286,"uncaught":0,"consoleErrors":0}

RESULT: ALL PASS  checks=11 pass=11 fail=0 warn=0 skip=0 fatal=0 frames=279  [4.66s]   # 退出码 0
```

```bash
$ node tools/harness_new.cjs base/cur.html
=== harness_new.cjs  base/cur.html
load: 2 inline block(s) [17 chars, 2985382 chars]  #0: SKIP known-hotfix  #1: OK
load: WARN 已知热修占位块 `EmberMods._boot()` 在浏览器里同样会先于主脚本抛 ReferenceError（CUR 历史问题，非本次迁移引入），已按已知问题跳过。

CHECK title screen renders               PASS   #overlay 1813 chars, buttons=#bDbg,#bNew,#bImp
CHECK title -> class select              PASS   8 class cards, pick=ranger
CHECK class select -> hideout            PASS   zone="藏身处" overlay cleared
CHECK hideout frames x120                PASS   no exception in 120 frames
CHECK hideout HUD alive                  PASS   hp=79 buffs=0
CHECK hideout -> map tab                 PASS   #panel visible, pbody=7682 chars
CHECK hideout -> map                     PASS   zone="T2 余烬熔炉" portal visible, panelHidden=true
CHECK map frames x120                    PASS   no exception in 120 frames, zone="T2 余烬熔炉"
CHECK inline scripts evaluate            WARN   2 block(s) evaluated, 1 known-hotfix block tolerated
CHECK no window.onerror                  PASS   0 uncaught errors
CHECK no frame exceptions                PASS   286 frames driven

SNAPSHOT {"screen":"map","overlayBox":"","zone":"T2 余烬熔炉", ... ,"hp":"79","mana":"65",...,"framesDriven":286,"uncaught":0,"consoleErrors":0}

RESULT: ALL PASS  checks=11 pass=10 fail=0 warn=1 skip=0 fatal=0 frames=280  [4.39s]   # 退出码 0
```

**CUR 的 2 个 inline 块的解释**（这是 CUR 既有问题，不是本次迁移引入，也不影响 NEW）：
CUR 第 0 块是 17 字符热修占位 `EmberMods._boot()`，位于主 IIFE **之前**，在真实浏览器里同样会先抛 `ReferenceError: EmberMods is not defined`（`EmberMods` 由主脚本/外部 modloader 定义）。harness 对该块的规则很窄：**块内容精确匹配 `^EmberMods\._boot\(\)\s*;?$` 且抛 `EmberMods is not defined`** 才记为已知热修 SKIP（WARN），其它任何 eval 异常一律 FAIL。主 IIFE（第 1 块）照常评估。

### `--fatal-only` 快速回归

```bash
$ node tools/harness_new.cjs base/new.html --fatal-only
[fatal-only] 逐项断言输出已省略；仅统计致命项。flow={"title":true,"classSelect":true,"hideout":true,"mapTab":true,"mapEntered":true}
SNAPSHOT {...}
RESULT: ALL PASS  (fatal-only: 0 fatal)  [4.76s]        # 退出码 0

$ node tools/harness_new.cjs throw.html --fatal-only     # 注入 throw 的临时副本
FATAL DETAIL (1):
  [1] eval block #1: Error: boom from injected script |     at eval ...
RESULT: FAIL  (fatal-only: 1 fatal)                     # 退出码 1
```

### 负向自测（证明「能区分正常启动 / 白屏 / 抛异常」）

| 临时副本 | 制造的问题 | 结果 |
|---|---|---|
| `bad-syntax.html` | 主脚本截断到 12 万字符 | `syntax.mjs` → `SYNTAX ERROR`，`at HTML line 12436`，退出码 1 |
| `blank.html` | 主脚本替换为空注释（页面能加载但无 UI） | `harness` → `CHECK title screen renders FAIL  overlay is empty after load (white screen?) bodyLen=3765`，`RESULT: FAIL`，退出码 1 |
| `throw.html` | 主脚本后追加 `throw new Error("boom…")` | `harness` → `CHECK inline scripts evaluate FAIL` + `FATAL DETAIL` 带完整堆栈，`RESULT: FAIL`，退出码 1 |

失败输出都会标明：**失败的断言名**（CHECK 行）、**错误堆栈**（FATAL DETAIL / FAILED ITEMS）、以及能定位的行号/帧号/选择器上下文。

### 已测中间产物（`port/build/`，2026-10-26 21:0x 快照）

| 文件 | syntax | harness | 说明 |
|---|---|---|---|
| `base/new.html` | ALL OK | **ALL PASS**（11/11，279 帧，4.7s） | 迁移底座，达标基线 |
| `base/new.html`（重复跑） | ALL OK | **ALL PASS**（11/11，278 帧，4.7s） | 连跑两次结果一致，引导流程稳定 |
| `base/cur.html` | ALL OK | **ALL PASS**（10 PASS + 1 WARN，280 帧，4.4s） | 回归对照；WARN = CUR 17 字符热修块（已知） |
| `build/selftest.html` | ALL OK | **ALL PASS**（11/11，279 帧，4.6s） | NEW + 56 字符自检标记的中间产物 |
| `build/cand1.html` | ALL OK | ALL PASS（8 PASS + 1 SKIP，182 帧，5.4s） | 合并候选：**能启动、无异常**，但点 `地图` 菜单后 `#panel` 一直 hidden → 进图步骤 SKIP。疑似该候选的 UI 回归或尚未接线，建议构建负责人复查（harness 按约定记 SKIP，不误判 FAIL） |

> `build/*.html` 会随迁移推进变化，上表只是工具可用性的现场记录；验收时以当次运行输出为准。

---

## 3. 已知局限

1. **怪物数量等内部状态不可见**：harness 刻意不碰游戏内部变量（NEW 符号名未知），SNAPSHOT 只能用 DOM 可观测量：`screen`、`overlayBox`、`zone/zoneInfo/zoneMods`、`hp/mana`（HUD 文本）、`buffs`、`boss*`、`portalVisible`、`toasts`、`framesDriven`、`uncaught`、`consoleErrors`。怪物数、精确玩家属性、物品栏内容需要内部符号或额外玩法级断言工具（旧 harness 的 `__erTest` 注入路线只适用于 CUR/OLD，不能用于 NEW）。
2. **`console.error` 默认只是 WARN**：按任务验收口径「无未捕获异常、无 window.onerror」定为 FAIL 条件；`console.error`/`unhandledrejection` 正常模式记 WARN（防止 jsdom 环境噪声误杀），需要严格时用 `--fatal-only`（它们在该模式下计入致命）。
3. **过渡依赖真实定时器**：UI 操作后必须真实等待（`drain`），因此单次运行 ~4–5s，不能只同步跑帧。CI 里请预留 ≥30s。
4. **SNAPSHOT 有随机性**：地图名/地图词缀/掉落由 RNG 决定，两次构建 diff SNAPSHOT 时 zone 字段可能不同；建议 diff 时忽略 `zone`/`zoneMods`/`toasts`，或对比 `screen/hp/mana/panelVisible/portalVisible/uncaught` 等稳定字段。
5. **jsdom 不是浏览器**：canvas 是桩、音频是桩、无真实渲染/布局/字体，因此「能启动」≠「画面正确」。玩法级/视觉级仍需旧环境或真机验证。
6. **依赖旧环境 jsdom 路径**：默认复用 `C:/Users/33266/AppData/Local/Temp/dsh-e951uk/er-dom/node_modules/jsdom`（jsdom 30.1.3）。该临时目录若被清理，需在该目录 `pnpm add jsdom`，或把 node_modules 放到 `tools/` 下（harness 会自动回退）。
7. **只验 inline 脚本**：`src=` 外链脚本既不检查语法也不加载（本工程 3 个 HTML 都没有外链脚本，符合预期）。
8. **地图步骤是尽力而为**：`hideout -> map` 失败记 SKIP（不 FAIL），并打印 `zone/portal` 现场值；验收标准要求它能 PASS，当前 NEW/CUR 都是 PASS。
9. **标题入口用调试角色**：`#bDbg` 是页面自带的调试入口（DOM 上可见的按钮），选择它能在不依赖内部符号的前提下稳定拿到满配角色、地图袋里有图，从而让「进图」步骤可复现。它不改变被测 HTML。

---

## 4. 推荐验收命令（每个迁移产物都要跑）

```bash
NODE="C:/Users/33266/.dsh/dsh-runtimes/dsh-primary-runtime/dependencies/node/bin/node.exe"
cd /d/xyx/.dsh-work/port

# 1) 语法门
"$NODE" tools/syntax.mjs base/new.html        # 期望 ALL OK，退出码 0
"$NODE" tools/syntax.mjs build/cand1.html       # 构建产物（含中文文件名时先 cp 成 ASCII 再传）
# 2) 引导门
"$NODE" tools/harness_new.cjs base/new.html   # 期望 RESULT: ALL PASS，退出码 0
"$NODE" tools/harness_new.cjs base/cur.html   # 回归对照，期望同上（allow 1 WARN hotfix）

# 快速回归（只抓致命项）
"$NODE" tools/harness_new.cjs build/cand1.html --fatal-only
```

判定规则：**syntax 必须退出码 0 且 `ALL OK`；harness 必须退出码 0 且 `RESULT: ALL PASS`（FAIL 数 = 0、fatal 数 = 0）**。WARN/SKIP 允许存在但必须能解释（当前只有 CUR 17 字符热修块的 WARN 是已知可解释项）。
