#!/usr/bin/env node
/**
 * 余烬裂隙修改器 · 代码审查脚本（工程侧"审查 Agent"）
 * 用法: node scripts/review.js [目标文件]
 * 不改完必跑；发现 ERROR 直接以非 0 退出（不给过）。
 *
 * 检查项:
 *   1. 语法检查 (node --check)
 *   2. __rift API 调用正确性 (是否使用了已知不存在的导出键)
 *   3. 已知坑 (updPlayer() 无参会把冷却计时器写成 NaN 等)
 *   4. 边界/异常输入 (游戏 API 调用是否包 try/catch)
 *   5. XSS/转义 (innerHTML 拼接用户输入是否经过 esc())
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const TARGET = process.argv[2] || path.join(ROOT, 'ember-rift-gui.user.js');

const problems = [];
const add = (level, rule, msg) => problems.push({ level, rule, msg });

/* ---------- 0. 读取 ---------- */
if (!fs.existsSync(TARGET)) {
  console.error('[review] 目标文件不存在: ' + TARGET);
  process.exit(2);
}
// 统一换行（Windows 下常为 CRLF），否则行尾 \r 会干扰逐行正则
const src = fs.readFileSync(TARGET, 'utf8').replace(/\r\n?/g, '\n');

/* ---------- 1. 语法检查 ---------- */
try {
  execFileSync(process.execPath, ['--check', TARGET], { stdio: 'pipe' });
} catch (e) {
  const out = (e.stdout ? e.stdout.toString() : '') + (e.stderr ? e.stderr.toString() : '');
  add('ERROR', 'syntax', '语法检查未通过:\n' + out.trim());
}

/* ---------- 2. __rift API 调用正确性 ---------- */
// 已从游戏本体核对过的、确实存在的 __rift 导出键
const KNOWN_EXPORTS = new Set([
  'WALLET', 'CUR', 'CUR_ORDER', 'STASH', 'Player', 'G',
  // 通货分组名：本体模块 ig 导出 CUR_GRP:()=>uA，uA={basic:"通货",sock:"插槽",rune:"符文",ess:"精华",sig:"印记"}；
  // 全文 CUR_GRP 只出现 1 次（无重名），且 ig ∈ CL ⊂ __rift 的 V$ 列表，故可由 Proxy 取到
  'CUR_GRP',
  'AFF', 'affDef', 'modLine', 'nameItem', 'save', 'updPlayer',
  // 珠宝词缀表：本体模块 Qg 导出 JAFF:()=>es（es 为 slots:"J" 的独立表，与装备 AFF/Yt 不通用）；
  // 全文 JAFF 只出现 1 次（无重名），Qg ∈ CL ⊂ V$
  'JAFF',
  'saveWallet', 'makeItem', 'rollAffix', 'BASES', 'BASEMAP',
  'makeUnique', 'load', 'mkMod', 'rarityFor',
  // v2 全物品类型：以下生成器与数据表均已在本体 game.html 中核对签名与无重名冲突
  'makeMi', 'makeMap', 'mkGem', 'mkSup', 'mkMeta', 'mkBuff', 'mkJewel', 'mkUniqueJewel', 'mkSoul',
  'UNIQ', 'UNIQMAP', 'MI_LIST', 'MIDEF', 'MAPTHEMES', 'THEMES', 'MAP_CAP',
  'JTH', 'JTH_ORDER', 'UJW', 'BEASTS', 'SK', 'SUP', 'META', 'BUFFS', 'TABS', 'TAB_CAP',
  // 双手武器倍率（本体 _g 模块：TH_MUL=Zg(1.5) / TWO_HAND=Mu / WT=Wt；Dg 模块：TH_AFF=Fg）
  'TH_MUL', 'TWO_HAND', 'WT', 'TH_AFF',
  // 赌博保底（均已核对：noteCraft=Ci 写入 item.cr 履历 / CORRUPT=gu 腐化词缀池 / corruptPool=I0 按物品过滤）
  'noteCraft', 'CORRUPT', 'corruptPool',
]);
// 已知危险/易错用法
const KNOWN_PITFALLS = [
  {
    rule: 'updPlayer-no-arg',
    re: /\bupdPlayer\s*\(\s*\)/g,
    msg: 'updPlayer() 无参调用：updPlayer 映射到游戏逐帧 tick(dt)，无参会让角色冷却计时器 n.pl[x]-=undefined 变成 NaN。应传 0 (updPlayer(0))。',
  },
  {
    rule: 'saveWallet-missing',
    re: null, // 见下方语义检查
    msg: '',
  },
];

// 收集脚本里用到的 R.xxx / __rift.xxx 键
const usedKeys = new Set();
for (const m of src.matchAll(/\bR\.([A-Za-z_$][A-Za-z0-9_$]*)/g)) usedKeys.add(m[1]);
for (const m of src.matchAll(/__rift\.([A-Za-z_$][A-Za-z0-9_$]*)/g)) usedKeys.add(m[1]);
// 形如 const { A, B } = R 的解构
for (const m of src.matchAll(/const\s*\{([^}]+)\}\s*=\s*R\s*;/g)) {
  for (const part of m[1].split(',')) {
    const k = part.trim().split(':').pop().trim();
    if (k) usedKeys.add(k);
  }
}
for (const k of usedKeys) {
  if (!KNOWN_EXPORTS.has(k)) add('ERROR', 'rift-api', `使用了 __rift 上未核对的导出键: R.${k}（请先在游戏本体确认它存在）`);
}

// 已知坑: updPlayer() 无参
for (const p of KNOWN_PITFALLS) {
  if (!p.re) continue;
  const hits = src.match(p.re);
  if (hits) add('ERROR', p.rule, `${p.msg} (出现 ${hits.length} 处)`);
}

/* ---------- 3. 游戏 API 调用的异常保护 ---------- */
// 面板里对游戏函数的调用应当包在 try/catch 中（游戏版本变化时不至于整个面板崩掉）
const GAME_CALLS = ['nameItem', 'updPlayer', 'saveChar', 'saveWallet', 'makeItem', 'rollAffix', 'modLine', 'affDef',
  'makeMi', 'makeMap', 'makeUnique', 'mkGem', 'mkSup', 'mkMeta', 'mkBuff', 'mkJewel', 'mkUniqueJewel', 'mkSoul'];
for (const fn of GAME_CALLS) {
  // 找出所有调用点，粗略判断该行是否在 try 块内（逐行启发式）
  const lines = src.split('\n');
  let inTry = false;
  lines.forEach((line, i) => {
    if (/try\s*\{/.test(line)) inTry = true;
    if (/\}\s*catch/.test(line)) inTry = false;
    const re = new RegExp('\\b' + fn + '\\s*\\(');
    // 去掉行注释再检测，避免注释里提到函数名造成误报
    const codeOnly = line.replace(/\/\/.*/, '');
    // 单行 try/catch（如 try { x(); } catch(e){}）视为已保护，避免误报
    const selfGuarded = /try\s*\{/.test(codeOnly);
    if (re.test(codeOnly) && !inTry && !selfGuarded && !/function\s/.test(codeOnly)) {
      // 只警告：并非每处都必须 try（例如 render 里只读调用）
      add('WARN', 'api-guard', `${fn}() 调用可能不在 try/catch 中 (行 ${i + 1}): ${line.trim().slice(0, 90)}`);
    }
  });
}

/* ---------- 4. XSS / 转义 ---------- */
// innerHTML 模板里若直接插入变量而不经 esc()，且变量来自游戏数据（名称等），提示
const htmlAssign = src.match(/\.innerHTML\s*=\s*html/g) || [];
if (htmlAssign.length) {
  const dynPatterns = [
    /\$\{[^}]*\.(name|nm|text|title|n)\b[^}]*\}/g, // ${x.name}
  ];
  for (const re of dynPatterns) {
    const hits = src.match(re) || [];
    for (const h of hits) {
      if (!/esc\(/.test(h)) {
        add('WARN', 'xss', `innerHTML 中疑似未转义的动态内容: ${h}`);
      }
    }
  }
}

/* ---------- 5. 存档/快照安全 ---------- */
// 不得直接写游戏存档键（避免污染）；快照必须用独立 key
if (/ember-rift-save-v4/.test(src)) {
  add('ERROR', 'save-safety', '脚本直接读写了游戏存档键 ember-rift-save-v4，有误改坏档风险；快照请一律用独立 key (er-*)。');
}
// localStorage 写入应包 try/catch（配额超限会抛异常）
const lsSet = src.match(/localStorage\.setItem\([^)]*\)/g) || [];
if (lsSet.length) {
  const lines = src.split('\n');
  lines.forEach((line, i) => {
    if (/localStorage\.setItem/.test(line) && !/try\s*\{/.test(line)) {
      // 检查前 3 行内是否有 try
      const ctx = lines.slice(Math.max(0, i - 3), i + 1).join('\n');
      if (!/try\s*\{/.test(ctx)) add('WARN', 'ls-guard', `localStorage.setItem 可能未包 try/catch (行 ${i + 1})`);
    }
  });
}

/* ---------- 输出 ---------- */
const errs = problems.filter(p => p.level === 'ERROR');
const warns = problems.filter(p => p.level === 'WARN');

console.log('='.repeat(60));
console.log(`[review] 目标: ${path.relative(ROOT, TARGET)}`);
console.log(`[review] ERROR ${errs.length} · WARN ${warns.length}`);
console.log('='.repeat(60));
for (const p of [...errs, ...warns]) {
  console.log(`${p.level === 'ERROR' ? '✖' : '⚠'} [${p.rule}] ${p.msg}`);
}
if (!problems.length) console.log('✔ 未发现问题');

console.log('-'.repeat(60));
if (errs.length) {
  console.log('[review] 结论: 不通过（存在 ERROR，修复后再交付）');
  process.exit(1);
}
console.log('[review] 结论: 通过');
process.exit(0);
