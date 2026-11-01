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
| `cheat/cheat/ember-rift-gui.user.js` | 修改器 v1.1 |

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
