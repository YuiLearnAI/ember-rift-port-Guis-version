# Jira 交付锚点与工作流规范

> 工程：余烬裂隙 PoE2 内容扩展包 · v19 迁移与二次开发
> Jira 项目键：`EMB`（若你实际使用其他项目键，全仓库替换即可）
> 本文件是交付纪律的**唯一事实来源**。任何分支名、提交信息、PR 描述都必须能在这里找到依据。
> 刚接手？先读根目录 [`AGENTS.md`](../AGENTS.md)——那是一页纸入口，会把你带回这里。

---

## 一、门禁（铁律）

1. **没有 Jira 工单 ID，不产出分支名 / 提交信息 / PR。** 缺工单时先问，不猜、不编、不"先写个大概"。
2. **工单 ID 原样使用**，不自行标准化（`EMB-101` 不写成 `EMB101` 或 `EMB-0101`）。
3. 分支名、提交信息、PR 文本中**禁止**出现密钥、令牌、客户数据、内网地址。
4. 涉及认证、密钥、发布产物的变更，PR 必须写明风险与回滚方式。
5. **不虚报验证状态**：只写真正跑过的门禁，写清楚在哪个环境跑的。

---

## 二、分支策略（适配本仓库的单干线模型）

本仓库只有 `main` 一条长期分支，**不引入 develop**——单人/小团队维护，双干线只会制造合并噪音。这是对通用规范的**有意裁剪**，理由记录在此，便于后续团队扩张时复议。

| 分支 | 来源 | 去向 | 用途 |
|------|------|------|------|
| `main` | — | — | 生产就绪基线，对应已发布的 `build/` 产物。**不直接提交** |
| `feature/EMB-101-<slug>` | `main` | `main`（PR） | 新增能力、工具链改造 |
| `bugfix/EMB-102-<slug>` | `main` | `main`（PR） | 非生产关键缺陷修复 |
| `hotfix/EMB-103-<slug>` | `main` | `main`（PR + tag） | 发布版产物损坏等紧急修复 |
| `release/vX.Y.Z` | `main` | `main`（PR + tag） | 出包冻结、跑全量门禁 |

- `slug` 一律小写字母、数字、连字符，2–5 个词，描述变更而非路径。
- 例：`feature/EMB-103-wiki-exp-build`、`bugfix/EMB-101-relative-paths`。

---

## 三、提交规范

单行格式：

```
<gitmoji> EMB-<编号>: <简短描述>
```

| 变更性质 | gitmoji | 示例 |
|---------|---------|------|
| 新功能 | ✨ | `✨ EMB-103: add wiki expansion build pipeline` |
| 修 Bug | 🐛 | `🐛 EMB-101: fix hardcoded absolute tool paths` |
| 重构 | ♻️ | `♻️ EMB-102: extract dev server into standalone tool` |
| 文档 | 📚 | `📚 EMB-102: document local dev workflow` |
| 测试 | 🧪 | `🧪 EMB-104: add wiki artifact assertions` |
| 配置/工程 | 🔧 | `🔧 EMB-102: add npm script entrypoints` |
| 依赖 | 📦 | `📦 EMB-101: pin acorn 8.19.0 in jstools` |
| 样式/产物 | 💄 | `💄 EMB-104: rebuild release artifact` |

提交必须**原子化**：一个提交只回答一个问题。混合范围（比如"顺手改了 README"）要拆开。

---

## 四、追溯债登记（已解决 · 2026-11-01）

### 债是什么

`6f6d648 feat(wiki): 基于官方 wiki 构建异界扩展版，并补齐本地开发环境` 一个提交同时包含了 EMB-101 ~ EMB-104 四个工单的全部内容（15 个文件、+4897 行），且已推送至 `origin/main`。

后果：该提交无法单独回滚任意一个工单；提交信息不含工单锚点；4.4MB 快照与 4.6MB 产物进入公共历史。

### 处置结果：按路径 B 已执行完毕

| 项 | 值 |
|---|---|
| 处置方式 | **B. 重写历史拆分**（`--force-with-lease`） |
| 改写前 | `f4a41d4`（merge）→ `e9bdcb4` → `6f6d648`（四合一）→ `214b9f7` |
| 改写后 | `7042423` → `6cf68ec` → `b2ac052` → `8ed4db3` → `7c5b7cc` → `214b9f7`（五个按工单拆分的线性提交） |
| 内容是否改变 | **否**。改写前后 tree 哈希均为 `ce99bcb79aa32f769953fcd7b2d1502c19e41e34`，逐字节一致 |
| 备份 | 标签 `backup/pre-history-split-20261101` → `f4a41d4`（本地与远端都有） |
| 验证 | 五个提交的 subject 全部匹配提交正则；每提交文件集合仅含本工单；`npm run verify` 与 `verify-wiki` 全绿后推送 |

**恢复命令**（万一需要回退整个改写）：

```bash
git reset --hard backup/pre-history-split-20261101
git push --force-with-lease origin main   # 需先临时摘除分支保护，见第七节
```

### 工单与文件对照（历史参考）

| 工单 | 标题 | 覆盖文件 | 落地提交 |
|------|------|---------|---------|
| **EMB-101** | 工程可移植性：清理工具链硬编码绝对路径 | `tools/_review_probe.cjs`、`tools/_review_repro.mjs`、`tools/verify_map.mjs`、`tools/jstools/package.json`、`tools/jstools/package-lock.json` | `7c5b7cc` |
| **EMB-102** | 本地开发体验：npm 脚本 + 零依赖预览服务器 + 使用文档 | `package.json`、`tools/dev-server.mjs`、`README.md`、`docs/本地使用与二次开发.md` | `8ed4db3` |
| **EMB-103** | Wiki 异界扩展版构建管线 | `base/wiki-online.html`、`tools/build-wiki.mjs`、`tools/wiki-exp-plugin.js` | `b2ac052` |
| **EMB-104** | Wiki 产物校验与构建报告 | `tools/verify-wiki.mjs`、`reports/wiki-build-report.json`、`build/wiki-异界版-v2.2.0.html` | `6cf68ec` |
| **EMB-105** | 交付门禁：提交/分支校验钩子 + CI + PR 模板 | `.github/**`、`docs/jira-delivery.md`、`docs/jira-tickets-import.csv`、`tools/hooks/*` | `7042423` |

> ⚠️ 遗留未闭环：`base/wiki-online.html`（4.4MB）与 `build/wiki-异界版-v2.2.0.html`（4.6MB）仍在 Git 历史中。移出需 `git filter-repo`，仅 `git rm` 无效。**已开 EMB-106 跟进**。

---

## 五、历史拆分执行记录（已完成，保留供下次参考）

> 已执行完毕，不要重复执行。下次遇到同类"多工单压一个提交"的情况可复用此流程。

执行要点：

1. 先打备份标签并推到远端（`backup/pre-*`），别只留在本地
2. 从目标提交的**父提交**拉临时分支，用 `git restore --source=<坏提交> --worktree --staged -- .` 把树铺回工作区
3. 按工单分组 `git add` + 逐个提交（机械性重写期间用 `git -c core.hooksPath=/dev/null commit` 绕过本地钩子，**但事后必须用正则逐个复核 subject**）
4. `git rev-parse <旧>^{tree}` 与 `git rev-parse HEAD^{tree}` **必须相等**，不等就是内容被改了，立刻停下
5. 把其后基于旧历史的提交 `cherry-pick` 到新历史上
6. 全量门禁跑绿后再 `git branch -f main <新分支>` + `git push --force-with-lease`
7. 保护规则存在时需先 `DELETE /branches/main/protection`，推完立即重建

### 本次实际执行的命令（2026-11-01）

```bash
# 0. 备份（关键：先备份再动刀）
git tag -a backup/pre-history-split-20261101 -m "改写历史前备份" f4a41d4
git push origin backup/pre-history-split-20261101

# 1. 从坏提交的父提交开临时分支，铺回坏提交的树
git switch -c rebuild/split-history 214b9f7
git restore --source=6f6d648 --worktree --staged -- .
git restore --staged .

# 2. 按工单逐个提交（-c core.hooksPath=/dev/null 临时绕过本地钩子）
git add tools/_review_probe.cjs tools/_review_repro.mjs tools/verify_map.mjs \
        tools/jstools/package.json tools/jstools/package-lock.json
git -c core.hooksPath=/dev/null commit -m "🐛 EMB-101: replace hardcoded absolute tool paths"

git add package.json tools/dev-server.mjs README.md "docs/本地使用与二次开发.md"
git -c core.hooksPath=/dev/null commit -m "🔧 EMB-102: add npm scripts, dev server and dev guide"

git add base/wiki-online.html tools/build-wiki.mjs tools/wiki-exp-plugin.js
git -c core.hooksPath=/dev/null commit -m "✨ EMB-103: add wiki expansion build pipeline"

git add tools/verify-wiki.mjs reports/wiki-build-report.json "build/wiki-异界版-v2.2.0.html"
git -c core.hooksPath=/dev/null commit -m "🧪 EMB-104: verify wiki artifact and record build report"

# 3. 内容必须零变化（tree 哈希相等才算过）
git rev-parse 6f6d648^{tree}   # ce99bcb79aa32f769953fcd7b2d1502c19e41e34
git rev-parse HEAD^{tree}      # 必须相同

# 4. 把其后的 EMB-105 提交接上来，再验一次与合并前等价
git cherry-pick e9bdcb4
git diff f4a41d4 HEAD --stat   # 必须为空

# 5. 门禁绿后改写远端
npm run verify && node tools/verify-wiki.mjs "build/wiki-异界版-v2.2.0.html"
git branch -f main rebuild/split-history
git push --force-with-lease origin main
```


---

## 六、PR 要求

- 标题：`<gitmoji> EMB-101: 一句话说明`（与提交信息同格式，CI 会校验，不合规直接卡住）
- 描述：使用 `.github/pull_request_template.md`，**必须**含工单链接、测试证据、回滚方式；CI 会检查描述中是否出现 `EMB-<编号>` 与"回滚"字样
- 合并：`main` 只接受 PR，不接受直接 push
- 合并后：回到工单更新状态与验证结论，不要在 PR 里留"待验证"

---

## 七、分支保护与门禁现状（2026-11-01 启用）

`main` 的服务端规则已开启，**对管理员同样生效**（`enforce_admins: true`），本地钩子被 `--no-verify` 绕过也拦得住。

| 规则 | 状态 | 说明 |
|------|------|------|
| 必须走 PR | ✅ | 直推返回 `protected branch hook declined` |
| 必须通过检查 | ✅ 2 项 | `分支与 PR 标题合规`、`三层门禁（语法 / 玩法回归 / 发布版冒烟）`，且要求分支为最新（strict） |
| 强制线性历史 | ✅ | 禁止 merge commit → **合并请用 `Rebase and merge`**，别用 `Create a merge commit` |
| 禁止强推 | ✅ | 含管理员 |
| 禁止删除分支 | ✅ | — |
| 强制管理员遵守 | ✅ | `enforce_admins: true` |
| 需要审批 | ❌ 0 人 | 单人仓库，自己开 PR 自己合，不设审批门槛 |

### 紧急情况下临时摘除保护

这是**唯一**需要关保护的操作类型（还有 EMB-106 那种历史清理）：

```bash
# 1. 摘除
gh api -X DELETE repos/YuiLearnAI/ember-rift-port-Guis-version/branches/main/protection

# 2. 做完必须立刻按原样重建（否则门禁形同虚设）
gh api -X PUT repos/YuiLearnAI/ember-rift-port-Guis-version/branches/main/protection \
  --input tools/protection.json
```

> 重建用的 JSON 建议纳入版本库（如 `tools/protection.json`），避免凭记忆手拼漏项。

---

## 八、发布与追溯

| 版本 | 基底 | 时间 | 工单范围 | 产物 |
|------|------|------|---------|------|
| v2.2.0 | v19.1 | 2026-11-01 | EMB-101 ~ EMB-104 | `build/余烬裂隙-异界内容扩展-v2.2.0-v19.html`、`build/wiki-异界版-v2.2.0.html` |
| v2.3.0 | v19.2 踏麟 · 真言 | 2026-11-01 | EMB-110、EMB-111 | `build/余烬裂隙-异界内容扩展-v2.3.0-v19.html`、`build/wiki-异界版-v2.3.0.html` |
| v2.3.1 | v19.2 踏麟 · 真言 | 2026-11-01 | EMB-112、EMB-113、EMB-114 | `build/余烬裂隙-异界内容扩展-v2.3.1-v19.html`、`build/wiki-异界版-v2.3.1.html` |

> 版本号规则：**基底升级必换版本号**。同一版本号对应同一个官方基底，否则 `tools/assets.json` 的 sha256
> 无法同时描述两套产物，Release 归档也会互相覆盖。
>
> 补丁位同理：**产物字节一变就得换版本号**（哪怕基底没动）。v2.3.1 就是 EMB-113 修复带来的补丁位，
> 目的是让「文件名 ↔ 哈希 ↔ 工单」始终一一对应；沿用旧版本号会让同一个文件名在不同 Release 里对应两份不同内容。

发版时打 tag `v2.2.0`，tag message 引用本表。目标是：**任意一个产物文件，能在 10 分钟内反查到「哪个工单、哪次提交、跑了哪些验证」**。

---

## 九、下次官方升版（v19 → v20）如何挂工单

1. 建 epic：`EMB-200 迁移至官方 v20 基底`
2. 每个阶段一个子任务：符号重映射 / 移植块重写 / 构建 / 回归验证 / 修改器同步 / Wiki 同步
3. 每阶段单独分支 + 单独 PR，禁止"一个大 PR 搞定升版"
4. 回归验证（397 条断言）结果写入子任务评论，作为可审计证据

---

## 十、大文件资产：不进版本库（EMB-106 · 2026-11-01 起生效）

### 规则

Git 里只放**源码与可审阅文本**。任何 1MB 以上的 HTML（上游快照、构建产物、历史发行版）一律走 GitHub Release，
由 `tools/assets.json` 登记，`npm run assets:pull` 取回并校验 sha256。

```bash
npm run assets:pull     # 取回缺失项
npm run assets:check    # 只体检不下载（缺文件时退出码 1）
npm run assets:pull -- --only wiki      # 只处理路径含 wiki 的条目
npm run assets:pull -- --force          # 哈希不符时强制覆盖（本地改动会被丢弃）
```

当前外置清单（Release `assets-v2.3.1`）：

| 落地路径 | 性质 | 是否可复现 |
|---|---|---|
| `base/v19-online.html` | 上游快照 v19.2（构建输入） | 否，必须保全 |
| `base/wiki-online.html` | 上游快照 v19.2（Wiki 输入） | 否，必须保全 |
| `cheat/cheat/wiki.html` | 与上一行同内容的副本 | 否，必须保全 |
| `build/test-v19.html` | 构建产物 | ✅ `npm run build` |
| `build/余烬裂隙-异界内容扩展-v2.3.1-v19.html` | 构建产物 | ✅ `npm run build` |
| `build/wiki-异界版-v2.3.1.html` | 构建产物 | ✅ `npm run wiki`（固定 `EMB_BUILD_AT` 后字节一致） |
| `pack/**/余烬裂隙-异界内容扩展-v2.1.0.html` | 历史发行版归档 | 否，仅留档 |

当前 Release 标签：`assets-v2.3.1`。上一版 `assets-v2.3.0`、`assets-v2.2.0` 全部保留，**不要删**——
它们是回滚 v2.3.0 / v2.2.0 的唯一来源。

> 换 tag 时新 Release 必须**整套上传**（3 个上游快照 + 全部产物）：`fetch-assets.mjs` 只认 `assets.json`
> 里那一个 `tag`，不会跨 Release 找文件。新克隆只有从这一个 tag 能取回全部 7 项。

**不可复现的三个上游快照必须保全**：删了 Release 就真没了，这是本仓库唯一的单点。

### 为什么不能只 `git rm`

`git rm` 只影响新的 tree，历史 blob 仍在 pack 里，`.git` 不会变小，clone 依旧慢。必须重写历史。
本次执行的实测收益：

| 指标 | 治理前 | 治理后 |
|---|---|---|
| `.git` 体积 | 13 MB | 3.3 MB |
| 最大已跟踪文件 | 4.4 MB | 3.7 MB（`game.html`，测试夹具，不可删） |
| 提交数 | 7 | 7（一一对应，信息未变） |

### 可复现性验证（这是本方案成立的前提）

产物能重建，外置才不丢东西。实测：

```
npm run build  → test-v19.html        sha256 5c60b079…（与 Release 资产一致）
npm run build  → 发布版 v2.3.1 产物     sha256 3bf68684…（与 Release 资产一致）
npm run wiki   → wiki-异界版.html      见下方「构建时间」说明
```

`build-wiki.mjs` 会把构建时间写进产物，是唯一的不可复现来源。固定它即可字节一致：

```bash
EMB_BUILD_AT=2026-11-01T09:20:00.000Z node tools/build-wiki.mjs
# → build/wiki-异界版-v2.3.1.html sha256 cefa2e65…（与 Release 归档完全一致）
```

实测（v2.3.1）：同一 `EMB_BUILD_AT` 连跑两遍 `build` + `wiki`，三份产物哈希逐字节一致。

> 副作用提醒：`npm run wiki` 不带 `EMB_BUILD_AT` 时产物哈希会变。这是**预期行为**，
> `npm run assets:check` 会因此报 MISMATCH，用 `--force` 覆盖或删掉本地产物重新 pull 即可，不是数据损坏。

### 改这些文件时的流程

1. 内容变更 → 在同一 PR 里更新 `tools/assets.json` 的 `sha256`
2. 打新 Release（tag 递增，如 `assets-v2.2.1`），同步改 `assets.json` 的 `tag`
3. **绝不允许**为了让 CI 通过而把大文件 `git add -f` 回去

### 历史改写记录

- 备份：`backup-ember-pre-filter-20261101.bundle`（8.5 MB，`git bundle verify` 通过，含改写前完整历史）
- 旧备份标签 `backup/pre-history-split-20261101` 已删除——它指向改写前提交，会把旧 blob 重新钉在远端
- 恢复某个旧版本的命令：`git clone backup-ember-pre-filter-20261101.bundle recovered`
- 本次改写使全部 commit hash 变化（`8f20733…` → `f1a4acc…`），旧 clone 必须重新克隆


---

## 十一、基底一致性审计：三道门（EMB-112 · 2026-11-01 起生效）

### 为什么需要

本工程的产物 = **官方基底 + 白名单补丁 + 扩展注入**。产品承诺是「官方内容全量保留，
扩展只做追加」。但扩展块与宿主共享同一个作用域，可以赋值覆盖宿主函数——
2026-11-01 的 EMB-112 就是扩展用 `kind === "jewel"` 宽判据接管了宿主的珠宝图标 /
格子 / tooltip，把官方 v19.2 新增的三件传奇珠宝整类吃掉：图标空白、稀有度边框丢失、
悬浮只显示扩展包的通用说明。官方原版显示正常。

**教训：文本没改 ≠ 行为没被覆盖。** 光靠人眼 review 挡不住，必须有机器闸门。

### 三道门

| 命令 | 检查什么 | 失败含义 |
|---|---|---|
| `npm run audit:parity` | 剥掉扩展注入（移植块 / HOTFIX / mods / CSS）+ 施加白名单补丁后，与 `base/v19-online.html` **逐字节**比对 | 基底文本被动过：要么有没登记的白名单补丁，要么注入区段边界算错 |
| `npm run audit:runtime` | 同一段探针分别注入官方基底与产物，在 jsdom 里各跑一次，比对 10 张核心数据表的键集合与逐键内容 | 官方数据被扩展改写或删除（新增键、仅掉落权重 `w` 变化属允许项） |
| `npm run verify:jewel` | 三件官方传奇珠宝 + 一件扩展珠宝，28 条断言：tooltip 文案 / 转换表 / 风味文字 / `jwc`、`r3` 样式类 / 图标非空 | 珠宝渲染判据又放宽了，官方珠宝再次被吞 |

三道门全部并入 `npm run verify`。

### 画布排版门（EMB-113 起）

| 命令 | 检查什么 | 失败含义 |
|---|---|---|
| `npm run verify:atlas` | 真跑产物，在 5 组缩放/平移下取出天赋树每个节点名的最终矩形，断言「标签之间 / 标签与 HUD / 标签与节点圆」重叠面积恒为 0，且都在画布内 | 标签排版退化：候选位被减到只剩「正上方」时该测试立刻 23/32 失败（已做红绿对照） |

### 修改器门（EMB-113 起）

| 命令 | 检查什么 | 失败含义 |
|---|---|---|
| `npm run cheat:test` | `cheat:review`（静态审查：未核对导出键 / 无参 updPlayer / XSS / 存档键）+ `cheat:smoke`（161 条逻辑断言，含「panel.css 与脚本一致」）+ `cheat:ui`（jsdom 里真点面板，69 条界面断言） | 修改器改坏了，或面板 CSS 与 `docs/design/panel.css` 漂移（动 CSS 后必须跑 `node cheat/cheat/scripts/extract-css.js`） |

### 白名单补丁

`audit:parity` 认可的补丁只有 `tools/audit-parity.mjs` 顶部 `PATCHES` 里登记的十条
（抗性上限 75→85 四处、宝石等级 20→30 两处、四个防崩 guard）。**新增补丁必须同时改
`build-v19.mjs` 与 `audit-parity.mjs` 两处**，否则审计立刻报不一致——这是有意的摩擦。

### 接管清单（只报不判）

```bash
npm run audit:hijack
```

用 AST + 作用域分析列出扩展块对宿主符号的全部写入（当前 91 个符号），区分
「function 包装」「非函数替换」「属性赋值」「数组原地修改」。它不返回失败码，
用途是**官方升版后复审**：数字或名单变化时，逐条确认新出现的接管点是否只做加法。

### 官方升版后的必做动作

1. `npm run audit:parity` 必须仍为「逐字节一致」，否则先补 `PATCHES` 或修注入边界
2. `npm run audit:runtime` 必须仍为「改写 0 · 丢失 0」；掉落权重调整若变化，更新说明
3. `npm run audit:hijack` 与上一版清单对比，新接管点逐条复审
4. `npm run verify:jewel` 必须 ALL PASS——官方若在升版里新增珠宝类型，这条会先炸
