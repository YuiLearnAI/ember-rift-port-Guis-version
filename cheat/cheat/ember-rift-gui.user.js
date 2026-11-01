// ==UserScript==
// @name         余烬裂隙 Ember Rift 修改器 (GUI)
// @namespace    https://workbuddy.app/ember-rift
// @version      1.1
// @description  在游戏页面内注入悬浮面板，图形化修改通货与装备词缀（基于 __rift）
// @author       WorkBuddy
// @match        https://ember-rift.pages.dev/*
// @match        https://jason-xx614.itch.io/ember-rift*
// @match        https://html-classic.itch.zone/html/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
  'use strict';

  // 避免重复注入
  if (window.__emberRiftGui) return;

  const POLL = setInterval(() => {
    const R = window.__rift;
    if (R && typeof R.G !== 'undefined') {
      clearInterval(POLL);
      boot(R);
    }
  }, 300);

  // 5 秒后若仍无 __rift（如外层 itch 页面），放弃注入
  setTimeout(() => clearInterval(POLL), 8000);

  function boot(R) {
    if (window.__emberRiftGui) return;
    window.__emberRiftGui = true;

    /* ---------------- 数据接口 ---------------- */
    const WALLET = R.WALLET;
    const CUR = R.CUR || {};
    const CUR_ORDER = Array.isArray(R.CUR_ORDER) ? R.CUR_ORDER : Object.keys(CUR);
    const AFF = R.AFF || {};
    // 珠宝词缀表：本体 game.html 是独立一套（es，slots 全是 "J"），与装备的 AFF（Yt）不通用。
    // 导出名 JAFF:()=>es —— 全文仅此一处、无重名，Proxy 可取；缺失时退化为空表（旧版游戏）
    const JAFF = R.JAFF || {};
    const affDef = R.affDef;
    const modLine = R.modLine;
    const nameItem = R.nameItem;
    const saveChar = R.save;
    const updPlayer = R.updPlayer;
    const saveWallet = R.saveWallet;
    // 生成装备用：BASES 是基底数组 [{n,slot,lv,...}]，makeItem(baseEntry, ilvl, rarity) 内部会自动 roll 词缀
    const BASES = Array.isArray(R.BASES) ? R.BASES : [];
    const makeItem = R.makeItem;
    const RARITY = ['普通', '魔法', '稀有', '传奇'];

    /* ---- 双手武器伤害倍率（取游戏自身数据，与 Nl()/gd() 完全一致） ----
       游戏在「显示」与「属性结算」时才乘倍率（gd(e,t)=v.map(x=>Math.round(x*Zg))），
       存进 item.mods[].v 的是**未乘的基值**。因此面板按「游戏里看到的数值」收发，
       写入时反解回基值，避免出现「填 180 结果变成 270%」。 */
    const BASEMAP = R.BASEMAP || {};
    const WTNAME = R.WT || {};
    const TH_MUL = Number(R.TH_MUL) || 1.5;                       // 游戏 Zg = 1.5
    const TH_AFF = (R.TH_AFF instanceof Set) ? R.TH_AFF           // 游戏 Fg：享受倍率的伤害类词缀
      : new Set(['addPhys', 'addFire', 'addCold', 'addLight', 'physInc', 'spellInc',
                 'meleeInc', 'fireInc', 'coldInc', 'lightInc', 'projDmg']);
    const TWO_HAND = (R.TWO_HAND instanceof Set) ? R.TWO_HAND     // 游戏 Mu：双手武器类型
      : new Set(['bow', 'qstaff', 'staff', 'crossbow']);

    /* ---- 赌博类操作保底（工艺台 / 瓦尔宝珠 / 余烬祭坛） ---- */
    const noteCraft = R.noteCraft;                                // Ci(kind, item, extra|null) → item.cr[kind]++（铸造履历）
    const CORRUPT_POOL = Array.isArray(R.CORRUPT) ? R.CORRUPT : []; // gu: [["skillLvl",[1,1]],["lifeInc",[8,12]],...]
    const corruptPool = R.corruptPool;                            // I0(item)：珠宝会剔除 skillLvl
    // 腐化词缀显示名取自本体 C3 表（Wa=(k,v)=>(C3[k]||k+" {v}").replace("{v}",v)）。
    // 注意：C3 里漏了 skillLvl，游戏会原样显示 "skillLvl 1" —— 这里用 AFF 文本补全。
    const CIMPL_TEXT = {
      skillLvl: '+{v} 所有技能宝石等级', lifeInc: '最大生命提高 {v}%', critInc: '暴击率提高 {v}%',
      leech: '击中偷取 {v}% 伤害为生命', resAll: '+{v}% 所有元素抗性', moveInc: '移动速度提高 {v}%',
      atkSpd: '攻击速度提高 {v}%', castSpd: '施法速度提高 {v}%', spirit: '+{v} 精魂',
      rarity: '物品稀有度提高 {v}%',
    };

    /* ---- 全物品类型：生成器 + 数据表（均已在游戏本体 game.html 中逐一核对） ---- */
    // 物品种类口径取自游戏自身的仓库页签分类 (游戏 fc = [["gen","装备"],["map","地图"],["gem","宝石"],["uniq","传奇"],["soul","兽魂"],["jewel","珠宝"]])
    const makeMi = R.makeMi;                  // Aw(miId, ilvl, src, modCount)  → kind:"item"(rarity2, 带 .mi)
    const makeUnique = R.makeUnique;          // Ut(uniqDef, ilvl)              → rarity 3
    const makeMap = R.makeMap;                // Ht(tier)                       → kind:"map"
    const mkGem = R.mkGem;                    // ho(gid, lvl, sock)             → kind:"gem"
    const mkSup = R.mkSup;                    // _s(gid)                        → kind:"sup"
    const mkMeta = R.mkMeta;                  // ar(gid)                        → kind:"meta"
    const mkBuff = R.mkBuff;                  // el(gid)                        → kind:"buff"
    const mkJewel = R.mkJewel;                // G0(jt, ilvl, rarity, thKey)    → kind:"jewel"
    const mkUniqueJewel = R.mkUniqueJewel;    // Hr(ujwId, ilvl)                → kind:"jewel"(rarity3)
    const mkSoul = R.mkSoul;                  // E0(beastId, ilvl, rarity)      → kind:"soul"

    const UNIQ = Array.isArray(R.UNIQ) ? R.UNIQ : [];        // 传奇装备定义表 [{id,n,base,lv,mods}]
    const MI_LIST = Array.isArray(R.MI_LIST) ? R.MI_LIST : []; // 异种底材 [{id,n,base,slot,from}]
    const MAPTHEMES = Array.isArray(R.MAPTHEMES) ? R.MAPTHEMES : []; // ["crypt","lava","ice","swamp"]
    const THEMES = R.THEMES || {};            // {crypt:{key,names:[...]}}
    const JTH = R.JTH || {};                  // 大型珠宝来源 {key: {base,...}}
    const JTH_ORDER = Array.isArray(R.JTH_ORDER) ? R.JTH_ORDER : [];
    const UJW = R.UJW || {};                  // 传奇珠宝 {id:{n,jt,r,...}}
    const BEASTS = R.BEASTS || {};            // 兽魂来源 {id:{n,cls,spirit,...}}
    const SK = R.SK || {};                    // 技能宝石 {gid:{n,tags,...}}
    const SUP = R.SUP || {};                  // 辅助宝石 {gid:{n,req,d}}
    const META = R.META || {};                // 元技能 {gid:{n,spirit,d}}
    const BUFFS = R.BUFFS || {};              // 光环/捷 {gid:{n,spirit,d}}
    const STASH = R.STASH || null;            // 共享仓库 {tabs:{gen,map,gem,uniq,soul,jewel}}
    const TAB_CAP = R.TAB_CAP || {};          // {gen:120,map:200,gem:200,uniq:200,soul:120,jewel:120}
    const MAP_CAP = R.MAP_CAP || 120;         // 游戏 ga = 120，地图袋容量

    const player = () => R.G || null;

    function refresh(item) {
      try { nameItem && nameItem(item); } catch (e) {}
      try { updPlayer && updPlayer(0); } catch (e) {}   // 传 0 触发属性重算，避免冷却计时器被写成 NaN
      try { saveChar && saveChar(); } catch (e) {}
    }
    function saveAll() {
      try { saveWallet && saveWallet(); } catch (e) {}
      try { saveChar && saveChar(); } catch (e) {}
      toast('已保存');
    }
    // 带保护的钱包保存：写盘失败（配额/版本变化）时不打断当前操作
    function safeSaveWallet() { try { saveWallet && saveWallet(); } catch (e) {} }
    // 带保护的词缀文本格式化：失败时返回 null，由调用方回退显示 id
    function safeModLine(it, m) { try { return modLine ? modLine(it, m) : null; } catch (e) { return null; } }

    /* ---------------- 常量（取自游戏本体核对结果） ---------------- */
    // 部位代码 → 中文名（游戏 $s 映射）
    const SLOTNAME = { W: '武器', H: '头盔', B: '胸甲', G: '手套', F: '鞋子', R: '戒指', A: '项链', L: '腰带', Q: '箭袋', S: '盾牌', X: '法器', K: '胁差', J: '珠宝', Z: '兽魂', M: '地图' };
    const INV_CAP = 160;   // 游戏 Ft = 160（不含地图）

    /* ---------------- 存档快照（独立 key，绝不碰游戏存档） ---------------- */
    const SNAP_KEY = 'er-snapshots';
    const SNAP_MAX = 5;
    function snapList() {
      try { const a = JSON.parse(localStorage.getItem(SNAP_KEY) || '[]'); return Array.isArray(a) ? a : []; }
      catch (e) { return []; }
    }
    function snapSave(list) {
      try { localStorage.setItem(SNAP_KEY, JSON.stringify(list)); return true; }
      catch (e) {
        // 配额超限：丢弃较旧的快照后重试
        try { localStorage.setItem(SNAP_KEY, JSON.stringify(list.slice(0, 2))); return true; }
        catch (e2) { return false; }
      }
    }
    function snapTake(label) {
      const P = player(); if (!P) return false;
      let u, w = null;
      try { u = JSON.parse(JSON.stringify(P)); } catch (e) { return false; }
      try { w = R.WALLET ? JSON.parse(JSON.stringify(R.WALLET)) : null; } catch (e) { w = null; }
      const list = snapList();
      list.unshift({ t: Date.now(), label: label || '编辑前', u, w });
      while (list.length > SNAP_MAX) list.pop();
      return snapSave(list);
    }
    // 原地还原：改写 R.G / R.WALLET 指向的同一对象，游戏变量 u 仍指向它，无需读盘重载
    function snapRestore(idx) {
      const list = snapList(); const s = list[idx]; if (!s || !s.u) return false;
      const P = player();
      if (P) { for (const k of Object.keys(P)) delete P[k]; Object.assign(P, s.u); }
      if (R.WALLET && s.w) { for (const k of Object.keys(R.WALLET)) delete R.WALLET[k]; Object.assign(R.WALLET, s.w); }
      try { updPlayer && updPlayer(0); } catch (e) {}
      try { saveChar && saveChar(); } catch (e) {}
      safeSaveWallet();
      return true;
    }
    function snapClear() { try { localStorage.removeItem(SNAP_KEY); } catch (e) {} }
    // 修改前自动快照：3 秒内的连续编辑共用同一份（保留"这一串编辑之前"的状态，避免刷屏）
    function snapAuto(label) {
      const list = snapList(); const last = list[0];
      if (last && (Date.now() - last.t) < 3000) return false;
      return snapTake(label);
    }

    /* ---------------- 词缀数值范围（越界提示用） ---------------- */
    function flattenNums(x, out) {
      out = out || [];
      if (Array.isArray(x)) { for (const v of x) flattenNums(v, out); }
      else if (typeof x === 'number' && isFinite(x)) out.push(x);
      return out;
    }
    // 返回 {min,max,tiers:[{ti,lo,hi}]}；无 ranges 则返回 null
    function rangeInfo(def) {
      const rs = (def && def.ranges) || [];
      if (!rs.length) return null;
      const all = flattenNums(rs);
      if (!all.length) return null;
      const tiers = rs.map((r, ti) => {
        const f = flattenNums(r);
        return { ti, lo: Math.min.apply(null, f), hi: Math.max.apply(null, f) };
      });
      return { min: Math.min.apply(null, all), max: Math.max.apply(null, all), tiers };
    }
    // 阶层编号约定（对齐游戏本体 game.html 的 forge 面板，切勿再反）：
    //   ranges 数组按「弱 → 强」排列，索引越大数值越高
    //   T1 = 最高阶 = ranges[ranges.length-1]；T{n} = 最低阶 = ranges[0]
    //   依据：h.ranges.map((x,S)=>"T"+(b-S)) 与 allT1 分支的 r.ti = i.ranges.length-1
    function tierCount(def) { return ((def && def.ranges) || []).length; }
    function tierLabel(def, ti) {
      const n = tierCount(def); if (!n) return '';
      return 'T' + (n - Math.max(0, Math.min(n - 1, ti || 0)));
    }
    // 最高阶 T1 对应的 ranges 索引（无范围数据返回 0）
    function topTierIdx(def) { const n = tierCount(def); return n ? n - 1 : 0; }
    // 越界则返回 {ri, bad, min, max}（min/max 为倍率后的生效区间）；合法返回 null
    // mul = 该词缀的实际倍率（双手武器伤害类 = TH_MUL）。内部仍以「存储基值 vs 原始范围」
    // 比较（与游戏一致），仅把报告给用户的最小/最大值换算成游戏里看到的数值。
    function outOfRange(def, v, mul) {
      const ri = rangeInfo(def); if (!ri) return null;
      const vals = flattenNums(Array.isArray(v) ? v : [v]);
      const bad = vals.filter(x => x < ri.min || x > ri.max);
      if (!bad.length) return null;
      const m = mul || 1;
      return { ri, bad, min: Math.round(ri.min * m), max: Math.round(ri.max * m) };
    }
    // 词缀定义查表：珠宝走 JAFF（本体 es），其余走 AFF（本体 Yt）。
    // 两张表 id 不重叠（JAFF 全是 j_*），混用会让游戏按错误表读取 —— 所以只能从这里取。
    function affOf(it, id) {
      return (it && it.kind === 'jewel' ? JAFF : AFF)[id];
    }

    /* ---------------- 传奇专属数值（item.ur） ----------------
       官方 makeUnique（本体 Kt）只写 mods；扩展包把「传奇专属数值」另外写进 item.ur ——
       一个与 def.sr 等长的数组，def.srt 里的 {0} 就是它（见 build/block_v19.js 里对 Kt / qs
       的接管）。扩展块在 ur 长度与 sr 不一致时会按 uid 重随，所以写回时只改单格、保持长度。 */
    function uniqDef(it) {
      if (!it || it.kind !== 'item' || it.rarity !== 3 || !it.uniq) return null;
      const d = UNIQ.find(x => x && x.id === it.uniq);
      if (d) return d;
      try { return (R.UNIQMAP && R.UNIQMAP[it.uniq]) || null; } catch (e) { return null; }
    }
    function uniqRolls(it) {
      const d = uniqDef(it);
      if (!d || !Array.isArray(d.sr)) return null;
      const want = d.sr.length;
      if (!Array.isArray(it.ur) || it.ur.length !== want) {
        let got = null;
        // 优先借扩展块自己的惰性补齐，保证与「掉落时随机到的值」同一套算法
        try { got = window.__TEMPORALIS_ROLL ? window.__TEMPORALIS_ROLL(it) : null; } catch (e) { got = null; }
        if (!Array.isArray(got) || got.length !== want) {
          got = d.sr.map(r => (r ? Math.round((r[0] + r[1]) / 2) : null));
        }
        it.ur = got.slice();
      }
      return it.ur;
    }
    // 传奇数值行模板：把 srt 里的 {0} 去掉，剩下的就是这一行的中文说明
    function uniqLineLabel(def, i) {
      const tpl = (def && Array.isArray(def.srt) && def.srt[i]) || (def && Array.isArray(def.st) && def.st[i]) || '';
      return String(tpl).replace(/\{[^}]*\}/g, '').replace(/\s+/g, ' ').trim() || ('传奇数值 #' + (i + 1));
    }
    // 符文插槽上限：官方编辑面板给 0–2 且只放行底材允许的部位，这里放到 6（空槽不影响结算）
    const RSOCK_MAX = 6;

    /* ---------------- 双手武器倍率（与游戏 Nl() / gd() / Bw() 对齐） ---------------- */
    // 是否双手武器：item.base 在 BASEMAP 中且 slot==="W" 且武器类型 wt 属于 TWO_HAND
    function isTwoHand(it) {
      if (!it || it.kind !== 'item') return false;
      const b = BASEMAP[it.base];
      return !!(b && b.slot === 'W' && TWO_HAND.has(b.wt));
    }
    // 该条词缀是否享受双手倍率（游戏 Nl 的全部条件：非 implicit、id 在 TH_AFF 内、定义存在）
    function thMulFor(it, modId, modObj) {
      if (!isTwoHand(it) || !modId || !TH_AFF.has(modId) || !AFF[modId]) return 1;
      if (modObj && Array.isArray(it.impl) && it.impl.indexOf(modObj) >= 0) return 1; // implicit 不吃倍率
      return TH_MUL;
    }
    // 面板值（游戏显示的生效值）→ 需写回 item.mods[].v 的基值。反解保证 Math.round(s*mul)===面板值
    function toStoredVal(target, mul) {
      const m = mul || 1;
      if (m === 1) return target;
      const approx = target / m;
      const lo = Math.floor(approx) - 3, hi = Math.ceil(approx) + 3;
      for (let s = lo; s <= hi; s++) { if (s >= 0 && Math.round(s * m) === target) return s; }
      // Math.round(s*1.5) 无法用整数命中 ≡1 (mod 3) 的目标（如 100），整数回退会系统性偏高 1。
      // 这里退回精确小数，保证「填多少 → 游戏里就显示多少」。显示/结算处本来就有 Math.round，不受影响。
      return Math.round(approx * 10000) / 10000;
    }
    function effArr(v, mul) { const m = mul || 1; return (v || []).map(x => Math.round(x * m)); }
    function storedArr(v, mul) { return (v || []).map(x => toStoredVal(Number(x) || 0, mul)); }
    // 背包已用格数（与游戏 Sa() 一致：不计地图）
    function invCount() {
      const P = player(); if (!P) return 0;
      return (P.inv || []).reduce((n, t) => n + (t && t.kind === 'map' ? 0 : 1), 0);
    }
    // 地图单独计入地图袋（游戏 ga = 120），不占普通背包格
    function mapCount() {
      const P = player(); if (!P) return 0;
      return (P.inv || []).reduce((n, t) => n + (t && t.kind === 'map' ? 1 : 0), 0);
    }

    /* ---------------- 物品落点与容量判定 ---------------- */
    // 背负类：装备/异种/传奇/兽魂/珠宝 走 u.inv；地图走 u.inv（记入地图袋）
    // 宝石类：技能/辅助/元技能/光环 走 u.gems（游戏无宝石上限）
    function isGemKind(kind) { return kind === 'gem' || kind === 'sup' || kind === 'meta' || kind === 'buff'; }
    // 物品应进哪个仓库页签（沿用游戏本体 aS() 的分类逻辑）
    function stashTabFor(item) {
      if (!item) return 'gen';
      if (item.kind === 'map') return 'map';
      if (isGemKind(item.kind)) return 'gem';
      if (item.kind === 'soul') return 'soul';
      if (item.kind === 'jewel') return 'jewel';
      if (item.rarity === 3 || item.mi) return 'uniq';   // 传奇 / 异种底材
      return 'gen';
    }
    // 返回 {ok, msg}：目标容器是否还有空间
    function hasRoom(item, dest) {
      if (dest === 'stash') {
        const tab = stashTabFor(item);
        const tabs = STASH && STASH.tabs || {};
        const arr = tabs[tab];
        if (!Array.isArray(arr)) return { ok: false, msg: '未能读取仓库「' + tab + '」页签' };
        const cap = TAB_CAP[tab] || Infinity;
        if (arr.length >= cap) return { ok: false, msg: '仓库「' + tab + '」已满（' + arr.length + '/' + cap + '）' };
        return { ok: true, tab };
      }
      if (isGemKind(item.kind)) return { ok: true };            // u.gems 无上限
      if (item.kind === 'map') {
        return mapCount() < MAP_CAP ? { ok: true } : { ok: false, msg: '地图袋已满（' + mapCount() + '/' + MAP_CAP + '）' };
      }
      return invCount() < INV_CAP ? { ok: true } : { ok: false, msg: '背包已满（' + invCount() + '/' + INV_CAP + '）' };
    }
    // 真正放入目标容器
    function placeItem(item, dest) {
      const P = player(); if (!P) return false;
      if (dest === 'stash') {
        const tabs = STASH && STASH.tabs;
        if (!tabs) return false;
        const tab = stashTabFor(item);
        tabs[tab] = Array.isArray(tabs[tab]) ? tabs[tab] : [];
        tabs[tab].push(item);
        return true;
      }
      if (isGemKind(item.kind)) { P.gems = P.gems || []; P.gems.push(item); return true; }
      P.inv = P.inv || []; P.inv.push(item); return true;
    }

    /* ---------------- 样式 ----------------
       设计依据: docs/design/apple-DESIGN.md（VoltAgent/awesome-design-md 的 Apple 设计语言）
       组件映射 —— 顶栏=global-nav · 标签栏=sub-nav-frosted · 内容卡=store-utility-card
                 主按钮=button-primary(蓝胶囊) · 行内小按钮=button-pearl-capsule · 输入框=search-input
       两条铁律：① 全系统零 box-shadow（唯一阴影 rgba(0,0,0,.22) 3px 5px 30px 只给产品图）
                 ② 单一强调色 Action Blue #0066cc，不引入第二个品牌色
       字号/圆角/间距一律取自 doc 的 token scale；语义状态色见 DESIGN.md 的「Project extensions」段 */
    const css = `
#er-gui,.er-gui{
  --canvas:#ffffff; --parchment:#f5f5f7; --pearl:#fafafc; --hairline:#e0e0e0; --divide:rgba(0,0,0,.08);
  --ink:#1d1d1f; --ink-80:#333333; --ink-64:#6e6e73; --on-dark:#ffffff;
  --blue:#0066cc; --blue-focus:#0071e3; --blue-on-dark:#2997ff;
  /* 语义色为 Apple HIG 系统色（systemRed/Orange/Green 的暗色调），登记在 DESIGN.md 的 Project extensions。
     Impeccable 检测后调整：原 ink-muted-48(#7a7a7a) 在羊皮纸底上仅 3.94:1，未达 WCAG AA，改用 Apple 官网真实 secondary 灰 #6e6e73 */
  --st-error:#d70015; --st-error-ink:#b00014; --st-warn:#9c2b00; --st-success:#1d6f31;
  position:fixed;top:16px;right:16px;width:360px;max-height:88vh;z-index:2147483647;
  background:rgba(255,255,255,.96);color:var(--ink);
  -webkit-backdrop-filter:saturate(180%) blur(20px);backdrop-filter:saturate(180%) blur(20px);
  font:14px/1.43 SF Pro Text,system-ui,-apple-system,sans-serif;
  letter-spacing:-.224px;border:1px solid var(--divide);border-radius:18px;
  display:flex;flex-direction:column;overflow:hidden}
#er-gui *,.er-gui *{box-sizing:border-box}
#er-gui ::-webkit-scrollbar,.er-gui ::-webkit-scrollbar{width:8px;height:8px}
#er-gui ::-webkit-scrollbar-thumb,.er-gui ::-webkit-scrollbar-thumb{background:var(--hairline);border-radius:9999px}
#er-gui ::selection,.er-gui ::selection{background:rgba(0,102,204,.16)}
/* global-nav：纯黑 44px 顶栏，是整套系统里唯一出现纯黑的地方 */
.er-head{display:flex;align-items:center;gap:8px;min-height:44px;padding:13px 17px;
  background:#000000;color:var(--on-dark);cursor:move;user-select:none;flex:0 0 auto}
.er-title{flex:1;font-size:12px;font-weight:400;line-height:1;letter-spacing:-.12px;color:var(--on-dark)}
.er-btn-min,.er-btn-x{padding:0 6px;cursor:pointer;color:var(--on-dark);opacity:.72;font-size:12px;line-height:1}
.er-btn-min:active,.er-btn-x:active{transform:scale(.95)}
.er-btn-min:focus-visible,.er-btn-x:focus-visible{outline:2px solid var(--blue-focus);outline-offset:2px}
/* sub-nav-frosted：羊皮纸 80% + 毛玻璃， monomers 高度感来自模糊而非阴影 */
.er-tabs{display:flex;flex:0 0 auto;background:rgba(245,245,247,.8);
  -webkit-backdrop-filter:blur(20px);backdrop-filter:blur(20px);border-bottom:1px solid var(--divide)}
.er-tab{flex:1;text-align:center;padding:11px 0;cursor:pointer;font-size:12px;font-weight:400;
  letter-spacing:-.12px;color:var(--ink-80);border-bottom:2px solid transparent;transition:color .18s ease}
.er-tab.on{color:var(--blue);border-bottom-color:var(--blue)}
.er-tab:active{transform:scale(.95)}
.er-body{padding:17px;overflow:auto}
.er-row{display:flex;align-items:center;gap:8px;margin:8px 0}
.er-row label{flex:1;font-size:14px;color:var(--ink-80);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
/* search-input：全圆角胶囊输入框 */
.er-input{width:88px;background:var(--canvas);border:1px solid var(--divide);color:var(--ink);
  padding:6px 14px;border-radius:9999px;font-size:14px;font-family:inherit;letter-spacing:-.224px}
.er-input:focus{outline:2px solid var(--blue-focus);outline-offset:1px;border-color:var(--blue-focus)}
/* button-pearl-capsule：默认行内按钮 */
.er-btn{background:var(--pearl);color:var(--ink-80);border:3px solid var(--hairline);border-radius:11px;
  padding:5px 12px;cursor:pointer;font-size:12px;letter-spacing:-.12px;font-family:inherit;transition:transform .12s ease}
.er-btn:active{transform:scale(.95)}
.er-btn:focus-visible{outline:2px solid var(--blue-focus);outline-offset:2px}
/* button-primary：Action Blue 胶囊，唯一的品牌动作信号 */
.er-btn.go{background:var(--blue);color:var(--on-dark);border:1px solid var(--blue);border-radius:9999px;
  padding:8px 18px;font-size:14px;letter-spacing:-.224px}
.er-btn.go:active{transform:scale(.95)}
.er-mini{padding:3px 10px;font-size:12px}
.er-grp{margin:17px 0 8px;font-size:12px;font-weight:600;letter-spacing:-.12px;color:var(--ink-80);
  border-bottom:1px solid var(--divide);padding-bottom:6px}
/* store-utility-card：白底 + 发丝边框 + 18px 圆角，无阴影 */
.er-item{background:var(--canvas);border:1px solid var(--hairline);border-radius:18px;
  padding:12px 17px;margin:8px 0;cursor:pointer;transition:border-color .18s ease}
.er-item:active{transform:scale(.995)}
.er-item .nm{font-size:17px;font-weight:600;letter-spacing:-.374px;color:var(--ink)}
.er-item .meta{color:var(--ink-64);font-size:12px;letter-spacing:-.12px;margin-top:2px}
.er-affix{display:flex;align-items:center;gap:8px;margin:6px 0;padding:8px 12px;
  background:var(--parchment);border-radius:8px}
.er-affix .tx{flex:1;font-size:12px;letter-spacing:-.12px;color:var(--ink-80);line-height:1.4}
.er-sel{background:var(--canvas);color:var(--ink);border:1px solid var(--divide);border-radius:9999px;
  padding:6px 14px;font-size:14px;font-family:inherit;letter-spacing:-.224px;width:100%}
.er-sel:focus{outline:2px solid var(--blue-focus);outline-offset:1px}
.er-combo{position:relative}
.er-suggest{position:absolute;left:0;right:0;top:100%;z-index:50;max-height:220px;overflow:auto;
  background:var(--canvas);border:1px solid var(--hairline);border-radius:18px;margin-top:4px;display:none}
.er-sug{padding:8px 14px;cursor:pointer;font-size:12px;letter-spacing:-.12px;
  display:flex;align-items:center;gap:8px;border-bottom:1px solid var(--parchment)}
.er-sug:last-child{border-bottom:0}
.er-sug:hover,.er-sug.hl{background:var(--parchment)}
.er-sugid{color:var(--blue);font-size:12px}
.er-sugt{margin-left:auto;color:var(--ink-64);font-size:12px}
.er-hint{color:var(--ink-64);font-size:12px;letter-spacing:-.12px;line-height:1.5;margin:8px 0}
.er-empty{color:var(--ink-64);text-align:center;padding:32px 0;font-size:14px}
.er-status b{color:var(--blue);font-weight:600}
.er-big{display:flex;gap:8px;margin:12px 0;flex-wrap:wrap}
.er-big .er-btn{flex:1}
/* floating：毛玻璃提示条，高度感来自模糊层。
   EMB-113：气泡挂到 body 上，不继承 #er-gui 的 CSS 变量；原来写 color:var(--ink) 在面板外
   取不到变量 → 整条声明失效 → 颜色回退成继承色（游戏页面的浅色），浅字压浅底什么也看不见。
   所以这里不能用变量，且要压过游戏自身的样式表，配色写死并加 !important。 */
.er-toast{font-family:SF Pro Text,system-ui,-apple-system,sans-serif;position:fixed;bottom:20px;right:20px;
  background:rgba(29,29,31,.95)!important;border:1px solid rgba(255,255,255,.22);
  color:#f5f5f7!important;padding:12px 17px;border-radius:18px;z-index:2147483647;font-size:12px;letter-spacing:-.12px;
  -webkit-backdrop-filter:blur(20px);backdrop-filter:blur(20px);
  opacity:0;transition:opacity .2s ease;max-width:320px;line-height:1.5;pointer-events:none}
/* 筛选栏 */
.er-filter{display:flex;gap:6px;flex-wrap:wrap;margin:8px 0}
.er-filter .er-sel{width:auto;flex:1;min-width:88px}
.er-filter input.er-sel{flex:1.4}
/* 审查报告 */
.er-audit{border:1px solid var(--hairline);border-radius:18px;padding:12px 17px;margin:8px 0;background:var(--canvas)}
.er-audit.ok{border-color:rgba(36,138,61,.28);background:rgba(36,138,61,.05)}
.er-audit.bad{border-color:rgba(215,0,21,.28);background:rgba(215,0,21,.05)}
.er-audit .ti{font-size:14px;font-weight:600;letter-spacing:-.224px;color:var(--ink);margin-bottom:4px}
.er-audit .li{color:var(--ink-80);font-size:12px;letter-spacing:-.12px;line-height:1.6}
.er-audit.bad .li{color:var(--st-error-ink)}
.er-sev{display:inline-block;padding:1px 8px;border-radius:9999px;font-size:12px;letter-spacing:-.12px;
  margin-right:4px;color:var(--on-dark)}
.er-sev.e{background:var(--st-error)}
.er-sev.w{background:var(--st-warn)}
.er-sev.i{background:var(--blue)}
.er-sev.th{background:var(--ink)}
/* 快照条目 */
.er-snap{display:flex;align-items:center;gap:8px;padding:8px 12px;margin:6px 0;
  background:var(--parchment);border-radius:8px;font-size:12px;letter-spacing:-.12px}
.er-snap .tm{flex:1;color:var(--ink-80)}
/* 状态提示（淡色底，不用粗色边，避免把普通区块伪装成告警） */
.er-warn{color:var(--st-warn);font-size:12px;letter-spacing:-.12px;line-height:1.5;
  background:#fcf3f0;padding:8px 12px;margin:8px 0;border-radius:8px}
.er-ok{color:var(--st-success);font-size:12px;letter-spacing:-.12px}
/* 通货页：分组卡片沿用 store-utility-card（白底 + 发丝边 + 18px 圆角），分组名取游戏自身 CUR_GRP */
.er-wgrp{background:var(--canvas);border:1px solid var(--hairline);border-radius:18px;margin:12px 0;overflow:hidden}
.er-wghead{display:flex;align-items:center;gap:8px;padding:12px 17px;cursor:pointer;background:var(--parchment)}
.er-wghead:active{background:var(--hairline)}
.er-wgname{font-size:14px;font-weight:600;letter-spacing:-.224px;color:var(--ink)}
.er-wgmeta{flex:1;font-size:12px;letter-spacing:-.12px;color:var(--ink-64)}
.er-wgcaret{font-size:12px;letter-spacing:-.12px;color:var(--blue)}
.er-wgbody{padding:8px 17px 12px;border-top:1px solid var(--divide)}
.er-wrow{padding:8px 0}
.er-wrow+.er-wrow{border-top:1px solid var(--divide)}
.er-wtop{display:flex;align-items:center;gap:6px;flex-wrap:nowrap}
.er-wdot{width:8px;height:8px;flex:0 0 8px;border-radius:9999px;background:var(--hairline)}
.er-wname{flex:1 1 auto;min-width:0;font-size:14px;letter-spacing:-.224px;color:var(--ink);
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.er-wslang{flex:0 0 auto;font-size:12px;letter-spacing:-.12px;color:var(--ink-64)}
/* 行宽度预算（实测 .er-wgbody 可用 290px）：色点 8 + 名称弹性 + 俗称 + 输入框 64 + 两个按钮 ≤ 89，
   余量留给最长 6 个汉字的名称（如「完美珠宝匠石」）。这里的按钮比通用按钮略收，避免行被挤到换行。 */
.er-win{width:64px;flex:0 0 auto;padding:4px 10px;font-size:13px}
.er-wacts{display:flex;gap:6px;flex:0 0 auto}
.er-wacts .er-btn{padding:2px 9px;font-size:11px}
.er-wmeta{margin:6px 0 0;font-size:12px;line-height:1.5;letter-spacing:-.12px;color:var(--ink-64)}
.er-wlv-note{flex:1;text-align:right;font-size:12px;letter-spacing:-.12px;color:var(--ink-64)}
.er-btn.on{background:var(--blue);color:var(--on-dark);border-color:var(--blue)}
`;

    /* ---------------- 构建 DOM ---------------- */
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    const root = document.createElement('div');
    root.id = 'er-gui';
    root.innerHTML = `
      <div class="er-head">
        <span class="er-title">余烬裂隙 修改器</span>
        <span class="er-btn-min" title="折叠">—</span>
        <span class="er-btn-x" title="关闭">✕</span>
      </div>
      <div class="er-tabs">
        <div class="er-tab on" data-t="wallet">通货</div>
        <div class="er-tab" data-t="items">装备</div>
        <div class="er-tab" data-t="gamble">保底</div>
        <div class="er-tab" data-t="audit">审查</div>
        <div class="er-tab" data-t="status">状态</div>
      </div>
      <div class="er-body" id="er-body"></div>
    `;
    document.body.appendChild(root);

    const body = root.querySelector('#er-body');
    const tabs = root.querySelectorAll('.er-tab');

    // 折叠 / 关闭
    root.querySelector('.er-btn-min').onclick = () => {
      const hidden = body.style.display === 'none';
      body.style.display = hidden ? '' : 'none';
      root.querySelector('.er-tabs').style.display = hidden ? '' : 'none';
    };
    root.querySelector('.er-btn-x').onclick = () => {
      root.remove(); window.__emberRiftGui = false;
      toast('面板已关闭，刷新页面可重新打开');
    };

    // 拖拽
    (function drag() {
      const h = root.querySelector('.er-head');
      let sx, sy, ox, oy, on = false;
      h.onmousedown = (e) => {
        if (e.target.classList.contains('er-btn-min') || e.target.classList.contains('er-btn-x')) return;
        on = true; sx = e.clientX; sy = e.clientY;
        const r = root.getBoundingClientRect();
        ox = r.left; oy = r.top;
        e.preventDefault();
      };
      window.addEventListener('mousemove', (e) => {
        if (!on) return;
        root.style.left = (ox + e.clientX - sx) + 'px';
        root.style.top = (oy + e.clientY - sy) + 'px';
        root.style.right = 'auto';
      });
      window.addEventListener('mouseup', () => on = false);
    })();

    function switchTab(t) {
      tabs.forEach(x => x.classList.toggle('on', x.dataset.t === t));
      render(t);
    }
    tabs.forEach(x => x.onclick = () => switchTab(x.dataset.t));

    /* ---------------- 通用组件 ---------------- */
    function toast(msg) {
      let t = document.querySelector('.er-toast');
      if (!t) {
        t = document.createElement('div');
        t.className = 'er-toast';
        // 挂在 body 上是为了不被面板的 overflow:hidden 裁掉；配色已在 CSS 里写死，不依赖面板变量
        t.setAttribute('role', 'status');
        t.setAttribute('aria-live', 'polite');
        document.body.appendChild(t);
      }
      t.textContent = msg == null ? '' : String(msg);
      t.style.opacity = '1';
      clearTimeout(t._h);
      t._h = setTimeout(() => t.style.opacity = '0', 1600);
    }

    const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

    // 分组名取自游戏本体：模块 ig 导出 CUR_GRP（本体 uA = {basic:"通货",sock:"插槽",rune:"符文",ess:"精华",sig:"印记"}）
    const CUR_GRP = R.CUR_GRP || { basic: '通货', sock: '插槽', rune: '符文', ess: '精华', sig: '印记' };

    /* ---------------- 通货分档（依据官方 wiki「全部通货与掉率」页 DBP.cur） ----------------
       官方该页逐颗给出：名称 / 俗称 / 作用 / 掉落占比 / 估值（单位 c = 混沌石）。
       面板借其中两个官方字段来约束「一次给多少」，不再把全部货币刷成 99999：
         · v（估值，游戏铸造履历用的账本价）→ 越值钱的一次给得越少
         · w（掉落权重）→ 掉落占比 = w / Σw；w=0 的官方给的是获取途径，原样抄在下表
       分组沿用游戏自身的 CUR_GRP，不再自定义组名。
       以下均为纯函数，scripts/smoke.js 会直接抽取本段做断言，请勿在此引用 R / DOM。 */
    const CUR_GRP_ORDER = ['basic', 'sock', 'rune', 'ess', 'sig'];
    // 俗称取自官方 wiki 黑话对照表
    const CUR_SLANG = { chaos: 'C', divine: 'D', exalt: 'E', vaal: '瓦' };
    // 官方 note：掉落权重为 0 的通货，wiki 给出获取途径而非掉率
    const CUR_SOURCE = {
      frac: 'T11 以上地图, T16/T17 首领', ember: 'T11 以上地图首领', ash: '余烬祭坛摧毁装备时',
      sig_crypt: 'T6+ 骸骨主教', sig_lava: 'T6+ 熔炉君王', sig_ice: 'T6+ 霜冠女王', sig_swamp: 'T6+ 腐沼巨母',
    };
    // 补给幅度：lv 0 / 1 / 2 对应下面 steps 的三档
    const CUR_LEVELS = [{ name: '少量' }, { name: '适中' }, { name: '充足' }];
    // 按官方估值 v 分四档，每档给三个递增的「一次补多少」
    const CUR_TIERS = [
      { name: '常见', maxV: 0.5, steps: [10, 40, 120] },
      { name: '少见', maxV: 3, steps: [5, 15, 60] },
      { name: '稀有', maxV: 60, steps: [1, 3, 8] },
      { name: '珍贵', maxV: Infinity, steps: [1, 2, 5] },
    ];
    // 估值 v（单位 c）→ 档位下标；缺失或非法一律落到最保守的一档
    function curTierIdx(v) {
      const x = Number(v);
      if (!isFinite(x)) return CUR_TIERS.length - 1;
      for (let i = 0; i < CUR_TIERS.length; i++) if (x <= CUR_TIERS[i].maxV) return i;
      return CUR_TIERS.length - 1;
    }
    function curTierOf(v) { return CUR_TIERS[curTierIdx(v)]; }
    // 某通货在当前幅度下一次补多少（lv: 0 少量 / 1 适中 / 2 充足）
    function curStepOf(v, lv) {
      const steps = curTierOf(v).steps;
      const i = Math.max(0, Math.min(steps.length - 1, Number(lv) || 0));
      const n = Number(steps[i]);
      return isFinite(n) && n > 0 ? Math.round(n) : 1;
    }
    // 官方口径：掉落占比 = w / Σw。≥10% 取整，否则保留两位小数；不可算时返回空串
    function curDropPct(w, totalW) {
      const x = Number(w), t = Number(totalW);
      if (!isFinite(x) || !isFinite(t) || x <= 0 || t <= 0) return '';
      const p = x / t * 100;
      return (p >= 10 ? p.toFixed(0) : p.toFixed(2)) + '%';
    }
    // 优先官方掉率；无掉落权重的退回 wiki 的获取途径
    function curAcquireText(id, def, totalW, srcTable) {
      const p = curDropPct(def && def.w, totalW);
      if (p) return '掉落 ' + p;
      const src = srcTable && srcTable[id];
      return src ? src : '不在常规掉落表';
    }
    // 搜索用的拼接文本：名称 + 俗称 + 作用 + 分组
    function curSearchText(id, def, slangTable, grpTable) {
      return [def && def.n, slangTable && slangTable[id], def && def.d, grpTable && grpTable[def && def.grp]]
        .filter(Boolean).join(' ').toLowerCase();
    }
    // -------- 通货 UI 状态（跨次渲染保留）--------

    /* ---------------- 通货页 ---------------- */
    const walletUI = { lv: 1, detail: false, q: '', open: {}, openedOnce: false };
    // 官方 DBP.cur 里的总权重：Σw（只统计有掉落权重的通货）
    function curWeightTotal() {
      let s = 0;
      CUR_ORDER.forEach(id => { const w = Number(CUR[id] && CUR[id].w); if (isFinite(w) && w > 0) s += w; });
      return s;
    }
    function curGroupKey(def) { return (def && def.grp) || 'basic'; }
    function curGroups() {
      const g = {};
      CUR_ORDER.forEach(id => { const d = CUR[id]; if (d) (g[curGroupKey(d)] = g[curGroupKey(d)] || []).push(id); });
      return g;
    }
    function renderWallet() {
      const cur = WALLET.cur = WALLET.cur || {};
      const totalW = curWeightTotal();
      const lv = walletUI.lv, detail = walletUI.detail;
      const q = String(walletUI.q || '').trim().toLowerCase();
      const groups = curGroups();
      const order = CUR_GRP_ORDER.filter(g => groups[g])
        .concat(Object.keys(groups).filter(g => CUR_GRP_ORDER.indexOf(g) < 0));
      // 首次进入只展开第一组，避免 30 多行一次糊屏
      if (!walletUI.openedOnce && order.length) { walletUI.openedOnce = true; walletUI.open[order[0]] = true; }
      const stepOf = (id) => curStepOf(CUR[id] && CUR[id].v, lv);

      // 搜索：命中分组自动展开、整组无命中则隐藏
      const hits = {}; let hitTotal = 0;
      order.forEach(g => {
        hits[g] = groups[g].filter(id => !q || curSearchText(id, CUR[id], CUR_SLANG, CUR_GRP).indexOf(q) >= 0);
        hitTotal += hits[g].length;
      });
      const allOpen = order.every(g => walletUI.open[g]);

      let html = `
        <input class="er-sel" id="er-wq" type="search" placeholder="搜索名称 / 俗称 / 作用" value="${esc(walletUI.q)}">
        <div class="er-row" id="er-wlv">
          ${CUR_LEVELS.map((L, i) => `<button class="er-btn er-mini${i === lv ? ' on' : ''}" data-lv="${i}">${esc(L.name)}</button>`).join('')}
          <span class="er-wlv-note">一次给多少</span>
        </div>
        <div class="er-big"><button class="er-btn go" id="er-wrefill">全部补给 · ${esc(CUR_LEVELS[lv].name)}</button></div>
        <div class="er-row" id="er-wtools">
          <button class="er-btn er-mini" id="er-wexp">${allOpen ? '收起全部' : '展开全部'}</button>
          <button class="er-btn er-mini" id="er-wdetail">${detail ? '隐藏简介' : '显示简介'}</button>
          <button class="er-btn er-mini" id="er-clearwallet">清零</button>
          <button class="er-btn er-mini" id="er-savewallet">保存</button>
        </div>
        <div class="er-hint">补给量按官方估值分档：${CUR_TIERS.map(t => esc(t.name) + ' ' + t.steps[lv] + ' 颗').join(' · ')}。<br>「+N」一次就加 N 颗；要任意数量直接在输入框里改数字后点「设」。分组、作用与掉率同样取自官方资料。</div>`;

      order.forEach(g => {
        const ids = hits[g];
        if (q && !ids.length) return;
        const have = ids.reduce((s, id) => s + (Number(cur[id]) || 0), 0);
        const open = q ? ids.length > 0 : !!walletUI.open[g];
        html += `<div class="er-wgrp">
          <div class="er-wghead" data-g="${esc(g)}">
            <span class="er-wgname">${esc(CUR_GRP[g] || g)}</span>
            <span class="er-wgmeta">${ids.length} 种 · 持有 ${have}</span>
            <span class="er-wgcaret">${open ? '收起' : '展开'}</span>
          </div>`;
        if (open) {
          html += '<div class="er-wgbody">';
          ids.forEach(id => {
            const d = CUR[id];
            const v = Number(cur[id]) || 0;
            const step = stepOf(id);
            const slang = CUR_SLANG[id] ? `<span class="er-wslang">${esc(CUR_SLANG[id])}</span>` : '';
            const meta = detail
              ? `<div class="er-wmeta">${esc(curAcquireText(id, d, totalW, CUR_SOURCE))} · ${esc(d.v)} c<br>${esc(d.d || '')}</div>`
              : '';
            html += `<div class="er-wrow">
              <div class="er-wtop">
                <span class="er-wdot" style="background:${esc(d.col || '#8e8e93')}"></span>
                <span class="er-wname" title="${esc((d.d || '') + ' · ' + curAcquireText(id, d, totalW, CUR_SOURCE))}">${esc(d.n || id)}</span>${slang}
                <input class="er-input er-win" type="number" min="0" id="w-${esc(id)}" value="${v}">
                <span class="er-wacts">
                  <button class="er-btn er-mini" data-add="${esc(id)}" title="一次补 ${step} 颗">+${step}</button>
                  <button class="er-btn er-mini" data-set="${esc(id)}">设</button>
                </span>
              </div>${meta}
            </div>`;
          });
          html += '</div>';
        }
        html += '</div>';
      });
      if (!hitTotal) html += `<div class="er-empty">没有匹配的通货</div>`;
      body.innerHTML = html;

      const qBox = body.querySelector('#er-wq');
      if (qBox) qBox.oninput = () => {
        walletUI.q = qBox.value;
        renderWallet();
        const again = body.querySelector('#er-wq');
        if (again) {
          again.focus();
          try { again.setSelectionRange(again.value.length, again.value.length); } catch (e) {}
        }
      };
      body.querySelectorAll('[data-lv]').forEach(b => b.onclick = () => { walletUI.lv = Number(b.dataset.lv) || 0; renderWallet(); });
      body.querySelector('#er-wexp').onclick = () => {
        const all = allOpen; // 取渲染时的状态，切换后整体反向
        order.forEach(g => { walletUI.open[g] = !all; });
        renderWallet();
      };
      body.querySelector('#er-wdetail').onclick = () => { walletUI.detail = !detail; renderWallet(); };
      body.querySelectorAll('[data-g]').forEach(h => h.onclick = () => {
        const g = h.dataset.g; walletUI.open[g] = !walletUI.open[g]; renderWallet();
      });
      body.querySelectorAll('[data-set]').forEach(b => b.onclick = () => {
        const id = b.dataset.set;
        const n = parseInt((body.querySelector('#w-' + id) || {}).value, 10);
        cur[id] = Math.max(0, isFinite(n) ? n : 0);
        safeSaveWallet(); toast(dispName(id) + ' → ' + cur[id]); renderWallet();
      });
      // 「+N」的语义必须等同于它的标签：永远只加 N，不看输入框里的数字
      //（输入框里是「当前持有」，早期版本拿它当加数出现过「点 +40 结果加了 128」的误操作）
      body.querySelectorAll('[data-add]').forEach(b => b.onclick = () => {
        const id = b.dataset.add;
        const add = stepOf(id);
        cur[id] = (Number(cur[id]) || 0) + add;
        safeSaveWallet(); toast(dispName(id) + ' +' + add + ' → ' + cur[id]); renderWallet();
      });
      body.querySelector('#er-wrefill').onclick = () => {
        snapAuto('通货补给前');
        let kinds = 0;
        CUR_ORDER.forEach(id => {
          if (!CUR[id]) return;
          cur[id] = (Number(cur[id]) || 0) + stepOf(id); kinds++;
        });
        safeSaveWallet(); renderWallet();
        toast('已按「' + CUR_LEVELS[lv].name + '」补给 ' + kinds + ' 种通货');
      };
      body.querySelector('#er-clearwallet').onclick = () => {
        snapAuto('通货清零前');
        CUR_ORDER.forEach(id => { if (CUR[id]) cur[id] = 0; }); safeSaveWallet(); renderWallet(); toast('已清零');
      };
      body.querySelector('#er-savewallet').onclick = () => { safeSaveWallet(); toast('已保存通货'); };
    }
    function dispName(id) { return (CUR[id] && CUR[id].n) || id; }

    /* ---------------- 装备页 ---------------- */
    let selectedKey = null;
    // 筛选状态（跨次渲染保留）
    const filterState = { q: '', slot: '', rarity: '', where: '' };

    function listItems() {
      const p = player();
      if (!p) return null;
      const out = [];
      const eq = p.equip || {};
      for (const slot of Object.keys(eq)) if (eq[slot]) out.push({ key: 'E:' + slot, loc: '装备·' + (SLOTNAME[eq[slot].slot] || slot), item: eq[slot] });
      // 背包同时容纳 装备/地图/兽魂/珠宝（游戏 Tf() 与入库流程都是这四种走 u.inv），一并列出以便继续编辑
      const KINDCN = { item: '背包', map: '地图袋', soul: '兽魂', jewel: '珠宝' };
      (p.inv || []).forEach((it, i) => {
        if (!it) return;
        if (it.kind !== 'item' && it.kind !== 'soul' && it.kind !== 'jewel' && it.kind !== 'map') return;
        out.push({ key: 'I:' + i, loc: (KINDCN[it.kind] || '背包') + '#' + i, item: it });
      });
      // 已插入天赋树的珠宝存在 u.jw（10 个槽位，非 null 即已插入）：插入时游戏会把它从背包移走，
      // 所以它既不在 equip 也不在 inv —— 不单独列出来的话，最想腐化的那颗永远是「找不到的物品」
      const jw = Array.isArray(p.jw) ? p.jw : [];
      const seen = new Set(out.map(o => o.item));
      jw.forEach((it, i) => {
        if (!it || it.kind !== 'jewel' || seen.has(it)) return;
        out.push({ key: 'J:' + i, loc: '天赋珠宝槽#' + (i + 1), item: it });
      });
      return out;
    }
    /* ---------------- 换底材（改物品基底） ---------------- */
    // 本体依据（game.html）：生成物品时 base / slot / impl 三者同源 —— 见 Et()/Ut()：
    //   {base: e.n, slot: e.slot, impl: q1(e)}，q1 = e => (e.impl||[]).map(([id,v])=>({id,v:Array.isArray(v)?v.slice():[v]}))
    //   官方修复函数 Vp() 换基底时也严格限定同部位：pe[t.base].slot === e.slot 才执行 e.base=t.base, e.impl=q1(pe[t.base])
    // 需求等级 / 属性需求在游戏中是实时查 BASEMAP[base] 得来的（物品本身不缓存这些字段），
    // 所以这里只需改 base / slot / impl 三处，其余派生属性自动跟着变（含双手 ×1.5 判定）。
    // 固有词缀（implicit）：复刻本体 q1(baseDef)
    function makeImpl(b) {
      return ((b && b.impl) || []).map(([id, v]) => ({ id, v: Array.isArray(v) ? v.slice() : [v] }));
    }
    // 物品当前部位：优先 BASEMAP（本体多处用 pe[it.base].slot），回退 item.slot
    function slotOf(it) {
      const b = BASEMAP[(it && it.base) || ''];
      return (b && b.slot) || (it && it.slot) || '';
    }
    // 可选基底：默认只列同部位的（防止装备槽错位，与官方 Vp 的校验口径一致）
    function baseCandidates(it, allSlot) {
      const want = slotOf(it);
      return BASES.filter(b => allSlot || b.slot === want);
    }
    // it 当前被装备在哪个部位（不在装备栏返回 null）
    function equippedSlot(it) {
      const P = player(); const eq = (P && P.equip) || {};
      for (const s of Object.keys(eq)) if (eq[s] === it) return s;
      return null;
    }
    // 可行性校验（不写数据）。返回 {ok, reason?, from, to, needMove, occupied}
    function checkBase(it, nb, allowCross) {
      if (!it || it.kind !== 'item') return { ok: false, reason: '该物品不是装备，不支持换基底' };
      if (!nb) return { ok: false, reason: '未找到该基底' };
      const from = slotOf(it), to = nb.slot || '';
      if (from === to) return { ok: true, from, to, needMove: false, occupied: null };
      if (!allowCross) return { ok: false, reason: '部位不符（' + (SLOTNAME[to] || to) + ' ≠ ' + (SLOTNAME[from] || from) + '），如需跨部位请勾选开关' };
      const es = equippedSlot(it);
      if (!es) return { ok: true, from, to, needMove: false, occupied: null }; // 在背包里，换个部位无副作用
      const P = player(); const eq = (P && P.equip) || {};
      const occ = eq[to] || null;
      if (occ && (P.inv || []).length >= INV_CAP) return { ok: false, reason: '目标部位已被占用且背包已满，无法腾出空位' };
      return { ok: true, from, to, needMove: true, occupied: occ };
    }
    // 执行换基底：改 base/slot/impl；跨部位且已装备时做装备栏迁移（占用者退回背包）
    function applyBase(it, newName, allowCross) {
      const nb = BASES.find(b => b.n === newName) || null;
      const c = checkBase(it, nb, allowCross);
      if (!c.ok) return c;
      const P = player();
      if (c.needMove && P && P.equip) {
        const eq = P.equip;
        if (c.occupied && Array.isArray(P.inv)) P.inv.push(c.occupied);
        if (eq[c.from] === it) delete eq[c.from];
        eq[c.to] = it;
      }
      it.base = nb.n;
      it.slot = c.to;
      it.impl = makeImpl(nb);
      return c;
    }
    // 不属于当前部位的词缀（词缀定义带 slots 白名单时不匹配）—— 仅用于提示，不自动删
    function foreignMods(it) {
      const s = slotOf(it);
      return (it.mods || []).filter(m => {
        const d = AFF[m.id];
        return d && Array.isArray(d.slots) && d.slots.length && d.slots.indexOf(s) < 0;
      });
    }
    // 基底下拉：同一 optgroup 按需求等级排序；“当前基底”若不在候选里也要保留显示
    function baseOptsFor(it, allSlot) {
      const cur = it.base || '';
      const list = baseCandidates(it, allSlot);
      let s = '';
      if (cur && !list.some(b => b.n === cur)) {
        s += `<option value="${esc(cur)}" selected>${esc(cur)}（当前 · ${esc(SLOTNAME[slotOf(it)] || '其他部位')}）</option>`;
      }
      const groups = {};
      list.forEach(b => { (groups[b.slot] = groups[b.slot] || []).push(b); });
      for (const c of Object.keys(SLOTNAME)) {
        const g = groups[c]; if (!g || !g.length) continue;
        s += `<optgroup label="${SLOTNAME[c]}">`;
        g.slice().sort((x, y) => (x.lv || 0) - (y.lv || 0)).forEach(bd => {
          const sel = bd.n === cur ? ' selected' : '';
          const lv = bd.lv === undefined ? '?' : bd.lv;
          s += `<option value="${esc(bd.n)}"${sel}>${esc(bd.n)}（需求等级 ${esc(String(lv))}）</option>`;
        });
        s += `</optgroup>`;
      }
      return s || '<option value="">（无可换基底）</option>';
    }

    function findItem(key) { const r = listItems(); if (!r) return null; const x = r.find(o => o.key === key); return x ? x.item : null; }

    // 当前正在编辑的物品（用于判断双手倍率）；由 renderItemDetail 维护
    let curItemRef = null;
    // 某条词缀在当前物品上的实际倍率（新增时传 null modObj：新增的词缀不可能是 implicit）
    function affixMul(modId) { return thMulFor(curItemRef, modId, null); }

    // 根据词缀定义填充「t 级」下拉（T1 最高，对应 ti = ranges.length-1）
    // 显示的数值一律为「游戏里看到的生效值」：双手武器伤害类词缀已乘上 TH_MUL
    function buildTiers(def) {
      const sel = body.querySelector('#er-tier');
      if (!sel) return;
      sel.innerHTML = '';
      const valSel = body.querySelector('#er-affixval');
      if (!def || !def.ranges || !def.ranges.length) {
        sel.innerHTML = '<option value="">无阶层数据</option>';
        if (valSel) valSel.innerHTML = '<option value="">—</option>';
        return;
      }
      const mul = affixMul(def.id);
      const th = mul !== 1 ? ` · 双手 ×${mul}` : '';
      const idxs = def.ranges.map((_, ti) => ti).reverse(); // 强在前：T1 → T{n}
      idxs.forEach(ti => {
        const rng = def.ranges[ti];
        let label;
        if (def.pair && Array.isArray(rng[0])) {
          const a = [Math.round(rng[0][0] * mul), Math.round(rng[0][1] * mul)];
          const b = [Math.round(rng[1][0] * mul), Math.round(rng[1][1] * mul)];
          label = `${tierLabel(def, ti)} [${a[0]}~${a[1]}] / [${b[0]}~${b[1]}]${th}`;
        } else {
          label = `${tierLabel(def, ti)} ${Math.round(rng[0] * mul)}~${Math.round(rng[1] * mul)}${th}`;
        }
        const o = document.createElement('option'); o.value = String(ti); o.textContent = label; sel.appendChild(o);
      });
      const top = topTierIdx(def);
      sel.value = String(top);
      buildValues(def, top);
    }

    // 根据阶层填充「数值」下拉（单值列出该阶层范围；双值列出 最小/中/最大 组合）
    // 列出的是生效值；点击添加时再反解回存储基值（见 #er-addaffix）
    function buildValues(def, ti) {
      const sel = body.querySelector('#er-affixval');
      if (!sel) return;
      sel.innerHTML = '';
      const rng = def.ranges && def.ranges[ti];
      if (!rng) return;
      const mul = affixMul(def.id);
      // 在「存储基值」空间上取值再换算，保证每个选项都能被精确反解回整数基值
      const toEff = x => Math.round(x * mul);
      let opts = [];
      if (def.pair && Array.isArray(rng[0])) {
        const A = rng[0], B = rng[1];
        const mk = f => [toEff(Math.round(A[0] + (A[1] - A[0]) * f)), toEff(Math.round(B[0] + (B[1] - B[0]) * f))];
        [[0, '最小'], [0.5, '中'], [1, '最大']].forEach(([f, lab]) => {
          const v = mk(f); opts.push({ t: `${lab} [${v[0]}, ${v[1]}]`, v: JSON.stringify(v) });
        });
      } else {
        const min = rng[0], max = rng[1], span = max - min;
        let vals;
        if (span <= 40) { vals = []; for (let x = min; x <= max; x++) vals.push(x); }
        else vals = [0, 0.2, 0.4, 0.6, 0.8, 1].map(f => Math.round(min + span * f));
        vals.forEach(x => { const e = toEff(x); opts.push({ t: String(e), v: String(e) }); });
      }
      opts.forEach(o => { const op = document.createElement('option'); op.value = o.v; op.textContent = o.t; sel.appendChild(op); });
    }

    function renderItems() {
      const list = listItems();
      if (!list) { body.innerHTML = `<div class="er-empty">尚未进入角色。<br>请先点进一个角色、进入游戏世界（能走动/开背包），再切到本页。</div>`; return; }
      if (!list.length) { body.innerHTML = `<div class="er-empty">背包与装备里没有可修改的装备。</div>`; return; }

      const f = filterState;
      const filtered = list.filter(o => {
        const it = o.item;
        if (f.where === 'eq' && o.key.indexOf('E:') !== 0) return false;
        if (f.where === 'inv' && o.key.indexOf('I:') !== 0 && o.key.indexOf('J:') !== 0) return false;
        if (f.slot && it.slot !== f.slot) return false;
        if (f.rarity !== '' && String(it.rarity) !== f.rarity) return false;
        if (f.q) {
          const hay = ((it.name || '') + ' ' + (it.base || '')).toLowerCase();
          if (hay.indexOf(f.q.toLowerCase()) < 0) return false;
        }
        return true;
      });

      const slotOpts = Object.keys(SLOTNAME)
        .map(c => `<option value="${c}" ${f.slot === c ? 'selected' : ''}>${SLOTNAME[c]}</option>`).join('');
      const rarOpts = RARITY
        .map((r, i) => `<option value="${i}" ${f.rarity === String(i) ? 'selected' : ''}>${r}</option>`).join('');

      let html = `<div class="er-big">
        <button class="er-btn" id="er-refresh-items">刷新列表</button>
        <button class="er-btn go" id="er-gen-open">＋ 添加物品</button>
      </div>
      <div class="er-filter">
        <input class="er-sel" id="f-q" placeholder="搜名称/基底…" value="${esc(f.q)}">
        <select class="er-sel" id="f-slot"><option value="">全部部位</option>${slotOpts}</select>
      </div>
      <div class="er-filter">
        <select class="er-sel" id="f-rar"><option value="">全部稀有度</option>${rarOpts}</select>
        <select class="er-sel" id="f-where">
          <option value="">全部位置</option>
          <option value="eq" ${f.where === 'eq' ? 'selected' : ''}>已装备</option>
          <option value="inv" ${f.where === 'inv' ? 'selected' : ''}>背包/珠宝槽</option>
        </select>
      </div>
      <div class="er-hint">筛选后 ${filtered.length} / 共 ${list.length} 件</div>`;

      if (!filtered.length) html += `<div class="er-empty">没有符合条件的装备</div>`;
      filtered.forEach(o => {
        const it = o.item;
        html += `<div class="er-item" data-key="${o.key}">
          <div class="nm">${esc(it.name || '(未命名)')}</div>
          <div class="meta">${esc(o.loc)} · ${RARITY[it.rarity] || it.rarity} · 词缀 ${(it.mods || []).length} 条</div>
        </div>`;
      });

      body.innerHTML = html;
      body.querySelector('#er-refresh-items').onclick = () => { selectedKey = null; renderItems(); };
      body.querySelector('#er-gen-open').onclick = () => renderGenerate();
      body.querySelectorAll('.er-item').forEach(el => el.onclick = () => { selectedKey = el.dataset.key; renderItemDetail(); });

      // 筛选交互（搜索框保持焦点与光标，避免输入被打断）
      const qEl = body.querySelector('#f-q');
      qEl.addEventListener('input', () => {
        f.q = qEl.value;
        const pos = qEl.selectionStart;
        renderItems();
        const n = body.querySelector('#f-q');
        if (n) { n.focus(); try { n.setSelectionRange(pos, pos); } catch (e) {} }
      });
      body.querySelector('#f-slot').addEventListener('change', e => { f.slot = e.target.value; renderItems(); });
      body.querySelector('#f-rar').addEventListener('change', e => { f.rarity = e.target.value; renderItems(); });
      body.querySelector('#f-where').addEventListener('change', e => { f.where = e.target.value; renderItems(); });
    }

    /* ---------------- 添加物品（覆盖游戏全部物品种类） ---------------- */
    // 分类口径取自游戏自身的仓库页签：装备 gen / 地图 map / 宝石 gem / 传奇 uniq / 兽魂 soul / 珠宝 jewel
    // 每个生成器和数据表都已在游戏本体 game.html 中逐一核对存在且签名正确
    const GEN_CATS = [
      { id: 'gen',  grp: '装备', label: '装备（普通 / 魔法 / 稀有）',   ok: () => BASES.length > 0 && !!makeItem },
      { id: 'mi',   grp: '传奇', label: '异种底材（自带固定效果）',     ok: () => MI_LIST.length > 0 && !!makeMi },
      { id: 'uniq', grp: '传奇', label: '传奇装备',                     ok: () => UNIQ.length > 0 && !!makeUnique },
      { id: 'map',  grp: '地图', label: '地图（指定阶级 / 主题）',      ok: () => !!makeMap },
      { id: 'jwl',  grp: '珠宝', label: '天赋珠宝（普通 / 大型）',      ok: () => !!mkJewel },
      { id: 'ujw',  grp: '珠宝', label: '传奇珠宝',                     ok: () => Object.keys(UJW).length > 0 && !!mkUniqueJewel },
      { id: 'soul', grp: '兽魂', label: '兽魂',                         ok: () => Object.keys(BEASTS).length > 0 && !!mkSoul },
      { id: 'gem',  grp: '宝石', label: '技能宝石',                     ok: () => Object.keys(SK).length > 0 && !!mkGem, gem: true },
      { id: 'sup',  grp: '宝石', label: '辅助宝石',                     ok: () => Object.keys(SUP).length > 0 && !!mkSup, gem: true },
      { id: 'meta', grp: '宝石', label: '元技能',                       ok: () => Object.keys(META).length > 0 && !!mkMeta, gem: true },
      { id: 'buff', grp: '宝石', label: '光环 / 捷',                    ok: () => Object.keys(BUFFS).length > 0 && !!mkBuff, gem: true },
    ];
    let gen = { cat: 'gen', ilvl: null, dest: 'bag', jt: 'n', jrar: '2', srar: '2' };

    function genVal(sel) { const el = body.querySelector(sel); return el ? el.value : ''; }
    function genIlvl(sel) { return Math.max(1, Math.min(100, parseInt(genVal(sel)) || 1)); }
    function numOpts(from, to, cur) {
      let s = '';
      for (let n = from; n <= to; n++) s += `<option value="${n}"${String(cur) === String(n) ? ' selected' : ''}>${n}</option>`;
      return s;
    }
    function baseOpts() {
      const groups = {};
      BASES.forEach(b => { (groups[b.slot] = groups[b.slot] || []).push(b); });
      let s = '';
      for (const c of Object.keys(SLOTNAME)) {
        if (!groups[c]) continue;
        s += `<optgroup label="${SLOTNAME[c]}">`;
        groups[c].forEach(b => {
          const bname = b.n;
          s += `<option value="${esc(bname)}"${gen.base === bname ? ' selected' : ''}>${esc(bname)}（需求等级 ${b.lv}）</option>`;
        });
        s += `</optgroup>`;
      }
      return s;
    }
    // 生成物品；返回 {item, name} 或 null（失败时已 toast 原因）
    function buildItem() {
      const id = gen.cat;
      try {
        if (id === 'gen') {
          const base = BASES.find(b => b.n === genVal('#g-base'));
          if (!base) { toast('未找到该基底'); return null; }
          return { item: makeItem(base, genIlvl('#g-ilvl'), parseInt(genVal('#g-rar')) || 0), name: base.n };
        }
        if (id === 'mi') {
          const mi = genVal('#g-mi');
          const def = MI_LIST.find(x => x.id === mi);
          if (!mi) { toast('请选择异种底材'); return null; }
          return { item: makeMi(mi, genIlvl('#g-ilvl'), null, parseInt(genVal('#g-micnt')) || 3), name: (def && def.n) || mi };
        }
        if (id === 'uniq') {
          const u = genVal('#g-uniq');
          const def = UNIQ.find(x => x.id === u);
          if (!def) { toast('请选择传奇装备'); return null; }
          return { item: makeUnique(def, genIlvl('#g-ilvl')), name: def.n };
        }
        if (id === 'map') {
          const tier = Math.max(1, Math.min(17, parseInt(genVal('#g-tier')) || 1));
          const th = genVal('#g-theme');
          const m = makeMap(tier);
          // 指定主题时重roll名称（makeMap 内部是按随机主题取名的）
          if (th && THEMES[th] && m) {
            const names = THEMES[th].names || [];
            m.theme = th;
            if (names.length) m.base = names[Math.floor(Math.random() * names.length)] || m.base;
            m.name = tier >= 17 ? '深渊·' + m.base : m.base;
          }
          return m ? { item: m, name: m.name } : null;
        }
        if (id === 'jwl') {
          const jt = genVal('#g-jt');
          return { item: mkJewel(jt, genIlvl('#g-ilvl'), parseInt(genVal('#g-jrar')) || 0, genVal('#g-jth') || undefined), name: (jt === 'b' ? '大型珠宝' : '珠宝') };
        }
        if (id === 'ujw') {
          const u = genVal('#g-ujw');
          if (!u || !UJW[u]) { toast('请选择传奇珠宝'); return null; }
          return { item: mkUniqueJewel(u, genIlvl('#g-ilvl')), name: UJW[u].n || u };
        }
        if (id === 'soul') {
          const b = genVal('#g-beast');
          if (!b || !BEASTS[b]) { toast('请选择兽魂来源'); return null; }
          return { item: mkSoul(b, genIlvl('#g-ilvl'), parseInt(genVal('#g-srar')) || 0), name: BEASTS[b].n || b };
        }
        if (id === 'gem') {
          const g = genVal('#g-gem');
          if (!g || !SK[g]) { toast('请选择技能宝石'); return null; }
          const lvl = Math.max(1, Math.min(20, parseInt(genVal('#g-glvl')) || 1));
          const sock = Math.max(2, Math.min(6, parseInt(genVal('#g-gsock')) || 2));
          return { item: mkGem(g, lvl, sock), name: (SK[g].n || g) + ' Lv' + lvl };
        }
        if (id === 'sup') {
          const g = genVal('#g-sup');
          if (!g || !SUP[g]) { toast('请选择辅助宝石'); return null; }
          return { item: mkSup(g), name: SUP[g].n || g };
        }
        if (id === 'meta') {
          const g = genVal('#g-meta');
          if (!g || !META[g]) { toast('请选择元技能'); return null; }
          return { item: mkMeta(g), name: META[g].n || g };
        }
        if (id === 'buff') {
          const g = genVal('#g-buff');
          if (!g || !BUFFS[g]) { toast('请选择光环/捷'); return null; }
          return { item: mkBuff(g), name: BUFFS[g].n || g };
        }
      } catch (e) {
        toast('生成失败：游戏接口调用异常');
        return null;
      }
      return null;
    }

    function renderGenerate() {
      const P = player();
      if (!P) { body.innerHTML = `<div class="er-empty">尚未进入角色，无法添加物品。<br>请先点进一个角色、进入游戏世界。</div>`; return; }
      // 只保留数据齐全的分类：游戏版本变化时优雅降级，而不是整个面板崩掉
      const cats = GEN_CATS.filter(c => { try { return !!c.ok(); } catch (e) { return false; } });
      if (!cats.length) { body.innerHTML = `<div class="er-empty">未能读取任何物品数据表或生成接口。<br>可能是游戏版本变化，请到「状态」页确认。</div>`; return; }
      if (!cats.some(c => c.id === gen.cat)) gen.cat = cats[0].id;
      const cat = cats.find(c => c.id === gen.cat);
      if (gen.ilvl == null) gen.ilvl = P.level || 100;

      // ① 种类下拉（按仓库分类分组）
      let catOpts = '';
      const grps = [];
      cats.forEach(c => { if (!grps.includes(c.grp)) grps.push(c.grp); });
      grps.forEach(g => {
        catOpts += `<optgroup label="${g}">`;
        cats.filter(c => c.grp === g).forEach(c => {
          catOpts += `<option value="${c.id}"${gen.cat === c.id ? ' selected' : ''}>${c.label}</option>`;
        });
        catOpts += `</optgroup>`;
      });

      // ② 该种类对应的选项区
      let fields = '';
      if (cat.id === 'gen') {
        fields += `<div class="er-row"><label>基底（按部位分组，共 ${BASES.length} 种）</label></div>
          <select class="er-sel" id="g-base" style="width:100%">${baseOpts()}</select>
          <div class="er-row" style="margin-top:6px"><label>稀有度</label>
            <select class="er-sel" id="g-rar" style="width:auto">
              <option value="2"${gen.rarity === '0' || gen.rarity === '1' ? '' : ' selected'}>稀有（随机 3~6 条词缀）</option>
              <option value="1"${gen.rarity === '1' ? ' selected' : ''}>魔法（随机 1~2 条词缀）</option>
              <option value="0"${gen.rarity === '0' ? ' selected' : ''}>普通（无词缀）</option>
            </select></div>
          <div class="er-row" style="margin-top:6px"><label>物品等级</label>
            <input class="er-input" id="g-ilvl" type="number" min="1" max="100" value="${gen.ilvl}" style="width:70px"></div>`;
      } else if (cat.id === 'mi') {
        const o = MI_LIST.map(x => `<option value="${esc(x.id)}"${gen.mi === x.id ? ' selected' : ''}>${esc(x.n)}（${esc(SLOTNAME[x.slot] || x.slot || '')}）</option>`).join('');
        fields += `<div class="er-row"><label>异种底材（共 ${MI_LIST.length} 件，只从指定怪物掉落）</label></div>
          <select class="er-sel" id="g-mi" style="width:100%">${o}</select>
          <div class="er-row" style="margin-top:6px"><label>随机词条数</label>
            <select class="er-sel" id="g-micnt" style="width:auto">${numOpts(2, 4, gen.micnt || 3)}</select></div>
          <div class="er-row" style="margin-top:6px"><label>物品等级</label>
            <input class="er-input" id="g-ilvl" type="number" min="1" max="100" value="${gen.ilvl}" style="width:70px"></div>`;
      } else if (cat.id === 'uniq') {
        const o = UNIQ.slice().sort((a, b) => (a.lv || 0) - (b.lv || 0))
          .map(x => `<option value="${esc(x.id)}"${gen.uniq === x.id ? ' selected' : ''}>${esc(x.n)}（${esc(x.base)} · Lv${x.lv}）</option>`).join('');
        fields += `<div class="er-row"><label>传奇装备（共 ${UNIQ.length} 件）</label></div>
          <select class="er-sel" id="g-uniq" style="width:100%">${o}</select>
          <div class="er-row" style="margin-top:6px"><label>物品等级</label>
            <input class="er-input" id="g-ilvl" type="number" min="1" max="100" value="${gen.ilvl}" style="width:70px"></div>`;
      } else if (cat.id === 'map') {
        const th = MAPTHEMES.map(k => {
          const t = THEMES[k] || {};
          const nm = (t.names && t.names[0]) || k;
          return `<option value="${esc(k)}"${gen.theme === k ? ' selected' : ''}>${esc(nm)}（${esc(k)}）</option>`;
        }).join('');
        fields += `<div class="er-row"><label>地图阶级（1~17，17 = 深渊图）</label>
            <input class="er-input" id="g-tier" type="number" min="1" max="17" value="${gen.tier || 1}" style="width:70px"></div>
          <div class="er-row" style="margin-top:6px"><label>主题</label>
            <select class="er-sel" id="g-theme" style="width:auto"><option value="">随机主题</option>${th}</select></div>`;
      } else if (cat.id === 'jwl') {
        fields += `<div class="er-row"><label>珠宝类型</label>
            <select class="er-sel" id="g-jt" style="width:auto">
              <option value="n"${gen.jt === 'b' ? '' : ' selected'}>普通珠宝</option>
              <option value="b"${gen.jt === 'b' ? ' selected' : ''}>大型珠宝（天赋树长分支）</option>
            </select></div>`;
        if (gen.jt === 'b') {
          const o = JTH_ORDER.map(k => {
            const b = JTH[k] || {};
            return `<option value="${esc(k)}"${gen.jth === k ? ' selected' : ''}>${esc(b.base || k)}</option>`;
          }).join('');
          fields += `<div class="er-row" style="margin-top:6px"><label>大型珠宝基底</label>
            <select class="er-sel" id="g-jth" style="width:auto"><option value="">随机</option>${o}</select></div>`;
        }
        fields += `<div class="er-row" style="margin-top:6px"><label>稀有度</label>
            <select class="er-sel" id="g-jrar" style="width:auto">
              <option value="0"${gen.jrar === '0' ? ' selected' : ''}>普通</option>
              <option value="1"${gen.jrar === '1' ? ' selected' : ''}>魔法</option>
              <option value="2"${gen.jrar === '2' ? ' selected' : ''}>稀有</option>
            </select></div>
          <div class="er-row" style="margin-top:6px"><label>物品等级</label>
            <input class="er-input" id="g-ilvl" type="number" min="1" max="100" value="${gen.ilvl}" style="width:70px"></div>`;
      } else if (cat.id === 'ujw') {
        const o = Object.keys(UJW).map(k => `<option value="${esc(k)}"${gen.ujw === k ? ' selected' : ''}>${esc((UJW[k] || {}).n || k)}</option>`).join('');
        fields += `<div class="er-row"><label>传奇珠宝（共 ${Object.keys(UJW).length} 件）</label></div>
          <select class="er-sel" id="g-ujw" style="width:100%">${o}</select>
          <div class="er-row" style="margin-top:6px"><label>物品等级</label>
            <input class="er-input" id="g-ilvl" type="number" min="1" max="100" value="${gen.ilvl}" style="width:70px"></div>`;
      } else if (cat.id === 'soul') {
        const o = Object.keys(BEASTS).map(k => {
          const b = BEASTS[k] || {};
          return `<option value="${esc(k)}"${gen.beast === k ? ' selected' : ''}>${esc(b.n || k)}（${esc(b.cls || '')}${b.spirit ? ' · ' + b.spirit + ' 精魂' : ''}）</option>`;
        }).join('');
        fields += `<div class="er-row"><label>兽魂来源（共 ${Object.keys(BEASTS).length} 种）</label></div>
          <select class="er-sel" id="g-beast" style="width:100%">${o}</select>
          <div class="er-row" style="margin-top:6px"><label>稀有度</label>
            <select class="er-sel" id="g-srar" style="width:auto">
              <option value="0"${gen.srar === '0' ? ' selected' : ''}>普通</option>
              <option value="1"${gen.srar === '1' ? ' selected' : ''}>魔法</option>
              <option value="2"${gen.srar === '2' ? ' selected' : ''}>稀有</option>
            </select></div>
          <div class="er-row" style="margin-top:6px"><label>物品等级</label>
            <input class="er-input" id="g-ilvl" type="number" min="1" max="100" value="${gen.ilvl}" style="width:70px"></div>`;
      } else if (cat.id === 'gem') {
        const o = Object.keys(SK).map(k => `<option value="${esc(k)}"${gen.gem === k ? ' selected' : ''}>${esc((SK[k] || {}).n || k)}（${esc(k)}）</option>`).join('');
        fields += `<div class="er-row"><label>技能宝石（共 ${Object.keys(SK).length} 个）</label></div>
          <select class="er-sel" id="g-gem" style="width:100%">${o}</select>
          <div class="er-row" style="margin-top:6px"><label>等级</label>
            <input class="er-input" id="g-glvl" type="number" min="1" max="20" value="${gen.glvl || 1}" style="width:70px">
            <label style="margin-left:8px">插槽需求</label>
            <select class="er-sel" id="g-gsock" style="width:auto">${numOpts(2, 6, gen.gsock || 2)}</select></div>`;
      } else if (cat.id === 'sup') {
        const o = Object.keys(SUP).map(k => `<option value="${esc(k)}"${gen.sup === k ? ' selected' : ''}>${esc((SUP[k] || {}).n || k)}</option>`).join('');
        fields += `<div class="er-row"><label>辅助宝石（共 ${Object.keys(SUP).length} 个）</label></div>
          <select class="er-sel" id="g-sup" style="width:100%">${o}</select>`;
      } else if (cat.id === 'meta') {
        const o = Object.keys(META).map(k => `<option value="${esc(k)}"${gen.meta === k ? ' selected' : ''}>${esc((META[k] || {}).n || k)}（${(META[k] || {}).spirit || 60} 精魂）</option>`).join('');
        fields += `<div class="er-row"><label>元技能（共 ${Object.keys(META).length} 个）</label></div>
          <select class="er-sel" id="g-meta" style="width:100%">${o}</select>`;
      } else if (cat.id === 'buff') {
        const o = Object.keys(BUFFS).map(k => `<option value="${esc(k)}"${gen.buff === k ? ' selected' : ''}>${esc((BUFFS[k] || {}).n || k)}（${(BUFFS[k] || {}).spirit || 30} 精魂）</option>`).join('');
        fields += `<div class="er-row"><label>光环 / 捷（共 ${Object.keys(BUFFS).length} 个）</label></div>
          <select class="er-sel" id="g-buff" style="width:100%">${o}</select>`;
      }

      // ③ 落点（背包 / 宝石栏 / 共享仓库对应页签）
      const stashOK = !!(STASH && STASH.tabs);
      const destLabel = cat.gem ? '宝石栏' : (cat.id === 'map' ? '地图袋' : '背包');
      let destHtml = `<select class="er-sel" id="g-dest" style="width:auto">
        <option value="bag"${gen.dest !== 'stash' ? ' selected' : ''}>${destLabel}</option>`;
      if (stashOK) destHtml += `<option value="stash"${gen.dest === 'stash' ? ' selected' : ''}>共享仓库（自动分到对应页签）</option>`;
      destHtml += `</select>`;

      const used = cat.id === 'map' ? mapCount() : invCount();
      const cap = cat.id === 'map' ? MAP_CAP : INV_CAP;
      const full = used >= cap;

      let html = `<div class="er-big"><button class="er-btn" id="er-gen-back">← 返回列表</button></div>
        <div class="er-grp">添加物品</div>
        <div class="er-row"><label>物品种类（覆盖游戏全部 ${cats.length} 类）</label></div>
        <select class="er-sel" id="g-cat" style="width:100%">${catOpts}</select>
        ${fields}
        <div class="er-row" style="margin-top:6px"><label>放到哪里</label>${destHtml}</div>
        <div class="${full && gen.dest !== 'stash' ? 'er-warn' : 'er-hint'}">
          ${cat.gem ? '宝石栏 ' + ((P.gems || []).length) + ' 件' : destLabel + ' ' + used + ' / ' + cap}${full && gen.dest !== 'stash' ? ' · 已满，请先腾出空间' : ''}
        </div>
        <button class="er-btn go" id="g-do" style="width:100%;margin-top:6px">生成并放入</button>
        <div class="er-hint" style="margin-top:6px">全部调用游戏自带的生成接口，产出与正常掉落完全一致；装备/珠宝/兽魂生成后可在列表中继续改词缀。每次生成前会自动存快照。</div>`;
      body.innerHTML = html;

      body.querySelector('#er-gen-back').onclick = () => renderItems();
      body.querySelector('#g-cat').onchange = e => {
        rememberGen();
        gen.cat = e.target.value;
        renderGenerate();
      };
      // 需要局部重绘的联动：珠宝类型
      const jtEl = body.querySelector('#g-jt');
      if (jtEl) jtEl.onchange = e => { rememberGen(); gen.jt = e.target.value; renderGenerate(); };

      body.querySelector('#g-do').onclick = () => {
        rememberGen();
        const built = buildItem();
        if (!built) return;
        const item = built.item;
        if (!item) { toast('生成失败：游戏接口返回空'); return; }
        const dest = gen.dest;
        const room = hasRoom(item, dest);
        if (!room.ok) { toast(room.msg); return; }
        snapAuto('添加物品前：' + built.name);
        if (!placeItem(item, dest)) { toast('放入失败：未能写入目标容器'); return; }
        // 装备类走完整重算+命名；地图/宝石类不参与词缀命名
        if (isGemKind(item.kind) || item.kind === 'map') {
          try { saveChar && saveChar(); } catch (e) {}
        } else {
          refresh(item);
        }
        const where = dest === 'stash' ? '仓库「' + stashTabFor(item) + '」' : destLabel;
        toast('已添加 ' + built.name + ' → ' + where);
        // 装备/珠宝/兽魂：直接跳到详情页继续改词缀；地图与宝石类留在生成页便于连续添加
        if (dest !== 'stash' && !cat.gem && item.kind !== 'map') {
          const P2 = player();
          selectedKey = 'I:' + (((P2 && P2.inv) || []).length - 1);
          renderItemDetail();
        } else {
          renderGenerate();
        }
      };
    }
    // 记住当前填表状态，便于切换选项后不丢输入
    function rememberGen() {
      const grab = (sel, key) => { const el = body.querySelector(sel); if (el) gen[key] = el.value; };
      grab('#g-ilvl', 'ilvl'); grab('#g-base', 'base'); grab('#g-rar', 'rarity');
      grab('#g-mi', 'mi'); grab('#g-micnt', 'micnt'); grab('#g-uniq', 'uniq');
      grab('#g-tier', 'tier'); grab('#g-theme', 'theme');
      grab('#g-jt', 'jt'); grab('#g-jth', 'jth'); grab('#g-jrar', 'jrar'); grab('#g-ujw', 'ujw');
      grab('#g-beast', 'beast'); grab('#g-srar', 'srar');
      grab('#g-gem', 'gem'); grab('#g-glvl', 'glvl'); grab('#g-gsock', 'gsock');
      grab('#g-sup', 'sup'); grab('#g-meta', 'meta'); grab('#g-buff', 'buff'); grab('#g-dest', 'dest');
    }

    // 不可编辑的物品类型（地图 / 兽魂 / 珠宝）：只读查看
    function renderReadOnlyDetail(it) {
      const KINDCN = { map: '地图', soul: '兽魂', jewel: '珠宝' };
      const mods = it.mods || [];
      let h = `<div class="er-big"><button class="er-btn" id="er-back">← 返回列表</button></div>
        <div class="er-item"><div class="nm">${esc(it.name || '(未命名)')}</div>
        <div class="meta">${esc(KINDCN[it.kind] || it.kind)} · ${RARITY[it.rarity] || it.rarity} · 物品等级 ${it.ilvl || '?'}</div></div>
        <div class="er-grp">词缀列表（只读）</div>`;
      if (!mods.length) h += `<div class="er-hint">（无词缀）</div>`;
      mods.forEach(m => {
        const txt = safeModLine(it, m);
        h += `<div class="er-affix"><span class="tx">${esc(txt || m.id + ' ' + JSON.stringify(m.v))}</span></div>`;
      });
      h += it.kind === 'jewel'
        ? `<div class="er-warn" style="margin-top:8px">珠宝用的是游戏里独立于装备的一套词缀表（本体 <code>es</code>，导出名 JAFF），与装备的 AFF 不通用，所以这里只读。<br>但<b>腐化不受影响</b>：切到「保底」页就能对这颗珠宝做瓦尔宝珠、数值拉满与破溃——官方对 <code>kind==="jewel"</code> 是放行的。</div>`
        : `<div class="er-warn" style="margin-top:8px">这类物品使用的是游戏里独立于装备的词条表（地图/兽魂各自一套）。直接套用装备词缀会让游戏在读取它时报错，因此本版本只提供查看，不做编辑。</div>`;
      body.innerHTML = h;
      body.querySelector('#er-back').onclick = () => { selectedKey = null; renderItems(); };
    }

    function renderItemDetail() {
      const list = listItems();
      if (!list) { renderItems(); return; }
      const it = findItem(selectedKey);
      if (!it) { renderItems(); return; }
      // 地图/兽魂/珠宝的词缀走各自的独立词条表（MAFF / 野兽词缀），与装备的 AFF 并不通用。
      // 游戏 mapStats() 内部是 nn[s.id].stat，没有空值保护 —— 给地图写入装备词缀会直接抛错，
      // 所以这几类只提供只读查看，避免写坏存档。
      if (it.kind !== 'item') { curItemRef = null; renderReadOnlyDetail(it); return; }
      curItemRef = it;
      const isTH = isTwoHand(it);

      // ---- 传奇专属数值（item.ur）----
      // 扩展包的 5 件传奇把 sr 随机值存 item.ur，tooltip 里的那几行是从它渲染的；
      // 只改 mods 不会动它们，所以单独给一块编辑区。
      const udef = uniqDef(it);
      const uroll = udef ? uniqRolls(it) : null;
      let uniqHtml = '';
      if (udef && uroll) {
        let rows = '';
        for (let i = 0; i < uroll.length; i++) {
          const rng = Array.isArray(udef.sr) ? udef.sr[i] : null;
          if (!rng) continue;
          const lo = Math.min(rng[0], rng[1]), hi = Math.max(rng[0], rng[1]);
          const cur = uroll[i];
          const oor = cur != null && (cur < lo || cur > hi);
          rows += `<div class="er-affix">
            <span class="tx">${esc(uniqLineLabel(udef, i))}<span class="er-sugt" style="margin-left:6px">${lo}~${hi}</span>${oor ? ' <span class="er-sev w" title="超出官方区间">越界</span>' : ''}</span>
            <input class="er-input" type="text" id="u-${i}" value="${esc(cur == null ? '' : String(cur))}">
            <button class="er-btn er-mini" data-uset="${i}">改</button>
          </div>`;
        }
        if (rows) {
          uniqHtml = `<div class="er-grp">传奇数值（${esc(udef.n || udef.id)}）</div>
            <div class="er-hint">这几行是这件传奇的专属随机值，存在 <code>item.ur</code> 里，与下面的词缀列表互不影响；
              填多少就显示多少（留空会被拒）。官方区间写在右侧，越界仍会写入但会标出来。</div>${rows}`;
        }
      }

      // ---- 符文插槽 ----
      // 官方编辑面板只给 0–2 且仅限底材允许的部位；这里放到 0–6，加出来的是空符文插槽。
      // 写入口径与官方 setter 一致：改 rsock 后 runes 只保留前 rsock 个。
      const rsockNow = Math.max(0, Math.min(RSOCK_MAX, Number(it.rsock) || 0));
      const sockHtml = `<div class="er-grp">符文插槽</div>
        <div class="er-row"><label>插槽数量（0–${RSOCK_MAX}）</label>
          <input class="er-input" type="number" min="0" max="${RSOCK_MAX}" step="1" id="er-rsock" value="${rsockNow}">
          <button class="er-btn er-mini" id="er-setrsock">改</button>
        </div>
        <div class="er-hint">游戏按底材默认给 0～1 个（官方编辑面板最多 2 个）。这里能写到 ${RSOCK_MAX}：
          <b>加出来的都是空符文插槽</b>，插符文后照常结算；减少时超出的符文会被丢弃（与官方一致）。</div>`;

      let html = `<div class="er-big"><button class="er-btn" id="er-back">← 返回列表</button></div>
        <div class="er-item"><div class="nm">${esc(it.name || '(未命名)')}</div>
        <div class="meta">${RARITY[it.rarity] || it.rarity} · 物品等级 ${it.ilvl || '?'}</div></div>
        ${isTH ? `<div class="er-warn">双手武器（${esc(WTNAME[(BASEMAP[it.base] || {}).wt] || '武器')}）：伤害类词缀效果 ×${TH_MUL}。
          下面数值框显示的是<b>倍率后</b>的生效值（与游戏面板一致），直接照你想要的数值填写即可。</div>` : ''}
        <div class="er-row"><label>稀有度</label>
          <select class="er-sel" id="er-rar" style="width:auto">
            ${RARITY.map((r, i) => `<option value="${i}" ${i === it.rarity ? 'selected' : ''}>${r}</option>`).join('')}
          </select>
          <button class="er-btn er-mini" id="er-setrar">改</button>
        </div>
        <div class="er-row"><label>基底</label>
          <select class="er-sel" id="er-base" style="flex:1">${baseOptsFor(it, false)}</select>
          <button class="er-btn er-mini" id="er-setbase">换</button>
        </div>
        <label class="er-row" style="cursor:pointer"><input type="checkbox" id="er-allslot"> 允许跨部位换基底（已装备时会自动挪到新部位）</label>
        <div class="er-hint">基底决定部位、固有词缀、需求等级与是否为双手武器。<b>换基底会按新底材重算固有词缀</b>，你自己加的词缀保留不变。</div>
        ${uniqHtml}${sockHtml}
        <div class="er-grp">词缀列表</div>`;

      const mods = it.mods || [];
      if (!mods.length) html += `<div class="er-hint">（无词缀）</div>`;
      mods.forEach((m, i) => {
        const txt = safeModLine(it, m) || (m.id + ' ' + JSON.stringify(m.v));
        const d = AFF[m.id];
        const mul = thMulFor(it, m.id, m);
        const oor = d ? outOfRange(d, m.v, mul) : null;
        const thTag = mul !== 1 ? ` <span class="er-sev th" title="该伤害类词缀享受双手武器加成 ${mul} 倍">×${mul}</span>` : '';
        // 数值框填「倍率后的生效值」，与游戏里看到的数字一致；写入时再反解回基值
        const shown = effArr(m.v || [], mul);
        html += `<div class="er-affix">
          <span class="tx">${esc(txt || m.id)}${thTag}${oor ? ' <span class="er-sev w" title="超出正常区间 ' + oor.min + '~' + oor.max + '">越界</span>' : ''}</span>
          <input class="er-input" type="text" id="m-${i}" data-mul="${mul}" value="${esc(JSON.stringify(shown.length > 1 ? shown : (shown[0] === undefined ? m.v : shown[0])))}">
          <button class="er-btn er-mini" data-mset="${i}">改</button>
          <button class="er-btn er-mini" data-mdel="${i}">删</button>
        </div>`;
      });

      // 按分类构建下拉选项（使用游戏真正显示的词缀名）
      const groups = { '前缀 (P)': [], '后缀 (S)': [], '其他': [] };
      for (const id in AFF) {
        const d = AFF[id];
        const g = d.t === 'P' ? '前缀 (P)' : d.t === 'S' ? '后缀 (S)' : '其他';
        groups[g].push({ id, name: affixName(d, id) });
      }
      let selOpts = '<option value="">— 按分类选择词缀 —</option>';
      for (const g of ['前缀 (P)', '后缀 (S)', '其他']) {
        if (!groups[g].length) continue;
        selOpts += `<optgroup label="${g}">`;
        groups[g].sort((a, b) => a.name.localeCompare(b.name, 'zh'));
        for (const o of groups[g]) selOpts += `<option value="${o.id}">${esc(o.name)} (${o.id})</option>`;
        selOpts += `</optgroup>`;
      }

      html += `<div class="er-grp">添加词缀</div>
        <div class="er-row"><label>按分类浏览（下拉，显示名=游戏内词缀名）</label></div>
        <select class="er-sel" id="er-affixselect" style="width:100%">${selOpts}</select>
        <div class="er-row" style="margin-top:6px"><label>或搜索词缀（中文显示名 / 英文 id）</label></div>
        <div class="er-combo">
          <input class="er-sel" id="er-affixid" placeholder="如 魔力回复 / 生命 / 火焰 / life" autocomplete="off">
          <div class="er-suggest" id="er-suggest"></div>
        </div>
        <div class="er-row" style="margin-top:6px"><label>t 级（阶层，T1 最高）</label>
          <select class="er-sel" id="er-tier" style="width:auto"><option value="">— 先选词缀 —</option></select>
        </div>
        <div class="er-row" style="margin-top:4px"><label>数值</label>
          <select class="er-sel" id="er-affixval" style="width:auto"><option value="">— 选 t 级 —</option></select>
        </div>
        <div id="er-rangehint"></div>
        <button class="er-btn go" id="er-addaffix" style="margin-top:6px">＋ 添加词缀</button>
        <div class="er-big" style="margin-top:8px">
          <button class="er-btn" id="er-clearmods">清空词缀</button>
          <button class="er-btn" id="er-saveitem">保存</button>
        </div>`;

      body.innerHTML = html;

      body.querySelector('#er-back').onclick = () => renderItems();
      body.querySelector('#er-setrar').onclick = () => {
        snapAuto('改稀有度前');
        it.rarity = parseInt(body.querySelector('#er-rar').value) || 0; refresh(it); toast('稀有度 → ' + RARITY[it.rarity]); renderItemDetail();
      };
      const allSlotEl = body.querySelector('#er-allslot');
      if (allSlotEl) allSlotEl.onchange = () => {
        const bs = body.querySelector('#er-base');
        if (bs) bs.innerHTML = baseOptsFor(it, allSlotEl.checked);
      };
      body.querySelector('#er-setbase').onclick = () => {
        const v = (body.querySelector('#er-base') || {}).value || '';
        if (!v) { toast('请选择要换成的基底'); return; }
        if (v === it.base) { toast('已经是这个基底了'); return; }
        snapAuto('换基底前');
        const r = applyBase(it, v, !!(allSlotEl && allSlotEl.checked));
        if (!r.ok) { toast(r.reason || '无法更换基底'); return; }
        // 名字随基底走：本体 aa() 在 rarity=0 时 name=base，魔法/稀有会重随名字，传奇名不动
        refresh(it);
        let msg = '基底 → ' + v;
        if (r.needMove) {
          msg += '（已挪到' + (SLOTNAME[r.to] || r.to) + (r.occupied ? '，原有那件退回背包' : '') + '）';
          if (typeof selectedKey === 'string' && selectedKey.indexOf('E:') === 0) selectedKey = 'E:' + r.to;
        }
        const bad = foreignMods(it).length;
        if (bad) msg += ' · ⚠ ' + bad + ' 条词缀不属于该部位（详见审查页）';
        toast(msg);
        renderItemDetail();
      };

      // 传奇专属数值：只改 item.ur 的单格，长度必须保持与 def.sr 一致
      body.querySelectorAll('[data-uset]').forEach(b => b.onclick = () => {
        const i = +b.dataset.uset;
        const inp = body.querySelector('#u-' + i);
        const raw = String((inp && inp.value) || '').trim();
        if (raw === '' || !isFinite(Number(raw))) { toast('请输入有效数字'); return; }
        const v = Math.round(Number(raw));
        const def = uniqDef(it);
        const rolls = uniqRolls(it);
        if (!def || !rolls) { toast('这件装备没有传奇数值'); return; }
        snapAuto('改传奇数值前');
        rolls[i] = v;
        const rng = Array.isArray(def.sr) ? def.sr[i] : null;
        const oor = rng && (v < Math.min(rng[0], rng[1]) || v > Math.max(rng[0], rng[1]));
        refresh(it);
        toast(oor ? '已修改（数值越界，仍已写入）' : '已修改 → ' + uniqLineLabel(def, i) + ' ' + v);
        renderItemDetail();
      });

      // 符文插槽：写 rsock，并按官方 setter 的口径裁剪 runes
      body.querySelector('#er-setrsock').onclick = () => {
        const el = body.querySelector('#er-rsock');
        const raw = String((el && el.value) || '').trim();
        const n = Math.round(Number(raw));
        if (raw === '' || !isFinite(n) || n < 0 || n > RSOCK_MAX) { toast('插槽数量需为 0–' + RSOCK_MAX + ' 的整数'); return; }
        snapAuto('改插槽数前');
        const before = Math.max(0, Number(it.rsock) || 0);
        it.rsock = n;
        it.runes = (Array.isArray(it.runes) ? it.runes : []).slice(0, n);
        refresh(it);
        let msg = '符文插槽 → ' + n;
        if (n < before) msg += '（超出的 ' + (before - n) + ' 个符文已丢弃）';
        else if (n > before) msg += '（新增 ' + (n - before) + ' 个空槽）';
        toast(msg);
        renderItemDetail();
      };

      body.querySelectorAll('[data-mset]').forEach(b => b.onclick = () => {
        const i = +b.dataset.mset;
        const inp = body.querySelector('#m-' + i);
        const raw = inp.value.trim();
        const mul = Number(inp.dataset.mul) || 1;
        let v; try { v = JSON.parse(raw); } catch (e) { v = Number(raw); }
        if (!Array.isArray(v)) v = [v];
        v = v.map(Number);
        if (!isFinite(v[0])) { toast('请输入有效数字'); return; }
        // 面板填的是生效值 → 反解回存储基值（游戏读取时才会再乘一次倍率）
        const stored = storedArr(v, mul);
        snapAuto('改词缀前');
        it.mods[i].v = stored;
        const d = AFF[it.mods[i].id];
        const oor = d ? outOfRange(d, stored, mul) : null;
        refresh(it);
        toast(oor ? '已修改（数值越界，仍已写入）' : '已修改' + (mul !== 1 ? ` → 生效值 ${effArr(stored, mul).join(', ')}` : ''));
        renderItemDetail();
      });
      body.querySelectorAll('[data-mdel]').forEach(b => b.onclick = () => {
        snapAuto('删词缀前');
        const i = +b.dataset.mdel; it.mods.splice(i, 1); refresh(it); toast('已删除'); renderItemDetail();
      });
      const affixEl = body.querySelector('#er-affixid');
      const suggEl = body.querySelector('#er-suggest');
      const tierEl = body.querySelector('#er-tier');
      const valEl = body.querySelector('#er-affixval');
      let currentAffixId = null;

      // 取游戏内真正显示的词缀名（去掉数值占位符 {0}/{v}）
      function affixName(d, id) {
        if (d && d.text) {
          let n = d.text.replace(/\{[^}]*\}/g, '').replace(/\s+/g, ' ').trim();
          n = n.replace(/^[+\-×÷%\s]+/, '').replace(/\s*%\s*$/, '');
          if (n) return n;
        }
        return (d && d.nm) || id;
      }
      // 按中文显示名 / nm / 英文 id 解析词缀
      function resolveAffix(q) {
        q = (q || '').trim().toLowerCase();
        if (!q) return null;
        if (AFF[q]) return q;                       // 直接是 id
        for (const id in AFF) {
          const d = AFF[id];
          const dn = affixName(d, id).toLowerCase();
          if (id.toLowerCase() === q) return id;
          if ((d.nm || '').toLowerCase().includes(q)) return id;
          if (dn.includes(q)) return id;
        }
        return null;
      }
      // 实时下拉候选（中文显示名 / nm / id 子串匹配）
      function showSuggest(q) {
        q = (q || '').trim().toLowerCase();
        if (!q) { suggEl.style.display = 'none'; return; }
        const matches = [];
        for (const id in AFF) {
          const d = AFF[id];
          const dn = affixName(d, id).toLowerCase();
          if (id.toLowerCase().includes(q) || (d.nm || '').toLowerCase().includes(q) || dn.includes(q)) {
            matches.push({ id, name: affixName(d, id), t: d.t || 'P' });
            if (matches.length >= 50) break;
          }
        }
        if (!matches.length) { suggEl.style.display = 'none'; return; }
        suggEl.innerHTML = matches.map(m =>
          `<div class="er-sug" data-id="${m.id}">${esc(m.name)} <span class="er-sugid">${m.id}</span><span class="er-sugt">${m.t}</span></div>`
        ).join('');
        suggEl.style.display = 'block';
        suggEl.querySelectorAll('.er-sug').forEach(el => {
          el.onclick = () => {
            currentAffixId = el.dataset.id;
            const d = AFF[currentAffixId];
            affixEl.value = affixName(d, currentAffixId) + ' (' + currentAffixId + ')';
            suggEl.style.display = 'none';
            buildTiers(d);
          };
        });
      }

      affixEl.addEventListener('input', () => {
        currentAffixId = resolveAffix(affixEl.value);
        if (currentAffixId) buildTiers(AFF[currentAffixId]);
        showSuggest(affixEl.value);
      });
      affixEl.addEventListener('blur', () => setTimeout(() => { suggEl.style.display = 'none'; }, 150));

      // 分类下拉：选中即绑定词缀
      const affixSel = body.querySelector('#er-affixselect');
      affixSel.addEventListener('change', () => {
        const id = affixSel.value;
        if (!id || !AFF[id]) { currentAffixId = null; return; }
        currentAffixId = id;
        const d = AFF[id];
        affixEl.value = affixName(d, id) + ' (' + id + ')';
        buildTiers(d);
      });

      tierEl.addEventListener('change', () => {
        if (currentAffixId) buildValues(AFF[currentAffixId], parseInt(tierEl.value) || 0);
        updateRangeHint();
      });
      valEl.addEventListener('change', updateRangeHint);

      // 越界实时提示（提示但不阻止写入）；区间一律显示为倍率后的生效值
      function updateRangeHint() {
        const el = body.querySelector('#er-rangehint'); if (!el) return;
        const d = currentAffixId ? AFF[currentAffixId] : null;
        if (!d) { el.className = 'er-hint'; el.textContent = ''; return; }
        const ri = rangeInfo(d);
        if (!ri) { el.className = 'er-hint'; el.textContent = '该词缀无预设数值范围'; return; }
        const mul = affixMul(d.id);
        const eff = x => Math.round(x * mul);
        const lo = eff(ri.min), hi = eff(ri.max);
        const tip = mul !== 1 ? `（已含双手 ×${mul}）` : '';
        const ti = parseInt(tierEl.value);
        let txt = '正常区间 ' + lo + '~' + hi + tip;
        if (!isNaN(ti) && ri.tiers[ti]) txt += ' · 当前 ' + tierLabel(d, ti) + ' ' + eff(ri.tiers[ti].lo) + '~' + eff(ri.tiers[ti].hi);
        const raw = valEl.value;
        if (raw !== '') {
          let v; try { v = JSON.parse(raw); } catch (e) { v = Number(raw); }
          const stored = storedArr(Array.isArray(v) ? v : [v], mul);
          const oor = outOfRange(d, stored, mul);
          if (oor) { el.className = 'er-warn'; el.textContent = '⚠ 越界：' + JSON.stringify(Array.isArray(v) ? v : [v]) + ' 超出正常 ' + lo + '~' + hi + '（仍会写入）'; return; }
        }
        el.className = 'er-hint'; el.textContent = txt;
      }

      body.querySelector('#er-addaffix').onclick = () => {
        const id = currentAffixId || resolveAffix(affixEl.value);
        const d = id ? AFF[id] : null;
        if (!d) { toast('请先在上方下拉里选择一个词缀'); return; }
        const ti = parseInt(tierEl.value);
        const raw = valEl.value;
        if (raw === '' || isNaN(ti)) { toast('请先选 t 级与数值'); return; }
        let v; try { v = JSON.parse(raw); } catch (e) { v = Number(raw); }
        if (!Array.isArray(v)) v = [v];
        v = v.map(Number);
        if (d.pair && v.length < 2) { toast(affixName(d, id) + ' 是双值词缀，请选含 [a,b] 的项'); return; }
        // 下拉里选的是生效值 → 反解回基值存储，保证游戏读出正好是你选的那个数
        const mul = affixMul(id);
        const stored = storedArr(v, mul);
        snapAuto('加词缀前');
        it.mods = it.mods || [];
        it.mods.push({ id, t: d.t || 'P', ti: ti, v: stored });
        const oor = outOfRange(d, stored, mul);
        refresh(it);
        const valTxt = ' ' + effArr(stored, mul).join(', ');
        const tLab = tierLabel(d, ti);
        toast(oor ? '已添加 ' + affixName(d, id) + ' · ' + tLab + valTxt + '（数值越界，仍已写入）' : '已添加 ' + affixName(d, id) + ' · ' + tLab + valTxt);
        renderItemDetail();
      };
      body.querySelector('#er-clearmods').onclick = () => { snapAuto('清空词缀前'); it.mods = []; refresh(it); toast('已清空词缀'); renderItemDetail(); };
      body.querySelector('#er-saveitem').onclick = () => { saveAll(); };
    }

    /* ---------------- 状态页 ---------------- */
    function renderStatus() {
      const G = R.G;
      let html = `<div class="er-status">
        <p>__rift 就绪：<b>${!!R}</b></p>
        <p>玩家对象 R.G：<b>${G ? '已加载' : 'null（未进入角色）'}</b></p>`;
      if (G) {
        const inv = (G.inv || []).filter(x => x && x.kind === 'item').length;
        const eq = G.equip || {};
        const worn = Object.keys(eq).filter(k => eq[k]);
        html += `<p>背包装备数：<b>${inv}</b></p>
          <p>已装备：<b>${worn.length ? worn.join('、') : '无'}</b></p>`;
      }
      html += `</div>
        <div class="er-big">
          <button class="er-btn go" id="er-saveall">保存全部</button>
          <button class="er-btn" id="er-recalc">重算属性</button>
        </div>
        <div class="er-hint">修改后建议点「保存全部」。已装备的改动立即生效；背包装备关掉重开或刷新页面最稳。</div>
        <div class="er-hint">本工具仅修改你自己浏览器里的本地存档，不影响他人。游戏为免费单机作品，玩得开心可去作者页面支持。</div>`;
      body.innerHTML = html;
      body.querySelector('#er-saveall').onclick = () => saveAll();
      body.querySelector('#er-recalc').onclick = () => { try { updPlayer && updPlayer(0); toast('已重算'); } catch (e) { toast('重算失败'); } };
    }

    /* ---------------- 审查页：存档体检 + 快照管理 ---------------- */
    function collectIssues() {
      const P = player();
      const issues = [];
      if (!P) return [{ sev: 'e', text: '未进入角色，无法体检' }];
      // 完整性：结构是否齐全、能否序列化
      if (!Array.isArray(P.inv)) issues.push({ sev: 'e', text: '角色背包 (inv) 结构异常' });
      if (!P.equip || typeof P.equip !== 'object') issues.push({ sev: 'e', text: '已装备 (equip) 结构异常' });
      try { JSON.parse(JSON.stringify(P)); }
      catch (e) { issues.push({ sev: 'e', text: '角色数据无法序列化（可能已损坏）' }); }

      const items = [];
      const eq = P.equip || {};
      for (const slot in eq) if (eq[slot]) items.push({ where: '装备·' + (SLOTNAME[eq[slot].slot] || slot), it: eq[slot] });
      (P.inv || []).forEach((it, i) => { if (it && it.kind === 'item') items.push({ where: '背包#' + i, it }); });

      for (const { where, it } of items) {
        const nm = it.name || '(未命名)';
        const mods = it.mods || [];
        const seen = Object.create(null);
        mods.forEach((m, idx) => {
          const tag = `${where} ${nm}`;
          const d = AFF[m.id];
          if (!d) { issues.push({ sev: 'e', text: `${tag} 第${idx + 1}条词缀 id「${m.id}」不存在（非法词缀）` }); return; }
          const label = d.nm || m.id;
          if (seen[m.id]) issues.push({ sev: 'w', text: `${tag} 词缀「${label}」重复出现 ${seen[m.id] + 1} 次` });
          seen[m.id] = (seen[m.id] || 0) + 1;
          // 双手武器的伤害类词缀：游戏读取时会 ×TH_MUL，故正常区间按倍率后的生效值报告
          const mul = thMulFor(it, m.id, m);
          const oor = outOfRange(d, m.v, mul);
          if (oor) {
            const shown = effArr(m.v || [], mul);
            issues.push({ sev: 'w', text: `${tag}「${label}」数值 ${JSON.stringify(shown)}${mul !== 1 ? `（含双手 ×${mul}）` : ''} 越界（正常 ${oor.min}~${oor.max}）` });
          }
        });
        // 词缀条数与稀有度是否匹配
        const cap = it.rarity === 0 ? 0 : it.rarity === 1 ? 2 : it.rarity === 2 ? 6 : null;
        if (cap !== null && mods.length > cap) {
          issues.push({ sev: 'w', text: `${where} ${nm} 稀有度「${RARITY[it.rarity]}」却有 ${mods.length} 条词缀（常规上限 ${cap}）` });
        }
      }
      return issues;
    }

    function renderAudit() {
      let html = `<div class="er-grp">存档快照（自动，最近 ${SNAP_MAX} 份）</div>`;
      const snaps = snapList();
      if (!snaps.length) html += `<div class="er-hint">暂无快照。每次修改前会自动存一份，改错了可一键还原。</div>`;
      else {
        snaps.forEach((s, i) => {
          const d = new Date(s.t);
          const p2 = n => String(n).padStart(2, '0');
          const tm = `${d.getMonth() + 1}/${d.getDate()} ${p2(d.getHours())}:${p2(d.getMinutes())}:${p2(d.getSeconds())}`;
          html += `<div class="er-snap">
            <span class="tm">${esc(s.label || '快照')} · ${tm}</span>
            <button class="er-btn er-mini" data-restore="${i}">还原</button>
          </div>`;
        });
      }
      html += `<div class="er-big">
        <button class="er-btn" id="er-snapnow">立即存快照</button>
        <button class="er-btn" id="er-snapclear">清空快照</button>
      </div>`;

      html += `<div class="er-grp">存档体检</div>`;
      const issues = collectIssues();
      const errs = issues.filter(x => x.sev === 'e');
      const warns = issues.filter(x => x.sev === 'w');
      if (!issues.length) {
        html += `<div class="er-audit ok"><div class="ti">✔ 未发现异常</div>
          <div class="li">词缀 id 均合法、数值均在正常区间、稀有度与词缀数匹配、存档结构完整。</div></div>`;
      } else {
        html += `<div class="er-audit ${errs.length ? 'bad' : ''}">
          <div class="ti">发现 ${issues.length} 项（错误 ${errs.length} · 提醒 ${warns.length}）</div>
          <div class="li">${issues.map(x => `<span class="er-sev ${x.sev}">${x.sev === 'e' ? '错误' : '提醒'}</span>${esc(x.text)}`).join('<br>')}</div>
        </div>`;
      }
      html += `<div class="er-hint">提示：越界数值不影响生效，只是提醒你填了超出正常区间的值；非法词缀 id 才是真问题。</div>`;
      body.innerHTML = html;

      body.querySelector('#er-snapnow').onclick = () => { toast(snapTake('手动') ? '已存快照' : '存快照失败'); renderAudit(); };
      body.querySelector('#er-snapclear').onclick = () => { snapClear(); toast('已清空快照'); renderAudit(); };
      body.querySelectorAll('[data-restore]').forEach(b => b.onclick = () => {
        const i = +b.dataset.restore;
        if (!confirm('确定还原到该快照？当前未保存的改动会被覆盖。')) return;
        toast(snapRestore(i) ? '已还原到该快照' : '还原失败');
        selectedKey = null; renderAudit();
      });
    }

    /* ---------------- 保底页：赌博类操作定向最佳结果 ----------------
       之所以不能"直接调用游戏函数再改结果"，是因为这些结果的随机性来自游戏内部 RNG
       （瓦尔 lL / 祭坛 A2→Ph 确定性命运），没有可注入的入口。这里按游戏源码的
       "最好分支"逐个复刻，并把随机挑选改成用户自选：
       - 腐化 impl 分支: item.cimpl = {k, v}，其中 {k,v} 原本是 ae(corruptPool(item)) 随机取
       - 祭坛 up(升华) 分支: 追加 cimpl/cimpl2 + 全部词缀 v = max(v+1, round(v*1.1)) 并标记 ex=1
       - 破溃: mods[i].fr = true（游戏只允许 1 条）
       - 铸造履历统一走 noteCraft(kind, item, null) 写入 item.cr[kind]
    ---------------- */
    const gambleState = { q: '', slot: '', rar: '', key: null, consume: false };

    function cimplPool(it) {
      if (typeof corruptPool === 'function') {
        try { const p = corruptPool(it); if (Array.isArray(p) && p.length) return p; } catch (e) {}
      }
      return CORRUPT_POOL;
    }
    function cimplText(k, v) {
      const t = CIMPL_TEXT[k];
      return t ? t.replace('{v}', v) : (k + ' ' + v);
    }
    // 该词缀当前阶层（或传奇 ur）的上限值，返回数组；无范围数据返回 null
    function tierMax(def, m) {
      if (m && Array.isArray(m.ur)) {
        return Array.isArray(m.ur[0]) ? m.ur.map(p => Math.max(p[0], p[1])) : [Math.max(m.ur[0], m.ur[1])];
      }
      const rs = def && def.ranges;
      if (!rs || !rs.length) return null;
      // ti 是 ranges 索引：0 = 最低阶 T{n}，length-1 = 最高阶 T1
      const ti = Math.max(0, Math.min(rs.length - 1, (m && m.ti) || 0));
      const r = rs[ti];
      return Array.isArray(r[0]) ? r.map(p => Math.max(p[0], p[1])) : [r[1]];
    }
    // 「模拟真实消耗」：钱包里有才扣，没有就免单（不影响操作本身）
    function payCur(id) {
      if (!gambleState.consume) return false;
      const cur = WALLET && WALLET.cur;
      if (cur && (cur[id] || 0) > 0) { cur[id]--; safeSaveWallet(); return true; }
      return false;
    }
    function gambleEligible() {
      const list = listItems() || [];
      // 珠宝也在内：本体 cL() 的 vaal 分支写的是 `if(t.kind!=="item"&&t.kind!=="jewel")return"只能用于装备"`，
      // 即官方明确允许瓦尔宝珠腐化珠宝（只是腐化词缀池会剔除 skillLvl，见 I0()）
      return list.filter(o => o.item && (o.item.kind === 'item' || o.item.kind === 'jewel'));
    }
    function gambleItem() {
      const x = gambleEligible().find(o => o.key === gambleState.key);
      return x ? x.item : null;
    }
    function cimplOptions(it, exclude, selected) {
      let s = '';
      cimplPool(it).forEach(([k, rng]) => {
        if (exclude && k === exclude) return;
        const hi = Array.isArray(rng) ? rng[1] : rng;
        s += `<option value="${esc(k)}" ${k === selected ? 'selected' : ''}>${esc(cimplText(k, hi))}（池内最大 ${hi}）</option>`;
      });
      return s || '<option value="">（词缀池为空）</option>';
    }
    function cimplDefault(it, exclude) {
      const p = cimplPool(it).filter(([k]) => k !== exclude);
      if (!p.length) return null;
      const k = p[0][0], rng = p[0][1];
      return { k, v: Array.isArray(rng) ? rng[1] : rng };
    }
    function readCimpl(prefix, fallback) {
      const kEl = body.querySelector('#' + prefix + 'key');
      const vEl = body.querySelector('#' + prefix + 'val');
      const k = kEl ? kEl.value : (fallback && fallback.k);
      const rng = (cimplPool(gambleItem()).find(([kk]) => kk === k) || [])[1];
      const hi = Array.isArray(rng) ? rng[1] : rng;
      let v = Number(vEl ? vEl.value : NaN);
      if (!isFinite(v) || v <= 0) v = (hi !== undefined ? hi : 1);
      return { k, v: Math.round(v), hi };
    }

    function renderGamble() {
      const P = player();
      if (!P) { body.innerHTML = `<div class="er-empty">尚未进入角色。<br>请先点进一个角色、进入游戏世界后再使用本页。</div>`; return; }

      let all = gambleEligible();
      const q = (gambleState.q || '').trim().toLowerCase();
      const f = all.filter(o => {
        const it = o.item;
        if (q && !(it.name || '').toLowerCase().includes(q)) return false;
        if (gambleState.slot !== '' && ((BASEMAP[it.base] || {}).slot || it.slot) !== gambleState.slot) return false;
        if (gambleState.rar !== '' && String(it.rarity) !== gambleState.rar) return false;
        return true;
      });
      if (f.length) { if (!f.some(o => o.key === gambleState.key)) gambleState.key = f[0].key; }
      else gambleState.key = null;

      const it = gambleItem();
      let opts = '';
      f.forEach(o => {
        const x = o.item;
        const tag = x.dc ? '双重腐化' : x.corrupted ? '已腐化' : '';
        opts += `<option value="${esc(o.key)}"${o.key === gambleState.key ? ' selected' : ''}>${esc(x.name || '(未命名)')} · ${RARITY[x.rarity] || x.rarity} · ${esc(o.loc)}${tag ? ' · ' + tag : ''}</option>`;
      });

      const slotOpts = Object.keys(SLOTNAME)
        .map(c => `<option value="${esc(c)}"${gambleState.slot === c ? ' selected' : ''}>${SLOTNAME[c]}</option>`).join('');
      const rarOpts = RARITY.map((r, i) => `<option value="${i}"${String(i) === gambleState.rar ? ' selected' : ''}>${r}</option>`).join('');

      let html = `<div class="er-row"><label>筛选</label></div>
        <div class="er-big">
          <input class="er-input" id="wg-q" placeholder="名称搜索" style="flex:1;width:auto" value="${esc(gambleState.q)}">
          <select class="er-sel" id="wg-slot" style="flex:1;width:auto"><option value="">全部部位</option>${slotOpts}</select>
          <select class="er-sel" id="wg-rar" style="flex:1;width:auto"><option value="">全部稀有度</option>${rarOpts}</select>
        </div>
        <div class="er-row" style="margin-top:6px"><label>目标装备</label></div>
        <select class="er-sel" id="wg-item" style="width:100%">${opts || '<option value="">（没有符合条件的装备）</option>'}</select>
        <label class="er-row" style="margin-top:6px;cursor:pointer">
          <input type="checkbox" id="wg-consume"${gambleState.consume ? ' checked' : ''}> 模拟真实消耗（扣除瓦尔宝珠 / 余烬之心，不足则免单）
        </label>`;

      if (!it) { body.innerHTML = html + `<div class="er-empty">请先在上方选一件装备。</div>`; wireGamble(null, f); return; }

      const isJewel = it.kind === 'jewel';
      const mods = it.mods || [];
      const nFr = mods.filter(m => m.fr).length, nEx = mods.filter(m => m.ex).length;
      html += `<div class="er-item"><div class="nm">${esc(it.name || '(未命名)')}</div>
        <div class="meta">${RARITY[it.rarity] || it.rarity} · 物品等级 ${it.ilvl || '?'} · 词缀 ${mods.length} 条
        ${it.corrupted ? '<span class="er-sev e">已腐化</span>' : ''}${it.dc ? '<span class="er-sev e">双重腐化·' + esc(String(it.dc)) + '</span>' : ''}
        ${nFr ? '<span class="er-sev i">破溃 ' + nFr + '</span>' : ''}${nEx ? '<span class="er-sev i">超越 ' + nEx + '</span>' : ''}</div></div>
        ${it.cimpl ? `<div class="er-affix"><span class="tx">腐化：${esc(cimplText(it.cimpl.k, it.cimpl.v))}</span></div>` : ''}
        ${it.cimpl2 ? `<div class="er-affix"><span class="tx">双重腐化：${esc(cimplText(it.cimpl2.k, it.cimpl2.v))}</span></div>` : ''}`;

      /* ① 数值保底 */
      html += `<div class="er-grp">① 数值保底（替代神圣石）</div>
        <div class="er-hint">把每条词缀顶到当前阶层上限——游戏里这是完全随机的。${isJewel
          ? '珠宝走自己的词缀表（与装备不通用），阶层同样是 T1 最高。'
          : `双手武器会按 ×${TH_MUL} 显示。`}</div>
        <label class="er-row" style="cursor:pointer"><input type="checkbox" id="wg-t1"> 顺便把每条词缀升到 T1（最高阶层）</label>
        <label class="er-row" style="cursor:pointer"><input type="checkbox" id="wg-incfr"> 包含破溃词缀（默认跳过，游戏里不能改这些）</label>
        <button class="er-btn go" id="wg-domax" style="width:100%;margin-top:6px">数值拉满</button>`;

      /* ② 瓦尔宝珠 */
      // 本体 lL()：a<.3 → none；a<.6 → impl；a<.8 且 kind==="jewel" → 同样走 impl
      //（珠宝没有符文插槽，官方把「+1 插槽」那一档在珠宝上改写成了腐化词缀）
      html += `<div class="er-grp">② 瓦尔宝珠（腐化）</div>`;
      if (isJewel) {
        html += `<div class="er-hint">珠宝<b>可以</b>腐化（官方 cL() 对 kind==="jewel" 放行），但有两处与装备不同：<br>
          · 珠宝没有符文插槽，原本「+1 符文插槽」那一档在珠宝上会改为追加腐化词缀，所以这里没有该选项；<br>
          · 腐化词缀池会剔除「技能等级」（官方 I0() 过滤 skillLvl），因此可选条数比装备少一条。</div>`;
      }
      html += `<div class="er-row"><label>结果（自选，不再随机）</label>
          <select class="er-sel" id="wg-vout" style="width:auto">
            <option value="impl">获得腐化词缀（自选 + 拉满）</option>
            ${isJewel ? '' : '<option value="sock">+1 符文插槽</option>'}
            <option value="none">无事发生（仅打上腐化标记）</option>
          </select>
        </div>
        <div class="er-row" style="margin-top:4px"><label>腐化词缀</label></div>
        <select class="er-sel" id="wg-vkey" style="width:100%">${cimplOptions(it, null, null)}</select>
        <div class="er-row" style="margin-top:4px"><label>数值</label>
          <input class="er-input" id="wg-vval" type="number" style="width:80px">
        </div>
        ${isJewel ? '' : '<label class="er-row" style="cursor:pointer"><input type="checkbox" id="wg-vsock"> 同时 +1 符文插槽（贪心组合）</label>'}
        <button class="er-btn go" id="wg-dovaal" style="width:100%;margin-top:6px">执行腐化</button>`;

      /* ③ 余烬祭坛 */
      if (isJewel) {
        // 本体 $2()：e.kind!=="item" → "只能献祭装备"；珠宝永远过不了这道门槛
        html += `<div class="er-grp">③ 余烬祭坛（珠宝不可用）</div>
          <div class="er-hint">官方只允许献祭<b>装备</b>：本体 $2() 对非装备直接返回「只能献祭装备」。
            珠宝因此没有第二层腐化，腐化词缀只能有 1 条（用上面的瓦尔宝珠即可）。</div>`;
      } else {
        const altBlocked = it.dc ? '已双重腐化过（每件只能献祭一次）—— 可用下方维护工具清除标记重来'
          : !it.corrupted ? '尚未腐化，执行时会自动先腐化' : '';
        html += `<div class="er-grp">③ 余烬祭坛（双重腐化）</div>
          <div class="er-hint">原本 20% 升华 / 30% 无事发生 / 30% 失衡 / 20% 化为余烬（装备会消失）。这里锁定为最好的「升华」：追加 1 条腐化词缀 + 全部词缀 +10%（可超越 T1）。</div>
          <div class="er-row"><label>新增腐化词缀</label></div>
          <select class="er-sel" id="wg-akey" style="width:100%">${cimplOptions(it, it.cimpl && it.cimpl.k, null)}</select>
          <div class="er-row" style="margin-top:4px"><label>数值</label>
            <input class="er-input" id="wg-aval" type="number" style="width:80px">
          </div>
          ${altBlocked ? `<div class="er-warn">${esc(altBlocked)}</div>` : ''}
          <button class="er-btn go" id="wg-doaltar" style="width:100%;margin-top:6px"${it.dc ? ' disabled' : ''}>执行献祭（必定升华）</button>`;
      }

      /* ④ 破溃石保底 */
      let modOpts = '';
      mods.forEach((m, i) => {
        const t = safeModLine(it, m) || m.id;
        modOpts += `<option value="${i}"${m.fr ? ' selected' : ''}>${esc(t)}${m.fr ? '（当前已破溃）' : ''}</option>`;
      });
      html += `<div class="er-grp">④ 破溃石保底</div>
        <div class="er-hint">原本随机锁 1 条；这里由你指定，之后任何通货都无法改变它。${isJewel
          ? (mods.length < 2 ? '<br><span class="er-sev w">提醒</span>珠宝的破溃门槛是「稀有 + 2 条词缀」，当前只有 ' + mods.length + ' 条。' : '')
          : (mods.length < 4 ? '<br><span class="er-sev w">提醒</span>游戏要求至少 4 条词缀，当前只有 ' + mods.length + ' 条。' : '')}</div>
        <select class="er-sel" id="wg-fridx" style="width:100%">${modOpts || '<option value="">（无词缀）</option>'}</select>
        <button class="er-btn go" id="wg-dofrac" style="width:100%;margin-top:6px"${(isJewel ? (!mods.length || it.rarity !== 2) : !mods.length) ? ' disabled' : ''}>指定破溃</button>`;

      /* ⑤ 一键必胜 */
      html += `<div class="er-grp">⑤ 一键必胜</div>
        <div class="er-hint">按顺序：全部词缀升 T1 并拉满 → 自选腐化词缀${isJewel ? '（珠宝没有祭坛那一层，到此为止）' : ' → 祭坛升华（+10%）'}。直接用上面的选择，不必逐个点。</div>
        <button class="er-btn go" id="wg-doall" style="width:100%;margin-top:6px">一键做到顶配</button>`;

      /* 维护 */
      html += `<div class="er-grp">维护（可反悔）</div>
        <div class="er-big">
          <button class="er-btn" id="wg-undodc">清除双重腐化</button>
          <button class="er-btn" id="wg-undocor">清除全部腐化</button>
        </div>
        <div class="er-big" style="margin-top:4px">
          <button class="er-btn" id="wg-unex">清除超越标记</button>
          <button class="er-btn" id="wg-unfr">清除破溃</button>
        </div>`;

      body.innerHTML = html;
      wireGamble(it, f);
    }

    function wireGamble(it, list) {
      // it 可能为 null（列表里没有符合条件的物品时会带着 null 进来），这里必须容忍
      const isJewel = !!it && it.kind === 'jewel';
      const qEl = body.querySelector('#wg-q');
      if (qEl) qEl.oninput = () => { gambleState.q = qEl.value; };
      const sEl = body.querySelector('#wg-slot');
      if (sEl) sEl.onchange = () => { gambleState.slot = sEl.value; renderGamble(); };
      const rEl = body.querySelector('#wg-rar');
      if (rEl) rEl.onchange = () => { gambleState.rar = rEl.value; renderGamble(); };
      const cEl = body.querySelector('#wg-consume');
      if (cEl) cEl.onchange = () => { gambleState.consume = cEl.checked; };
      const iEl = body.querySelector('#wg-item');
      if (iEl) iEl.onchange = () => { gambleState.key = iEl.value; renderGamble(); };

      // 选择了词缀/阶层时自动把「数值」框补为该选项的池内最大值
      const autoFill = (keySel, valEl) => {
        if (!keySel || !valEl) return () => {};
        const upd = () => {
          const [[, rng]] = [cimplPool(gambleItem()).find(([k]) => k === keySel.value) || [null, [1, 1]]];
          valEl.value = Array.isArray(rng) ? rng[1] : rng;
        };
        keySel.onchange = upd; upd(); return upd;
      };
      autoFill(body.querySelector('#wg-vkey'), body.querySelector('#wg-vval'));
      autoFill(body.querySelector('#wg-akey'), body.querySelector('#wg-aval'));

      /* ---- ① 数值拉满 ---- */
      const maxBtn = body.querySelector('#wg-domax');
      if (maxBtn) maxBtn.onclick = () => {
        const toT1 = body.querySelector('#wg-t1').checked;
        const incFr = body.querySelector('#wg-incfr').checked;
        let changed = 0; const lines = [];
        snapAuto('数值拉满前');
        (it.mods || []).forEach(m => {
          if (m.fr && !incFr) return;
          const d = affOf(it, m.id); if (!d) return;
          const mul = thMulFor(it, m.id, m);
          const before = effArr(m.v || [], mul);
          const top = topTierIdx(d);
          const tmx = tierMax(d, m.ur ? m : { ti: toT1 ? top : (m.ti || 0) });
          if (!tmx) return;
          if (toT1) m.ti = top;
          m.v = tmx;
          const after = effArr(m.v, mul);
          if (String(before) !== String(after)) { changed++; lines.push(safeModLine(it, m) || m.id); }
        });
        payCur('divine'); refresh(it);
        const newest = lines[lines.length - 1] || '';
        if (changed) toast(`已拉满 ${changed} 条词缀${toT1 ? '（并升到 T1）' : ''} · 末条：${newest}`);
        else toast('没有可调整的词缀（可能都是破溃或无范围数据）');
        renderGamble();
      };

      /* ---- ② 瓦尔宝珠 ---- */
      const vb = body.querySelector('#wg-dovaal');
      if (vb) vb.onclick = () => {
        const out = body.querySelector('#wg-vout').value;
        const vs = body.querySelector('#wg-vsock');          // 珠宝没有这个勾选框
        const extra = !!(vs && vs.checked);
        snapAuto('瓦尔宝珠前');
        payCur('vaal');
        it.corrupted = true;
        let msg = '无事发生（已打上腐化标记）';
        if (out === 'impl') {
          const g = readCimpl('wg-v');
          if (!g.k) { toast('未取到腐化词缀选项'); return; }
          it.cimpl = { k: g.k, v: g.v };
          msg = '腐化词缀 ' + cimplText(g.k, g.v);
        } else if (out === 'sock' && !isJewel) { it.extraSock = 1; it.rsock = (it.rsock || 0) + 1; msg = '+1 符文插槽'; }
        if (extra && out !== 'sock') { it.extraSock = 1; it.rsock = (it.rsock || 0) + 1; msg += ' · +1 符文插槽'; }
        try { noteCraft && noteCraft('vaal', it, null); } catch (e) {}
        refresh(it); toast('腐化 → ' + msg); renderGamble();
      };

      /* ---- ③ 余烬祭坛 ---- */
      const ab = body.querySelector('#wg-doaltar');
      if (ab) ab.onclick = () => {
        if (it.dc) { toast('已双重腐化过，每件只能一次'); return; }
        const g = readCimpl('wg-a');
        if (!g.k) { toast('未取到腐化词缀选项'); return; }
        snapAuto('祭坛前');
        payCur('ember');
        if (!it.corrupted) it.corrupted = true;          // 祭坛前置条件：必须先腐化
        const h = { k: g.k, v: g.v };
        if (it.cimpl) it.cimpl2 = h; else it.cimpl = h;
        (it.mods || []).forEach(m => {
          m.v = (m.v || []).map(x => x > 0 ? Math.max(x + 1, Math.round(x * 1.1)) : x);
          m.ex = 1;
        });
        it.dc = 'up';
        try { noteCraft && noteCraft('altar', it, null); } catch (e) {}
        refresh(it); toast('祭坛 · 升华：' + cimplText(g.k, g.v) + ' · 全部词缀 +10%'); renderGamble();
      };

      /* ---- ④ 破溃 ---- */
      const fb = body.querySelector('#wg-dofrac');
      if (fb) fb.onclick = () => {
        const sel = body.querySelector('#wg-fridx');
        const idx = Number(sel && sel.value);
        const m = (it.mods || [])[idx];
        if (!m) { toast('请先有词缀'); return; }
        // 本体 cL() 的 frac 分支：珠宝门槛是 min(4, tu()) = 2，且必须稀有
        if (isJewel && (it.rarity !== 2 || (it.mods || []).length < 2)) { toast('珠宝破溃需要「稀有 + 2 条词缀」'); return; }
        snapAuto('破溃前');
        payCur('frac');
        (it.mods || []).forEach(x => { delete x.fr; });
        m.fr = true;
        refresh(it); toast('已设为破溃：' + (safeModLine(it, m) || m.id)); renderGamble();
      };

      /* ---- ⑤ 一键必胜 ---- */
      const ab2 = body.querySelector('#wg-doall');
      if (ab2) ab2.onclick = () => {
        snapAuto('一键必胜前');
        // 1) 全部升 T1 + 拉满
        (it.mods || []).forEach(m => {
          const d = affOf(it, m.id); if (!d) return;
          const top = topTierIdx(d);
          const tmx = tierMax(d, m.ur ? m : { ti: top });
          if (!tmx) return;
          m.ti = top; m.v = tmx;
        });
        // 2) 腐化（若还没）
        let vmsg = '';
        if (!it.corrupted) {
          it.corrupted = true;
          const g = readCimpl('wg-v');
          if (g.k) { it.cimpl = { k: g.k, v: g.v }; vmsg = cimplText(g.k, g.v); }
        }
        // 3) 祭坛升华（珠宝没有这一层：本体 $2() 只接受 kind==="item"）
        if (!isJewel && !it.dc) {
          const g = readCimpl('wg-a');
          const h = { k: g.k, v: g.v };
          if (it.cimpl && !it.cimpl2) it.cimpl2 = h; else if (!it.cimpl) it.cimpl = h;
          (it.mods || []).forEach(m => {
            m.v = (m.v || []).map(x => x > 0 ? Math.max(x + 1, Math.round(x * 1.1)) : x);
            m.ex = 1;
          });
          it.dc = 'up';
        }
        payCur('divine'); payCur('vaal'); if (!isJewel) payCur('ember');
        try { noteCraft && noteCraft('altar', it, null); } catch (e) {}
        refresh(it);
        toast('一键必胜完成 · T1 拉满 + 腐化' + (isJewel ? '（珠宝无祭坛升华）' : ' + 升华'));
        renderGamble();
      };

      /* ---- 维护 ---- */
      const bind = (id, fn) => { const el = body.querySelector(id); if (el) el.onclick = fn; };
      bind('#wg-undodc', () => { snapAuto('撤销双重腐化前'); delete it.dc; delete it.cimpl2; refresh(it); toast('已清除双重腐化标记'); renderGamble(); });
      bind('#wg-undocor', () => {
        snapAuto('撤销腐化前');
        delete it.corrupted; delete it.cimpl; delete it.cimpl2; delete it.dc;
        if (it.extraSock) { delete it.extraSock; it.rsock = Math.max(0, (it.rsock || 0) - 1); }
        refresh(it); toast('已清除全部腐化'); renderGamble();
      });
      bind('#wg-unex', () => { snapAuto('清除超越前'); (it.mods || []).forEach(m => { if (m.ex) m.ex = 0; }); refresh(it); toast('已清除超越标记'); renderGamble(); });
      bind('#wg-unfr', () => { snapAuto('清除破溃前'); (it.mods || []).forEach(m => { delete m.fr; }); refresh(it); toast('已清除破溃'); renderGamble(); });
    }

    /* ---------------- 路由 ---------------- */
    function render(t) {
      if (t === 'wallet') renderWallet();
      else if (t === 'items') { selectedKey = null; renderItems(); }
      else if (t === 'gamble') renderGamble();
      else if (t === 'audit') renderAudit();
      else renderStatus();
    }

    // 初始默认显示通货页；若尚未进入角色，自动切到状态页提示
    if (!player()) switchTab('status'); else render('wallet');

    toast('余烬裂隙修改器已加载');
  }
})();
