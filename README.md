# 余烬裂隙扩展包 · v19 迁移工作区

把「余烬裂隙 PoE2 内容扩展包 v2.0.5」（原底包 18.0.3）移植到 <https://ember-rift.pages.dev/> 当前线上版本（**v19.2 踏麟 · 真言**）的完整工程：符号重映射 → 移植块重写 → 构建 → 回归验证 → 修改器同步。

- **发布版**：`build/余烬裂隙-异界内容扩展-v2.3.0-v19.html`
- **改版 Wiki**：`build/wiki-异界版-v2.3.0.html`
- **核心资产**：`out/symbol_map_19to192.json`（1946 条符号映射，v19.1 → v19.2）；历史：`out/symbol_map_18to19.json`（1697 条）
- **修改器**：`cheat/cheat/ember-rift-gui.user.js`（已支持 `ember-rift.pages.dev`）

> 免责声明：本仓库为个人学习用途的同人内容与二次开发工程，与游戏官方无关。游戏本体、原始扩展包版权归各自作者所有。请勿用于商业用途；若权利人提出异议请提 issue，会立即下架相关内容。

## 目录

```
port/
├─ base/v19-online.html        官方底包快照 v19.2（构建输入，勿改）
├─ base/wiki-online.html       官方 Wiki 快照 v19.2（改版 Wiki 的基底，勿改）
├─ pack/                       原扩展包副本（含 block_new.js 历史快照）
├─ cheat/                      修改器副本
├─ build/
│   ├─ block_baseline_18.0.3.js   迁移前基线（18.0.3 符号）
│   ├─ block_v19.js               ★ v19 版移植块（唯一手改源，符号面向 v19.2）
│   ├─ expose_v19.js              测试 API 桥
│   ├─ test-v19.html              测试版（含 expose，无热修）
│   ├─ 余烬裂隙-异界内容扩展-v2.3.0-v19.html   ★ 发布版
│   └─ wiki-异界版-v2.3.0.html                  ★ 改版 Wiki（单文件）
├─ out/
│   ├─ symbol_map_19to192.json    1946 条符号映射（核心资产，v19.1→v19.2）
│   ├─ symbol_map_18to19.json     1697 条符号映射（历史，v18→v19）
│   ├─ remap_report.json          重映射统计
│   └─ build-v19-report.json      构建补丁应用/跳过清单
├─ tools/
│   ├─ remap.mjs                  符号重映射（作用域安全）
│   ├─ build-v19.mjs              构建
│   ├─ syntax.mjs                 语法门
│   ├─ harness_v19.cjs            玩法回归（399 条断言）
│   ├─ smoke-v19.cjs              发布版冒烟
│   ├─ verify_map.mjs             映射目标合法性校验
│   ├─ dev-server.mjs             本地预览服务器（零依赖）
│   ├─ build-wiki.mjs             改版 Wiki 构建（官方快照 + 扩展数据）
│   ├─ wiki-exp-plugin.js         改版 Wiki 浏览器端插件（新增页面 + 数据合并）
│   └─ verify-wiki.mjs            改版 Wiki 运行时验收（jsdom）
├─ docs/本地使用与二次开发.md      使用 + 二次开发说明
├─ package.json                   npm 脚本（build / verify / dev / cheat:*）
└─ reports/
    ├─ MIGRATION-REPORT.md        迁移报告
    ├─ HANDOFF.md                 评审交接
    └─ CODE-REVIEW.md             评审结论
```

## 大文件资产（必读）

`base/*.html`、`build/*.html`、`cheat/cheat/wiki.html` 等 4MB 级文件**不在版本库里**——它们由 GitHub Release 承载，
以控制仓库体积（详见 [docs/jira-delivery.md](docs/jira-delivery.md) 第十节）。

**干净克隆后第一步**：

```bash
npm run assets:pull    # 从 Release 取回并按 sha256 校验，缺什么补什么
```

不做这一步，`npm run build` / `npm run wiki` / `npm run dev` 的 `/base` `/wiki` 都会失败并提示同一条命令。
清单与哈希在 `tools/assets.json`。

## 常用命令

```bash
npm run assets:pull                            # 取回大文件资产（新克隆必做一次）
npm run build                                  # 出包（产物与当前提交字节级一致）
npm run verify                                 # check + test + smoke 三道门禁，必须全绿
node tools/syntax.mjs  build/test-v19.html     # 语法门
node tools/harness_v19.cjs build/test-v19.html # 玩法回归（要求 ALL PASS）
node tools/smoke-v19.cjs                       # 发布版冒烟（自动取 build/ 下最新发布版）
node tools/verify_map.mjs                      # 映射目标合法性
```

## 本地环境

### 新克隆：三步跑通

```bash
# 1) 取回大文件资产（base/build 下的 HTML，sha256 校验）
npm run assets:pull

# 2) 安装依赖（node_modules 不进版本库，必须自己装）
(cd tools && npm ci)
(cd tools/jstools && npm ci)

# 3) 出包 + 跑门禁
npm run build && npm run verify
```

> 跳过第 2 步会报 `ERR_MODULE_NOT_FOUND: .../jstools/node_modules/acorn/...`；
> 跳过第 1 步会报「缺少资产」。两条错误信息都会直接告诉你该跑哪条命令。
> `cheat/cheat/` 的 jsdom 只在跑 `npm run cheat:*` 时需要，可选：`cd cheat/cheat && npm ci`。

### 已装好依赖的本机

在仓库根目录：

```bash
npm run assets:pull  # 首次/新克隆：取回大文件资产
npm run build        # 出包（产物与当前提交字节级一致）
npm run verify       # check + test + smoke 三道门禁，必须全绿
npm run dev          # 本地预览：http://127.0.0.1:8787/  （/test 测试版，/base 官方底包，/wiki 改版 Wiki）
npm run cheat:review # 修改器静态审查
npm run cheat:smoke  # 修改器逻辑 + 界面断言
npm run wiki         # 构建「异界扩展版」Wiki 并跑运行时验收
```

完整使用与二次开发说明（怎么玩、改哪个文件、下次官方升版怎么迁、坑在哪）见
**[docs/本地使用与二次开发.md](docs/本地使用与二次开发.md)**。


## 改玩法的正确姿势

1. 只改 `build/block_v19.js`（不要改产物 HTML）
2. `node build-v19.mjs --mode both`
3. `node syntax.mjs` + `node harness_v19.cjs`，必须 ALL PASS
4. 发布版再跑一次 `smoke-v19.cjs` 确认无 __erTest 依赖

## 下次官方升版

见 `reports/MIGRATION-REPORT.md` 最后一节。
