# 移植块符号补丁报告（v1.04 移植块 → 新基础）

## 1. 结论

- `out/symbol_patch.json`：**resolved 49 条（全部 high）**，`missing_in_new` **0 条**。
- 用合并映射重新翻译 `out/gen_block.js`：**unmapped 只剩 24 个，且全部是 JS/浏览器内建**，无一个 OLD 游戏符号。
- `tools/assemble.mjs` + `tools/boot.cjs`：**RESULT: ALL PASS**（exit 0；无 `is not a function` / `is not defined`，无 console.error / window.onerror）。

## 2. 输入快照

工作区有其它进程在并发重新生成 `out/gen_block.js` / `out/block_new_report.json`，因此下列验收锁定在这一快照：

| 文件 | 大小 | md5 |
|---|---:|---|
| `out/gen_block.js` | 364530 | `c7c1ba497792a265e6cc8a344e54fe1a` |
| `out/block_new2.js` | 293578 | `4c5187943ef4eff78cbca2a014c2bc4b` |
| `build/cand2.html` | 4843202 | `51e76693d9780086660b8d60f36f0589` |
| `out/symbol_map_round2.json` | 331344 | `c7e16fe5c4d6667d82e0b918cccdaddc` |
| `out/symbol_patch.json` | 20635 | `cfeeee75c8ec14bc560271e8602f05bb` |

- `out/gen_block.js`：**364530 bytes / 8615 行 / mtime 2026-10-26 21:06:25**。
- 任务说明里的快照：`unmapped` 82 个（开工时 71 个），本 patch 覆盖其中全部非内建名；另额外覆盖更早快照出现过的 `Gi`、`sy`，共 49 条。

## 3. 方法（按可靠性从高到低，四步都做）

1. **用法取证**：用 acorn 复刻 `rewrite.mjs` 的作用域规则，导出 `gen_block.js` 每个自由标识符的出现位置（所在函数、父节点类型、三行上下文）。
2. **OLD 声明取证**：`out/decls_old.json` 取该名字的顶层 `var/function` 源码与行号，确定它是函数/对象/数字/字符串/数组。
3. **OLD→NEW 定位**：用 `old.js`/`new.js` 的 6 行块级锚点（1,228 块）把 OLD 行区间预测到 NEW 行区间；对区间内的 NEW 顶层声明做 3-gram 规范化相似度（标识符→`V`、属性名→`P`、字符串/数字/关键字原样保留），取最高分。
4. **语义交叉验证**：核对调用点、事件绑定（`#bClose` / `#shopClose` / `#btnPortal` / `#overlay contextmenu` 等）、相邻常量组、NEW 里成对出现的同类函数；最后确认目标名是 NEW 的 IIFE 顶层声明，且与移植块自身 121 个顶层声明不冲突。

> **没有采用「同名即同一物」**：NEW 里同样存在 `No`/`vr`/`cd`/`oo`/`As`/`Wi`/`Gi`/`rs`/`ra` 等名字，但都已用语义排除（例如 NEW `ra` 是背包容量、OLD `ra` 是画布宽 480；NEW `oo` 另有其物，OLD `oo` 对应 `ur`）。

## 4. 映射结果（49 条，全部 high）

| # | OLD | NEW | 证据要点 |
|---:|---|---|---|
| 1 | `A2` | `Af` | 一行同构 `da.some(...)||ds().includes(e)` → `ks.some(...)||ma().includes(e)`，锚点精确落 NEW:26623 |
| 2 | `Ad` | `C1` | 同构（新基础多 eye 分支）；渲染调用点 OLD `?Ad(f,b,x)` ↔ NEW:48614 `?C1(f,b,y)` |
| 3 | `Dc` | `ou` | 同构关闭地图；`#btnPortal.onclick=Dc` ↔ NEW:44428 `=ou` |
| 4 | `Dh` | `h2` | `#overlay` contextmenu 仓库入口；NEW:44533 直接调 `h2(o)`，API `stashContext:()=>h2`（修正 medium 候选 Or） |
| 5 | `E2` | `ap` | 同体；`#bClose.onclick=E2` ↔ NEW:26946/28523 `=ap` |
| 6 | `Gh` | `ji` | 同构 `re[e].mech?{chaos:2}:{chaos:1}` ↔ `Y[e]...`（ji） |
| 7 | `Gi` | `k0` | 同体开商人；分发点 OLD `kind==="vendor"→Gi()` ↔ NEW:41241 `→k0()` |
| 8 | `Hr` | `Zc` | `Object.keys(Re)` ↔ NEW:11554 `Object.keys(Se)`（Re→Se 已 high） |
| 9 | `Ih` | `T0` | pointer 坐标：`Ge/Ae` ↔ `st/Fe`，NEW:43402 T0 |
| 10 | `Ii` | `Vn` | `Math.max(1,Math.min(14,(u.bestTier||1)-3))` ↔ NEW:44761 Vn |
| 11 | `J2` | `Eg` | 触屏 UI 入口：`matchMedia("(pointer: coarse)")&&J2()` ↔ `Cg()&&Eg()`（NEW:44664），API `enableMobile` |
| 12 | `Jn` | `Gr` | 同体；`o.menu?Jn():ss()` ↔ NEW:44430 `n.menu?Gr():us()`；Esc 分支亦为 Gr |
| 13 | `Ky` | `s6` | 存档版本迁移表：`hf/Ky` ↔ `Pu/s6`，前后十余行逐字一致（NEW:54817） |
| 14 | `Mc` | `Xp` | `#treecv` 尺寸逻辑 ↦ Xp(NEW:39389)；调用点 `(Mc(!0),Ka())` ↔ `(Xp(!0),Za())` |
| 15 | `My` | `j3` | 投射物绘制；渲染循环 OLD.js:35605 `&&My(b)` ↔ NEW:48658 `&&j3(b)` |
| 16 | `Nh` | `Of` | `Math.max(1,Math.min(16,u.bestTier||0))` ↔ NEW:44731 Of |
| 17 | `Od` | `G1` | `Od=(e)=>Pl(e)` ↔ `G1=(e)=>Dd(e)`；mm 内 `Od(_t("back"))` ↔ `G1(Ga("back"))` |
| 18 | `Qi` | `D0` | 常量组第 2 项：Qi=4 ↔ D0=4（NEW:48352） |
| 19 | `Qs` | `nr` | 常量组第 1 项：Qs=1 ↔ nr=1（NEW:48351） |
| 20 | `Ty` | `I3` | `new Set(["pop","cflash","zip"])` ↔ NEW:49989 I3 |
| 21 | `Uf` | `ih` | 音效节流 `s-Uf<0.03` ↔ `s-ih<0.03`（NEW:7258 ih，Zf→lh 已 high） |
| 22 | `Wi` | `x0` | 同体开仓库；`kind==="stash"→Wi()` ↔ NEW:41242 `→x0()` |
| 23 | `_l` | `Cp` | 调试角色重置同构（同中文提示 `调试角色已重置`）↔ NEW:30499 Cp |
| 24 | `_o` | `yi` | `_o=()=>de.k>0` ↔ NEW:22809 `yi=()=>Te.k>0` |
| 25 | `cd` | `Xm` | 画质 setter `Je.q/localStorage` ↔ NEW:21329 Xm；`#btnGfx` 回调同处 |
| 26 | `ey` | `Y4` | `for(...) u.cur[t]-=a` ↔ NEW:44735 Y4 的 `h.cur[t]-=a` |
| 27 | `gl` | `sd` | map 词缀表 gl=[] 与 push 注册 ↔ NEW:11154 sd=[]；xc 的 map 分支亦 gl→sd |
| 28 | `gn` | `co` | 低阶地图过滤 `tier<=Ii(),rarity<2` ↔ NEW:44762 co（Vn） |
| 29 | `ia` | `bs` | 常量组第 4 项：ia=270 ↔ bs=270（NEW:48354） |
| 30 | `io` | `As` | `io=(e)=>g0(e)` ↔ `As=(e)=>Ph(e)`（NEW:53855，g0→Ph 已 high） |
| 31 | `ir` | `uc` | 稀有度权重表 `Pe([0,1,2],s=>[52,34,14][s])` ↔ NEW:37867 uc |
| 32 | `kr` | `$c` | 常量组第 6 项：kr=540 ↔ $c=540（NEW:48356） |
| 33 | `mo` | `tn` | 宝石价值包装 `mo=(e)=>x0(e)` ↔ `tn=(e)=>Bh(e)`（Bh=宝石价值、Oh=地图价值，成对出现） |
| 34 | `oo` | `ur` | 通货图标缓存：`(oo[e]=t),(It[e]=t.toDataURL())` ↔ NEW:7551 `(ur[e]=t),(He[e]=...)`；渲染 `oo[E.cur]` ↔ `ur[C.cur]` |
| 35 | `pi` | `Ir` | `ae[e].tags.includes("spell")&&T0.has(t.bh)` ↔ NEW:33416 Ir |
| 36 | `ql` | `qd` | `ii&&(hk(e,ii),ii=null)` ↔ NEW:24735 `xf&&(gS(e,xf),xf=null)` |
| 37 | `ra` | `gs` | 常量组第 3 项：ra=480 ↔ gs=480（NEW:48353） |
| 38 | `rs` | `rn` | 相机抖动 `rs.x*ne.shake` ↔ NEW:48422 `rn.x*le.shake`；累加处亦同 |
| 39 | `tr` | `cc` | `e==="pin"?"#c080ff":Na.find(...).col` ↔ NEW:40019 cc |
| 40 | `ul` | `ed` | 音效去重 `ul[e]&&a-ul[e]<0.035` ↔ NEW:7248 `ed[e]&&a-ed[e]<0.035` |
| 41 | `us` | `bo` | 常量组第 7 项：Noto Serif SC 字体串 ↔ bo（NEW:48358） |
| 42 | `vc` | `Qd` | `Bo(Yy(e)+":"+ops)`+`Af` ↔ NEW:53936 Qd 的 `cr(i6(e)...)`+`Wu` |
| 43 | `vn` | `tl` | 常量组第 5 项：vn=960 ↔ tl=960（NEW:48355） |
| 44 | `vr` | `ai` | 常量组第 8 项：Silkscreen 字体串 ↔ ai（NEW:48359） |
| 45 | `xc` | `Vd` | `map?gl:soul?bl:zn` ↔ NEW:53624 `map?sd:soul?od:pl` |
| 46 | `yl` | `nd` | 升华节点表：写 `(yl[t.k]=t)` ↔ `(nd[t.k]=t)`；读 `yl[i.dataset.k]` ↔ `nd[t.dataset.k]` |
| 47 | `yr` | `zs` | `Object.entries(e).every(([t,a])=>(u.cur[t]||0)>=a)` ↔ NEW:44734 zs |
| 48 | `zl` | `jd` | 随从渲染 `lighter + dragon?Mg:vg + ak + restore` ↔ NEW:23687 jd（+eye 分支） |
| 49 | `sy` | `yp` | 同体；`#shopClose.onclick=sy` ↔ NEW:28845/44941 `=yp` |

完整逐条 evidence 见 `out/symbol_patch.json` 的 `resolved.<name>.evidence`。

### 4.1 一次锁定 8 个常量的证据组

`OLD.js:35304-35312` 与 `NEW.js:48350-48359` 顺序、数值、字体串完全对应：

| OLD | NEW | 值 |
|---|---|---|
| `Qs` | `nr` | 1 |
| `Qi` | `D0` | 4 |
| `ra` | `gs` | 480 |
| `ia` | `bs` | 270 |
| `vn` | `tl` | 960 |
| `kr` | `$c` | 540 |
| `us` | `bo` | `"Noto Serif SC","Songti SC",serif` |
| `vr` | `ai` | "Silkscreen,ui-monospace,monospace" |

### 4.2 上一轮 medium 的两处修正

- **`Dh` → `h2`（原候选 `Or`）**：OLD `Dh(event)` 是 `#overlay` contextmenu 的仓库点击入口；NEW:45661 `h2(e)` 是同一入口（同一段 `closest("[data-wd]"/"[data-dp]"/"[data-dg]")` 分发），NEW:44533 的 contextmenu 监听直接调用 `h2(o)`，插件 API 也导出 `stashContext: () => h2`。而 `Or` 是拆分出的 `(kind,index)` 辅助函数（NEW:45672），不是事件处理器。
- **`oo` → `ur`（原候选即 `ur`，但需排除 `Ya`）**：OLD Cx 里 `(oo[e]=t),(It[e]=t.toDataURL())` ↔ NEW:7551 `(ur[e]=t),(He[e]=t.toDataURL())`；渲染处 OLD `E.kind==="cur"?oo[E.cur]` ↔ NEW:48572 `C.kind==="cur"?ur[C.cur]`。item 图标缓存是另一对 `Kt→Ya`/`It→He`。

## 5. missing_in_new：空

本轮块**没有**引用任何 NEW 不存在的 OLD-only 外部符号。`playAssetSfx` / `__uploadedSfxData` / `__uploadedSfxAudio` / `__uploadedSfxLive` / `__uploadedSfxMap` / `__uploadedSfxTrim` / `__uploadedSfxVolume` / `__syncUploadedSfxVolume` / `makeEndlessMap` 都已在移植块**顶层自行定义**（见 gen_block 顶层声明），不依赖 NEW。
NEW 侧确实没有 uploaded-sfx / endless 实现（`grep -i 'uploaded\|data:audio' new.js` 无命中；`endless` 只有一条无关文件名 `"ember-rift-endless-floor-{0}.png"`），这正是这些 helper 被整体搬进块的原因。将来若块改为“引用而非自定义”，应把它们放进 `missing_in_new`。

## 6. 验收记录

### 6.1 合并映射并重新翻译

```bash
python scratch/sym_build.py    # 生成 out/symbol_patch.json + out/symbol_map_round2.json
NODE=/c/Users/33266/.dsh/dsh-runtimes/dsh-primary-runtime/dependencies/node/bin/node.exe
"$NODE" tools/rewrite.mjs --map out/symbol_map_round2.json --in out/gen_block.js --out out/block_new2.js --report out/block_new2_report.json --minimal
```

`out/symbol_map_round2.json` = `out/symbol_map.json`.globals（1,115）∪ `out/symbol_map_high.json`.globals（更新的 high 表，多出 `qh/Av/f/ih/Ay/ka` 六条最终块引用）∪ 本 patch 的 49 条（同名覆盖），high 原样保留，合计 **1,153 条**；1,153 条映射**无重复目标**。

翻译结果（`out/block_new2_report.json`）：

```
freeIdentifiers: 470   mapped: 446   unmapped: 24
unmapped = Array, Date, Infinity, Int16Array, Int32Array, Math, Number, Object, Set, String, Uint8Array, addEventListener, arguments, console, document, history, isFinite, matchMedia, removeEventListener, requestAnimationFrame, setInterval, setTimeout, undefined, window
```

24 个全部是 JS/浏览器内建（无游戏符号）。本 patch 的 49 条中，当前块实际引用并生效 **45 条**；未被引用（保留备用）的 4 条：`Hr`, `ir`, `kr`, `vn`。

### 6.2 组装 + 引导（完整原始输出）

命令：

```bash
"$NODE" tools/assemble.mjs base/new.html out/block_new2.js build/cand2.html
"$NODE" tools/boot.cjs build/cand2.html
```

`assemble` 输出：

```
base: base/new.html
block lines: 6669
inserted at html offset 4341920 (IIFE body end), out bytes 4843202
```

`boot` 输出（exit code 0）：

```
[暗金扩展] 已加载新暗金: headhunter, mageblood, temporalis, kaoms_heart, rathpith_globe
eval: OK
frames(30): OK
title DOM length: 2318572
character flow: OK
  PASS eval no fatal
  PASS frames no error
  PASS no window.onerror
  PASS no console.error
  PASS character created
  PASS canvas exists
  PASS currency bar rendered
RESULT: ALL PASS
```

## 7. 风险与注意事项

- **并发写入**：`out/gen_block.js` 在本轮期间被其它进程重新生成过多次（21:00 / 21:04 / 21:06）。本报告所有验证锁定在 md5 `c7c1ba497792a265e6cc8a344e54fe1a` 的版本；若块再变，请重跑 `rewrite → assemble → boot` 并把新出现的自由名补进 patch（当前流程已可重复执行）。
- **boot 深度**：`tools/boot.cjs` 覆盖 标题 → 选角（ranger）→ 藏身处 180 帧，并触发块初始化（`[暗金扩展] 已加载新暗金`）、canvas 与通货栏渲染；不进入地图，因此地图内路径（`My→j3` 投射物、`Hr→Zc` 兽魂、`xc→Vd` 图标表等）靠调用点/结构取证而非运行时覆盖。
- **保留但当前未引用**的 4 条（`Hr`, `ir`, `kr`, `vn`）出现在任务原始报告/更早快照中；留在 patch 无副作用。
- **不要手工改成同名猜测**：例如 `No→$n` 是逐字符同构（`$t.nodes.find(...kind==="start"...)` ↔ `at.nodes.find(...)`）确认的；`vr`/`cd`/`oo`/`As`/`Wi` 等 NEW 同名符号均已排除。

## 8. 复现

```bash
cd /d/xyx/.dsh-work/port
python scratch/sym_build.py
NODE=/c/Users/33266/.dsh/dsh-runtimes/dsh-primary-runtime/dependencies/node/bin/node.exe
"$NODE" tools/rewrite.mjs --map out/symbol_map_round2.json --in out/gen_block.js --out out/block_new2.js --report out/block_new2_report.json --minimal
"$NODE" tools/assemble.mjs base/new.html out/block_new2.js build/cand2.html
"$NODE" tools/boot.cjs build/cand2.html
```
