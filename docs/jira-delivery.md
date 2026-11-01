# Jira 交付锚点与工作流规范

> 工程：余烬裂隙 PoE2 内容扩展包 · v19 迁移与二次开发
> Jira 项目键：`EMB`（若你实际使用其他项目键，全仓库替换即可）
> 本文件是交付纪律的**唯一事实来源**。任何分支名、提交信息、PR 描述都必须能在这里找到依据。

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

## 四、追溯债登记（2026-11-01 现状）

**事实**：`6f6d648 feat(wiki): 基于官方 wiki 构建异界扩展版，并补齐本地开发环境` 一个提交同时包含了 EMB-101 ~ EMB-104 四个工单的全部内容（15 个文件、+4897 行），且已推送至 `origin/main`。

这是本规范的**首个追溯债**，不做粉饰：

- 该提交无法单独回滚任意一个工单的改动（例如只想撤掉 wiki 构建，必须手工挑文件）
- 提交信息不含工单锚点，评审者无法从提交主题判断变更范围
- 4.4MB 快照与 4.6MB 产物已进入公共仓库历史，后续若要移除只能重写历史

### 处置路径（二选一，需明确拍板）

| 方案 | 做法 | 代价 | 适用 |
|------|------|------|------|
| **A. 保留 + 回填锚点** | 不动历史，在 EMB-101~104 工单中互相引用 `6f6d648`，标注"内容已随该提交交付" | 追溯链上留一个四合一提交，未来回滚粒度粗 | 单人维护、仓库无他人 fork |
| **B. 重写历史拆分** | 在 `main` 上交互式 rebase 把 `6f6d648` 拆成 4 个锚点提交，`--force-with-lease` 推送 | 需要 force push 公共仓库；他人已 clone 会冲突 | 只有你一人使用该仓库 |

**EMB-105 起，本文件是唯一事实来源，两个方案都不影响其后的执行。**

### 工单与文件对照（用于 A 方案回填，或 B 方案拆分）

| 工单 | 标题 | 覆盖文件 |
|------|------|---------|
| **EMB-101** | 工程可移植性：清理工具链硬编码绝对路径 | `tools/_review_probe.cjs`、`tools/_review_repro.mjs`、`tools/verify_map.mjs`、`tools/jstools/package.json`、`tools/jstools/package-lock.json` |
| **EMB-102** | 本地开发体验：npm 脚本 + 零依赖预览服务器 + 使用文档 | `package.json`、`tools/dev-server.mjs`、`README.md`、`docs/本地使用与二次开发.md` |
| **EMB-103** | Wiki 异界扩展版构建管线 | `base/wiki-online.html`、`tools/build-wiki.mjs`、`tools/wiki-exp-plugin.js` |
| **EMB-104** | Wiki 产物校验与构建报告 | `tools/verify-wiki.mjs`、`reports/wiki-build-report.json`、`build/wiki-异界版-v2.2.0.html` |
| **EMB-105** | 交付门禁：提交/分支校验钩子与 PR 模板 | `.github/pull_request_template.md`、`tools/hooks/*`、`docs/jira-delivery.md`、`docs/jira-tickets-import.csv` |

**依赖关系**：EMB-101 → EMB-102（脚本入口依赖路径可移植）；EMB-103 → EMB-104（校验对象是构建产物）；EMB-101~104 **已完成交付**（见上方追溯债）。EMB-105 为当前唯一在途工单。

> ⚠️ `base/wiki-online.html`（4.4MB）与 `build/wiki-异界版-v2.2.0.html`（4.6MB）已随 `6f6d648` 进入公共仓库历史。若后续决定改为 CI 重建 + Release 附件，需配套一次历史清理（`git filter-repo`），不能只 `git rm`——后者删不掉历史 blob。此项挂 EMB-104 跟进。

---

## 五、若处置路径选 B：拆分 `6f6d648` 的操作序列

> 仅在仓库确无他人 clone 时执行。执行前先 `git fetch` 并用 `git push --force-with-lease`，不要用 `--force`。

```bash
git switch main
git pull --ff-only

# 用 soft reset 把 6f6d648 拆回工作区，再按工单分批提交
git reset --soft 214b9f7
git restore --staged .

# 1. EMB-101
git add tools/_review_probe.cjs tools/_review_repro.mjs tools/verify_map.mjs \
        tools/jstools/package.json tools/jstools/package-lock.json
git commit -m "🐛 EMB-101: replace hardcoded absolute tool paths"
npm run check

# 2. EMB-102
git add package.json tools/dev-server.mjs README.md "docs/本地使用与二次开发.md"
git commit -m "🔧 EMB-102: add npm scripts, dev server and dev guide"
npm run check

# 3. EMB-103
git add base/wiki-online.html tools/build-wiki.mjs tools/wiki-exp-plugin.js
git commit -m "✨ EMB-103: add wiki expansion build pipeline"

# 4. EMB-104
git add tools/verify-wiki.mjs reports/wiki-build-report.json "build/wiki-异界版-v2.2.0.html"
git commit -m "🧪 EMB-104: verify wiki artifact and record build report"

npm run verify && node tools/verify-wiki.mjs "build/wiki-异界版-v2.2.0.html"
git push --force-with-lease origin main
```

拆分后必须重跑全量门禁再推：

```bash
npm run verify                                                  # check + test + smoke
node tools/verify-wiki.mjs "build/wiki-异界版-v2.2.0.html"
```

---

## 六、PR 要求

- 标题：`<gitmoji> EMB-101: 一句话说明`（与提交信息同格式，CI 会校验，不合规直接卡住）
- 描述：使用 `.github/pull_request_template.md`，**必须**含工单链接、测试证据、回滚方式；CI 会检查描述中是否出现 `EMB-<编号>` 与"回滚"字样
- 合并：`main` 只接受 PR，不接受直接 push
- 合并后：回到工单更新状态与验证结论，不要在 PR 里留"待验证"

---

## 七、发布与追溯

| 版本 | 时间 | 工单范围 | 产物 |
|------|------|---------|------|
| v2.2.0 | 2026-11-01 | EMB-101 ~ EMB-104 | `build/余烬裂隙-异界内容扩展-v2.2.0-v19.html`、`build/wiki-异界版-v2.2.0.html` |

发版时打 tag `v2.2.0`，tag message 引用本表。目标是：**任意一个产物文件，能在 10 分钟内反查到「哪个工单、哪次提交、跑了哪些验证」**。

---

## 八、下次官方升版（v19 → v20）如何挂工单

1. 建 epic：`EMB-200 迁移至官方 v20 基底`
2. 每个阶段一个子任务：符号重映射 / 移植块重写 / 构建 / 回归验证 / 修改器同步 / Wiki 同步
3. 每阶段单独分支 + 单独 PR，禁止"一个大 PR 搞定升版"
4. 回归验证（397 条断言）结果写入子任务评论，作为可审计证据
