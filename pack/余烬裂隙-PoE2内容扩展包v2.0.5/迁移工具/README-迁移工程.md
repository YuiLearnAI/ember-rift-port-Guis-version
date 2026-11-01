# 迁移工程规格书（余烬裂隙 v1.04 → 新基础 v0.4/18.0.1）

> 所有参与者先读这份文档。路径、约定、接口、验收标准都在这里。**只写自己 write scope 内的文件。**

## 1. 目标

把 `余烬裂隙 v1.04`（直接改源代码实现的全部玩法）迁移到新基础
「憨憨问号 v0.4 / 18.0.1」，产出可运行、通过语法检查与 jsdom 引导测试的新开发版。

## 2. 三个源文件（只读，禁止修改）

| 代号 | 路径 | 说明 |
|---|---|---|
| **OLD** 基础 | `D:\xyx\余烬裂隙-PoE2内容扩展包v1.0.4\基础版本\旧魔改基础版\【魔改】基于憨憨问号魔改的魔改，低卡，技能特效音效重置，提供地图强度设置，无尽模式.html` | v1.04 的父本，48,925 行 |
| **CUR** 现版 | `D:\xyx\余烬裂隙-PoE2内容扩展包v1.0.4\余烬裂隙-异界内容扩展.html` | OLD + 我们的改动，53,605 行 |
| **NEW** 新基础 | `D:\xyx\余烬裂隙-PoE2内容扩展包v1.0.4\基础版本\憨憨问号v0.4-18.0.1\[改版]余烬裂隙 憨憨问号 v0.4更好的体验18.0.1.html` | 迁移目标底座，67,074 行 |

已提取的主 JS（最大 inline `<script>` 块，后续分析都用它）：

- `D:\xyx\.dsh-work\port\out\old.js` — 2,833,034 chars / 43,899 行
- `D:\xyx\.dsh-work\port\out\cur.js` — 2,985,382 chars / 48,228 行
- `D:\xyx\.dsh-work\port\out\new.js` — 1,981,317 chars / 57,138 行

HTML 结构：OLD/NEW 各只有 1 个 inline script（主 IIFE，`(() => { ... })();`）；
CUR 有 2 个 inline（第 0 个 17 chars 是热修占位，第 1 个是主 IIFE）。

## 3. 关键事实（已验证，别重复验证）

1. **OLD → CUR 是我们的全部改动**：行级比对得 106 个差异段，删除 203 行、新增 4,883 行；两者 99.8% 行相同。
2. **NEW 是同一源码谱系的重新压缩构建**：内部变量/函数名是一整套不同的乱码名（OLD 的 `Ee/hn/Tt/ue/Qv/fe/ki/Vs/qv/Ro/We/Se/ka/Fc/Ay/ui/ih/Kl/Mt/pt/Hs` 在 NEW 里都不存在），游戏状态对象 OLD 叫 `o`，NEW 叫 `n`。
3. **属性名未被混淆**：`o.Z`、`o.objs`、`e.mods`、`.x/.y` 这类成员名两版一致，只有**变量/函数标识符**不同。字符串字面量、数值、CSS、数据表键名都保留 —— 这是符号匹配的主要指纹。
4. OLD↔NEW 行级锚点比对：49.7% 的 OLD 行能在 NEW 里找到 ≥6 行的连续同文块（1244 块）。说明代码结构可对齐，但有大量重排和新增。
5. NEW 自带 38 项新玩法（背包 200、通货 UI 分类换行、DPS 面板、技能搜索、一键点金、视野 1.5 倍、Alt 锁物品、整理背包等），部分与我们改动过的区域重叠 → 一定会产生合并冲突，需按语义处理。

## 4. 迁移架构（2026-10-26 修订：改为"末尾移植块"）

**发现**：NEW 基础本身就带插件机制 —— 主 IIFE 末尾有插件数组、`window.__rift` 代理、`for (let e of g6) e.init && e.init();`，
朋友的 v0.4 新功能（DPS 面板、宝石搜索、一键点金、背包整理…）全部是"末尾追加的 IIFE 块"。
用户的朋友当初的原话也是「必须用一整段代码实现…最后加在源代码结尾就能生效」。

**决议**：
- 我们的全部玩法做成**一个追加在主 IIFE 末尾（`})();` 之前）的移植块**，块内直接使用 NEW 的标识符（靠符号表翻译，不用别名层）。
- 这样：① 不需要在 NEW 里找 100+ 个落点；② 天然抗下一次基础更新；③ 与基础自身的风格一致。
- 每个功能在块里占独立小节，可并行开发；最后由 build 合并成一个块插入 HTML。
- 块内**不允许**出现与 NEW 顶层同名的声明（会覆盖基础实现）—— 由 `tools/blocklint` 拦截。

块的结构（顺序固定）：

```
1) 兼容常量/数据表增量   Object.assign(P, {...}); 追加暗金；追加词缀池；i18n 增量
2) 我们的新函数体         Abyss*/Del*/Om*/Ds*/Ex*/Rit*/Atlas* …（由 rewrite 工具翻译）
3) 包装/劫持              把 NEW 的 hook 函数解包后重新赋值：
                          var _kill = <newKill>; <newKill> = function(){ ...我们的钩子...; return _kill.apply(this, arguments) };
4) 场景对象补齐           藏身处：灵魂之井等 o.objs.push({kind:"well",...})
5) 初始化与重绘           x1(); Cx(); qv(); Vs(); 等
6) CSS 注入              <style> 追加我们那 ~350 行样式
```

## 4.1 旧方案（保留备查）

- ~~直接改 NEW 的源代码，用 patch module（§5）+ build.py 应用~~。仍保留 build.py 作为最终"把块插进 HTML"的工具，patch module 机制保留给 CSS/HTML 局部小改。

## 4.2 我们代码依赖的 API 面（已量化）

- 我们新增的 4,529 行 JS 里，自由引用共 128 个；其中 **76 个是 OLD 的 IIFE 顶层名**（需映射到 NEW），
  52 个是我们自己定义的（AbyssMake/OmTake/…）或 JS 内建（Math/Object/document/window/…）。
- 清单：`D:\xyx\.dsh-work\port\out\api_need.md`
- 另外还需要约 20~30 个"要包装的基础函数"（刷怪、击杀、掉落、地图生成、UI 渲染、藏身处构建…）的 NEW 名。

## 5. Patch module 格式

每个功能/片段一个文件：`D:\xyx\.dsh-work\port\patches\<NN>_<name>.json`

```json
{
  "id": "05_abyss_hooks",
  "feature": "abyss",
  "note": "把 AbyssOnKill 植入击杀处理",
  "ops": [
    {
      "type": "insert_after",
      "anchor": "        function QQ(e, t) {\n          o.$ = 1;",   // NEW 中唯一存在的文本（含缩进，≥1行）
      "text": "        AbyssOnKill(e);",                          // 要插入的行（不含结尾换行）
      "occ": 1                                                     // 可选：anchor 出现次数，默认要求唯一
    },
    {
      "type": "replace",
      "anchor": "<NEW 中原有文本>",
      "text": "<替换文本>"
    },
    {
      "type": "append_iife_end",     // 在主 IIFE 的 `})();` 之前追加
      "text": "..."
    }
  ]
}
```

规则：
- `anchor` 必须在 NEW 中**唯一**匹配（build.py 会报 `anchor not unique: N matches`）；不唯一就加长上下文。
- 不写 `replace` 除非确实要改 NEW 已有代码；能 `insert_after` 就别 `replace`。
- 多个 module 按文件名排序依次应用；后一个的 anchor 基于前面的结果。
- 所有 JSON 用 UTF-8 无 BOM，缩进 2 空格。

## 6. 符号映射表

`D:\xyx\.dsh-work\port\out\symbol_map.json`

```json
{ "version": 1,
  "globals": { "o": {"new": "n", "kind": "object", "evidence": "state obj keys camFocus/UID/muted/...", "confidence": "high"},
               "Ee": {"new": "X0", "kind": "function", "evidence": "string literal 'abyss'", "confidence": "high"} },
  "unresolved": ["..."] }
```
`confidence` = `high | medium | low`。**low 的名字不能用于自动改写**，必须报告。

## 7. 标识符改写规则（重要，防踩坑）

我们移植的代码是 Terser 压缩过的形态，局部变量名是 `e,t,a,s,n,r,i,l,c,d,p,m,h,x,k,g,y,v,M,S,b,E,D,j,Y...`。
NEW 的全局状态叫 `n`、玩家叫别的短名。若把我们的 `o` 直接替换成 `n`，而代码里本来有局部 `n`，就会产生**遮蔽 bug**。

因此改写必须两步（用 AST，不能正则）：
1. 对我们新增的代码片段：先做 alpha 重命名，把所有**自身声明**的绑定（var/let/const/参数/函数名/catch 参数）改成不会冲突的 `_a1/_a2/...`；
2. 再把**自由引用**按 `symbol_map.json` 翻成 NEW 名；
3. 重新生成代码（astring）。

## 8. 产出与位置

工作区根：`D:\xyx\.dsh-work\port\`

```
tools/           工具脚本（python + node）
tools/jstools/   node 依赖（acorn 8.19, astring 1.9 已装好）
out/             中间产物（提取的 js、delta、符号表…）
patches/         patch modules
build/           构建产物（build_v1.05.html 等）
```

最终产物：`D:\xyx\.dsh-work\port\build\余烬裂隙-异界内容扩展-v1.05-dev.html`

## 9. 验收（每个改动都必须过）

- 语法：`node <er-check 等价脚本> <html>` → 所有 inline script 编译通过。
  （已有：`C:\Users\33266\AppData\Local\Temp\dsh-e951uk\er-check.mjs`，可直接用）
- 引导：jsdom 加载 → 无未捕获异常 → 能进入游戏（title → 选角 → hideout → 进图）→ 跑 120 帧无报错。
- 玩法级：对应功能的断言（深渊/预兆/迷雾/祭坛…）逐项 PASS。
- 禁止：为了"能跑"而删功能、改数值、放宽断言。

## 10. 运行时环境

- node：`C:\Users\33266\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\node\bin\node.exe`（v24.21.0）
- pnpm：`<同上目录>\pnpm\bin\pnpm.mjs`（用 `node pnpm.mjs add xxx`）
- python：`C:\Users\33266\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\python\python.exe`（3.13.7）
- 旧 jsdom 环境（可直接复用）：`C:\Users\33266\AppData\Local\Temp\dsh-e951uk\er-dom`（含 node_modules/jsdom、harness.cjs 等）
- 权限：danger-full-access，无需申请审批；**不要设置 sandbox_permissions**。
