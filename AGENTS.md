# AGENTS.md — 接手第一页

> 任何 AI 或人接手本仓库，**先读这一页**，再动手。本文件只做入口与索引，详细规则在 `docs/jira-delivery.md`。

## 这是什么

- 余烬裂隙 · Path of Exile 2 同人二创内容扩展包，基底 v19，当前版本 **2.2.0**
- 产物是**单文件离线 HTML**：无框架、无运行时依赖、断网可跑
- public 仓库。上游素材版权归原厂，仅自用，勿分发或商用

## 动手前必读

| 文件 | 作用 |
|---|---|
| `docs/jira-delivery.md` | 交付唯一事实来源：门禁 / 分支 / 提交 / PR / 分支保护 / 大文件，共十节 |
| `docs/本地使用与二次开发.md` | 本地怎么跑、怎么改、怎么升版 |

## 新克隆：三步，顺序不能乱

```bash
npm run assets:pull                                   # 1. 大文件在 Release，不在 Git
(cd tools && npm ci) && (cd tools/jstools && npm ci)   # 2. node_modules 不进版本库
npm run build && npm run verify                        # 3. 期望 ALL OK / ALL PASS
```

漏第 1 步 → 报「缺少资产」；漏第 2 步 → `ERR_MODULE_NOT_FOUND: acorn`。

## 工单：编号的唯一来源

- 载体是 **GitHub Issues**（无 Jira 连接器），标题前缀 `EMB-nnn`
- 编号已用到 **EMB-109**，**下一个从 EMB-110 起**；建单后请同步改这一行
- 分支：`feature|bugfix|hotfix/EMB-nnn-<小写连字符 slug>`
- 提交：`<gitmoji> EMB-nnn: 一句话描述`，一个提交只做一件事
- **没有工单号，不建分支、不提交、不开 PR。** 缺号就问，不猜、不编

## 五条铁律

1. `main` 只接受 PR；合并必须 **Rebase and merge**（仓库强制线性历史），merge commit 会被拒
2. 一个 PR 只装一个工单；要扩范围，先在 PR 里写明依据
3. 没实跑 `npm run verify` 不得声称"已测试"，必须贴真实输出
4. 大文件（≥1MB 的 HTML、快照、产物）不进 Git，见 `tools/assets.json`
5. 密钥 / 令牌 / 内网地址不进分支名、提交、PR

## 必须问人，不要自己拍板

扩范围 · 改写 Git 历史 · 临时摘除分支保护 · 删除 Release · 发版与对外发布 · 版权判断

## 已知环境坑

- `gh` 的 GraphQL 常 `TLS handshake timeout` → 改用 REST：`gh api -X POST .../pulls --input x.json`
- `gh issue close` 没有 `--body-file` → 先 `gh issue comment`，再 `gh issue close`
- bash `grep` 对本仓库部分中文文件返回空 → 用 Grep 工具
- `git filter-branch` 后必须清 `refs/original` + reflog + `gc --prune=now`，否则体积不减
- 改写历史前先删掉指向旧提交的 tag，否则旧 blob 被钉在远端
- `package.json` **不得**加 `"type": "module"`，否则 `cheat/cheat/scripts/*.js`（CJS）全废

## 常用命令

```bash
npm run dev        # 本地预览 http://127.0.0.1:8787/ （/test /base /wiki）
npm run verify     # check + 397 条玩法断言 + 发布版冒烟
npm run wiki       # 重建改版 Wiki
npm run assets:check   # 体检：哪些大文件缺失
```

## 目录速览

| 路径 | 内容 |
|---|---|
| `pack/` `build/block_v19.js` | 玩法内容与数值（主体工作区） |
| `tools/` | 构建、语法门、回归、冒烟、资产取回 |
| `base/` | 上游快照（外置，需 `assets:pull`） |
| `cheat/` | 修改器，`ember-rift/game.html` 是测试夹具，勿删 |
| `out/` `reports/` | 升版符号映射与各类报告（生成物，通常不手改） |
| `docs/` `.github/` | 规范、PR 模板、CI |
