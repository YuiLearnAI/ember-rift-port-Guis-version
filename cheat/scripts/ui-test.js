#!/usr/bin/env node
/**
 * 余烬裂隙修改器 · 界面级测试（jsdom）
 *
 * 为什么需要这一层：过去只有纯函数断言，出现过「78 项全绿、但下拉阶层实际是反的」。
 * 这里把真实的用户脚本塞进 jsdom，喂给它从 game.html 解析出来的真实 CUR 数据，
 * 直接点按钮、读 DOM，验证通货页的分类、折叠、搜索、补给幅度是否真的按预期工作。
 *
 * 用法: node scripts/ui-test.js
 * 依赖: npm i --no-save jsdom（没装则自动跳过，不判 fail）
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
let JSDOM;
try {
  ({ JSDOM } = require('jsdom'));
} catch (e) {
  // 仓库里 jsdom 装在 tools/node_modules（构建与玩法回归用同一份），这里回退过去，
  // 免得为了界面测试再装一份。两处都没有才算“未安装”。
  try {
    ({ JSDOM } = require(path.join(ROOT, '..', 'tools', 'node_modules', 'jsdom')));
  } catch (e2) {
    console.log('[ui] 跳过界面级测试（未安装 jsdom：npm i --no-save jsdom）');
    process.exit(0);
  }
}

let pass = 0, fail = 0;
const ok = (name, cond, extra) => {
  if (cond) { pass++; console.log('  ✔ ' + name); }
  else { fail++; console.log('  ✖ ' + name + (extra ? '  → ' + extra : '')); }
};

/* ---------- 从游戏本体解析真实通货数据 ---------- */
const g = fs.readFileSync(path.join(ROOT, 'ember-rift', 'game.html'), 'utf8');
const gi = g.indexOf('var z={trans:');
const gj = g.indexOf(',vt=Object.keys(z),uA={basic:');
if (gi < 0 || gj < 0) { console.error('[ui] game.html 中找不到 CUR 表'); process.exit(2); }
const CUR = new Function('return ' + g.slice(gi + 'var z='.length, gj))();
const gk = g.indexOf('uA={basic:'), gl = g.indexOf(',Od={rune_fire');
const CUR_GRP = new Function('return ' + g.slice(gk + 'uA='.length, gl))();
const CUR_ORDER = Object.keys(CUR);

/* ---------- 搭一个最小 __rift ---------- */
const saved = { wallet: 0, char: 0 };
const walletObj = { cur: { chaos: 10 } };
const player = { inv: [], equip: {}, gems: [], jw: [] };
const noop = () => {};
const mkItem = () => ({ kind: 'item', mods: [] });
// 扩展包新增传奇之一（时空之肌）：sr / srt 是「传奇专属数值」的区间与文案模板，
// 游戏把它随在 item.ur 里，与物品种类的 mods 分开存 —— 修改器必须能改它（EMB-113）
const UNIQ_TEMPORALIS = {
  id: 'temporalis', n: '时空之肌', base: '秘法长袍', lv: 64,
  mods: [['es', [100, 150]]],
  st: ['将所受伤害的 5–30% 吸纳为生命', '技能的冷却时间 -2 ~ -1 秒'],
  sr: [[5, 30], [-2, -1]],
  srt: ['将所受伤害的 {0}% 吸纳为生命', '技能的冷却时间 {0} 秒'],
  fl: '说书人最后掌握的元素，乃是时光本身。',
};
const rift = {
  CUR, CUR_ORDER, CUR_GRP, WALLET: walletObj, G: player,
  AFF: {}, BASES: [], BASEMAP: {}, UNIQ: [UNIQ_TEMPORALIS], MI_LIST: [], SK: {}, SUP: {}, META: {}, BUFFS: {},
  BEASTS: {}, JTH: {}, UJW: {}, THEMES: {}, MAPTHEMES: {}, CORRUPT: [], TH_MUL: 1.5, WT: {},
  TWO_HAND: new Set(), TH_AFF: new Set(),
  // 珠宝词缀表（本体 JAFF:()=>es，slots 全是 "J"）
  JAFF: {
    j_melee: { id: 'j_melee', t: 'P', slots: 'J', nm: '武斗的', ranges: [[6, 8], [9, 11], [12, 14], [15, 18]], div: 1 },
    j_life: { id: 'j_life', t: 'S', slots: 'J', nm: '生命的', ranges: [[10, 14], [15, 19], [20, 24], [25, 30]], div: 1 },
  },
  affDef: () => ({ id: 'x', t: 'x', ti: 0, v: [1], ur: 0, fr: 0 }),
  modLine: () => 'x', nameItem: () => 'x', rollAffix: () => null,
  makeItem: mkItem, makeMi: mkItem, makeMap: mkItem, makeUnique: mkItem,
  mkGem: mkItem, mkSup: mkItem, mkMeta: mkItem, mkBuff: mkItem, mkJewel: mkItem,
  mkUniqueJewel: mkItem, mkSoul: mkItem,
  noteCraft: noop,
  // 复刻本体 I0()：珠宝池剔除 skillLvl
  corruptPool: (it) => {
    const pool = [['skillLvl', [1, 1]], ['lifeInc', [8, 12]], ['moveSpd', [3, 5]]];
    return it && it.kind === 'jewel' ? pool.filter(x => x[0] !== 'skillLvl') : pool;
  },
  save: () => { saved.char++; }, updPlayer: noop, saveWallet: () => { saved.wallet++; },
};

const dom = new JSDOM('<!doctype html><html><body></body></html>', {
  url: 'https://html-classic.itch.zone/html/1234',
  runScripts: 'outside-only',
  pretendToBeVisual: true,
});
const win = dom.window;
win.__rift = new Proxy({}, { get: (t, k) => (k in rift ? rift[k] : undefined), has: (t, k) => k in rift });
win.localStorage.setItem('ember-rift-wallet', JSON.stringify({ cur: { chaos: 10 } }));

/* ---------- 运行用户脚本 ---------- */
const src = fs.readFileSync(path.join(ROOT, 'ember-rift-gui.user.js'), 'utf8');
try {
  win.eval(src);
} catch (e) {
  console.error('[ui] 用户脚本在 jsdom 中抛异常: ' + (e && e.message));
  process.exit(2);
}

const $ = (sel) => win.document.querySelector(sel);
const $$ = (sel) => Array.prototype.slice.call(win.document.querySelectorAll(sel));
const click = (el) => el.dispatchEvent(new win.MouseEvent('click', { bubbles: true }));

setTimeout(() => {
  console.log('[ui] 通货页 · 分类与折叠');
  ok('面板已注入', !!$('#er-gui'));
  ok('五个页签都在', $$('.er-tab').length === 5, String($$('.er-tab').length));
  ok('搜索引擎框存在', !!$('#er-wq'));

  const names = $$('.er-wgname').map(e => e.textContent);
  ok('分组按游戏自身 CUR_GRP 排列', JSON.stringify(names) === JSON.stringify(['通货', '插槽', '符文', '精华', '印记']),
    names.join('/'));

  const basic = $$('.er-wghead')[0];
  ok('首屏只展开第一组（其余收起）',
    basic.parentElement.querySelector('.er-wgbody') && $$('.er-wgbody').length === 1,
    String($$('.er-wgbody').length));
  ok('分组标题显示种类数与持有合计', /15 种/.test(basic.textContent) && /持有 \d+/.test(basic.textContent),
    basic.textContent.trim());

  console.log('[ui] 每行内容与俗称');
  const rows = $$('.er-wgbody .er-wrow');
  ok('第一组列出 15 种通货', rows.length === 15, String(rows.length));
  const chaosRow = $$('.er-wrow').find(r => /混沌石/.test(r.textContent));
  ok('存在混沌石这一行', !!chaosRow);
  ok('混沌石带官方俗称 C', chaosRow && /^C$/.test(chaosRow.querySelector('.er-wslang').textContent.trim()));
  ok('每行都有一个输入框与两个按钮',
    rows.every(r => r.querySelector('input[type=number]') && r.querySelectorAll('.er-wacts button').length === 2));
  const dotStyles = rows.map(r => r.querySelector('.er-wdot').getAttribute('style') || '');
  ok('色点用的是游戏本体自带的通货颜色（均为 #rrggbb）',
    dotStyles.every(s => /#[0-9a-f]{3,6}\b/i.test(s)), dotStyles[0]);

  console.log('[ui] 补给幅度与「+N」按钮');
  const chaosAdd = () => $$('[data-add="chaos"]')[0];
  const chaosInput = () => $('#w-chaos');
  ok('输入框显示当前持有量 10', chaosInput().value === '10', chaosInput().value);
  ok('默认「适中」：混沌石一次 +15', chaosAdd().textContent.trim() === '+15', chaosAdd().textContent.trim());
  ok('神圣石属于珍贵档：一次 +2', $$('[data-add="divine"]')[0].textContent.trim() === '+2');
  click(chaosAdd());
  ok('点「+15」后钱包变成 25（标签即行为，不受输入框里的旧值影响）', walletObj.cur.chaos === 25, String(walletObj.cur.chaos));
  ok('界面同步显示新值', chaosInput().value === '25', chaosInput().value);
  ok('补给后写入了钱包', saved.wallet > 0, String(saved.wallet));

  const lv0 = $$('[data-lv]').find(b => b.dataset.lv === '0');
  click(lv0);
  ok('切到「少量」后按钮文案随之变化', $$('[data-add="chaos"]')[0].textContent.trim() === '+5',
    $$('[data-add="chaos"]')[0].textContent.trim());
  const lv2 = $$('[data-lv]').find(b => b.dataset.lv === '2');
  click(lv2);
  ok('切到「充足」后按钮文案随之变化', $$('[data-add="chaos"]')[0].textContent.trim() === '+60');
  click($$('[data-lv]').find(b => b.dataset.lv === '1'));

  console.log('[ui] 简介模式');
  ok('默认不显示简介行', $$('.er-wmeta').length === 0);
  click($('#er-wdetail'));
  const metas = $$('.er-wmeta');
  ok('开启后每行都有简介', metas.length === rows.length, String(metas.length));
  const firstMeta = metas[0].textContent;
  ok('简介首行是「掉落占比 · 估值 c」', /掉落 [0-9.]+% · 0\.02 c/.test(firstMeta), firstMeta.trim());
  ok('简介第二行是官方写的作用说明',
    /普通物品 . 魔法物品/.test(firstMeta), firstMeta.trim());
  ok('无掉落权重的显示获取途径', metas.some(m => /T6\+|T11|余烬祭坛/.test(m.textContent)));

  console.log('[ui] 搜索');
  const q = $('#er-wq');
  q.value = '完美';
  q.dispatchEvent(new win.Event('input', { bubbles: true }));
  const names2 = $$('.er-wgname').map(e => e.textContent);
  ok('未命中的分组被隐藏（只剩插槽）', JSON.stringify(names2) === JSON.stringify(['插槽']), names2.join('/'));
  ok('命中的分组自动展开', $$('.er-wgbody .er-wrow').length === 1, String($$('.er-wgbody .er-wrow').length));
  ok('搜索后焦点仍在搜索框', win.document.activeElement === $('#er-wq'));
  const q2 = $('#er-wq');
  q2.value = 'D';
  q2.dispatchEvent(new win.Event('input', { bubbles: true }));
  ok('可用俗称搜索（D → 神圣石）', /神圣石/.test(win.document.querySelector('.er-body').textContent));
  const q3 = $('#er-wq');
  q3.value = '';
  q3.dispatchEvent(new win.Event('input', { bubbles: true }));
  ok('清空搜索后分组恢复', $$('.er-wgname').length === 5, String($$('.er-wgname').length));

  console.log('[ui] 全部补给 / 清零');
  click($('#er-wrefill'));
  // 前面已经手动 +15 过一次（10 → 25），补给再按「适中」加 15 → 40
  const expect = {
    trans: 40, chaos: 40, divine: 2, exalt: 3, ember: 3, sig_crypt: 3, rune_fire: 40, ess_life: 15,
  };
  const wrong = Object.keys(expect).filter(k => walletObj.cur[k] !== expect[k]);
  ok('「全部补给 · 适中」按每档给出的量加算',
    wrong.length === 0,
    wrong.map(k => k + '=' + walletObj.cur[k] + '≠' + expect[k]).join(','));
  ok('34 种通货全部被补给', Object.keys(walletObj.cur).length === CUR_ORDER.length,
    String(Object.keys(walletObj.cur).length));
  ok('动手前留了快照', (win.localStorage.getItem('er-snapshots') || '').indexOf('补给前') >= 0);
  click($('#er-clearwallet'));
  ok('清零后所有通货归零', Object.keys(walletObj.cur).every(k => walletObj.cur[k] === 0));

  /* ---------------- 保底页 · 珠宝腐化 ---------------- */
  console.log('[ui] 保底页 · 珠宝可被腐化');
  // 背包里一颗、天赋树里一颗（本体插入后珠宝存在 u.jw，不在 inv）
  const jewelInv = {
    kind: 'jewel', slot: 'J', jt: 'n', base: '珠宝', ilvl: 80, rarity: 2, name: '武斗的珠宝',
    impl: [], mods: [{ id: 'j_melee', t: 'P', ti: 0, v: [6] }, { id: 'j_life', t: 'S', ti: 0, v: [10] }],
  };
  const jewelJw = {
    kind: 'jewel', slot: 'J', jt: 'n', base: '珠宝', ilvl: 80, rarity: 2, name: '射手的珠宝',
    impl: [], mods: [{ id: 'j_melee', t: 'P', ti: 1, v: [10] }],
  };
  player.inv.push(jewelInv);
  player.jw = [null, jewelJw];

  const gambTab = $$('.er-tab').find(t => /保底/.test(t.textContent));
  click(gambTab);

  const itemSel = $('#wg-item');
  ok('保底页已打开', !!itemSel);
  const optText = itemSel ? Array.from(itemSel.options).map(o => o.textContent).join(' | ') : '';
  ok('背包里的珠宝可被选中', /武斗的珠宝/.test(optText), optText);
  ok('已插入天赋树的珠宝也能被选中（本体存在 u.jw，不在 inv/equip）', /射手的珠宝/.test(optText), optText);

  // 选天赋树里那颗，验证列表来源与后续逻辑都不依赖 inv
  const jwOpt = Array.from(itemSel.options).find(o => /射手的珠宝/.test(o.textContent));
  itemSel.value = jwOpt.value;
  itemSel.dispatchEvent(new win.Event('change', { bubbles: true }));

  const vout = $('#wg-vout');
  const voutVals = vout ? Array.from(vout.options).map(o => o.value) : [];
  ok('珠宝没有「+1 符文插槽」结果项（本体把这一档改写为腐化词缀）',
    voutVals.indexOf('sock') < 0 && voutVals.indexOf('impl') >= 0, voutVals.join(','));
  ok('珠宝没有「同时 +1 符文插槽」勾选框', !$('#wg-vsock'));
  const vkeys = $('#wg-vkey') ? Array.from($('#wg-vkey').options).map(o => o.value) : [];
  ok('腐化词缀池剔除 skillLvl', vkeys.indexOf('skillLvl') < 0 && vkeys.length === 2, vkeys.join(','));
  ok('珠宝页面说明里写清楚「可以腐化」', /珠宝<b>可以<\/b>腐化/.test($('.er-body').innerHTML));
  ok('祭坛那一节对珠宝不可用', !$('#wg-doaltar') && /珠宝不可用/.test($('.er-body').innerHTML));

  click($('#wg-dovaal'));
  ok('执行腐化后打上 corrupted 标记', jewelJw.corrupted === true);
  ok('腐化词缀写入了 cimpl', !!jewelJw.cimpl && jewelJw.cimpl.k === 'lifeInc', JSON.stringify(jewelJw.cimpl));
  ok('珠宝不会被塞进符文插槽字段', jewelJw.extraSock === undefined && !jewelJw.rsock);

  // 一键必胜：珠宝只做「T1 拉满 + 腐化」，不应产生二次腐化
  click($('#wg-doall'));
  ok('一键必胜把珠宝词缀升到 T1 并拉满',
    jewelJw.mods[0].ti === 3 && JSON.stringify(jewelJw.mods[0].v) === '[18]',
    JSON.stringify(jewelJw.mods[0]));
  ok('一键必胜不会给珠宝加祭坛的二次腐化', jewelJw.dc === undefined && jewelJw.cimpl2 === undefined);

  // 回归：列表为空时 wireGamble 会带着 null 进来，不能因此抛异常
  player.inv.length = 0;
  player.jw = [];
  let threw = null;
  try { click($$('.er-tab').find(t => /保底/.test(t.textContent))); } catch (e) { threw = e; }
  ok('没有可选物品时不抛异常（wireGamble 容忍 null）',
    !threw && /请先在上方选一件装备/.test($('.er-body').textContent), threw && threw.message);

  /* ---------------- EMB-113 · 提示气泡 ---------------- */
  console.log('[ui] 提示气泡可读性');
  const cssText = $$('style').map(s => s.textContent || '').join('\n');
  const toastRule = (cssText.match(/\.er-toast\{[\s\S]*?\}/) || [''])[0];
  ok('气泡样式不再引用面板作用域的 CSS 变量（挂 body 上取不到）',
    !!toastRule && !/var\(--/.test(toastRule), toastRule.replace(/\s+/g, ' ').slice(0, 120));
  ok('气泡是深底浅字（原先是浅底浅字 → 什么也看不见）',
    /background:\s*rgba\(29,29,31/.test(toastRule) && /color:\s*#f5f5f7/.test(toastRule),
    toastRule.replace(/\s+/g, ' ').slice(0, 120));

  click($$('.er-tab').find(t => /通货/.test(t.textContent)));
  click($('#er-clearwallet'));
  const toastEl = $('.er-toast');
  ok('操作后生成了气泡元素', !!toastEl);
  ok('气泡里有文字', !!toastEl && toastEl.textContent.trim().length > 0, toastEl && toastEl.textContent);
  const toastCs = toastEl ? win.getComputedStyle(toastEl) : {};
  ok('气泡文字色是具体颜色（不是空/继承）', /^rgba?\(/.test(toastCs.color || ''), toastCs.color);
  ok('气泡不再拦截鼠标（pointer-events:none）', toastCs.pointerEvents === 'none', toastCs.pointerEvents);

  /* ---------------- EMB-113 · 传奇专属数值 ---------------- */
  console.log('[ui] 装备页 · 传奇数值可改');
  const temp = {
    uid: 880001, kind: 'item', base: '秘法长袍', slot: 'B', ilvl: 80, rarity: 3,
    uniq: 'temporalis', name: '时空之肌', impl: [],
    mods: [{ id: 'es', t: 'U', ur: [100, 150], v: [150] }],
    ur: [20, -1], rsock: 1, runes: [],
  };
  player.inv.push(temp);
  click($$('.er-tab').find(t => /装备/.test(t.textContent)));
  const card = $$('.er-item').find(el => /时空之肌/.test(el.textContent));
  ok('背包里能看到这件传奇', !!card);
  click(card);
  ok('出现「传奇数值」编辑区', /传奇数值（时空之肌）/.test($('.er-body').textContent));
  ok('两条 sr 各一个输入框', !!$('#u-0') && !!$('#u-1'));
  ok('输入框里是当前值', $('#u-0').value === '20' && $('#u-1').value === '-1',
    $('#u-0').value + '/' + $('#u-1').value);

  $('#u-0').value = '27';
  click($$('[data-uset]').find(b => b.dataset.uset === '0'));
  ok('item.ur[0] 被改写', temp.ur[0] === 27, String(temp.ur[0]));
  ok('ur 长度保持不变（长度变了扩展块会按 uid 重随）', temp.ur.length === 2, String(temp.ur.length));
  ok('改完给出「已修改」提示', /已修改/.test(($('.er-toast') || {}).textContent || ''));

  $('#u-0').value = '99';
  click($$('[data-uset]').find(b => b.dataset.uset === '0'));
  ok('越界值仍写入但会标出来', temp.ur[0] === 99 && /越界/.test(($('.er-toast') || {}).textContent || ''),
    String(temp.ur[0]));

  $('#u-1').value = 'abc';
  click($$('[data-uset]').find(b => b.dataset.uset === '1'));
  ok('非法输入被拒、数据不动', temp.ur[1] === -1, String(temp.ur[1]));

  /* ---------------- EMB-113 · 符文插槽 ---------------- */
  console.log('[ui] 装备页 · 插槽数量可改');
  ok('出现符文插槽编辑区', !!$('#er-rsock'));
  ok('初始值取自 item.rsock', $('#er-rsock').value === '1', $('#er-rsock').value);

  $('#er-rsock').value = '4';
  click($('#er-setrsock'));
  ok('插槽数写到 item.rsock', temp.rsock === 4, String(temp.rsock));
  ok('加出来的槽是空槽（不补假符文）', Array.isArray(temp.runes) && temp.runes.length === 0, JSON.stringify(temp.runes));

  temp.runes = ['rune_fire', 'rune_ice', 'rune_storm'];
  $('#er-rsock').value = '2';
  click($('#er-setrsock'));
  ok('减少插槽时裁剪 runes（与官方 setter 一致）',
    temp.rsock === 2 && temp.runes.length === 2, String(temp.rsock) + '/' + JSON.stringify(temp.runes));

  $('#er-rsock').value = '9';
  click($('#er-setrsock'));
  ok('超过上限被拒（仍是 2）', temp.rsock === 2, String(temp.rsock));

  $('#er-rsock').value = '0';
  click($('#er-setrsock'));
  ok('可以减到 0 槽', temp.rsock === 0 && temp.runes.length === 0, String(temp.rsock));

  console.log('-'.repeat(50));
  console.log(`[ui] 通过 ${pass} · 失败 ${fail}`);
  process.exit(fail ? 1 : 0);
}, 500);
