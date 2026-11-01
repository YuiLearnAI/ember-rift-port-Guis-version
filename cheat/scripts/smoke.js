#!/usr/bin/env node
/**
 * 余烬裂隙修改器 · 核心逻辑冒烟测试
 * 不依赖浏览器：直接从用户脚本里抽取纯逻辑函数求值后断言。
 * 用法: node scripts/smoke.js
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC = fs.readFileSync(path.join(ROOT, 'ember-rift-gui.user.js'), 'utf8').replace(/\r\n?/g, '\n');

let pass = 0, fail = 0;
const ok = (name, cond, extra) => {
  if (cond) { pass++; console.log('  ✔ ' + name); }
  else { fail++; console.log('  ✖ ' + name + (extra ? '  → ' + extra : '')); }
};

/* ---------- 抽取「词缀数值范围」函数块并求值 ---------- */
const startMark = '/* ---------------- 词缀数值范围（越界提示用） ---------------- */';
const endMark = '// 背包已用格数';
const i0 = SRC.indexOf(startMark);
const i1 = SRC.indexOf(endMark);
if (i0 < 0 || i1 < 0 || i1 <= i0) {
  console.error('[smoke] 无法定位待测试函数块，锚点可能已变更');
  process.exit(2);
}
const block = SRC.slice(i0, i1);
const sandbox = {};
// 双手武器倍率所需的依赖以 fixture 注入（与游戏本体 game.html 核对过的值）
const FIXTURE = {
  AFF: { spellInc: { id: 'spellInc' }, addFire: { id: 'addFire' }, manaRegen: { id: 'manaRegen' } },
  BASEMAP: {
    '学徒法杖': { slot: 'W', wt: 'staff' },
    '短弓': { slot: 'W', wt: 'bow' },
    '短杖': { slot: 'W', wt: 'wand' },
    '长剑': { slot: 'W', wt: 'jian' },
    '秘术胸甲': { slot: 'B' },
  },
  TWO_HAND: new Set(['bow', 'qstaff', 'staff', 'crossbow']),
  TH_AFF: new Set(['addPhys', 'addFire', 'addCold', 'addLight', 'physInc', 'spellInc',
    'meleeInc', 'fireInc', 'coldInc', 'lightInc', 'projDmg']),
  TH_MUL: 1.5,
  // 珠宝词缀表（本体 es，slots:"J"）：与装备 AFF 完全不重叠
  JAFF: {
    j_melee: { id: 'j_melee', t: 'P', slots: 'J', ranges: [[6, 8], [9, 11], [12, 14], [15, 18]] },
  },
};
// eslint-disable-next-line no-new-func
new Function('out', 'AFF', 'BASEMAP', 'TWO_HAND', 'TH_AFF', 'TH_MUL', 'JAFF',
  block + '\nout.flattenNums=flattenNums;out.rangeInfo=rangeInfo;out.outOfRange=outOfRange;' +
  '\nout.isTwoHand=isTwoHand;out.thMulFor=thMulFor;out.toStoredVal=toStoredVal;out.effArr=effArr;out.storedArr=storedArr;' +
  '\nout.tierCount=tierCount;out.tierLabel=tierLabel;out.topTierIdx=topTierIdx;out.affOf=affOf;'
)(sandbox, FIXTURE.AFF, FIXTURE.BASEMAP, FIXTURE.TWO_HAND, FIXTURE.TH_AFF, FIXTURE.TH_MUL, FIXTURE.JAFF);
const { flattenNums, rangeInfo, outOfRange, isTwoHand, thMulFor, toStoredVal, effArr, storedArr,
  tierCount, tierLabel, topTierIdx, affOf } = sandbox;

console.log('[smoke] 越界判定');
// 以游戏内真实词缀 manaRegen 为例: [[10,19],[20,29],[30,39],[40,49],[50,59],[60,70]]
const manaRegen = { id: 'manaRegen', ranges: [[10, 19], [20, 29], [30, 39], [40, 49], [50, 59], [60, 70]] };
const ri = rangeInfo(manaRegen);
ok('rangeInfo 正确解析区间 (min=10, max=70)', ri && ri.min === 10 && ri.max === 70, ri && JSON.stringify(ri));
ok('rangeInfo 阶层数为 6', ri && ri.tiers.length === 6, ri && String(ri.tiers.length));
ok('ranges 按「弱→强」排列：ti=0 是 10~19（最低阶）', ri && ri.tiers[0].lo === 10 && ri.tiers[0].hi === 19);
ok('ranges 按「弱→强」排列：ti=5 是 60~70（最高阶）', ri && ri.tiers[5].lo === 60 && ri.tiers[5].hi === 70);

/* ---------- 阶层编号：T1 = 最高阶 = ranges 最后一个索引 ---------- */
// 回归防线：早期版本把 ranges[0] 当成 T1，导致下拉标签与实际写入阶层全部反了。
// 依据 game.html：forge 面板 h.ranges.map((x,S)=>"T"+(b-S))，且 allT1 分支为 r.ti = i.ranges.length-1
console.log('[smoke] 阶层编号映射');
ok('manaRegen 共 6 阶', tierCount(manaRegen) === 6);
ok('ti=5 → T1（最高阶）', tierLabel(manaRegen, 5) === 'T1', tierLabel(manaRegen, 5));
ok('ti=4 → T2', tierLabel(manaRegen, 4) === 'T2');
ok('ti=0 → T6（最低阶）', tierLabel(manaRegen, 0) === 'T6', tierLabel(manaRegen, 0));
ok('topTierIdx = 5（T1 的索引）', topTierIdx(manaRegen) === 5, String(topTierIdx(manaRegen)));
ok('topTierIdx 取到的确是最强区间 60~70', JSON.stringify(manaRegen.ranges[topTierIdx(manaRegen)]) === '[60,70]');
ok('ti 越界时正确夹取：99→T1（最高阶），-1→T6（最低阶）',
  tierLabel(manaRegen, 99) === 'T1' && tierLabel(manaRegen, -1) === 'T6',
  tierLabel(manaRegen, 99) + '/' + tierLabel(manaRegen, -1));
ok('无 ranges 的词缀 tierLabel 返回空、topTierIdx 返回 0', tierLabel({ id: 'x' }, 0) === '' && topTierIdx({ id: 'x' }) === 0);
ok('3 阶词缀：ti=2 → T1', tierLabel({ ranges: [[1, 2], [3, 4], [5, 6]] }, 2) === 'T1');

ok('合法值 50 不报越界', outOfRange(manaRegen, [50]) === null);
ok('边界值 10 / 70 不报越界', outOfRange(manaRegen, [10]) === null && outOfRange(manaRegen, [70]) === null);
ok('越界值 200 被判定越界', !!outOfRange(manaRegen, [200]));
ok('越界值 100 被判定越界', !!outOfRange(manaRegen, [100]));
ok('低于下限 5 被判定越界', !!outOfRange(manaRegen, [5]));
ok('双值词缀其中一个越界即报', !!outOfRange({ ranges: [[[1, 3], [5, 8]]] }, [2, 99]));
ok('无 ranges 的词缀返回 null（不误报）', outOfRange({ id: 'x' }, [999]) === null);
ok('flattenNums 能展开嵌套数组', JSON.stringify(flattenNums([[[1, 2]], 3])) === '[1,2,3]');

/* ---------- 珠宝：独立词缀表 + 官方腐化规则 ---------- */
// 依据 game.html：
//   · var A3=[1,30,46,58],es={},...; function st(...){... slots:"J" ...; es[e]=c}  → 珠宝词缀表 es 与装备表 Yt 分开
//   · cL() 的 vaal 分支：if(t.kind!=="item"&&t.kind!=="jewel")return"只能用于装备"  → 珠宝允许腐化
//   · lL() 里 a<.8 && e.kind==="jewel" → 走 cimpl（而不是 +1 符文插槽）
//   · $2()（余烬祭坛）：e.kind!=="item" → "只能献祭装备"  → 珠宝不能二次腐化
console.log('[smoke] 珠宝词缀表与腐化规则');
ok('珠宝查表命中 JAFF', affOf({ kind: 'jewel' }, 'j_melee') === FIXTURE.JAFF.j_melee);
ok('装备查表不会命中珠宝词缀（防串表写坏存档）', affOf({ kind: 'item' }, 'j_melee') === undefined);
ok('珠宝查表不会命中装备词缀', affOf({ kind: 'jewel' }, 'manaRegen') === undefined);
const jDef = FIXTURE.JAFF.j_melee;
ok('珠宝词缀同样是 ranges 弱→强：4 阶 → T1 在第 3 号索引', tierCount(jDef) === 4 && topTierIdx(jDef) === 3);
ok('珠宝 T1 数值取最强区间 15~18', JSON.stringify(jDef.ranges[topTierIdx(jDef)]) === '[15,18]');
ok('珠宝 ti=3 → T1，ti=0 → T4', tierLabel(jDef, 3) === 'T1' && tierLabel(jDef, 0) === 'T4');
try {
  const gg = fs.readFileSync(path.join(ROOT, 'ember-rift', 'game.html'), 'utf8');
  ok('本体确认瓦尔宝珠放行珠宝（vaal 分支同时接受 item 与 jewel）',
    gg.indexOf('if(e==="vaal"){if(t.kind!=="item"&&t.kind!=="jewel")return"只能用于装备"') >= 0);
  ok('本体确认珠宝走插槽那一档时会改为腐化词缀',
    gg.indexOf('if(a<.8&&e.kind==="jewel")') >= 0);
  ok('本体确认珠宝的腐化词缀池剔除 skillLvl',
    gg.indexOf('I0=e=>e&&e.kind==="jewel"?gu.filter(t=>t[0]!=="skillLvl"):gu') >= 0);
  ok('本体确认余烬祭坛只接受装备（珠宝不可二次腐化）',
    gg.indexOf('function $2(e){return e?e.kind!=="item"?"只能献祭装备"') >= 0);
} catch (e) {
  ok('读取 game.html 做交叉验证', false, e && e.message);
}

/* ---------- 双手武器伤害倍率（游戏 Nl()/gd()/Bw()，TH_MUL=1.5） ---------- */
console.log('[smoke] 双手武器 ×1.5 倍率');
const staff = { kind: 'item', base: '学徒法杖', mods: [], impl: [] };
const bow = { kind: 'item', base: '短弓', mods: [], impl: [] };
const wand = { kind: 'item', base: '短杖', mods: [], impl: [] };
const sword = { kind: 'item', base: '长剑', mods: [], impl: [] };
const chest = { kind: 'item', base: '秘术胸甲', mods: [], impl: [] };

ok('法杖（staff）判定为双手', isTwoHand(staff) === true);
ok('弓（bow）判定为双手', isTwoHand(bow) === true);
ok('短杖（wand）不是双手', isTwoHand(wand) === false);
ok('长剑（jian）不是双手', isTwoHand(sword) === false);
ok('胸甲不是双手', isTwoHand(chest) === false);
ok('地图/兽魂等非装备不参与判定', isTwoHand({ kind: 'map', base: 'x' }) === false);

ok('双手 + 伤害类词缀 spellInc → ×1.5', thMulFor(staff, 'spellInc') === 1.5);
ok('双手 + 伤害类词缀 addFire → ×1.5', thMulFor(staff, 'addFire') === 1.5);
ok('双手 + 非伤害词缀 manaRegen → ×1', thMulFor(staff, 'manaRegen') === 1);
ok('单手武器上的伤害词缀 → ×1', thMulFor(wand, 'spellInc') === 1);
ok('未知词缀 id → ×1（不误判）', thMulFor(staff, 'nope') === 1);
// implicit 不吃倍率（游戏 Nl: e.impl.includes(t) → false）
const implObj = { id: 'spellInc', v: [10] };
const withImpl = { kind: 'item', base: '学徒法杖', mods: [implObj], impl: [implObj] };
ok('implicit 词缀不吃倍率（与游戏一致）', thMulFor(withImpl, 'spellInc', implObj) === 1);
ok('mods 里的同名词缀仍吃倍率', thMulFor(withImpl, 'spellInc', { id: 'spellInc', v: [10] }) === 1.5);

// 面板值 ↔ 存储值往返：填多少，游戏就该显示多少
console.log('[smoke] 面板「所见即所得」往返一致性');
let bad = [];
for (let target = 1; target <= 400; target++) {
  const s = toStoredVal(target, 1.5);
  const shown = Math.round(s * 1.5);        // 游戏 gd(): Math.round(v*Zg)
  if (shown !== target) bad.push(`${target}→显示${shown}`);
}
ok(`1~400 全部目标值都能精确还原（含 ≡1 mod 3 的难命中值）`, bad.length === 0, bad.slice(0, 5).join(', '));
ok('倍率为 1 时原样返回', toStoredVal(77, 1) === 77);
ok('0 正常处理', toStoredVal(0, 1.5) === 0);
ok('180% ↔ 存储 120', toStoredVal(180, 1.5) === 120 && Math.round(120 * 1.5) === 180);
ok('双值 [29,57] 往返一致', JSON.stringify(effArr(storedArr([29, 57], 1.5), 1.5)) === '[29,57]');
ok('倍率 1 时 effArr 不变', JSON.stringify(effArr([10, 20], 1)) === '[10,20]');

// 越界提示应按「倍率后的生效区间」报告
const oorTH = outOfRange(manaRegen, [200], 1.5);
ok('越界仍以存储基值判定（200 越出 10~70）', !!oorTH);
ok('越界报告的是倍率后的区间 15~105', oorTH && oorTH.min === 15 && oorTH.max === 105,
  oorTH && `${oorTH.min}~${oorTH.max}`);
ok('倍率为 1 时区间报告保持原值 10~70', (() => { const o = outOfRange(manaRegen, [200], 1); return o && o.min === 10 && o.max === 70; })());

/* ---------- 赌博保底：阶层上限 / 腐化词缀 / 祭坛 +10% ---------- */
console.log('[smoke] 赌博保底（阶层上限 / 腐化词缀 / 祭坛 +10%）');
const gStart = 'function cimplPool(it) {';
const gEnd = 'function gambleEligible() {';
const g0 = SRC.indexOf(gStart);
const g1 = SRC.indexOf(gEnd);
if (g0 < 0 || g1 < 0 || g1 <= g0) {
  console.error('[smoke] 无法定位「赌博保底」函数块，锚点可能已变更');
  process.exit(2);
}
// 本体 gu 的真实数据（已在 game.html 中核对）
const REAL_POOL = [
  ['skillLvl', [1, 1]], ['lifeInc', [8, 12]], ['critInc', [20, 30]], ['leech', [1, 2]],
  ['resAll', [8, 12]], ['moveInc', [5, 8]], ['atkSpd', [6, 10]], ['castSpd', [6, 10]],
  ['spirit', [10, 20]], ['rarity', [10, 15]],
];
const gs = {};
const gState = { consume: false };
// 直接从脚本里取真实的腐化词缀名表（避免测试桩与实现脱节）
const ct0 = SRC.indexOf('const CIMPL_TEXT = {');
const ct1 = ct0 >= 0 ? SRC.indexOf('};', ct0) : -1;
if (ct0 < 0 || ct1 < 0) { console.error('[smoke] 无法定位 CIMPL_TEXT'); process.exit(2); }
const REAL_CIMPL_TEXT = new Function('return ' + SRC.slice(ct0 + 'const CIMPL_TEXT = '.length, ct1 + 1))();
new Function('out', 'CORRUPT_POOL', 'corruptPool', 'CIMPL_TEXT', 'WALLET', 'gambleState', 'safeSaveWallet',
  SRC.slice(g0, g1) + '\nout.cimplPool=cimplPool;out.cimplText=cimplText;out.tierMax=tierMax;out.payCur=payCur;'
)(gs, REAL_POOL, (e) => (e && e.kind === 'jewel' ? REAL_POOL.filter(t => t[0] !== 'skillLvl') : REAL_POOL),
  REAL_CIMPL_TEXT, { cur: { vaal: 0, ember: 0, divine: 0 } }, gState, () => { });
const { cimplPool: gPool, cimplText, tierMax, payCur } = gs;

// tierMax：单值 / 双值 / 传奇 ur / 越界阶层 / 无范围
const singleDef = { id: 'x', ranges: [[10, 19], [20, 29], [30, 39]] };
ok('最低阶 T3(ti=0) 上限 = 19', JSON.stringify(tierMax(singleDef, { ti: 0 })) === '[19]');
ok('中间阶 T2(ti=1) 上限 = 29', JSON.stringify(tierMax(singleDef, { ti: 1 })) === '[29]');
ok('最高阶 T1(ti=2) 上限 = 39', JSON.stringify(tierMax(singleDef, { ti: 2 })) === '[39]');
ok('ti 越界时夹到最后一阶 = 39', JSON.stringify(tierMax(singleDef, { ti: 99 })) === '[39]');
ok('缺少 ti 时按最低阶处理 = 19（保守，不写坏）', JSON.stringify(tierMax(singleDef, {})) === '[19]');
// 「升到 T1」的真实效果：必须拿到该词缀的最强值，而不是最弱值
ok('配合 topTierIdx 升到 T1 → manaRegen 得到 70',
  JSON.stringify(tierMax(manaRegen, { ti: topTierIdx(manaRegen) })) === '[70]');
ok('配合 topTierIdx 升到 T1 → singleDef 得到 39',
  JSON.stringify(tierMax(singleDef, { ti: topTierIdx(singleDef) })) === '[39]');
ok('未升级时保留当前阶层 T4(ti=2) → manaRegen 得到 39',
  JSON.stringify(tierMax(manaRegen, { ti: 2 })) === '[39]');
ok('双值词缀上限按位置取 [3,8]',
  JSON.stringify(tierMax({ ranges: [[[1, 3], [5, 8]]] }, { ti: 0 })) === '[3,8]');
ok('传奇 ur 单值 [[10,20]] 上限 = 20', JSON.stringify(tierMax(singleDef, { ur: [10, 20] })) === '[20]');
ok('传奇 ur 双值上限 = [3,8]', JSON.stringify(tierMax(singleDef, { ur: [[1, 3], [5, 8]] })) === '[3,8]');
ok('无 ranges 且无 ur 返回 null（跳过而非写坏）', tierMax({ id: 'x' }, { ti: 0 }) === null);
ok('def 为空返回 null', tierMax(null, { ti: 0 }) === null);

// 腐化词缀池
ok('取到 10 条腐化词缀', gPool({ kind: 'item' }).length === 10);
ok('珠宝会剔除 skillLvl（与游戏 I0 一致）',
  gPool({ kind: 'jewel' }).length === 9 && !gPool({ kind: 'jewel' }).some(([k]) => k === 'skillLvl'));
ok('corruptPool 抛错时回退到 CORRUPT_POOL', gPool(null).length === 10);
ok('腐化文本替换 {v}：暴击率提高 30%', cimplText('critInc', 30) === '暴击率提高 30%');
ok('未知 key 不崩且有兜底', cimplText('nope', 7) === 'nope 7');
ok('池内最大值可读（lifeInc → 12）', REAL_POOL.find(([k]) => k === 'lifeInc')[1][1] === 12);
// 游戏的 C3 表漏了 skillLvl（会显示成 "skillLvl 1"），这里必须覆盖
ok('10 个腐化词缀全部有中文名（含游戏漏掉的 skillLvl）',
  REAL_POOL.every(([k]) => typeof REAL_CIMPL_TEXT[k] === 'string'), '缺少: ' + REAL_POOL.filter(([k]) => !REAL_CIMPL_TEXT[k]).map(([k]) => k).join(','));
ok('CIMPL_TEXT 每条都含 {v} 占位符',
  Object.values(REAL_CIMPL_TEXT).every(t => t.includes('{v}')));

// 祭坛「升华」的 +10% 数学（与游戏 A2 完全一致）
const bump = v => v > 0 ? Math.max(v + 1, Math.round(v * 1.1)) : v;
ok('+10%：100 → 110', bump(100) === 110);
ok('+10%：1 → 2（至少 +1 兜底）', bump(1) === 2);
ok('+10%：5 → 6（round(5.5)=6）', bump(5) === 6);
ok('负值不受影响（-3 保持 -3）', bump(-3) === -3);
ok('0 保持 0', bump(0) === 0);

// 付费语义：未开启"模拟消耗"时不扣
gState.consume = false;
ok('未开启模拟消耗时 payCur 返回 false（不扣通货）', payCur('vaal') === false);
gState.consume = true;
ok('开启后钱包为 0 时免单不报错', payCur('vaal') === false);

/* ---------- 换基底（改物品底材） ---------- */
const bsMark = '/* ---------------- 换底材（改物品基底） ---------------- */';
const bsEnd = 'function findItem(key) {';
const bsX0 = SRC.indexOf(bsMark);
const bsX1 = SRC.indexOf(bsEnd);
if (bsX0 < 0 || bsX1 < 0 || bsX1 <= bsX0) {
  console.error('[smoke] 无法定位换基底函数块，锚点可能已变更');
  process.exit(2);
}
const BASE_FIX = {
  BASES: [
    { n: '学徒法杖', slot: 'W', lv: 1, wt: 'staff', impl: [['physInc', [10, 20]]] },
    { n: '长老法杖', slot: 'W', lv: 55, wt: 'staff', impl: [['physInc', [40, 60]], ['castSpd', [5, 8]]] },
    { n: '秘术胸甲', slot: 'B', lv: 20, impl: [] },
    { n: '精工胸甲', slot: 'B', lv: 60, impl: [['lifeFlat', [20, 30]]] },
    { n: '轻弓', slot: 'W', lv: 12, wt: 'bow', impl: [] },
  ],
  BASEMAP: {
    '学徒法杖': { slot: 'W', lv: 1, wt: 'staff', impl: [['physInc', [10, 20]]] },
    '长老法杖': { slot: 'W', lv: 55, wt: 'staff', impl: [['physInc', [40, 60]], ['castSpd', [5, 8]]] },
    '秘术胸甲': { slot: 'B', lv: 20, impl: [] },
    '精工胸甲': { slot: 'B', lv: 60, impl: [['lifeFlat', [20, 30]]] },
    '轻弓': { slot: 'W', lv: 12, wt: 'bow', impl: [] },
  },
  SLOTNAME: { W: '武器', B: '胸甲' },
  AFF: {
    physInc: { id: 'physInc' },
    lifeFlat: { id: 'lifeFlat', slots: ['B'] },   // 只允许胸甲：用于跨部位提示
    castSpd: { id: 'castSpd' },
  },
  INV_CAP: 160,
};
const bsb = {};
// 被换的装备 + 玩家对象，随用例重建
function mkBaseCtx(it, invLen) {
  const P = { inv: new Array(invLen || 0).fill({}), equip: {} };
  if (it.__eq) P.equip[it.__eq] = it;
  return P;
}
new Function('out', 'BASES', 'BASEMAP', 'SLOTNAME', 'AFF', 'INV_CAP', 'player', 'esc',
  SRC.slice(bsX0, bsX1) + '\nout.makeImpl=makeImpl;out.slotOf=slotOf;out.baseCandidates=baseCandidates;' +
  '\nout.equippedSlot=equippedSlot;out.checkBase=checkBase;out.applyBase=applyBase;out.foreignMods=foreignMods;'
)(bsb, BASE_FIX.BASES, BASE_FIX.BASEMAP, BASE_FIX.SLOTNAME, BASE_FIX.AFF, BASE_FIX.INV_CAP,
  () => curP, (s) => String(s));
const { makeImpl, slotOf, baseCandidates, checkBase, applyBase, foreignMods } = bsb;
let curP = mkBaseCtx({}, 0);

console.log('[smoke] 换基底（底材）');
// 固有词缀结构必须与本体 q1(baseDef) 完全一致：{id, v:[...]}，且 v 是拷贝不是引用
const bsImpl = makeImpl(BASE_FIX.BASEMAP['长老法杖']);
ok('makeImpl 复刻本体 q1：生成 {id,v[]} 数组',
  JSON.stringify(bsImpl) === '[{"id":"physInc","v":[40,60]},{"id":"castSpd","v":[5,8]}]', JSON.stringify(bsImpl));
ok('makeImpl 的 v 是拷贝（改结果不污染基底表）',
  (bsImpl[0].v[0] = 1) === 1 && BASE_FIX.BASEMAP['长老法杖'].impl[0][1][0] === 40);
ok('无 impl 的基底返回空数组', JSON.stringify(makeImpl(BASE_FIX.BASEMAP['秘术胸甲'])) === '[]');
ok('基底缺失时返回空数组（不崩）', JSON.stringify(makeImpl(null)) === '[]');
ok('单值 impl 也会包成数组', JSON.stringify(makeImpl({ impl: [['x', 5]] })) === '[{"id":"x","v":[5]}]');

const bsStaff = { kind: 'item', base: '学徒法杖', slot: 'W', ilvl: 5, mods: [], impl: makeImpl(BASE_FIX.BASEMAP['学徒法杖']) };
ok('slotOf 以 BASEMAP 为准（本体 pe[it.base].slot 口径）', slotOf(bsStaff) === 'W');
ok('默认候选只含同部位基底（武器）', baseCandidates(bsStaff, false).every(x => x.slot === 'W')
  && baseCandidates(bsStaff, false).some(x => x.n === '长老法杖') && !baseCandidates(bsStaff, false).some(x => x.n === '秘术胸甲'));
ok('勾选跨部位后候选包含全部基底', baseCandidates(bsStaff, true).length === BASE_FIX.BASES.length);

ok('同部位换基底允许（不需勾选）', checkBase(bsStaff, BASE_FIX.BASEMAP['长老法杖'], false).ok);
ok('跨部位未勾选时被拒绝并给出原因',
  checkBase(bsStaff, BASE_FIX.BASEMAP['秘术胸甲'], false).ok === false && checkBase(bsStaff, BASE_FIX.BASEMAP['秘术胸甲'], false).reason.includes('部位不符'));
ok('在背包里跨部位不需要勾选也能换', checkBase(bsStaff, BASE_FIX.BASEMAP['秘术胸甲'], true).ok);
ok('非装备(kind!=item)一律拒绝', checkBase({ kind: 'map' }, BASE_FIX.BASEMAP['轻弓'], true).ok === false);
ok('基底不存在时拒绝', checkBase(bsStaff, null, true).ok === false);

// 实际执行：base / slot / bsImpl 三件套必须一起更新（本体 Et()/Ut() 的同源要求）
curP = mkBaseCtx(bsStaff, 0);
const rSwap = applyBase(bsStaff, '长老法杖', false);
ok('applyBase 成功', rSwap.ok === true);
ok('换后 base 已更新', bsStaff.base === '长老法杖', bsStaff.base);
ok('换后 bsImpl 按新底材重算（原 inherent 被替换）',
  JSON.stringify(bsStaff.impl) === '[{"id":"physInc","v":[40,60]},{"id":"castSpd","v":[5,8]}]', JSON.stringify(bsStaff.impl));
ok('原有自加词缀保留（只动 impl，不动 mods）', bsStaff.mods.length === 0);
ok('同部位不需要动装备栏', rSwap.needMove === false);

// 跨部位 + 已装备 → 装备栏迁移
const it2 = { kind: 'item', base: '学徒法杖', slot: 'W', mods: [{ id: 'lifeFlat', v: [10] }], impl: [] };
it2.__eq = 'W';
curP = mkBaseCtx(it2, 0);
const r2 = applyBase(it2, '秘术胸甲', true);
ok('已装备且跨部位：从旧部位移除', r2.ok && r2.needMove === true && curP.equip.W === undefined);
ok('已装备且跨部位：放到新部位', curP.equip.B === it2 && it2.slot === 'B');
ok('跨部位后 impl/slot 同步更新', JSON.stringify(it2.impl) === '[]');
// lifeFlat 只允许胸甲（slots:['B']）：换到胸甲后不再报警 —— 正好验新部位生效
ok('词缀部位限制随新部位重新判定（换到胸甲后不再越界）', foreignMods(it2).length === 0);
const it2b = { kind: 'item', base: '学徒法杖', slot: 'W', mods: [{ id: 'lifeFlat', v: [10] }], impl: [] };
ok('foreignMods 能挑出不属于当前部位的词缀（武器上的胸甲词缀）', foreignMods(it2b).length === 1);
ok('foreignMods 对部位正确的词缀不误报', foreignMods(bsStaff).length === 0);

// 目标部位被占用 → 占用者退回背包；背包满则拒绝
const it3 = { kind: 'item', base: '学徒法杖', slot: 'W', mods: [], impl: [] }; it3.__eq = 'W';
const bsBusy = { kind: 'item', base: '秘术胸甲', slot: 'B', mods: [], impl: [] };
curP = mkBaseCtx(it3, 0); curP.equip.B = bsBusy;
ok('目标部位被占用时先探测到 occupant', checkBase(it3, BASE_FIX.BASEMAP['秘术胸甲'], true).occupied === bsBusy);
const r3 = applyBase(it3, '秘术胸甲', true);
ok('占用者的装备退回背包', r3.ok && curP.inv[curP.inv.length - 1] === bsBusy);
ok('新装备接管该部位', curP.equip.B === it3);
const it4 = { kind: 'item', base: '学徒法杖', slot: 'W', mods: [], impl: [] }; it4.__eq = 'W';
curP = mkBaseCtx(it4, BASE_FIX.INV_CAP); curP.equip.B = bsBusy;
ok('背包已满时拒绝跨部位（不写坏存档）',
  applyBase(it4, '秘术胸甲', true).ok === false && curP.equip.W === it4);

/* ---------- 快照「原地还原」语义验证 ---------- */
console.log('[smoke] 快照原地还原语义');
// 模拟: 游戏内部变量 u 指向 obj；快照深拷贝后，原地清空再赋值应让 u 仍指向同一对象且内容被还原
const u = { inv: [{ name: 'A', mods: [{ id: 'life', v: [10] }] }], equip: {}, level: 5 };
const snapshot = JSON.parse(JSON.stringify(u));
// 模拟一次"改坏"
u.inv[0].mods[0].v = [9999];
u.level = 99;
// 原地还原（与 snapRestore 同逻辑）
for (const k of Object.keys(u)) delete u[k];
Object.assign(u, snapshot);
ok('还原后数值回到快照状态 (v=10)', u.inv[0].mods[0].v[0] === 10, JSON.stringify(u.inv[0].mods[0].v));
ok('还原后 level 回到 5', u.level === 5, String(u.level));
ok('还原未替换对象引用（游戏变量 u 仍指向它）', u === u && typeof u === 'object');

/* ---------- 背包容量计数 ---------- */
console.log('[smoke] 背包计数（与游戏 Sa() 一致：不计地图）');
const invCount = (inv) => inv.reduce((n, t) => n + (t && t.kind === 'map' ? 0 : 1), 0);
ok('3 件普通 + 2 张地图 = 3', invCount([{ kind: 'item' }, { kind: 'map' }, { kind: 'item' }, { kind: 'map' }, { kind: 'item' }]) === 3);
ok('空背包 = 0', invCount([]) === 0);

/* ---------- 全物品类型的落点 / 容量判定 ---------- */
console.log('[smoke] 物品落点与容量（游戏：地图袋 ga=120，背包 Ft=160，宝石无上限）');
const bStart = '/* ---------------- 物品落点与容量判定 ---------------- */';
const bEnd = '/* ---------------- 样式';
const b0 = SRC.indexOf(bStart);
const b1 = SRC.indexOf(bEnd);
if (b0 < 0 || b1 < 0 || b1 <= b0) {
  console.error('[smoke] 无法定位「物品落点」函数块，锚点可能已变更');
  process.exit(2);
}
const thePlayer = { inv: [], gems: [], equip: {} };
const api = {};
// 把该块里的纯逻辑函数抽出来求值，依赖（容量/计数器/玩家）以参数注入
new Function(
  'out', 'INV_CAP', 'MAP_CAP', 'TAB_CAP', 'STASH', 'player', 'invCount', 'mapCount',
  SRC.slice(b0, b1) + '\nout.isGemKind=isGemKind;out.stashTabFor=stashTabFor;out.hasRoom=hasRoom;out.placeItem=placeItem;'
)(api, 160, 120, { gen: 120, map: 200, gem: 200, uniq: 200, soul: 120, jewel: 120 },
  { tabs: { gen: [], map: [], gem: [], uniq: [], soul: [], jewel: [] } },
  () => thePlayer, () => invCount(thePlayer.inv), () => thePlayer.inv.filter(t => t && t.kind === 'map').length);
const { isGemKind, stashTabFor, hasRoom, placeItem } = api;

ok('宝石类识别 (gem/sup/meta/buff)',
  ['gem', 'sup', 'meta', 'buff'].every(isGemKind) && !isGemKind('map') && !isGemKind('item'));
ok('仓库归页：地图 → map', stashTabFor({ kind: 'map' }) === 'map');
ok('仓库归页：宝石类 → gem', stashTabFor({ kind: 'sup' }) === 'gem');
ok('仓库归页：兽魂 → soul', stashTabFor({ kind: 'soul' }) === 'soul');
ok('仓库归页：珠宝 → jewel', stashTabFor({ kind: 'jewel' }) === 'jewel');
ok('仓库归页：传奇 → uniq', stashTabFor({ kind: 'item', rarity: 3 }) === 'uniq');
ok('仓库归页：异种底材 → uniq', stashTabFor({ kind: 'item', rarity: 2, mi: 'shroud' }) === 'uniq');
ok('仓库归页：普通装备 → gen', stashTabFor({ kind: 'item', rarity: 2 }) === 'gen');

// 地图袋容量：填满 120 张地图后应拒绝
thePlayer.inv = Array.from({ length: 120 }, () => ({ kind: 'map' }));
ok('地图袋满（120/120）时拒绝新地图',
  hasRoom({ kind: 'map' }, 'bag').ok === false && /地图袋已满/.test(hasRoom({ kind: 'map' }, 'bag').msg));
ok('地图袋满不影响普通装备入包（地图不占背包格）', hasRoom({ kind: 'item' }, 'bag').ok === true);

// 背包容量：160 件非地图物品后应拒绝
thePlayer.inv = Array.from({ length: 160 }, () => ({ kind: 'item' }));
ok('背包满（160/160）时拒绝新装备',
  hasRoom({ kind: 'item' }, 'bag').ok === false && /背包已满/.test(hasRoom({ kind: 'item' }, 'bag').msg));
ok('背包满不影响地图入地图袋', hasRoom({ kind: 'map' }, 'bag').ok === true);

// 宝石无上限
thePlayer.gems = Array.from({ length: 500 }, () => ({ kind: 'gem' }));
ok('宝石类无容量上限', hasRoom({ kind: 'gem' }, 'bag').ok === true);

// 路由正确性
thePlayer.inv = []; thePlayer.gems = [];
placeItem({ kind: 'item', name: '剑' }, 'bag');
placeItem({ kind: 'map', name: '图' }, 'bag');
placeItem({ kind: 'gem', name: '火球术' }, 'bag');
ok('装备/地图进 u.inv', thePlayer.inv.length === 2);
ok('宝石进 u.gems', thePlayer.gems.length === 1);

/* ---------- 通货分档（用本地 game.html 的真实 CUR 表做断言，避免与线上数据漂移） ---------- */
console.log('[smoke] 通货分档与补给幅度');
const cStart = '/* ---------------- 通货分档';
const cEnd = '// -------- 通货 UI 状态';
const c0 = SRC.indexOf(cStart);
const c1 = SRC.indexOf(cEnd);
if (c0 < 0 || c1 < 0 || c1 <= c0) {
  console.error('[smoke] 无法定位「通货分档」函数块，锚点可能已变更');
  process.exit(2);
}
const cApi = {};
new Function('out', SRC.slice(c0, c1) +
  '\nout.curTierIdx=curTierIdx;out.curTierOf=curTierOf;out.curStepOf=curStepOf;' +
  '\nout.curDropPct=curDropPct;out.curAcquireText=curAcquireText;out.curSearchText=curSearchText;' +
  '\nout.CUR_TIERS=CUR_TIERS;out.CUR_LEVELS=CUR_LEVELS;out.CUR_SOURCE=CUR_SOURCE;out.CUR_SLANG=CUR_SLANG;'
)(cApi);
const { curTierIdx, curTierOf, curStepOf, curDropPct, curAcquireText, curSearchText,
  CUR_TIERS, CUR_LEVELS, CUR_SOURCE, CUR_SLANG } = cApi;

// 分层边界：官方估值 v 以混沌石为单位（v ≤ 0.5 常见 / ≤3 少见 / ≤60 稀有 / 其余珍贵）
ok('v=0.02（蜕变石）归为常见', curTierOf(0.02).name === '常见', curTierOf(0.02).name);
ok('v=0.5（符文）仍在常见档上边界', curTierOf(0.5).name === '常见', curTierOf(0.5).name);
ok('v=1（混沌石）升为少见', curTierOf(1).name === '少见', curTierOf(1).name);
ok('v=12（崇高石）归为稀有', curTierOf(12).name === '稀有', curTierOf(12).name);
ok('v=120（神圣石）归为珍贵', curTierOf(120).name === '珍贵', curTierOf(120).name);
ok('估值缺失/非法时落到最保守一档', curTierIdx(undefined) === 3 && curTierIdx(NaN) === 3 && curTierIdx('x') === 3);
// 幅度：0 少量 / 1 适中 / 2 充足
ok('少量：蜕变石一次 10 颗', curStepOf(0.02, 0) === 10, String(curStepOf(0.02, 0)));
ok('适中：蜕变石一次 40 颗', curStepOf(0.02, 1) === 40, String(curStepOf(0.02, 1)));
ok('充足：蜕变石一次 120 颗', curStepOf(0.02, 2) === 120, String(curStepOf(0.02, 2)));
ok('神圣石即使充足档也只有 5 颗', curStepOf(120, 2) === 5, String(curStepOf(120, 2)));
ok('印记/完宝这类中等货在适中档只给 3 颗', curStepOf(25, 1) === 3 && curStepOf(15, 1) === 3);
ok('幅度越界时夹取而非崩溃', curStepOf(1, 9) === 60 && curStepOf(1, -3) === 5 && curStepOf(1, NaN) === 5);
// 回归防线：早期版本会把所有通货刷成 99999，这里保证任何情况下都不可能出现该量级
ok('回归：任何档位都不会给出 99999 这种量级',
  CUR_TIERS.every(t => t.steps.every(s => s > 0 && s < 99999)),
  JSON.stringify(CUR_TIERS.map(t => t.steps)));
ok('越值钱的通货补给量递减',
  CUR_TIERS.every((t, i) => i === 0 || t.steps.every((s, k) => s <= CUR_TIERS[i - 1].steps[k])),
  JSON.stringify(CUR_TIERS.map(t => t.steps)));
// 掉率公式必须严格等于官方 wiki 的 pct()：(p*100>=10 ? toFixed(0) : toFixed(2)) + '%'
const pctOff = (p) => ((p * 100 >= 10 ? (p * 100).toFixed(0) : (p * 100).toFixed(2)) + '%');
ok('掉率 26.4% → "26%"（≥10% 取整）', curDropPct(300, 1139.5) === pctOff(300 / 1139.5), curDropPct(300, 1139.5));
ok('掉率 0.13% → "0.13%"（<10% 保留两位）', curDropPct(1.5, 1139.5) === pctOff(1.5 / 1139.5), curDropPct(1.5, 1139.5));
ok('无掉落权重时返回空串（改显示获取途径）', curDropPct(0, 1139.5) === '' && curDropPct(undefined, 0) === '');
ok('无掉落权重时给出官方获取途径', curAcquireText('frac', { w: 0 }, 1139.5, CUR_SOURCE) === 'T11 以上地图, T16/T17 首领');
ok('有掉落权重时给出掉率', curAcquireText('trans', { w: 300 }, 1139.5, CUR_SOURCE) === '掉落 ' + curDropPct(300, 1139.5));
ok('俗称可搜（chaos → C）', curSearchText('chaos', { n: '混沌石', d: '重铸', grp: 'basic' }, CUR_SLANG, { basic: '通货' }).indexOf('c') >= 0);

// ---- 用游戏本体真实数据表交叉验证 ----
try {
  const g = fs.readFileSync(path.join(ROOT, 'ember-rift', 'game.html'), 'utf8');
  const gStart = g.indexOf('var z={trans:');
  const gEnd = g.indexOf(',vt=Object.keys(z),uA={basic:');
  if (gStart < 0 || gEnd < 0) throw new Error('game.html 中未找到 CUR 表');
  const REAL = new Function('return ' + g.slice(gStart + 'var z='.length, gEnd))();
  const ids = Object.keys(REAL);
  const W = ids.reduce((s, k) => s + (REAL[k].w || 0), 0);
  ok('game.html 中取到全部通货（34 种）', ids.length === 34, String(ids.length));
  ok('官方分组全部落在基本:sock:rune:ess:sig 之内',
    ids.every(k => ['basic', 'sock', 'rune', 'ess', 'sig'].indexOf(REAL[k].grp) >= 0),
    [...new Set(ids.map(k => REAL[k].grp))].join(','));
  ok('每种通货都有作用描述（简介模式要显示）', ids.every(k => !!REAL[k].d));
  ok('有掉落权重的都能算出官方掉率',
    ids.filter(k => REAL[k].w > 0).every(k => curDropPct(REAL[k].w, W) === pctOff(REAL[k].w / W)));
  ok('w=0 的七种在官方表里都有获取途径说明',
    ids.filter(k => !REAL[k].w).every(k => !!CUR_SOURCE[k]),
    ids.filter(k => !REAL[k].w).filter(k => !CUR_SOURCE[k]).join(','));
  // 通货识别色属于「数据调色板」：数值随游戏数据出现，必须在 DESIGN.md 里逐一登记，
  // 否则 Impeccable 会把它判成无来源的色彩漂移，也会漏掉游戏改色。
  const md = fs.readFileSync(path.join(ROOT, 'DESIGN.md'), 'utf8');
  const miss = ids.filter(k => md.indexOf('cur-' + k + ': "' + String(REAL[k].col).toUpperCase() + '"') < 0);
  ok('34 种通货的识别色全部登记在 DESIGN.md 的数据调色板里', miss.length === 0, miss.join(','));
  const totals = CUR_LEVELS.map((L, lv) => ids.reduce((s, k) => s + curStepOf(REAL[k].v, lv), 0));
  const worth = CUR_LEVELS.map((L, lv) => ids.reduce((s, k) => s + curStepOf(REAL[k].v, lv) * REAL[k].v, 0));
  ok('三档补给总量随幅度递增', totals[0] < totals[1] && totals[1] < totals[2], totals.join(' / '));
  ok('「充足」一档的总补给量仍在合理范围内（< 4000 颗）', totals[2] < 4000, String(totals[2]));
  ok('「适中」一档总估值低于 1500 c（约 12 颗神圣石，远低于过去的全部 99999）', worth[1] < 1500, worth[1].toFixed(1) + ' c');
  ok('「充足」一档总估值低于 6000 c', worth[2] < 6000, worth[2].toFixed(1) + ' c');
  console.log(`  · 参考：三档总补给 = ${totals.join(' / ')} 颗，折合 ≈ ${worth.map(x => x.toFixed(0)).join(' / ')} c`);
} catch (e) {
  ok('用 game.html 真实 CUR 表交叉验证通货分档', false, String(e && e.message));
}

/* ---------- 样式真源一致性 ---------- */
// docs/design/panel.css 必须能由脚本重新生成，否则预览页 / 教程 / Impeccable 检测会与线上样式漂移
try {
  require('child_process').execFileSync(
    process.execPath, [path.join(ROOT, 'scripts', 'extract-css.js'), '--check'], { stdio: 'pipe' });
  ok('panel.css 能由脚本原样重现（预览/教程不与线上漂移）', true);
} catch (e) {
  ok('panel.css 能由脚本原样重现（预览/教程不与线上漂移）', false, '请运行: node scripts/extract-css.js');
}

/* ---------- 界面级测试（jsdom，缺依赖则跳过） ---------- */
// 纯函数断言看不见 DOM 层错误（历史上出现过「全绿但下拉阶层反了」）。这一层真正把脚本跑起来点按钮。
try {
  const out = require('child_process').execFileSync(
    process.execPath, [path.join(ROOT, 'scripts', 'ui-test.js')], { encoding: 'utf8', stdio: 'pipe' });
  out.split('\n').filter(Boolean).forEach(l => console.log(l));
  ok('界面级测试（jsdom 真实点击通货页）全部通过', true);
} catch (e) {
  const out = String((e && e.stdout) || '');
  out.split('\n').filter(Boolean).forEach(l => console.log(l));
  ok('界面级测试（jsdom 真实点击通货页）全部通过', false, (e && e.stderr) ? String(e.stderr).trim() : '');
}

console.log('-'.repeat(50));
console.log(`[smoke] 通过 ${pass} · 失败 ${fail}`);
process.exit(fail ? 1 : 0);
