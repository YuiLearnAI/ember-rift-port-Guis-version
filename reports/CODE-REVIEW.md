# Code Review 结论 · v19 迁移

> 评审方式：自动化校验（可复跑）+ 人工审读 + 两个专项 Agent 评审（后台运行中，结论到达后追加）。
> 所有「已确认」项都附可复现命令。

---

## 一、按严重度排序的发现

### 🔴 高｜热修注入位置错误（已修复）

**现象**：发布版里热修块被插到主脚本**之后**，而移植块在 IIFE 末尾读取 `window.HOTFIX`，此时它还不存在 → 整段热修静默失效（`if (!_v3025) return;` 直接返回），且不报错，极难察觉。

**根因**：`out.lastIndexOf("<script")` 命中的是页面底部 Cloudflare Analytics 的 `<script defer src=...>`，不是主脚本。

**证据**：
```
修复前块顺序：(31654,'MODS') (1948260,'MAIN') (6929,'HOTFIX')
修复后块顺序：(31654,'MODS') (6929,'HOTFIX') (1948260,'MAIN')
修复前：__HOTFIX_APPLIED = 2.1.0  ≠  HOTFIX.version = 2.2.0   → 未应用
修复后：__HOTFIX_APPLIED = 2.2.0  == HOTFIX.version = 2.2.0   → 已应用
```
**修复**：`tools/build-v19.mjs` 改用主脚本内容锚点定位其 `<script>` 标签。

---

### 🟠 中｜测试门禁本身有缺陷（已修复）

**现象**：`harness` 只 `eval` HTML 里**最后一个** inline 块。发布版/测试版含 mods 块在主脚本之前，于是 mods 从未执行 → `mods_*` 未注册 → 选角卡片读 `undefined.n` 抛 `TypeError`。

这正是交接文档里从 v2.03 起「发布前检查四项全绿」失效的根因，一直被当成产品 bug。

**影响面**：`boot.cjs` / `ui_tour.cjs` / `harness_port.cjs` 全部同款写法。

**修复**：按浏览器行为顺序执行全部 inline 块。修复后 `debug character flow: OK`、9 张职业卡正常。

---

### 🟠 中｜61 条 medium 置信度符号映射

1697 条映射中 high 1636 / medium 61。medium 全部来自 `ref-vote-relaxed0`（某个已匹配函数对里 2 处对齐引用一致，样本极小）。

**已做的兜底**：
- `tools/verify_map.mjs`：1697 条目标符号在 v19 顶层声明中 **0 条缺失**；
- `tools/shadow_check.mjs`：移植块顶层 382 个声明与 v19 顶层 2226 个名字 **0 重名冲突**；
- 397 条玩法断言覆盖到大部分被映射符号。

**残余风险**：低频路径上的符号若错配，表现为「某个数值/图标不对」而非崩溃，断言未必覆盖。

---

### 🟡 低｜3 条循环级加固未注入

`obj-loop` / `loot-loop` / `ent-loop` 的逐项 `try/catch` 未移植。v19 渲染管线把视野判定从 `T()` 改为 `M()`、循环边界与 18.0.3 不同，原锚点语义不存在；强行包裹需重写循环边界。

v19 自身已有 `Zs()`（能否拾取）、`zf()` 等逐项判定；本次已恢复的 3 条单点加固（背景绘制钩子、通货/底材图标兜底、怪物贴图兜底）覆盖了「吞字」的主要根因。

**残留症状**：若某对象绘制抛异常，理论上仍可能中断该帧。

---

### 🟡 低｜图谱数量断言硬编码

`all 56 old atlas keys kept` / `all.length === 57 + extra` 在 v19 必然失败——v19 官方把图谱树从 56 扩到 77，扩展包再加 21，共 99。

已改为以当前基底实测数为基线：`all.length === oldKeys.length + 1 + extra`。**这是测试期望值过时，不是玩法 bug**（数据层 77 个官方 key 全部保留）。

---

## 二、已验证无问题（附命令）

| 项 | 结论 | 复跑命令 |
|---|---|---|
| 符号映射目标合法性 | 1697 条，0 条指向不存在的符号 | `node tools/verify_map.mjs` |
| 顶层命名冲突 | block 382 vs v19 2226，0 冲突（`var` 不会覆盖底包） | `node tools/shadow_check.mjs` |
| 语法 | 测试版 2 块 + 发布版 3 块全部 OK | `node tools/syntax.mjs <html>` |
| 玩法回归 | 397 条断言 ALL PASS | `node tools/harness_v19.cjs build/test-v19.html` |
| 发布版冒烟 | eval OK / frame OK / `onerror: none` / `riftErrors: 0` / 9 职业 / `state:play` / `player:true` | `node tools/smoke-v19.cjs "build/…v2.2.0-v19.html"` |
| 发布版不依赖测试钩子 | `__erTest` 引用数 = 0 | `grep -c __erTest build/block_v19.js` |
| 渲染包装接入 | `var __portBaseVb = Ax`，v19 主循环确实调用 `Ax()` | 见 block:13807 / 14011 |
| 84 个扩展 API 挂载 | 67 已挂载；17 个 absent 均为惰性/条件创建（如 `__riftLastVbError` 仅出错时生成） | `ER_API=1 node tools/harness_v19.cjs …` |
| 修改器 API 契约 | 所需 22 个接口全部存在且类型正确（`CUR` 109 / `AFF` 51 / `BASES` 72 / `TH_MUL` 1.5） | `ER_PROBE=1 node tools/harness_v19.cjs …` |
| 修改器功能 | 面板挂载、5 tab 渲染、背包读取、`save()`→true、`updPlayer()`、`modLine()`→"物理伤害提高 30%" | `ER_CHEAT=… node tools/harness_v19.cjs …` |
| 产物 HTML 结构 | head/body/html 各 1 次闭合；3 个 `<style>` 全在 `</head>` 前 | 见报告第五章 |

---

## 三、残余风险（需真机验证，本次无法覆盖）

1. **jsdom 的 canvas 是 stub**，所有绘制代码「不报错」不等于「画对」。`getImageData` / 渐变 / `globalCompositeOperation` / 离屏 canvas 的真实行为未验证。
2. **v19 有 1000+ 函数体被重写**，符号对得上不代表语义对得上。移植块有 61 处 `X = function` 主动覆盖底包函数，若 v19 在原函数里加了新逻辑，覆盖会静默丢弃。已人工核对 `mL`（kill:loot handler）与 v19 原版一致；`Px`（图谱页渲染，v19 版比 18.0.3 长 535 字符）是**最需要真机确认**的一个。
3. 长时间刷图（30 分钟以上、高层深渊/迷雾）未做压力测试。

---

## 四、建议的验收动作

1. 真浏览器打开发布版：进游戏 → 选角 → 打 3 张 T1 地图 → 开一次深渊 → 开一次图谱页（重点看是否有排版缺失）。
2. 装修改器 v1.1 → 改一件装备词缀 → 保存 → 刷新 → 确认词缀仍在。
3. 观察控制台 `window.__riftErrors` 是否为空。
