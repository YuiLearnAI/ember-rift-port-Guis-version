/* ============================================================
 *  《余烬裂隙》Ember Rift — 装备词缀自定义修改器 (v19.x)
 *  用途：给任意背包/已装备装备 增删改 词缀、改稀有度
 *  用法：F12 控制台（务必选到游戏 frame：html-classic.itch.zone），
 *        先 allow pasting，整段粘贴回车。
 *        ⚠ 必须在「已进入一个角色、身在游戏世界/主城」后，命令才会生效。
 *  与 ember-rift-cheat.js 共用 window.ER；两者都可单独运行。
 * ============================================================ */

(() => {
  const R = window.__rift;
  if (!R) { console.error('[ER] 没拿到 __rift，请确认在游戏 frame 里执行（看控制台左上角应为 html-classic.itch.zone，不是 top）'); return; }

  // 玩家对象 u：游戏内部用全局变量 u 保存，「当前角色」。
  // __rift 的模块 m4 把它以键名 G 暴露出来（G:()=>u），所以 R.G 就是玩家 u。
  // 进入角色前 u 为 null，这里实时获取，不在粘贴时锁定。
  const getPlayer = () => R.G || null;     // R.G === 玩家 u（含 .inv 背包 / .equip 已装备）
  const AFF = R.AFF || {};                 // 全词缀表 Yt
  const affDef = R.affDef;                 // Da(base,id) -> 词缀定义
  const modLine = R.modLine;               // js(item,mod) -> 中文显示文本
  const nameItem = R.nameItem;             // aa(item)    -> 重新命名
  const saveChar = R.save;                 // Xe()        -> 保存角色
  const updPlayer = R.updPlayer;           // a()         -> 重算角色属性
  const RARITY = ['普通', '魔法', '稀有', '传奇'];

  function needPlayer() {
    const P = getPlayer();
    if (!P) console.error('[ER] 还没进入角色：请先加载一个存档、进入游戏世界/主城，再调用命令。');
    return P;
  }

  // 建立 key -> item 引用
  // 装备 key 形如 "E:<部位>"（如 E:weapon），背包 key 形如 "I:<序号>"（如 I:5）
  function index() {
    const P = getPlayer(); if (!P) return [];
    const out = [];
    const eq = P.equip || {};
    for (const slot of Object.keys(eq)) if (eq[slot]) out.push({ key: 'E:' + slot, loc: '装备:' + slot, item: eq[slot] });
    (P.inv || []).forEach((it, i) => { if (it && it.kind === 'item') out.push({ key: 'I:' + i, loc: '背包#' + i, item: it }); });
    return out;
  }
  const find = (key) => { const r = index().find(x => x.key === key); return r ? r.item : null; };

  function refresh(item) {
    try { nameItem && nameItem(item); } catch (e) {}
    try { updPlayer && updPlayer(); } catch (e) {}
    try { saveChar && saveChar(); } catch (e) {}
  }

  const ER = (window.ER = window.ER || {});

  // 诊断：看玩家对象是否就绪
  ER.status = function () {
    const G = R.G;
    console.log('[ER] __rift 存在：', !!R);
    console.log('[ER] R.G (玩家对象) 类型：', G === null ? 'null（未进入角色）' : typeof G);
    if (G) {
      console.log('[ER] 背包物品数：', (G.inv || []).filter(x => x && x.kind === 'item').length);
      const eq = G.equip || {};
      const worn = Object.keys(eq).filter(k => eq[k]);
      console.log('[ER] 已装备部位：', worn.length ? worn.join(',') : '（无）');
    } else {
      console.log('[ER] 提示：请点进一个角色、进入游戏世界（能走动/开背包），再调用 ER.items()');
    }
    return G;
  };

  ER.help = function () {
    console.log([
      'ER.items()            列出全部背包/已装备物品（先看 key）',
      'ER.view("I5")         查看某件装备的词缀明细',
      'ER.affixes("P")       按类型/关键字列出可加的词缀（P前缀 S后缀）',
      'ER.add(key,id,value)  加词缀，双值词缀传数组 [v0,v1]',
      'ER.set(key,idx,val)   改某条词缀数值',
      'ER.del(key,idx)       删除词缀',
      'ER.setRarity(key,r)   改稀有度 0普通 1魔法 2稀有 3传奇',
      'ER.clearMods(key)     清空全部词缀',
      'ER.dumpItem(key)      导出整件装备 JSON',
      'ER.importMods(key,json) 整体替换词缀'
    ].join('\n'));
  };

  ER.items = function () {
    const P = needPlayer(); if (!P) return;
    const rows = index().map(x => ({
      key: x.key, 位置: x.loc, 名称: x.item.name, 稀有度: RARITY[x.item.rarity] || x.item.rarity,
      部位: x.item.slot, 词缀数: (x.item.mods || []).length, 物品等级: x.item.ilvl
    }));
    console.table(rows);
    if (rows.length) console.log('例：ER.view("' + rows[0].key + '")  查看； ER.add("' + rows[0].key + '","life",120)  加 +120 生命');
    return rows;
  };

  ER.view = function (key) {
    const P = needPlayer(); if (!P) return;
    const it = find(key);
    if (!it) { console.error('[ER] 找不到 key=' + key + '，先用 ER.items() 看列表'); return; }
    console.log('名称:', it.name, '| 稀有度:', RARITY[it.rarity] || it.rarity, '| 部位:', it.slot, '| iLvl:', it.ilvl);
    const mods = it.mods || [];
    if (!mods.length) { console.log('（无词缀）'); return; }
    const rows = mods.map((m, i) => {
      const def = affDef ? affDef(it, m.id) : null;
      const tier = m.ur ? 0 : (def && def.ranges ? def.ranges.length - (m.ti || 0) : '?');
      return { idx: i, id: m.id, 类型: m.t, 阶层: tier, 数值: JSON.stringify(m.v), 文本: modLine ? modLine(it, m) : m.id, 腐化: !!m.fr, 升华: !!m.ex };
    });
    console.table(rows);
    console.log('例：ER.set("' + key + '",0,120) 把 idx=0 的数值改成 120');
    console.log('    ER.del("' + key + '",0)      删除 idx=0');
    return rows;
  };

  ER.affixes = function (type, kw) {
    const rows = [];
    for (const id in AFF) {
      const d = AFF[id];
      if (type && d.t !== type) continue;
      if (kw && !(id.includes(kw) || (d.nm || '').includes(kw) || (d.text || '').includes(kw))) continue;
      const r0 = d.ranges && d.ranges[0];
      const rN = d.ranges && d.ranges[d.ranges.length - 1];
      const fmt = arr => Array.isArray(arr[0]) ? arr.map(x => x.join('~')).join(' / ') : arr.join('~');
      rows.push({ id, 名称: d.nm || '(无独立名)', 类型: d.t, 部位: d.slots, T1: r0 ? fmt(r0) : '-', 最低阶: rN ? fmt(rN) : '-', 双值: !!d.pair });
    }
    console.table(rows);
    console.log('类型 P=前缀 S=后缀 U=传奇。数值来自各阶 [min,max]，填值时按你想要的固定数值给即可。');
    console.log('例：ER.affixes("P")  只列前缀； ER.affixes("S","res")  搜后缀里含 res 的');
    return rows;
  };

  // ER.add(key, id, value, [type], [ti])  value 数字(单值)；双值传 [v0,v1]
  ER.add = function (key, id, value, type, ti) {
    const P = needPlayer(); if (!P) return;
    const it = find(key);
    if (!it) { console.error('[ER] 找不到 key=' + key); return; }
    const d = AFF[id];
    if (!d) { console.error('[ER] 词缀 id 不存在：' + id + '，先用 ER.affixes() 查'); return; }
    const t = type || d.t || 'P';
    const v = Array.isArray(value) ? value.map(Number) : [Number(value)];
    if (d.pair && v.length < 2) { console.error('[ER] ' + id + ' 是双值词缀，请传数组 [v0,v1]'); return; }
    it.mods = it.mods || [];
    it.mods.push({ id, t, ti: ti || 0, v });
    refresh(it);
    console.log('[ER] 已加 ' + id + ' 到 ' + it.name + '：', JSON.stringify({ id, t, ti: ti || 0, v }));
    ER.view(key);
  };

  ER.set = function (key, idx, value) {
    const P = needPlayer(); if (!P) return;
    const it = find(key);
    if (!it || !it.mods) { console.error('[ER] 找不到物品或词缀'); return; }
    const m = it.mods[idx];
    if (!m) { console.error('[ER] idx 越界：' + idx); return; }
    m.v = Array.isArray(value) ? value.map(Number) : [Number(value)];
    refresh(it);
    console.log('[ER] 已改 ' + m.id + ' →', JSON.stringify(m.v));
    ER.view(key);
  };

  ER.del = function (key, idx) {
    const P = needPlayer(); if (!P) return;
    const it = find(key);
    if (!it || !it.mods) { console.error('[ER] 找不到物品或词缀'); return; }
    const m = it.mods.splice(idx, 1)[0];
    refresh(it);
    console.log('[ER] 已删除', m ? m.id : '(空)', '剩余', it.mods.length, '条');
    ER.view(key);
  };

  ER.setRarity = function (key, rarity) {
    const P = needPlayer(); if (!P) return;
    const it = find(key);
    if (!it) { console.error('[ER] 找不到 key=' + key); return; }
    it.rarity = Math.max(0, Math.min(3, rarity | 0));
    refresh(it);
    console.log('[ER] ' + it.name + ' 稀有度 → ' + RARITY[it.rarity]);
    ER.view(key);
  };

  ER.clearMods = function (key) {
    const P = needPlayer(); if (!P) return;
    const it = find(key);
    if (!it) return;
    it.mods = [];
    refresh(it);
    console.log('[ER] 已清空 ' + it.name + ' 的词缀');
    ER.view(key);
  };

  ER.dumpItem = function (key) { const P = needPlayer(); if (!P) return; const it = find(key); return it ? JSON.parse(JSON.stringify(it)) : null; };
  ER.importMods = function (key, modsJson) {
    const P = needPlayer(); if (!P) return;
    const it = find(key);
    if (!it) return;
    try { it.mods = JSON.parse(modsJson); } catch (e) { console.error('[ER] JSON 解析失败', e); return; }
    refresh(it);
    console.log('[ER] 已导入词缀');
    ER.view(key);
  };

  console.log('%c[余烬裂隙] 装备词缀修改器已就绪','color:#7affc8;font-weight:bold;font-size:14px');
  console.log('⚠ 请先进入一个角色（加载存档、进入游戏世界/主城），再调用 ER.items() 等命令。');
  console.log('ER.help() 查看全部命令。');
})();
