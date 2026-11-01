# 三方合并报告：v1.04 移植块 × 新基础 v0.4

> 由 `tools/threeway.mjs` 生成于 2026-10-26T13:12:34.115Z（耗时 288 ms）
> 输入：`out/decls_old.json` / `out/decls_cur.json` / `out/decls_new.json` / `out/symbol_map.json` / `out/decl_diff.json`
> 合并基准：base = OLD 基础原实现，ours = CUR（我们的改版），theirs = NEW 新基础（按 `symbol_map.globals[函数].new` 定位）

## 1. 结论

| 指标 | 数量 |
|---|---|
| changedFuncs 总数 | 54 |
| 参与合并 | 54 |
| **自动合并成功（无冲突，已写出）** | **41** |
| **有冲突（需人工判断，未写出）** | **11** |
| 无冲突但语法不通过 | 0 |
| 处理失败 | 0 |
| 跳过（无映射 / 缺声明） | 2 |
| 冲突块合计 | 16 |
| 采用的新基础改动块合计 | 69 |
| 重叠且内容相同、只采用一次 | 0 |
| 局部名撞车（结构体检拦下） | 0 |

合并成功的结果在 `out/merges/<函数名>.js`，形如 `X = function (...) { ... };`
（全局名仍是 OLD 名、局部名是 `$L*`，后续移植工具会统一改名）。冲突函数**不**写文件。

### 规范化与合并规则（简述）

1. **alpha 归一**：三方各自 acorn 解析 → 局部绑定（参数 / var,let,const / 内部函数名 / catch 参数 / 类名）
   按**声明出现顺序**改名为 `$L1,$L2,…`；自由引用 base/ours 保留 OLD 名，theirs 用 `symbol_map`
   反向表（NEW→OLD）翻回 OLD 名；顶层函数名统一成 OLD 名。astring 生成代码后逐行比较。

   **再做一次跨版本对齐**（重要）：单纯「按声明顺序编号」会把我们新增的局部变量变成插入点，
   后面所有编号整体后移，diff 于是变成一大块假改动，让新基础在同一函数里**互不相干**的改动
   也被误判成冲突。实测：不对齐时 17 个函数冲突 / 62 个冲突块（`hn` `Zo` `Ko` `X2` `$y` 全是假冲突，
   `qv` 一个函数就 35 个块）；对齐后 12 个函数 / 17 个块，且剩下的都是真冲突。
   对齐做法：把局部名掩成 `$L` 后仍逐行相同的位置当锚点，统计「我们的第 k 个名字 ↔ base 的哪个名字」
   的票数，贪心做一对一分配；没票的（双方新增的）分配 base 最大值之后的新号。分配是双射，
   所以结果只是等价的 alpha 重命名——对齐不完美也只会多几个冲突，不会改坏语义。
2. `difflib.SequenceMatcher` 的 Python 语义移植（行级，autojunk 关闭）求 B→O、B→T 改动块；
   把 T 的改动块当补丁贴到 O 上：**不重叠→采用**；**重叠但替换文本相同→只采用一次**；
   **重叠且不同→冲突**（保留 O 版本，不写文件）。区间按半开区间判定，相邻不算重叠。
3. 每个写出的结果都再过一遍 `acorn.parse` + `node:vm` 的 `new vm.Script()`；
   无冲突但语法不通过的单列 `invalid`，不写文件，避免污染后续移植。
4. **结构体检**：合并结果里同一个局部名不允许出现两次声明。每个版本内部 `$L` 编号对每个绑定
   自增且唯一，所以重名只可能来自「我们的新局部」和「新基础的新局部」撞车——语法上合法（遮蔽），
   语义会串味。两边的新局部号段**互不重叠**（我们的排在 base 最大号之后，新基础的再往后排），
   本次 0 处；一旦命中就判 `invalid` 不写文件。

## 2. 逐函数结果

行数一律指**规范化后**的行数。`B/O/T` = base/ours/theirs；`采用T` = 采纳的新基础改动块数；
`冲突(行号)` = OLD 规范化行号区间（多个冲突块用逗号分隔）。

| # | 函数 | NEW 名 | B 行 | O 行 | T 行 | 结果 | 冲突块 | 冲突(行号) | 采用T | 文件 |
|---:|---|---|---:|---:|---:|---|---:|---|---:|---|
| 1 | `ca` | `$a` | 30 | 32 | 30 | ✅ 合并成功 | 0 | - | 0 | `out/merges/ca.js` |
| 2 | `U` | `_` | 4 | 4 | 4 | ✅ 合并成功 | 0 | - | 0 | `out/merges/U.js` |
| 3 | `J` | `ae` | 8 | 8 | 8 | ✅ 合并成功 | 0 | - | 0 | `out/merges/J.js` |
| 4 | `w` | `M` | 21 | 22 | 10 | ❌ 冲突 | 2 | 2-13, 15-16 | 0 | - |
| 5 | `Zf` | `lh` | 15 | 15 | 15 | ✅ 合并成功 | 0 | - | 0 | `out/merges/Zf.js` |
| 6 | `Cx` | `P6` | 158 | 172 | 158 | ✅ 合并成功 | 0 | - | 1 | `out/merges/Cx.js` |
| 7 | `ue` | `Re` | 16 | 18 | 16 | ✅ 合并成功 | 0 | - | 0 | `out/merges/ue.js` |
| 8 | `mp` | `ib` | 12 | 13 | 12 | ✅ 合并成功 | 0 | - | 0 | `out/merges/mp.js` |
| 9 | `Tk` | `QM` | 10 | 10 | 11 | ✅ 合并成功 | 0 | - | 1 | `out/merges/Tk.js` |
| 10 | `pb` | `Aw` | 107 | 109 | 107 | ✅ 合并成功 | 0 | - | 0 | `out/merges/pb.js` |
| 11 | `ui` | `Ni` | 28 | 29 | 28 | ✅ 合并成功 | 0 | - | 0 | `out/merges/ui.js` |
| 12 | `fi` | `Nr` | 84 | 106 | 94 | ✅ 合并成功 | 0 | - | 2 | `out/merges/fi.js` |
| 13 | `ro` | `vr` | 42 | 42 | 35 | ❌ 冲突 | 1 | 13-14 | 3 | - |
| 14 | `ub` | `Cw` | 54 | 81 | 54 | ✅ 合并成功 | 0 | - | 0 | `out/merges/ub.js` |
| 15 | `Qp` | `Bb` | 47 | 47 | 47 | ✅ 合并成功 | 0 | - | 0 | `out/merges/Qp.js` |
| 16 | `Yp` | `qb` | 51 | 51 | 51 | ✅ 合并成功 | 0 | - | 0 | `out/merges/Yp.js` |
| 17 | `K` | `ee` | 83 | 83 | 78 | ✅ 合并成功 | 0 | - | 4 | `out/merges/K.js` |
| 18 | `ou` | `Ub` | 63 | 86 | 63 | ❌ 冲突 | 1 | 48-48 | 2 | - |
| 19 | `hn` | `sr` | 158 | 228 | 164 | ✅ 合并成功 | 0 | - | 3 | `out/merges/hn.js` |
| 20 | `nt` | `Dt` | 30 | 34 | 30 | ✅ 合并成功 | 0 | - | 0 | `out/merges/nt.js` |
| 21 | `Ib` | `_w` | 11 | 11 | 11 | ✅ 合并成功 | 0 | - | 0 | `out/merges/Ib.js` |
| 22 | `rv` | `jS` | 10 | 11 | 10 | ✅ 合并成功 | 0 | - | 1 | `out/merges/rv.js` |
| 23 | `Jb` | `i4` | 9 | 17 | 9 | ✅ 合并成功 | 0 | - | 1 | `out/merges/Jb.js` |
| 24 | `Vs` | `ps` | 18 | 22 | 22 | ❌ 冲突 | 2 | 4-5, 15-16 | 0 | - |
| 25 | `t2` | `fp` | 12 | 12 | 12 | ✅ 合并成功 | 0 | - | 0 | `out/merges/t2.js` |
| 26 | `Zo` | `as` | 67 | 67 | 67 | ✅ 合并成功 | 0 | - | 4 | `out/merges/Zo.js` |
| 27 | `Cc` | `jr` | 7 | 14 | 7 | ✅ 合并成功 | 0 | - | 0 | `out/merges/Cc.js` |
| 28 | `v2` | `Ul` | 9 | 9 | 9 | ✅ 合并成功 | 0 | - | 0 | `out/merges/v2.js` |
| 29 | `w2` | `A5` | 4 | 4 | 4 | ✅ 合并成功 | 0 | - | 0 | `out/merges/w2.js` |
| 30 | `Ro` | `oo` | 34 | 38 | 38 | ❌ 冲突 | 1 | 2-2 | 2 | - |
| 31 | `B2` | `E4` | 19 | 19 | 19 | ❌ 冲突 | 1 | 2-2 | 0 | - |
| 32 | `F2` | `L4` | 35 | 35 | 35 | ✅ 合并成功 | 0 | - | 0 | `out/merges/F2.js` |
| 33 | `Ko` | `Qo` | 16 | 19 | 16 | ✅ 合并成功 | 0 | - | 1 | `out/merges/Ko.js` |
| 34 | `Fc` | `El` | 18 | 21 | 22 | ❌ 冲突 | 1 | 4-5 | 2 | - |
| 35 | `ji` | `v0` | 36 | 3 | 36 | ✅ 合并成功 | 0 | - | 0 | `out/merges/ji.js` |
| 36 | `ih` | - | - | - | - | ⏭ 跳过 | - | - | 0 | - |
| 37 | `mr` | `an` | 10 | 11 | 10 | ✅ 合并成功 | 0 | - | 0 | `out/merges/mr.js` |
| 38 | `X2` | `Q4` | 249 | 260 | 249 | ✅ 合并成功 | 0 | - | 2 | `out/merges/X2.js` |
| 39 | `qv` | `s$` | 578 | 597 | 207 | ❌ 冲突 | 2 | 23-359, 461-513 | 11 | - |
| 40 | `ty` | `mp` | 16 | 21 | 16 | ✅ 合并成功 | 0 | - | 2 | `out/merges/ty.js` |
| 41 | `br` | `po` | 38 | 49 | 47 | ❌ 冲突 | 2 | 2-2, 17-18 | 5 | - |
| 42 | `Ph` | `m2` | 152 | 175 | 154 | ❌ 冲突 | 2 | 40-40, 143-143 | 14 | - |
| 43 | `my` | `S3` | 30 | 32 | 30 | ✅ 合并成功 | 0 | - | 0 | `out/merges/my.js` |
| 44 | `Ay` | - | - | - | - | ⏭ 跳过 | - | - | 0 | - |
| 45 | `mm` | `dv` | 214 | 244 | 215 | ❌ 冲突 | 1 | 91-91 | 2 | - |
| 46 | `$y` | `B3` | 11 | 15 | 11 | ✅ 合并成功 | 0 | - | 1 | `out/merges/$y.js` |
| 47 | `Rm` | `Mv` | 69 | 74 | 69 | ✅ 合并成功 | 0 | - | 0 | `out/merges/Rm.js` |
| 48 | `Mn` | `sl` | 3 | 3 | 3 | ✅ 合并成功 | 0 | - | 0 | `out/merges/Mn.js` |
| 49 | `Ue` | `St` | 9 | 9 | 9 | ✅ 合并成功 | 0 | - | 0 | `out/merges/Ue__57f37a.js` |
| 50 | `pt` | `Nt` | 22 | 22 | 22 | ✅ 合并成功 | 0 | - | 1 | `out/merges/pt.js` |
| 51 | `Qv` | `O$` | 134 | 186 | 134 | ✅ 合并成功 | 0 | - | 0 | `out/merges/Qv__58fc76.js` |
| 52 | `en` | `Fi` | 113 | 117 | 115 | ✅ 合并成功 | 0 | - | 3 | `out/merges/en.js` |
| 53 | `Kl` | `jp` | 11 | 19 | 11 | ✅ 合并成功 | 0 | - | 0 | `out/merges/Kl.js` |
| 54 | `o5` | `N$` | 25 | 25 | 25 | ✅ 合并成功 | 0 | - | 1 | `out/merges/o5.js` |

> 文件名说明：Windows 文件名大小写不敏感，`Ue` / `Qv` 与同名不同大小写的函数会写到同一个文件，已加后缀区分：`Ue` → `out/merges/Ue__57f37a.js`；`Qv` → `out/merges/Qv__58fc76.js`。

## 3. 跳过 / 异常明细

| 函数 | 状态 | 原因 |
|---|---|---|
| `ih` | skipped | symbol_map 无映射 |
| `Ay` | skipped | symbol_map 无映射 |

## 4. 语法自检（node:vm `new vm.Script` + acorn）

对**全部 41 个**已写出的合并结果逐个做了 `new vm.Script(代码)` 编译（不是抽查），
另外用 acorn 再 parse 一次；下表是完整结果。

| 函数 | 文件 | acorn | vm.Script |
|---|---|---|---|
| `ca` | `out/merges/ca.js` | OK | OK |
| `U` | `out/merges/U.js` | OK | OK |
| `J` | `out/merges/J.js` | OK | OK |
| `Zf` | `out/merges/Zf.js` | OK | OK |
| `Cx` | `out/merges/Cx.js` | OK | OK |
| `ue` | `out/merges/ue.js` | OK | OK |
| `mp` | `out/merges/mp.js` | OK | OK |
| `Tk` | `out/merges/Tk.js` | OK | OK |
| `pb` | `out/merges/pb.js` | OK | OK |
| `ui` | `out/merges/ui.js` | OK | OK |
| `fi` | `out/merges/fi.js` | OK | OK |
| `ub` | `out/merges/ub.js` | OK | OK |
| `Qp` | `out/merges/Qp.js` | OK | OK |
| `Yp` | `out/merges/Yp.js` | OK | OK |
| `K` | `out/merges/K.js` | OK | OK |
| `hn` | `out/merges/hn.js` | OK | OK |
| `nt` | `out/merges/nt.js` | OK | OK |
| `Ib` | `out/merges/Ib.js` | OK | OK |
| `rv` | `out/merges/rv.js` | OK | OK |
| `Jb` | `out/merges/Jb.js` | OK | OK |
| `t2` | `out/merges/t2.js` | OK | OK |
| `Zo` | `out/merges/Zo.js` | OK | OK |
| `Cc` | `out/merges/Cc.js` | OK | OK |
| `v2` | `out/merges/v2.js` | OK | OK |
| `w2` | `out/merges/w2.js` | OK | OK |
| `F2` | `out/merges/F2.js` | OK | OK |
| `Ko` | `out/merges/Ko.js` | OK | OK |
| `ji` | `out/merges/ji.js` | OK | OK |
| `mr` | `out/merges/mr.js` | OK | OK |
| `X2` | `out/merges/X2.js` | OK | OK |
| `ty` | `out/merges/ty.js` | OK | OK |
| `my` | `out/merges/my.js` | OK | OK |
| `$y` | `out/merges/$y.js` | OK | OK |
| `Rm` | `out/merges/Rm.js` | OK | OK |
| `Mn` | `out/merges/Mn.js` | OK | OK |
| `Ue` | `out/merges/Ue__57f37a.js` | OK | OK |
| `pt` | `out/merges/pt.js` | OK | OK |
| `Qv` | `out/merges/Qv__58fc76.js` | OK | OK |
| `en` | `out/merges/en.js` | OK | OK |
| `Kl` | `out/merges/Kl.js` | OK | OK |
| `o5` | `out/merges/o5.js` | OK | OK |

结果：**41/41 通过**，无失败。

题目要求的「至少 3 个」样本（取合并结果最大 / 中位 / 最小的三个，实际是全部 41 个都验了）：

| 样本 | 文件 | 行数 | 字节 | `new vm.Script(...)` |
|---|---|---:|---:|---|
| `X2` | `out/merges/X2.js` | 260 | 7982 | OK |
| `ty` | `out/merges/ty.js` | 21 | 788 | OK |
| `Mn` | `out/merges/Mn.js` | 3 | 134 | OK |

## 5. 反向映射缺失的自由引用（theirs 侧，保持原样）

这些是 NEW 代码里出现、但 `symbol_map` 反向表（NEW→OLD）里没有的标识符 —— 多半是新基础新增的顶层函数/变量
或浏览器内建（内建已过滤）。合并结果里它们保持 NEW 名，移植时需要人工确认是否需要补映射。

| 函数 | 未映射自由引用 |
|---|---|
| `w` | `ed` |
| `ou` | `ba` |
| `hn` | `ba` |
| `Vs` | `Xp` |
| `Zo` | `Oo` `Vp` `Zn` |
| `Ro` | `Af` `ap` |
| `Fc` | `WT` `k0` `x0` |
| `X2` | `Zc` `uc` |
| `qv` | `Cg` `Eg` `Gr` `J4` `T0` `Xm` `fu` `h2` `hf` `ou` `pp` |
| `ty` | `Of` `ji` |
| `br` | `Of` `Sa` `Vn` `bp` `co` `ji` `n$` `yp` |
| `Ph` | `C1` `D0` `D2` `I3` `P3` `Y2` `a2` `ai` `f` `ja` `jd` `nr` `ov` `qd` `sv` `t2` `yi` |
| `my` | `f` |
| `mm` | `G1` `J2` `nv` `o2` `q2` |
| `$y` | `$c` `f` `nr` `tl` |

### 5.1 ⚠ 名字与 OLD 顶层名撞车、但反向表里查不到的引用

这些标识符出现在 **theirs** 里、`symbol_map` 反向表（NEW→OLD）里没有，而 OLD 恰好有一个**同名但不同义**的顶层声明。
合并结果里它们保持 NEW 名（语义正确），但后续「按 OLD→NEW 统一改名」的那一步**绝不能**把它们当 OLD 名改写，
否则会指向错误的函数/变量。逐条确认后，正解是给这些 NEW 名补进 `symbol_map`（映射到 NEW 自己或标成 NEW-only）。

| 函数 | 撞名引用 |
|---|---|
| `w` | `ed` |
| `ou` | `ba` |
| `hn` | `ba` |
| `Vs` | `Xp` |
| `Zo` | `Oo` `Vp` `Zn` |
| `Ro` | `Af` `ap` |
| `Fc` | `k0` `x0` |
| `X2` | `Zc` `uc` |
| `qv` | `Cg` `Eg` `Gr` `T0` `Xm` `fu` `h2` `hf` `ou` `pp` |
| `ty` | `Of` `ji` |
| `br` | `Of` `Sa` `Vn` `bp` `co` `ji` `yp` |
| `Ph` | `C1` `D0` `D2` `Y2` `a2` `ai` `f` `ja` `jd` `nr` `ov` `qd` `sv` `t2` `yi` |
| `my` | `f` |
| `mm` | `G1` `J2` `nv` `o2` `q2` |
| `$y` | `$c` `f` `nr` `tl` |

### 5.2 合并结果里「我们自己」的依赖（O 侧自由引用，非 OLD 顶层名、非内建）

这些名字必须由我们的移植块自己提供（新函数/新常量）。凡是这里出现、块里却没有定义的，就是漏移植。

| 名字 | 出现于 |
|---|---|
| `AB_GREEN` | `hn` |
| `ABMODS` | `my` |
| `AbyssMake` | `ub` `X2` |
| `AbyssOmenDrop` | `hn` |
| `AbyssOnKill` | `hn` |
| `BAL` | `ub` `hn` |
| `curPage` | `Vs` |
| `DelDRMul` | `K` |
| `DelDRPct` | `Jb` |
| `DeliriumEnd` | `ui` |
| `DelRarityBonus` | `B2` |
| `DelSplinter` | `hn` |
| `DlMirror` | `Ph` |
| `DlRitual` | `Ph` |
| `DlShardDraw` | `Ph` |
| `DlSim` | `Ph` |
| `DlWell` | `Ph` |
| `DsBoneDrop` | `hn` |
| `DsDesecrate` | `Qv` |
| `DsMapChaos` | `Qv` |
| `DsWell` | `Fc` `qv` |
| `ExAll` | `br` |
| `ExBody` | `br` |
| `ExDo` | `br` |
| `ExPrev` | `br` |
| `jiBox` | `ji` |
| `OmActive` | `Vs` `Cc` |
| `OmBenchRow` | `Ro` |
| `OmDrop` | `hn` `rv` |
| `OmHas` | `nt` `ty` `Rm` `Qv` |
| `OmHint` | `w2` |
| `OmIsAbyss` | `Cc` |
| `OmIsWorld` | `Cc` |
| `OmPrune` | `Vs` `Ro` |
| `OmTake` | `nt` `Ib` `mr` `ty` `Rm` `Qv` |
| `OmToggle` | `Ro` `qv` |
| `OmWhittle` | `Qv` |
| `RIT_COL` | `hn` |
| `RitAddTribute` | `hn` |
| `RitTribute` | `hn` `Ph` |
| `RitualInteract` | `Fc` `qv` |
| `RitualMake` | `ub` |
| `SimDmgMul` | `Jb` |
| `SimulacrumInteract` | `Fc` `qv` |
| `UniqueResCap` | `nt` `t2` |

### 5.3 低置信度反向映射（已使用，留意）

| 函数 | NEW→OLD（confidence） |
|---|---|
| `Zf` | `ih->Uf(medium)` |
| `Cx` | `ur->oo(medium)` |
| `mp` | `cc->tr(medium)` `h->u(medium)` |
| `Tk` | `h->u(medium)` |
| `ui` | `bs->ia(medium)` `gs->ra(medium)` |
| `fi` | `h->u(medium)` |
| `ro` | `As->io(medium)` |
| `Yp` | `h->u(medium)` |
| `hn` | `h->u(medium)` |
| `nt` | `h->u(medium)` |
| `Ib` | `h->u(medium)` |
| `rv` | `h->u(medium)` |
| `Jb` | `h->u(medium)` |
| `Vs` | `h->u(medium)` |
| `t2` | `h->u(medium)` |
| `Zo` | `As->io(medium)` `h->u(medium)` `tn->mo(medium)` |
| `Cc` | `h->u(medium)` |
| `w2` | `h->u(medium)` |
| `B2` | `h->u(medium)` |
| `F2` | `h->u(medium)` |
| `Ko` | `h->u(medium)` |
| `ji` | `h->u(medium)` |
| `mr` | `h->u(medium)` |
| `X2` | `bs->ia(medium)` `gs->ra(medium)` `h->u(medium)` |
| `qv` | `h->u(medium)` |
| `ty` | `Y4->ey(medium)` `h->u(medium)` `zs->yr(medium)` |
| `br` | `h->u(medium)` `zs->yr(medium)` |
| `Ph` | `bo->us(medium)` `bs->ia(medium)` `gs->ra(medium)` `j3->My(medium)` `rn->rs(medium)` `ur->oo(medium)` |
| `mm` | `h->u(medium)` |
| `Qv` | `Qd->vc(medium)` `h->u(medium)` |
| `en` | `$n->No(medium)` `h->u(medium)` |
| `Kl` | `s6->Ky(medium)` |

## 6. 产物与复现

- `out/merges/<函数名>.js` —— 无冲突的合并结果（41 个），形如 `X = function (...) { ... };`
- `out/merge_stats.json` —— 机器可读统计：每个函数的 status / 行数 / 改动块数 / 冲突区间 / 语法结果 / 未映射引用 / 局部名对齐数据
- `out/merge_report.md` —— 本文件

复现某函数的规范化三方文本（写入 `scratch/tw_norm/`）：

```bash
node tools/threeway.mjs --dump --only ca   # 只看一个函数（部分运行不会覆盖 out/merge_*.{md,json}）
node tools/threeway.mjs                       # 全量重跑（会先清空 out/merges/*.js）
```

## 7. 冲突明细（需人工判断，文末）

### `w`（NEW `M`）— 2 个冲突块

#### 1/2 · B(OLD) 行 2-13 · O(ours) 行 3-10 · T(NEW) 行 2-2

**B — base（OLD 基础原实现）**，`-` = 落在改动块里的行

```js
     1| w = function ($L2, $L3 = 1) {
-    2|   if (o.muted) return;
-    3|   const $L4 = __uploadedSfxMap[$L2];
-    4|   if ($L4) {
-    5|     for (const $L5 of $L4) {
-    6|       const [$L6, $L7, $L8, $L9 = 0, $L10 = 0] = $L5;
-    7|       if ($L9 > 0) setTimeout(() => {
-    8|         if (!o.muted) playAssetSfx($L6, Math.min(1, $L7 * $L3), $L8, $L10);
-    9|       }, $L9); else playAssetSfx($L6, Math.min(1, $L7 * $L3), $L8, $L10);
-   10|     }
-   11|     return;
-   12|   }
-   13|   if (!ke) return;
    14|   let $L11 = ke.currentTime;
-   15|   if (!(ul[$L2] && $L11 - ul[$L2] < 0.035)) {
```

**O — ours（我们的改版，保留方）**，`+` = 我们的改动行

```js
     1| w = function ($L2, $L3 = 1) {
     2|   if (o.muted) return;
+    3|   let $L13 = $L3 * 0.92, $L14 = 1 + (T() - 0.5) * 0.035;
     4|   const $L4 = __uploadedSfxMap[$L2];
     5|   if ($L4) {
     6|     for (const $L5 of $L4) {
     7|       const [$L6, $L7, $L8, $L9 = 0, $L10 = 0] = $L5;
     8|       if ($L9 > 0) setTimeout(() => {
+    9|         if (!o.muted) playAssetSfx($L6, Math.min(1, $L7 * $L13), $L8 * $L14, $L10);
+   10|       }, $L9); else playAssetSfx($L6, Math.min(1, $L7 * $L13), $L8 * $L14, $L10);
    11|     }
    12|     return;
```

**T — theirs（新基础新版）**，`+` = 新基础的改动行

```js
     1| w = function ($L2, $L3 = 1) {
+    2|   if (!ke || o.muted) return;
     3|   let $L11 = ke.currentTime;
     4|   if (!(ed[$L2] && $L11 - ed[$L2] < 0.035)) {
```

#### 2/2 · B(OLD) 行 15-16 · O(ours) 行 16-16 · T(NEW) 行 4-5

**B — base（OLD 基础原实现）**，`-` = 落在改动块里的行

```js
    13|   if (!ke) return;
    14|   let $L11 = ke.currentTime;
-   15|   if (!(ul[$L2] && $L11 - ul[$L2] < 0.035)) {
-   16|     ul[$L2] = $L11;
    17|     try {
-   18|       Ln[$L2]($L11 + 0.004, $L3);
```

**O — ours（我们的改版，保留方）**，`+` = 我们的改动行

```js
    14|   if (!ke) return;
    15|   let $L11 = ke.currentTime;
+   16|   if (!(ul[$L2] && $L11 - ul[$L2] < 0.05)) {
    17|     ul[$L2] = $L11;
    18|     try {
```

**T — theirs（新基础新版）**，`+` = 新基础的改动行

```js
     2|   if (!ke || o.muted) return;
     3|   let $L11 = ke.currentTime;
+    4|   if (!(ed[$L2] && $L11 - ed[$L2] < 0.035)) {
+    5|     ed[$L2] = $L11;
     6|     try {
     7|       Ln[$L2]($L11 + 0.004, $L3);
```

### `ro`（NEW `vr`）— 1 个冲突块

#### 1/1 · B(OLD) 行 13-14 · O(ours) 行 13-13 · T(NEW) 行 8-9

**B — base（OLD 基础原实现）**，`-` = 落在改动块里的行

```js
    11|     torchCh: $L6.torch
    12|   });
-   13|   let [$L9, $L10] = $L6 && $L6.rooms ? $L6.rooms : [10, 12], $L11 = $L3 || (o.endlessMode ? makeEndlessMap() : Wn(ee($L9, $L10)));
-   14|   for (let $L12 = 0; !$L3 && !o.endlessMode && $L12 < 20 && $L11.rooms.length < Math.min(7, $L9 - 3); $L12++) $L11 = Wn(ee($L9, $L10));
    15|   (ui($L11, "map", $L4, {
    16|     lvl: io($L2.tier),
```

**O — ours（我们的改版，保留方）**，`+` = 我们的改动行

```js
    11|     torchCh: $L6.torch
    12|   });
+   13|   let [$L9, $L10] = $L6 && $L6.rooms ? $L6.rooms : [14, 17], $L11 = $L3 || (o.endlessMode ? makeEndlessMap() : Wn(ee($L9, $L10)));
    14|   for (let $L12 = 0; !$L3 && !o.endlessMode && $L12 < 20 && $L11.rooms.length < Math.min(7, $L9 - 3); $L12++) $L11 = Wn(ee($L9, $L10));
    15|   (ui($L11, "map", $L4, {
```

**T — theirs（新基础新版）**，`+` = 新基础的改动行

```js
     6|     torchCh: $L6.torch
     7|   });
+    8|   let [$L15, $L16] = $L6 && $L6.rooms ? $L6.rooms : [10, 12], $L11 = $L3 || Wn(ee($L15, $L16));
+    9|   for (let $L17 = 0; !$L3 && $L17 < 20 && $L11.rooms.length < Math.min(7, $L15 - 3); $L17++) $L11 = Wn(ee($L15, $L16));
    10|   (ui($L11, "map", $L4, {
    11|     lvl: io($L2.tier),
```

### `ou`（NEW `Ub`）— 1 个冲突块

#### 1/1 · B(OLD) 行 48-48 · O(ours) 行 48-71 · T(NEW) 行 48-48

**B — base（OLD 基础原实现）**，`-` = 落在改动块里的行

```js
    46|     heavy: 2.8,
    47|     super: 4.5
-   48|   })[$L5]), $L5 === "heavy" && (o.zoomP = Math.max(o.zoomP, 0.025)), $L5 === "super" && (o.zoomP = Math.max(o.zoomP, 0.05), o.fx.push({
    49|     k: "lines",
    50|     x: $L2.x,
```

**O — ours（我们的改版，保留方）**，`+` = 我们的改动行

```js
    46|     heavy: 2.8,
    47|     super: 4.5
+   48|   })[$L5]), isFinite($L2.x) && isFinite($L2.y) && isFinite($L2.h) && o.fx.push({
+   49|     k: "ring",
+   50|     x: $L2.x,
+   51|     y: $L2.y - $L2.h * 0.45,
+   52|     t: 0,
+   53|     max: $L5 === "light" ? 0.18 : $L5 === "super" ? 0.32 : 0.24,
+   54|     r0: 2,
+   55|     r1: 8 + ({
+   56|       light: 2,
+   57|       mid: 7,
+   58|       heavy: 13,
+   59|       super: 20
+   60|     })[$L5],
+   61|     w: $L4 ? 1.7 : 1.2,
+   62|     col: $L4 ? "#ffe8b0" : $L3 > $L2.maxhp * 0.25 ? "#ffb070" : "#ff8a60"
+   63|   }), ($L4 || $L5 !== "light") && R($L2.x, $L2.y - $L2.h * 0.5, $L4 ? 6 : 3, $L4 ? ["#fff2c0", "#ffd27a", "#ffb050"] : ["#ffd27a", "#ff9a60"], 34 + ({
+   64|     light: 0,
+   65|     mid: 18,
+   66|     heavy: 36,
+   67|     super: 60
+   68|   })[$L5], 0.3, {
+   69|     glow: !0,
+   70|     vz: 40
+   71|   }), $L5 === "heavy" && (o.zoomP = Math.max(o.zoomP, 0.025)), $L5 === "super" && (o.zoomP = Math.max(o.zoomP, 0.05), o.fx.push({
    72|     k: "lines",
    73|     x: $L2.x,
```

**T — theirs（新基础新版）**，`+` = 新基础的改动行

```js
    46|     heavy: 2.8,
    47|     super: 4.5
+   48|   })[$L5]), $L5 === "heavy" && (o.zoomP = Math.max(o.zoomP, 0.025)), $L5 === "super" && (o.zoomP = Math.max(o.zoomP, 0.05), o.fx.some($L13 => $L13.k === "lines" && $L13.t < 0.1) || o.fx.push({
    49|     k: "lines",
    50|     x: $L2.x,
```

### `Vs`（NEW `ps`）— 2 个冲突块

#### 1/2 · B(OLD) 行 4-5 · O(ours) 行 6-6 · T(NEW) 行 4-9

**B — base（OLD 基础原实现）**，`-` = 落在改动块里的行

```js
     2|   if (!o.tab) return;
     3|   document.querySelectorAll("#tabs button").forEach($L2 => $L2.classList.toggle("on", $L2.dataset.tab === o.tab));
-    4|   let $L3 = $("#pbody"), $L4 = $L3.scrollTop;
-    5|   ($L3.innerHTML = o.tab === "map" ? e2() : o.tab === "inv" ? a2() : o.tab === "gem" ? hp() : o.tab === "atlas" ? mp() : o.tab === "debug" ? bp() : o.tab === "codex" ? gp() : s2(), $L3.scrollTop = $L4, $L3.querySelectorAll("[data-pv]").forEach($L5 => $L5.replaceWith(di($L5.dataset.pv))));
     6|   let $L6 = $("#tabDebug");
     7|   $L6 && ($L6.hidden = !u.debug);
```

**O — ours（我们的改版，保留方）**，`+` = 我们的改动行

```js
     4|   document.querySelectorAll("#tabs button").forEach($L2 => $L2.classList.toggle("on", $L2.dataset.tab === o.tab));
     5|   let $L3 = $("#pbody"), $L4 = $L3.scrollTop;
+    6|   ($L3.innerHTML = o.tab === "map" ? e2() : o.tab === "inv" ? a2() : o.tab === "cur" ? curPage() : o.tab === "gem" ? hp() : o.tab === "atlas" ? mp() : o.tab === "debug" ? bp() : o.tab === "codex" ? gp() : s2(), $L3.scrollTop = $L4, $L3.querySelectorAll("[data-pv]").forEach($L12 => $L12.replaceWith(di($L12.dataset.pv))));
     7|   let $L6 = $("#tabDebug");
     8|   $L6 && ($L6.hidden = !u.debug);
```

**T — theirs（新基础新版）**，`+` = 新基础的改动行

```js
     2|   if (!o.tab) return;
     3|   document.querySelectorAll("#tabs button").forEach($L2 => $L2.classList.toggle("on", $L2.dataset.tab === o.tab));
+    4|   let $L17 = $("#pbody"), $L18 = $L17.scrollTop, $L19 = o.mv && o.mv.panel ? o.mv.panel(o.tab) : null;
+    5|   if (($L17.classList.toggle("mvbody", $L19 != null), $L19 != null)) {
+    6|     let $L20 = o.mv.keep($L17);
+    7|     ($L17.innerHTML = $L19, o.mv.restore($L17, $L20));
+    8|   } else $L17.innerHTML = o.tab === "map" ? e2() : o.tab === "inv" ? a2() : o.tab === "gem" ? hp() : o.tab === "atlas" ? mp() : o.tab === "debug" ? bp() : o.tab === "codex" ? gp() : s2();
+    9|   ($L17.scrollTop = $L18, $L17.querySelectorAll("[data-pv]").forEach($L21 => $L21.replaceWith(di($L21.dataset.pv))));
    10|   let $L6 = $("#tabDebug");
    11|   $L6 && ($L6.hidden = !u.debug);
```

#### 2/2 · B(OLD) 行 15-16 · O(ours) 行 19-19 · T(NEW) 行 19-20

**B — base（OLD 基础原实现）**，`-` = 落在改动块里的行

```js
-   13|     sig: "印记"
    14|   };
-   15|   ($("#curbar").innerHTML = '<span class="lbl">选中后点击物品使用 · 按住 Shift 连续使用 · 通货全角色共用</span>' + ["basic", "sock", "rune", "ess", "sig"].map($L8 => `<span class="cg">${$L7[$L8]}</span>` + lt.filter($L9 => P[$L9].grp === $L8).map($L10 => `<div class="cur${o.held === $L10 ? " sel" : ""}${u.cur[$L10] ? "" : " zero"}" data-act="cur" data-k="${$L10}" data-tt="cur:${$L10}"><img src="${It[$L10]}" alt=""><span>${P[$L10].n}</span><b>${u.cur[$L10] || 0}</b></div>`).join("")).join(""), o.tab === "tree" && setTimeout(() => {
-   16|     (Mc(!1), Ka());
    17|   }, 0));
    18| };
```

**O — ours（我们的改版，保留方）**，`+` = 我们的改动行

```js
    17|     del: "裂片"
    18|   };
+   19|   ($("#curbar").innerHTML = '<span class="lbl">选中后点击物品使用 · 按住 Shift 连续使用 · 通货全角色共用 · 预兆点击激活</span>' + ["basic", "sock", "rune", "ess", "sig", "bone", "del", "omen"].map($L13 => `<span class="cg">${$L7[$L13]}</span>` + lt.filter($L14 => P[$L14].grp === $L13).map($L15 => $L13 === "omen" ? `<div class="cur om${OmActive($L15) ? " on" : ""}${u.cur[$L15] ? "" : " zero"}" data-act="omen" data-k="${$L15}" data-tt="cur:${$L15}"><img src="${It[$L15]}" alt=""><span>${P[$L15].s || P[$L15].n}</span><b>${u.cur[$L15] || 0}</b>${OmActive($L15) ? '<i class="omtag">激活</i>' : ""}</div>` : `<div class="cur${o.held === $L15 ? " sel" : ""}${u.cur[$L15] ? "" : " zero"}" data-act="cur" data-k="${$L15}" data-tt="cur:${$L15}"><img src="${It[$L15]}" alt=""><span>${P[$L15].n}</span><b>${u.cur[$L15] || 0}</b></div>`).join("")).join(""), o.tab === "tree" && setTimeout(() => {
    20|     (Mc(!1), Ka());
    21|   }, 0));
```

**T — theirs（新基础新版）**，`+` = 新基础的改动行

```js
    17|     sig: "印记"
    18|   };
+   19|   ($("#curbar").innerHTML = '<span class="lbl" style="width:100%;display:block;margin-bottom:8px;">选中后点击物品使用 · 按住 Shift 连续使用 · 通货全角色共用</span>' + ["basic", "sock", "rune", "ess", "sig"].map($L22 => `<div style="display:flex; align-items:center; flex-wrap:wrap; gap:4px; margin-bottom:6px; width:100%;"><span class="cg" style="min-width:40px; margin-right:8px;">${$L7[$L22]}</span>` + lt.filter($L23 => P[$L23].grp === $L22).map($L24 => `<div class="cur${o.held === $L24 ? " sel" : ""}${u.cur[$L24] ? "" : " zero"}" data-act="cur" data-k="${$L24}" data-tt="cur:${$L24}"><img src="${It[$L24]}" alt=""><span>${P[$L24].n}</span><b>${u.cur[$L24] || 0}</b></div>`).join("")).join(""), o.tab === "tree" && setTimeout(() => {
+   20|     (Xp(!1), Ka());
    21|   }, 0));
    22| };
```

### `Ro`（NEW `oo`）— 1 个冲突块

#### 1/1 · B(OLD) 行 2-2 · O(ours) 行 2-2 · T(NEW) 行 2-5

**B — base（OLD 基础原实现）**，`-` = 落在改动块里的行

```js
     1| Ro = function () {
     2|   let $L2 = $o(), {eq: $L3, inv: $L4} = Ic(), $L5 = (Te.from === "eq" ? $L3 : $L4).map($L6 => ma($L6, "bench", `data-bsel="${$L6.uid}"${$L6.uid === Te.sel ? ' data-on="1"' : ""}`)).join("") || '<p class="dim">没有装备</p>', $L7;
     3|   if (!$L2) $L7 = Te.mode === "altar" ? `<div class="bempty">左边选一件<b>已腐化</b>的装备放上祭坛。</div>${gc(null)}` : '<div class="bempty">左边选一件装备开始。</div>'; else {
```

**O — ours（我们的改版，保留方）**，`+` = 我们的改动行

```js
     1| Ro = function () {
+    2|   OmPrune();
     3|   let $L2 = $o(), {eq: $L3, inv: $L4} = Ic(), $L5 = (Te.from === "eq" ? $L3 : $L4).map($L6 => ma($L6, "bench", `data-bsel="${$L6.uid}"${$L6.uid === Te.sel ? ' data-on="1"' : ""}`)).join("") || '<p class="dim">没有装备</p>', $L7;
     4|   if (!$L2) $L7 = Te.mode === "altar" ? `<div class="bempty">左边选一件<b>已腐化</b>的装备放上祭坛。</div>${gc(null)}` : '<div class="bempty">左边选一件装备开始。</div>'; else {
```

**T — theirs（新基础新版）**，`+` = 新基础的改动行

```js
     1| Ro = function () {
+    2|   if (o.mv && o.mv.bench) {
+    3|     o.mv.bench();
+    4|     return;
+    5|   }
     6|   let $L2 = $o(), {eq: $L3, inv: $L4} = Ic(), $L5 = (Te.from === "eq" ? $L3 : $L4).map($L6 => ma($L6, "bench", `data-bsel="${$L6.uid}"${$L6.uid === Te.sel ? ' data-on="1"' : ""}`)).join("") || '<p class="dim">没有装备</p>', $L7;
     7|   if (!$L2) $L7 = Te.mode === "altar" ? `<div class="bempty">左边选一件<b>已腐化</b>的装备放上祭坛。</div>${gc(null)}` : '<div class="bempty">左边选一件装备开始。</div>'; else {
```

### `B2`（NEW `E4`）— 1 个冲突块

#### 1/1 · B(OLD) 行 2-2 · O(ours) 行 2-2 · T(NEW) 行 2-2

**B — base（OLD 基础原实现）**，`-` = 落在改动块里的行

```js
     1| B2 = function ($L2, $L3) {
-    2|   let $L4 = (o.S.rarity + o.Z.ms.rar + (o.endlessMode ? o.endlessIntensity * 70 : 0) + $L3) / 100, $L5 = o.Z && o.Z.th && o.Z.th.key === "swamp" ? 1.6 : 1, $L6 = Pe([0, 1, 2, 3], $L7 => [100, 32 * (1 + $L4), 7 * (1 + $L4), 0.6 * (1 + $L4) * $L5][$L7]);
     3|   if ($L6 === 3) {
-    4|     let $L8 = Oe.filter($L9 => $L9.src === "world" && $L9.lv <= $L2 + 5);
```

**O — ours（我们的改版，保留方）**，`+` = 我们的改动行

```js
     1| B2 = function ($L2, $L3) {
+    2|   let $L26 = (o.S.rarity + o.Z.ms.rar + DelRarityBonus() + (o.endlessMode ? o.endlessIntensity * 70 : 0) + $L3) / 100, $L27 = o.Z && o.Z.th && o.Z.th.key === "swamp" ? 1.6 : 1, $L6 = Pe([0, 1, 2, 3], $L28 => [100, 32 * (1 + $L26), 7 * (1 + $L26), 0.6 * (1 + $L26) * $L27][$L28]);
     3|   if ($L6 === 3) {
     4|     let $L8 = Oe.filter($L29 => $L29.src === "world" && !$L29.noDrop && $L29.lv <= $L2 + 5);
```

**T — theirs（新基础新版）**，`+` = 新基础的改动行

```js
     1| B2 = function ($L2, $L3) {
+    2|   let $L31 = (o.S.rarity + o.Z.ms.rar + $L3) / 100, $L32 = o.Z && o.Z.th && o.Z.th.key === "swamp" ? 1.6 : 1, $L6 = Pe([0, 1, 2, 3], $L33 => [100, 32 * (1 + $L31), 7 * (1 + $L31), 0.6 * (1 + $L31) * $L32][$L33]);
     3|   if ($L6 === 3) {
     4|     let $L8 = Oe.filter($L9 => $L9.src === "world" && $L9.lv <= $L2 + 5);
```

### `Fc`（NEW `El`）— 1 个冲突块

#### 1/1 · B(OLD) 行 4-5 · O(ours) 行 5-5 · T(NEW) 行 4-5

**B — base（OLD 基础原实现）**，`-` = 落在改动块里的行

```js
     2|   let $L2 = null, $L3 = 1e9;
     3|   for (let $L4 of o.objs) {
-    4|     if (!($L4.kind === "box" && !$L4.open || Av.has($L4.kind))) continue;
-    5|     let $L5 = ($L4.x - o.pl.x) ** 2 + ($L4.y - o.pl.y) ** 2, $L6 = $L4.kind === "device" ? 42 : $L4.kind === "vendor" || $L4.kind === "stash" || $L4.kind === "bench" || $L4.kind === "altar" || $L4.kind === "monument" || $L4.kind === "dog" ? 34 : 36;
     6|     $L5 < $L6 * $L6 && $L5 < $L3 && ($L3 = $L5, $L2 = $L4);
     7|   }
```

**O — ours（我们的改版，保留方）**，`+` = 我们的改动行

```js
     3|   for (let $L4 of o.objs) {
     4|     if (!($L4.kind === "box" && !$L4.open || Av.has($L4.kind))) continue;
+    5|     let $L5 = ($L4.x - o.pl.x) ** 2 + ($L4.y - o.pl.y) ** 2, $L6 = $L4.kind === "device" ? 42 : $L4.kind === "vendor" || $L4.kind === "stash" || $L4.kind === "bench" || $L4.kind === "altar" || $L4.kind === "monument" || $L4.kind === "dog" || $L4.kind === "well" || $L4.kind === "ritual" || $L4.kind === "simulacrum" ? 34 : 36;
     6|     $L5 < $L6 * $L6 && $L5 < $L3 && ($L3 = $L5, $L2 = $L4);
     7|   }
```

**T — theirs（新基础新版）**，`+` = 新基础的改动行

```js
     2|   let $L2 = null, $L3 = 1e9;
     3|   for (let $L4 of o.objs) {
+    4|     if (!($L4.kind === "box" && !$L4.open || WT.has($L4.kind))) continue;
+    5|     let $L5 = ($L4.x - o.pl.x) ** 2 + ($L4.y - o.pl.y) ** 2, $L6 = $L4.kind === "tgate" || $L4.kind === "texit" ? 40 : $L4.kind === "device" ? 42 : $L4.kind === "vendor" || $L4.kind === "stash" || $L4.kind === "bench" || $L4.kind === "altar" || $L4.kind === "monument" || $L4.kind === "dog" ? 34 : 360;
     6|     $L5 < $L6 * $L6 && $L5 < $L3 && ($L3 = $L5, $L2 = $L4);
     7|   }
```

### `qv`（NEW `s$`）— 2 个冲突块

#### 1/2 · B(OLD) 行 23-359 · O(ours) 行 26-32 · T(NEW) 行 23-23

**B — base（OLD 基础原实现）**，`-` = 落在改动块里的行

```js
    21|     }
    22|     let $L10 = $L2.target.closest("[data-act]");
-   23|     if (!$L10) return;
-   24|     let $L11 = $L10.dataset.act;
-   25|     switch ($L11) {
-   26|       case "cur":
-   27|         {
-   28|           let $L12 = $L10.dataset.k;
-   29|           if (!u.cur[$L12]) {
-   30|             L("没有" + P[$L12].n);
-   31|             return;
-   32|           }
-   33|           Ia(o.held === $L12 ? null : $L12);
-   34|           return;
-   35|         }
-   36|       case "inv":
-   37|         {
-   38|           let $L13 = ha($L10.dataset.uid);
-   39|           if (!$L13) return;
-   40|           $L13.it.kind === "map" ? (u.device && u.inv.push(u.device), u.device = $L13.it, u.inv.splice(u.inv.indexOf($L13.it), 1), w("pick")) : $L13.it.kind === "soul" ? uu($L13.it) : Nn($L13.it, $L2.shiftKey);
-   41|           break;
-   42|         }
-   43|       case "beast":
-   44|         hu(+$L10.dataset.i, Xt);
-   45|         break;
-   46|       case "mapin":
-   47|         {
-   48|           let $L14 = ha($L10.dataset.uid);
      | …（中间省略 301 行；改动用 `node tools/threeway.mjs --dump --only <函数>` 看全量）…
-  350|         (o.forgeSel = +$L10.dataset.uid, ie.delArm = 0);
-  351|         break;
-  352|       case "fg":
-  353|         Y0($L10);
-  354|         break;
-  355|       case "mw":
-  356|         if (!od($L10)) return;
-  357|         break;
-  358|     }
-  359|     (Vs(), o.tipKey = null);
   360|   }), $("#panel").addEventListener("contextmenu", $L58 => {
   361|     if (($L58.preventDefault(), o.touchMode && o.lastPtr !== "mouse")) {
```

**O — ours（我们的改版，保留方）**，`+` = 我们的改动行

```js
    24|     let $L11 = $L10.dataset.act;
    25|     switch ($L11) {
+   26|       case "omen":
+   27|         {
+   28|           let $L111 = $L10.dataset.k;
+   29|           if (!$L111 || !P[$L111]) return;
+   30|           (OmToggle($L111), Vs());
+   31|           return;
+   32|         }
    33|       case "cur":
    34|         {
```

**T — theirs（新基础新版）**，`+` = 新基础的改动行

```js
    21|     }
    22|     let $L10 = $L2.target.closest("[data-act]");
+   23|     $L10 && pp($L10.dataset.act, $L10, $L2) !== !1 && (Vs(), o.tipKey = null);
    24|   }), $("#panel").addEventListener("contextmenu", $L58 => {
    25|     if (($L58.preventDefault(), o.touchMode && o.lastPtr !== "mouse")) {
```

#### 2/2 · B(OLD) 行 461-513 · O(ours) 行 507-518 · T(NEW) 行 122-136

**B — base（OLD 基础原实现）**，`-` = 落在改动块里的行

```js
   459|       $L89 !== o.tipKey || !!be.shift !== o.tipShift ? (o.tipKey = $L89, o.tipShift = !!be.shift, Li(Rc($L89), $L83.clientX, $L83.clientY)) : $c($L83.clientX, $L83.clientY);
   460|     } else ps.hidden || La();
-  461|   }), Ge.addEventListener("pointermove", Ih), Ge.addEventListener("pointerdown", $L90 => {
-  462|     if ((Ih($L90), ca(), o.state === "play")) {
-  463|       if (o.held) {
-  464|         Ia(null);
-  465|         return;
-  466|       }
-  467|       if ((Hc(), $L90.button === 0)) {
-  468|         for (let $L91 = o.labelRects.length - 1; $L91 >= 0; $L91--) {
-  469|           let $L92 = o.labelRects[$L91];
-  470|           if (Ae.sx >= $L92.x && Ae.sx <= $L92.x + $L92.w && Ae.sy >= $L92.y && Ae.sy <= $L92.y + $L92.h) {
-  471|             if (Math.hypot($L92.l.x - o.pl.x, $L92.l.y - o.pl.y) > 150) {
-  472|               L("距离太远");
-  473|               return;
-  474|             }
-  475|             if (Ko($L92.l)) {
-  476|               let $L93 = o.loots.indexOf($L92.l);
-  477|               $L93 >= 0 && o.loots.splice($L93, 1);
-  478|             }
-  479|             return;
-  480|           }
-  481|         }
-  482|         for (let $L94 of o.objs) {
-  483|           if (Math.hypot($L94.x - Ae.wx, $L94.y - Ae.wy) < 18) {
-  484|             if ($L94.kind === "device") {
-  485|               Bt("map");
-  486|               return;
      | …（中间省略 17 行；改动用 `node tools/threeway.mjs --dump --only <函数>` 看全量）…
-  504|           }
-  505|           if (($L94.kind === "monument" || $L94.kind === "dog") && Math.abs($L94.x - Ae.wx) < 11 && Ae.wy < $L94.y + 5 && Ae.wy > $L94.y - ($L94.kind === "monument" ? 48 : 20) && Math.hypot($L94.x - o.pl.x, $L94.y - o.pl.y) < 60) {
-  506|             $L94.kind === "monument" ? Bi() : zi();
-  507|             return;
-  508|           }
-  509|         }
-  510|         if ($L90.pointerType === "touch" && o.touchMode) return;
-  511|         (Ae.l = !0, bs(0));
-  512|       }
-  513|       $L90.button === 2 && (Ae.r = !0, bs(1));
   514|       try {
   515|         Ge.setPointerCapture($L90.pointerId);
```

**O — ours（我们的改版，保留方）**，`+` = 我们的改动行

```js
   505|               return;
   506|             }
+  507|             if ($L94.kind === "well" && Math.hypot($L94.x - o.pl.x, $L94.y - o.pl.y) < 60) {
+  508|               DsWell();
+  509|               return;
+  510|             }
+  511|             if ($L94.kind === "ritual" && Math.hypot($L94.x - o.pl.x, $L94.y - o.pl.y) < 60) {
+  512|               RitualInteract($L94);
+  513|               return;
+  514|             }
+  515|             if ($L94.kind === "simulacrum" && Math.hypot($L94.x - o.pl.x, $L94.y - o.pl.y) < 60) {
+  516|               SimulacrumInteract();
+  517|               return;
+  518|             }
   519|             if ($L94.kind === "box" && !$L94.open && Math.hypot($L94.x - o.pl.x, $L94.y - o.pl.y) < 40) {
   520|               ji($L94);
```

**T — theirs（新基础新版）**，`+` = 新基础的改动行

```js
   120|       $L89 !== o.tipKey || !!be.shift !== o.tipShift ? (o.tipKey = $L89, o.tipShift = !!be.shift, Li(Rc($L89), $L83.clientX, $L83.clientY)) : $c($L83.clientX, $L83.clientY);
   121|     } else ps.hidden || La();
+  122|   }), Ge.addEventListener("pointermove", T0), Ge.addEventListener("pointerdown", $L90 => {
+  123|     if ((ca(), o.state !== "play")) {
+  124|       T0($L90);
+  125|       return;
+  126|     }
+  127|     if (o.held) {
+  128|       Ia(null);
+  129|       return;
+  130|     }
+  131|     if ($L90.pointerType !== "mouse" && o.touchMode) {
+  132|       o.mPress ? o.mPress($L90, !1) : fu($L90);
+  133|       return;
+  134|     }
+  135|     if (!fu($L90)) {
+  136|       ($L90.button === 0 && (Ae.l = !0, bs(0)), $L90.button === 2 && (Ae.r = !0, bs(1)));
   137|       try {
   138|         Ge.setPointerCapture($L90.pointerId);
```

### `br`（NEW `po`）— 2 个冲突块

#### 1/2 · B(OLD) 行 2-2 · O(ours) 行 2-2 · T(NEW) 行 2-6

**B — base（OLD 基础原实现）**，`-` = 落在改动块里的行

```js
     1| br = function () {
-    2|   let $L2 = qh.tab, $L3 = [["gem", "技能宝石"], ["sup", "辅助宝石"], ["map", "地图"], ["sell", "出售"], ["back", "回购"]], $L4 = ["trans", "alch", "chaos"].map($L5 => `<span style="color:${P[$L5].col}">${P[$L5].n} <b>${u.cur[$L5] || 0}</b></span>`).join(""), $L6 = "";
     3|   if ($L2 === "gem") $L6 = '<p class="dim">本职业的主动技能宝石, 1 级 · 2 孔。</p><div class="shopgrid">' + Rt[u.cls].pool.filter($L7 => ae[$L7]).map($L8 => {
     4|     let $L9 = jh();
```

**O — ours（我们的改版，保留方）**，`+` = 我们的改动行

```js
     1| br = function () {
+    2|   let $L2 = qh.tab, $L3 = [["gem", "技能宝石"], ["sup", "辅助宝石"], ["map", "地图"], ["ex", "通货兑换"], ["sell", "出售"], ["back", "回购"]], $L4 = ["trans", "alch", "chaos"].map($L44 => `<span style="color:${P[$L44].col}">${P[$L44].n} <b>${u.cur[$L44] || 0}</b></span>`).join(""), $L6 = "";
     3|   if ($L2 === "gem") $L6 = '<p class="dim">本职业的主动技能宝石, 1 级 · 2 孔。</p><div class="shopgrid">' + Rt[u.cls].pool.filter($L7 => ae[$L7]).map($L8 => {
     4|     let $L9 = jh();
```

**T — theirs（新基础新版）**，`+` = 新基础的改动行

```js
     1| br = function () {
+    2|   if (o.mv && o.mv.shop) {
+    3|     o.mv.shop();
+    4|     return;
+    5|   }
+    6|   let $L2 = Sa.tab, $L3 = [["gem", "技能宝石"], ["sup", "辅助宝石"], ["map", "地图"], ["ex", "通货兑换"], ["sell", "出售"], ["back", "回购"]], $L4 = ["trans", "alch", "chaos"].map($L53 => `<span style="color:${P[$L53].col}">${P[$L53].n} <b>${u.cur[$L53] || 0}</b></span>`).join(""), $L6 = "";
     7|   if ($L2 === "gem") $L6 = '<p class="dim">本职业的主动技能宝石, 1 级 · 2 孔。</p><div class="shopgrid">' + Rt[u.cls].pool.filter($L7 => ae[$L7]).map($L8 => {
     8|     let $L9 = jh();
```

#### 2/2 · B(OLD) 行 17-18 · O(ours) 行 17-17 · T(NEW) 行 21-22

**B — base（OLD 基础原实现）**，`-` = 落在改动块里的行

```js
    15|       return `<button class="shopit${yr($L18) ? "" : " no"}" data-buy="map" data-id="${$L17}"><b>T${$L17} 地图</b>${Vi($L18)}</button>`;
    16|     }).join("") + "</div>";
-   17|   } else if ($L2 === "sell") {
-   18|     let $L19 = u.inv.filter($L20 => $L20.kind === "item" && $L20.rarity === 0).length, $L21 = u.inv.filter($L22 => $L22.kind === "item" && $L22.rarity === 1).length, $L23 = Ii(), $L24 = gn().length, $L25 = $L26 => $L26.kind === "gem" ? ae[$L26.gid].n + " Lv" + $L26.lvl : $L26.kind === "sup" ? re[$L26.gid].n : (Le[$L26.gid] || Be[$L26.gid] || ({})).n || $L26.gid, $L27 = u.gems.map(($L28, $L29) => `<button class="shopit${$L28.kind === "sup" && re[$L28.gid].mech ? " mech" : ""}" data-sg="${$L29}" data-tt="it:${$L28.uid}"><b>${$L25($L28)}</b>${Vi(xn($L28))}</button>`).join("");
    19|     $L6 = `<p class="dim">装备: 也可以在背包里右键单件出售。</p><div class="ovbtns"><button class="btn" data-sell="0">出售全部白装 (${$L19})</button><button class="btn" data-sell="1">出售全部蓝装 (${$L21})</button><button class="btn" data-sell="map">出售 T${$L23} 及以下地图 (${$L24})</button></div>
    20| 		 <p class="dim">未镶嵌的宝石 (点击出售, 卖错了可以在"回购"买回):</p><div class="shopgrid">${$L27 || '<p class="dim">没有未镶嵌的宝石</p>'}</div>`;
```

**O — ours（我们的改版，保留方）**，`+` = 我们的改动行

```js
    15|       return `<button class="shopit${yr($L18) ? "" : " no"}" data-buy="map" data-id="${$L17}"><b>T${$L17} 地图</b>${Vi($L18)}</button>`;
    16|     }).join("") + "</div>";
+   17|   } else if ($L2 === "ex") $L6 = ExBody(); else if ($L2 === "sell") {
    18|     let $L19 = u.inv.filter($L20 => $L20.kind === "item" && $L20.rarity === 0).length, $L21 = u.inv.filter($L22 => $L22.kind === "item" && $L22.rarity === 1).length, $L23 = Ii(), $L24 = gn().length, $L25 = $L26 => $L26.kind === "gem" ? ae[$L26.gid].n + " Lv" + $L26.lvl : $L26.kind === "sup" ? re[$L26.gid].n : (Le[$L26.gid] || Be[$L26.gid] || ({})).n || $L26.gid, $L27 = u.gems.map(($L28, $L29) => `<button class="shopit${$L28.kind === "sup" && re[$L28.gid].mech ? " mech" : ""}" data-sg="${$L29}" data-tt="it:${$L28.uid}"><b>${$L25($L28)}</b>${Vi(xn($L28))}</button>`).join("");
    19|     $L6 = `<p class="dim">装备: 也可以在背包里右键单件出售。</p><div class="ovbtns"><button class="btn" data-sell="0">出售全部白装 (${$L19})</button><button class="btn" data-sell="1">出售全部蓝装 (${$L21})</button><button class="btn" data-sell="map">出售 T${$L23} 及以下地图 (${$L24})</button></div>
```

**T — theirs（新基础新版）**，`+` = 新基础的改动行

```js
    19|       return `<button class="shopit${yr($L18) ? "" : " no"}" data-buy="map" data-id="${$L17}"><b>T${$L17} 地图</b>${Vi($L18)}</button>`;
    20|     }).join("") + "</div>";
+   21|   } else if ($L2 === "ex") $L6 = n$(); else if ($L2 === "sell") {
+   22|     let $L19 = u.inv.filter($L54 => $L54.kind === "item" && $L54.rarity === 0).length, $L21 = u.inv.filter($L55 => $L55.kind === "item" && $L55.rarity === 1).length, $L23 = Vn(), $L24 = co().length, $L56 = $L57 => $L57.kind === "gem" ? ae[$L57.gid].n + " Lv" + $L57.lvl : $L57.kind === "sup" ? re[$L57.gid].n : (Le[$L57.gid] || Be[$L57.gid] || ({})).n || $L57.gid, $L27 = u.gems.map(($L58, $L59) => `<button class="shopit${$L58.kind === "sup" && re[$L58.gid].mech ? " mech" : ""}" data-sg="${$L59}" data-tt="it:${$L58.uid}"><b>${$L56($L58)}</b>${Vi(xn($L58))}</button>`).join("");
    23|     $L6 = `<p class="dim">装备: 也可以在背包里右键单件出售。</p><div class="ovbtns"><button class="btn" data-sell="0">出售全部白装 (${$L19})</button><button class="btn" data-sell="1">出售全部蓝装 (${$L21})</button><button class="btn" data-sell="map">出售 T${$L23} 及以下地图 (${$L24})</button></div>
    24| 		 <p class="dim">未镶嵌的宝石 (点击出售, 卖错了可以在"回购"买回):</p><div class="shopgrid">${$L27 || '<p class="dim">没有未镶嵌的宝石</p>'}</div>`;
```

### `Ph`（NEW `m2`）— 2 个冲突块

#### 1/2 · B(OLD) 行 40-40 · O(ours) 行 40-49 · T(NEW) 行 40-40

**B — base（OLD 基础原实现）**，`-` = 落在改动块里的行

```js
    38|       (f.globalAlpha = $L36.st === "open" ? 0.18 : 0.5, f.fillStyle = "#4a1a80", f.beginPath(), f.ellipse($L36.x, $L36.y, $L37, $L37 * 0.8, 0, 0, 6.283), f.fill(), f.globalAlpha = 0.8, f.strokeStyle = "#b080ff", f.lineWidth = 1, f.beginPath(), f.ellipse($L36.x, $L36.y, $L37, $L37 * 0.8, 0, 0, 6.283), f.stroke(), f.globalAlpha = 1);
    39|     }
-   40|     $L36.kind === "device" ? Sy($L36) : $L36.kind === "vendor" ? Hh(f, $L36) : $L36.kind === "stash" ? em(f, $L36) : $L36.kind === "bench" ? Xu(f, $L36) : $L36.kind === "altar" ? Eu(f, $L36) : $L36.kind === "monument" ? Vu(f, $L36) : $L36.kind === "dog" && _u(f, $L36);
    41|   }
    42|   let $L38 = () => {
```

**O — ours（我们的改版，保留方）**，`+` = 我们的改动行

```js
    38|       (f.globalAlpha = $L36.st === "open" ? 0.18 : 0.5, f.fillStyle = "#4a1a80", f.beginPath(), f.ellipse($L36.x, $L36.y, $L37, $L37 * 0.8, 0, 0, 6.283), f.fill(), f.globalAlpha = 0.8, f.strokeStyle = "#b080ff", f.lineWidth = 1, f.beginPath(), f.ellipse($L36.x, $L36.y, $L37, $L37 * 0.8, 0, 0, 6.283), f.stroke(), f.globalAlpha = 1);
    39|     }
+   40|     if ($L36.kind === "abyss" && $L20($L36.x, $L36.y, 400)) {
+   41|       let $L103 = $L36.st === "sealed" || $L36.st === "done", $L104 = $L36.st === "pit" ? 1 + Math.sin(o.T * 6) * 0.08 : 1;
+   42|       ($L103 || (f.globalCompositeOperation = "lighter", f.fillStyle = "rgba(40,180,90,0.13)", f.globalAlpha = 1, f.beginPath(), f.ellipse($L36.x, $L36.y, $L36.r * 1.5 * $L104, $L36.r * 1.05 * $L104, 0, 0, 6.283), f.fill(), f.globalCompositeOperation = "source-over"), f.fillStyle = $L103 ? "#0b1410" : "#06110c", f.globalAlpha = $L103 ? 0.5 : 0.8, f.beginPath(), f.ellipse($L36.x, $L36.y, $L36.r, $L36.r * 0.7, 0, 0, 6.283), f.fill(), f.globalAlpha = $L103 ? 0.22 : 0.75, f.strokeStyle = "#2ee6a8", f.lineWidth = 1.3, f.beginPath(), f.ellipse($L36.x, $L36.y, $L36.r, $L36.r * 0.7, 0, 0, 6.283), f.stroke());
+   43|       for (let $L105 of $L36.fissures) {
+   44|         if ($L105.closed) continue;
+   45|         let $L106 = 1 + Math.sin(o.T * 4 + $L105.x) * 0.2;
+   46|         (f.globalCompositeOperation = "lighter", f.globalAlpha = 0.75 * $L106, f.strokeStyle = "#9dffb4", f.lineWidth = 1.4, f.beginPath(), f.moveTo($L105.x - 18, $L105.y + 3), f.lineTo($L105.x - 7, $L105.y - 3), f.lineTo($L105.x + 3, $L105.y + 4), f.lineTo($L105.x + 16, $L105.y - 2), f.stroke(), f.globalAlpha = 0.16, f.strokeStyle = "#1e7a3c", f.lineWidth = 4.5, f.stroke(), f.globalCompositeOperation = "source-over", f.globalAlpha = 1);
+   47|       }
+   48|     }
+   49|     $L36.kind === "device" ? Sy($L36) : $L36.kind === "vendor" ? Hh(f, $L36) : $L36.kind === "stash" ? em(f, $L36) : $L36.kind === "bench" ? Xu(f, $L36) : $L36.kind === "altar" ? Eu(f, $L36) : $L36.kind === "well" ? DlWell(f, $L36) : $L36.kind === "monument" ? Vu(f, $L36) : $L36.kind === "dog" ? _u(f, $L36) : $L36.kind === "mirror" ? DlMirror(f, $L36) : $L36.kind === "delshard" ? DlShardDraw(f, $L36) : $L36.kind === "simulacrum" ? DlSim(f, $L36) : $L36.kind === "ritual" && DlRitual(f, $L36);
    50|   }
    51|   let $L38 = () => {
```

**T — theirs（新基础新版）**，`+` = 新基础的改动行

```js
    38|       (f.globalAlpha = $L36.st === "open" ? 0.18 : 0.5, f.fillStyle = "#4a1a80", f.beginPath(), f.ellipse($L36.x, $L36.y, $L37, $L37 * 0.8, 0, 0, 6.283), f.fill(), f.globalAlpha = 0.8, f.strokeStyle = "#b080ff", f.lineWidth = 1, f.beginPath(), f.ellipse($L36.x, $L36.y, $L37, $L37 * 0.8, 0, 0, 6.283), f.stroke(), f.globalAlpha = 1);
    39|     }
+   40|     $L36.kind === "device" ? Sy($L36) : $L36.kind === "vendor" ? Hh(f, $L36) : $L36.kind === "stash" ? em(f, $L36) : $L36.kind === "bench" ? Xu(f, $L36) : $L36.kind === "altar" ? Eu(f, $L36) : $L36.kind === "monument" ? Vu(f, $L36) : $L36.kind === "dog" ? _u(f, $L36) : $L36.kind === "tgate" || $L36.kind === "texit" ? Y2(f, $L36) : $L36.kind === "stele" && sv(f, $L36);
    41|   }
    42|   let $L38 = () => {
```

#### 2/2 · B(OLD) 行 143-143 · O(ours) 行 160-160 · T(NEW) 行 145-145

**B — base（OLD 基础原实现）**，`-` = 落在改动块里的行

```js
   141|   }
   142|   if ((f.globalAlpha = 1, o.state === "play" && !o.pl.dead)) {
-  143|     for (let $L96 of o.objs) if (($L96.kind === "box" && !$L96.open && ($L96.x - o.pl.x) ** 2 + ($L96.y - o.pl.y) ** 2 < 1296 && ka($L96.x, $L96.y - 14, "F 开启宝箱"), $L96.kind === "rift" && $L96.st === "idle" && ($L96.x - o.pl.x) ** 2 + ($L96.y - o.pl.y) ** 2 < 3600 && ka($L96.x, $L96.y - 16, "走入裂隙即开启"), $L96.kind === "device" && ($L96.x - o.pl.x) ** 2 + ($L96.y - o.pl.y) ** 2 < 1600 && ka($L96.x, $L96.y - 26, "F / 点击 打开地图装置"), $L96.kind === "vendor" && ($L96.x - o.pl.x) ** 2 + ($L96.y - o.pl.y) ** 2 < 1156 && ka($L96.x, $L96.y - 30, "F / 点击 与商人交易"), $L96.kind === "stash" && ($L96.x - o.pl.x) ** 2 + ($L96.y - o.pl.y) ** 2 < 1156 && ka($L96.x, $L96.y - 22, "F / 点击 打开仓库"), $L96.kind === "bench" && ($L96.x - o.pl.x) ** 2 + ($L96.y - o.pl.y) ** 2 < 1156 && ka($L96.x, $L96.y - 26, "F / 点击 打开工艺台"), $L96.kind === "altar" && ($L96.x - o.pl.x) ** 2 + ($L96.y - o.pl.y) ** 2 < 1156 && ka($L96.x, $L96.y - 32, "F / 点击 打开余烬祭坛"), $L96.kind === "monument" && ($L96.x - o.pl.x) ** 2 + ($L96.y - o.pl.y) ** 2 < 1156 && ka($L96.x, $L96.y - 50, "F / 点击 查看创世群纪念碑"), $L96.kind === "dog" && ($L96.x - o.pl.x) ** 2 + ($L96.y - o.pl.y) ** 2 < 1156 && ka($L96.x, $L96.y - 32, bn() ? "F / 点击 看看今天的签" : "F / 点击 找过油肉抽签"), $L96.kind === "shrine" && !$L96.used && ($L96.x - o.pl.x) ** 2 + ($L96.y - o.pl.y) ** 2 < 2500)) {
   144|       let $L97 = Pt.find($L98 => $L98.k === $L96.type);
   145|       ka($L96.x, $L96.y - 28, $L97.n + " · " + $L97.d);
```

**O — ours（我们的改版，保留方）**，`+` = 我们的改动行

```js
   158|   }
   159|   if ((f.globalAlpha = 1, o.state === "play" && !o.pl.dead)) {
+  160|     for (let $L96 of o.objs) if (($L96.kind === "box" && !$L96.open && ($L96.x - o.pl.x) ** 2 + ($L96.y - o.pl.y) ** 2 < 1296 && ka($L96.x, $L96.y - 14, "F 开启宝箱"), $L96.kind === "rift" && $L96.st === "idle" && ($L96.x - o.pl.x) ** 2 + ($L96.y - o.pl.y) ** 2 < 3600 && ka($L96.x, $L96.y - 16, "走入裂隙即开启"), $L96.kind === "device" && ($L96.x - o.pl.x) ** 2 + ($L96.y - o.pl.y) ** 2 < 1600 && ka($L96.x, $L96.y - 26, "F / 点击 打开地图装置"), $L96.kind === "vendor" && ($L96.x - o.pl.x) ** 2 + ($L96.y - o.pl.y) ** 2 < 1156 && ka($L96.x, $L96.y - 30, "F / 点击 与商人交易"), $L96.kind === "stash" && ($L96.x - o.pl.x) ** 2 + ($L96.y - o.pl.y) ** 2 < 1156 && ka($L96.x, $L96.y - 22, "F / 点击 打开仓库"), $L96.kind === "bench" && ($L96.x - o.pl.x) ** 2 + ($L96.y - o.pl.y) ** 2 < 1156 && ka($L96.x, $L96.y - 26, "F / 点击 打开工艺台"), $L96.kind === "altar" && ($L96.x - o.pl.x) ** 2 + ($L96.y - o.pl.y) ** 2 < 1156 && ka($L96.x, $L96.y - 32, "F / 点击 打开余烬祭坛"), $L96.kind === "well" && ($L96.x - o.pl.x) ** 2 + ($L96.y - o.pl.y) ** 2 < 1156 && ka($L96.x, $L96.y - 30, "F / 点击 打开灵魂之井"), $L96.kind === "simulacrum" && ($L96.x - o.pl.x) ** 2 + ($L96.y - o.pl.y) ** 2 < 1156 && ka($L96.x, $L96.y - 32, u.simUnlocked ? "F / 点击 进入迷雾副本 (35 层)" : "F / 点击 解锁迷雾副本 (需 8 裂片)"), $L96.kind === "mirror" && $L96.st === "idle" && ($L96.x - o.pl.x) ** 2 + ($L96.y - o.pl.y) ** 2 < 1600 && ka($L96.x, $L96.y - 26, "走入迷雾之镜开启惊悸迷雾"), $L96.kind === "ritual" && ($L96.x - o.pl.x) ** 2 + ($L96.y - o.pl.y) ** 2 < 1600 && ka($L96.x, $L96.y - 32, $L96.st === "idle" ? "F / 点击 开始驱灵仪式 · 已吸收 " + ($L96.stored || 0) : $L96.st === "done" ? "F / 点击 领取恩典 · 贡品 " + RitTribute() : "驱灵仪式 · 第 " + $L96.wave + "/" + $L96.waves + " 波 · 贡品 " + RitTribute()), $L96.kind === "monument" && ($L96.x - o.pl.x) ** 2 + ($L96.y - o.pl.y) ** 2 < 1156 && ka($L96.x, $L96.y - 50, "F / 点击 查看创世群纪念碑"), $L96.kind === "dog" && ($L96.x - o.pl.x) ** 2 + ($L96.y - o.pl.y) ** 2 < 1156 && ka($L96.x, $L96.y - 32, bn() ? "F / 点击 看看今天的签" : "F / 点击 找过油肉抽签"), $L96.kind === "shrine" && !$L96.used && ($L96.x - o.pl.x) ** 2 + ($L96.y - o.pl.y) ** 2 < 2500)) {
   161|       let $L97 = Pt.find($L98 => $L98.k === $L96.type);
   162|       ka($L96.x, $L96.y - 28, $L97.n + " · " + $L97.d);
```

**T — theirs（新基础新版）**，`+` = 新基础的改动行

```js
   143|   }
   144|   if ((f.globalAlpha = 1, o.state === "play" && !o.pl.dead)) {
+  145|     for (let $L96 of o.objs) if (($L96.kind === "box" && !$L96.open && ($L96.x - o.pl.x) ** 2 + ($L96.y - o.pl.y) ** 2 < 1296 && ja($L96.x, $L96.y - 14, "F 开启宝箱"), $L96.kind === "rift" && $L96.st === "idle" && ($L96.x - o.pl.x) ** 2 + ($L96.y - o.pl.y) ** 2 < 3600 && ja($L96.x, $L96.y - 16, "走入裂隙即开启"), $L96.kind === "device" && ($L96.x - o.pl.x) ** 2 + ($L96.y - o.pl.y) ** 2 < 1600 && ja($L96.x, $L96.y - 26, "F / 点击 打开地图装置"), $L96.kind === "vendor" && ($L96.x - o.pl.x) ** 2 + ($L96.y - o.pl.y) ** 2 < 1156 && ja($L96.x, $L96.y - 30, "F / 点击 与商人交易"), $L96.kind === "stash" && ($L96.x - o.pl.x) ** 2 + ($L96.y - o.pl.y) ** 2 < 1156 && ja($L96.x, $L96.y - 22, "F / 点击 打开仓库"), $L96.kind === "bench" && ($L96.x - o.pl.x) ** 2 + ($L96.y - o.pl.y) ** 2 < 1156 && ja($L96.x, $L96.y - 26, "F / 点击 打开工艺台"), $L96.kind === "altar" && ($L96.x - o.pl.x) ** 2 + ($L96.y - o.pl.y) ** 2 < 1156 && ja($L96.x, $L96.y - 32, "F / 点击 打开余烬祭坛"), $L96.kind === "monument" && ($L96.x - o.pl.x) ** 2 + ($L96.y - o.pl.y) ** 2 < 1156 && ja($L96.x, $L96.y - 50, "F / 点击 查看创世群纪念碑"), $L96.kind === "dog" && ($L96.x - o.pl.x) ** 2 + ($L96.y - o.pl.y) ** 2 < 1156 && ja($L96.x, $L96.y - 32, bn() ? "F / 点击 看看今天的签" : "F / 点击 找过油肉抽签"), $L96.kind === "tgate" && ($L96.x - o.pl.x) ** 2 + ($L96.y - o.pl.y) ** 2 < 1600 && ja($L96.x, $L96.y - 44, "F / 点击 进入无尽裂隙"), $L96.kind === "texit" && ($L96.x - o.pl.x) ** 2 + ($L96.y - o.pl.y) ** 2 < 2500 && ja($L96.x, $L96.y - 30, "F / 走入 · 前往下一层"), $L96.kind === "stele" && ($L96.x - o.pl.x) ** 2 + ($L96.y - o.pl.y) ** 2 < 1296 && ja($L96.x, $L96.y + 12, "F / 点击 查看深渊碑"), $L96.kind === "stele" && ($L96.x - o.pl.x) ** 2 + ($L96.y - o.pl.y) ** 2 < 12100 && ja($L96.x, $L96.y - 70, ...ov()), $L96.kind === "shrine" && !$L96.used && ($L96.x - o.pl.x) ** 2 + ($L96.y - o.pl.y) ** 2 < 2500)) {
   146|       let $L97 = Pt.find($L98 => $L98.k === $L96.type);
   147|       ja($L96.x, $L96.y - 28, $L97.n + " · " + $L97.d);
```

### `mm`（NEW `dv`）— 1 个冲突块

#### 1/1 · B(OLD) 行 91-91 · O(ours) 行 91-107 · T(NEW) 行 92-92

**B — base（OLD 基础原实现）**，`-` = 落在改动块里的行

```js
    89|     c: "#9a60ff",
    90|     i: 0.8
-   91|   }), $L15.kind === "device" && o.LIGHTS.push({
    92|     env: 1,
    93|     x: $L15.x,
```

**O — ours（我们的改版，保留方）**，`+` = 我们的改动行

```js
    89|     c: "#9a60ff",
    90|     i: 0.8
+   91|   }), $L15.kind === "abyss" && (o.LIGHTS.push({
+   92|     env: 1,
+   93|     x: $L15.x,
+   94|     y: $L15.y,
+   95|     r: $L15.st === "sealed" || $L15.st === "done" ? 50 : 110,
+   96|     c: "#2ee6a8",
+   97|     i: 0.85
+   98|   }), $L15.fissures.forEach($L31 => {
+   99|     !$L31.closed && o.LIGHTS.push({
+  100|       env: 1,
+  101|       x: $L31.x,
+  102|       y: $L31.y,
+  103|       r: 44,
+  104|       c: "#2ee6a8",
+  105|       i: 0.55
+  106|     });
+  107|   })), $L15.kind === "device" && o.LIGHTS.push({
   108|     env: 1,
   109|     x: $L15.x,
```

**T — theirs（新基础新版）**，`+` = 新基础的改动行

```js
    90|     c: "#9a60ff",
    91|     i: 0.8
+   92|   }), ($L15.kind === "tgate" || $L15.kind === "texit") && o.LIGHTS.push(J2($L15)), $L15.kind === "stele" && o.LIGHTS.push(nv($L15)), $L15.kind === "device" && o.LIGHTS.push({
    93|     env: 1,
    94|     x: $L15.x,
```

