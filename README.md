# 余烬裂隙扩展包 · v19 迁移工作区

把「余烬裂隙 PoE2 内容扩展包 v2.0.5」（原底包 18.0.3）移植到 <https://ember-rift.pages.dev/> 当前线上版本（v19）的完整工程：符号重映射 → 移植块重写 → 构建 → 回归验证 → 修改器同步。

- **发布版**：`build/余烬裂隙-异界内容扩展-v2.2.0-v19.html`
- **核心资产**：`out/symbol_map_18to19.json`（1697 条符号映射）
- **修改器**：`cheat/cheat/ember-rift-gui.user.js`（已支持 `ember-rift.pages.dev`）

> 免责声明：本仓库为个人学习用途的同人内容与二次开发工程，与游戏官方无关。游戏本体、原始扩展包版权归各自作者所有。请勿用于商业用途；若权利人提出异议请提 issue，会立即下架相关内容。

## 目录

```
port/
├─ base/v19-online.html        官方 v19 原始底包（回滚基线，勿改）
├─ pack/                       原扩展包副本（含 block_new.js 历史快照）
├─ cheat/                      修改器副本
├─ build/
│   ├─ block_baseline_18.0.3.js   迁移前基线（18.0.3 符号）
│   ├─ block_v19.js               ★ v19 版移植块（唯一手改源）
│   ├─ expose_v19.js              测试 API 桥
│   ├─ test-v19.html              测试版（含 expose，无热修）
│   └─ 余烬裂隙-异界内容扩展-v2.2.0-v19.html   ★ 发布版
├─ out/
│   ├─ symbol_map_18to19.json     1697 条符号映射（核心资产）
│   ├─ remap_report.json          重映射统计
│   └─ build-v19-report.json      构建补丁应用/跳过清单
├─ tools/
│   ├─ remap.mjs                  符号重映射（作用域安全）
│   ├─ build-v19.mjs              构建
│   ├─ syntax.mjs                 语法门
│   ├─ harness_v19.cjs            玩法回归（397 条断言）
│   ├─ smoke-v19.cjs              发布版冒烟
│   └─ verify_map.mjs             映射目标合法性校验
└─ reports/
    ├─ MIGRATION-REPORT.md        迁移报告
    ├─ HANDOFF.md                 评审交接
    └─ CODE-REVIEW.md             评审结论
```

## 常用命令

```bash
cd tools
node syntax.mjs  ../build/test-v19.html        # 语法门
node harness_v19.cjs ../build/test-v19.html    # 玩法回归（要求 ALL PASS）
node smoke-v19.cjs "../build/余烬裂隙-异界内容扩展-v2.2.0-v19.html"   # 发布版冒烟
node verify_map.mjs                            # 映射目标合法性
node build-v19.mjs --mode both                 # 重建 test + release
```

## 改玩法的正确姿势

1. 只改 `build/block_v19.js`（不要改产物 HTML）
2. `node build-v19.mjs --mode both`
3. `node syntax.mjs` + `node harness_v19.cjs`，必须 ALL PASS
4. 发布版再跑一次 `smoke-v19.cjs` 确认无 __erTest 依赖

## 下次官方升版

见 `reports/MIGRATION-REPORT.md` 最后一节。
