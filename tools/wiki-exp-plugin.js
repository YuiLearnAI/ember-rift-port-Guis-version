/* ============================================================================
 * wiki-exp-plugin.js —— 「异界扩展」页插件（浏览器端）
 * ----------------------------------------------------------------------------
 * 由 tools/build-wiki.mjs 内联到 Wiki 的 app 脚本之后执行。
 * 职责：
 *   1) 把扩展包数据并入 window.RIFT（技能 / 辅助 / 通货 / 暗金），
 *      使官方原有的「技能 / 辅助 / 通货 / 传奇」页签直接多出新条目；
 *   2) 新增一级页面「异界扩展」(#exp)，集中展示符文之语、天赋珠宝、
 *      星图联动、数值改动、防崩加固等官方 wiki 没有的内容；
 *   3) 把新页面挂进左侧导航与顶部搜索索引。
 *
 * 依赖：window.RIFT（官方数据）、window.__EMBER_EXP（构建时注入的扩展数据）
 * 兼容：官方 app 的全局词法绑定 PAGES / NAV / SRCN / buildIndex 均可从后续
 *       <script> 访问（顶层 const 在全局词法环境中共享，非 window 属性）。
 * ========================================================================= */
(function () {
  'use strict';
  var R = window.RIFT;
  var E = window.__EMBER_EXP;
  if (!R || !E) { console.warn('[wiki-exp] 缺少 RIFT 或 __EMBER_EXP，跳过'); return; }

  var M = E.mods || {};
  var esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  var TAGN = function (t) { try { return (R.TAGN && R.TAGN[t]) || t; } catch (e) { return t; } };
  var tagList = function (arr) {
    return '<div class="tags">' + (arr || []).map(function (t) { return '<span class="tag">' + esc(TAGN(t)) + '</span>'; }).join('') + '</div>';
  };
  // 星图区域
  var REGN = { fire: '火焰', cold: '冰霜', light: '闪电', phys: '物理', minion: '召唤', defence: '防御', currency: '通货' };
  var secH = function (id, eyebrow, title, sub) {
    return '<div class="sec" id="' + id + '"><div class="eyebrow">' + esc(eyebrow) + '</div><h2>' + esc(title) + '</h2>' +
      (sub ? '<p class="lede">' + esc(sub) + '</p>' : '') + '<div class="rule"></div></div>';
  };
  // 属性键 + 值 → 中文描述。
  // 先查本表（官方 stxt 未覆盖的键），再退回游戏自带 stxt，最后降级成「键 值」。
  var DICT = {
    skillLvl: function (v) { return '+' + v + ' 技能等级'; },
    addFire: function (v) { return '附加 ' + v + ' 火焰伤害'; },
    addCold: function (v) { return '附加 ' + v + ' 冰霜伤害'; },
    esPct: function (v) { return '能量护盾提高 ' + v + '%'; },
    esInc: function (v) { return '能量护盾提高 ' + v + '%'; },
    coldShieldDR: function (v) { return '护盾对冰霜伤害额外减伤 ' + v + '%'; },
    fireLeech: function (v) { return '火焰伤害的 ' + v + '% 转化为生命回复'; },
    critVsShock: function (v) { return '对感电敌人暴击率 +' + v + '%'; },
    minionArmourPct: function (v) { return '召唤物获得你 ' + v + '% 的护甲'; },
    physToEs: function (v) { return '物理伤害的 ' + v + '% 转化为能量护盾'; },
    currencyInc: function (v) { return '通货掉落 +' + v + '%'; }
  };
  var fx = function (k, v) {
    var val = Array.isArray(v) ? (v[0] === v[1] ? v[0] : v[0] + '–' + v[1]) : v;
    if (typeof v === 'number' || Array.isArray(v)) {
      if (DICT[k]) return DICT[k](val);
      try {
        var t = R.stxt(k, val);
        if (t && String(t).indexOf(k) < 0) return t;   // 翻译成功
      } catch (e) { /* fallthrough */ }
    }
    return k + ' ' + val;
  };
  // 词缀 id → 「+40–60 最大生命」这种标准文案（优先用游戏自带的词缀模板）
  var affixText = function (id, rg) {
    var a = R.AFF && R.AFF[id];
    if (!a) return '';
    var lo = rg && rg[0], hi = rg && rg[1];
    var val = lo == null ? '' : (lo === hi ? String(lo) : lo + '–' + hi);
    if (a.text) return String(a.text).replace('{0}', val);
    return fx(a.stat || id, lo === hi ? lo : [lo, hi]);
  };
  var fxList = function (arr) {
    return (arr || []).map(function (p) { return fx(p[0], p[1]); }).join(' · ') || '—';
  };
  // 符文之语的适用部位
  var REQN = { weapon: '武器', armour: '护甲', helm: '头盔', body: '胸甲', staff: '法杖 / 长棍', any: '任意装备' };
  var reqName = function (req) {
    if (!req) return '任意装备';
    return String(req).split('|').map(function (r) { return REQN[r] || r; }).join(' 或 ');
  };

  /* ---------------- 1. 并入官方数据（让原有页签自动多出条目） ---------------- */

  // 通货
  (M.currencies || []).forEach(function (c) {
    if (!c || !c.id || R.CUR[c.id]) return;
    R.CUR[c.id] = { n: c.n, v: c.v || 0, w: c.w || 0, col: c.col || '#c8c0b0', grp: c.grp || 'basic', d: c.d || '' };
    if (R.CUR_ORDER.indexOf(c.id) < 0) R.CUR_ORDER.push(c.id);
  });

  // 主动技能（顺带把图标塞进 EXTRA.SKI，官方技能页就有图了）
  (M.skills || []).forEach(function (s) {
    if (!s || !s.id || R.SK[s.id]) return;
    R.SK[s.id] = { n: s.n, tags: s.tags || [], base: s.base, cast: s.cast, crit: s.crit, cost: s.cost, el: s.el, bh: s.bh, d: s.d || '' };
    if (s.icon && window.EXTRA && window.EXTRA.SKI && !window.EXTRA.SKI[s.id]) window.EXTRA.SKI[s.id] = s.icon;
  });

  // 辅助宝石
  (M.supports || []).forEach(function (s) {
    if (!s || !s.id || R.SUP[s.id]) return;
    R.SUP[s.id] = { n: s.n, req: s.req || '', d: s.d || '', mech: !!s.mech };
  });

  // 暗金：基底必须存在于当前底包，否则跳过（与游戏加载逻辑一致）
  (E.uniques || []).forEach(function (u) {
    if (!u || !u.id || !R.BASEMAP || !R.BASEMAP[u.base]) return;
    if (R.UNIQ.some(function (x) { return x.id === u.id; })) return;
    R.UNIQ.push({
      id: u.id, n: u.n, base: u.base, lv: u.lv || 1,
      mods: (u.mods || []).filter(function (m) { return m && R.AFF[m[0]]; }),
      sp: u.sp || [], st: (u.st || []).slice(), fl: u.fl || '', src: 'extra'
    });
  });

  // 传奇页签的来源筛选：给扩展暗金一个独立分类，避免被标成「地图随机掉落」
  try { if (typeof SRCN === 'object') SRCN.extra = '异界扩展 · 特殊掉落'; } catch (e) {}

  /* ---------------- 2. 渲染「异界扩展」页 ---------------- */

  function pageExp() {
    var s = E.summary || {};

    /* 概览 */
    var rows = [
      ['新增暗金', s.uniques, '传奇页签（来源筛选「异界扩展 · 特殊掉落」）'],
      ['新增主动技能', s.skills, '技能页签'],
      ['新增辅助宝石', s.supports, '辅助 · 精魂 · 元技能页签'],
      ['新增通货', s.currencies, '通货页签'],
      ['符文之语', s.runewords, '本页 · 第 7 节'],
      ['天赋树珠宝', s.jewels, '本页 · 第 8 节'],
      ['星图联动效果', s.stars, '本页 · 第 9 节']
    ].map(function (r) {
      return '<tr><td><b>' + esc(r[0]) + '</b></td><td class="t-num">' + (r[1] == null ? '—' : r[1]) + '</td><td class="mute">' + esc(r[2]) + '</td></tr>';
    }).join('');

    var banner = '<div class="dbc" style="border-color:#5a3a22;background:#1f1712"><h4 style="color:var(--gold)">这是玩家自制改版的内容页</h4>' +
      '<div class="d">本站基于官方 Wiki（基底 <b>' + esc(E.baseVer || 'v19.0.1') + '</b>）制作，追加了《余烬裂隙》内容扩展 <b>' + esc(E.ver) + '</b> 的内容。' +
      '官方原有页签的数值与词条未作改动，扩展带来的一切差异都集中在本页，以及下面标注「来自异界扩展」的条目上。</div>' +
      '<div class="fl">与游戏官方无关；游戏本体与原始扩展包版权归各自作者所有，仅供个人学习与同人交流。</div></div>';

    /* 数值与机制改动 */
    var patchRows = (E.patches || []).map(function (p) {
      return '<tr><td style="white-space:nowrap"><b style="color:var(--gold)">' + esc(p.n) + '</b></td><td class="t-num mute">' + esc(p.from) + '</td><td class="t-num"><b style="color:var(--good)">' + esc(p.to) + '</b></td><td>' + esc(p.d) + '</td></tr>';
    }).join('');

    /* 暗金卡片 */
    var uniqCards = (E.uniques || []).map(function (u) {
      var b = R.BASEMAP[u.base] || {};
      var modsHtml = (u.mods || []).map(function (m) {
        var txt = affixText(m[0], m[1]);
        return txt ? '<div class="md">' + esc(txt) + '</div>' : '';
      }).join('');
      var extra = (u.st || []).map(function (t) { return '<div class="sp">' + esc(t) + '</div>'; }).join('');
      var drop = (E.drops && E.drops[u.id]) ? E.drops[u.id] : '';
      return '<div class="dbc" id="exp-uniq-' + esc(u.id) + '"><h4 style="color:var(--r3)">' + esc(u.n) + '</h4>' +
        '<div class="meta">' + esc(u.base) + ' · ' + esc(b.slot ? (R.SLOTNAME[b.slot] || '装备') : '装备') + ' · 需求等级 ' + (u.lv || '—') + ' · 异界扩展</div>' +
        modsHtml + extra + (drop ? '<div class="mute" style="font-size:12.5px;margin-top:4px">获取：' + esc(drop) + '</div>' : '') +
        (u.fl ? '<div class="fl">' + esc(u.fl) + '</div>' : '') + '</div>';
    }).join('');

    /* 新增技能 */
    var skillCards = (M.skills || []).map(function (k) {
      var st = [
        k.base ? '基础伤害 ' + (k.base[0] === k.base[1] ? k.base[0] : k.base[0] + '–' + k.base[1]) : '',
        k.cast ? '施法 ' + k.cast + 's' : '',
        k.crit ? '暴击 ' + k.crit + '%' : '',
        k.cost ? '消耗 ' + k.cost : '',
        k.cd ? '冷却 ' + k.cd + 's' : '',
        k.dist ? '距离 ' + k.dist : ''
      ].filter(Boolean).join(' · ');
      var icon = k.icon ? '<img class="px" style="width:28px;height:28px;vertical-align:middle" src="' + k.icon + '" alt=""> ' : '';
      return '<div class="dbc" id="exp-skill-' + esc(k.id) + '"><h4>' + icon + esc(k.n) + '</h4>' +
        '<div class="meta">异界扩展 · 新增主动宝石</div>' + tagList(k.tags) +
        '<div class="d">' + esc(k.d) + '</div>' +
        (st ? '<div class="mute" style="font-size:12.5px;margin-top:4px">' + esc(st) + '</div>' : '') + '</div>';
    }).join('');

    /* 新增辅助 */
    var supRows = (M.supports || []).map(function (k) {
      return '<tr id="exp-sup-' + esc(k.id) + '"><td style="white-space:nowrap"><b style="color:#4fe0c0">' + esc(k.n) + '</b></td><td class="mute">' +
        esc(k.req || '所有技能') + '</td><td>' + esc(k.d) + '</td></tr>';
    }).join('');

    /* 新增通货 */
    var curRows = (M.currencies || []).map(function (c) {
      return '<tr id="exp-cur-' + esc(c.id) + '"><td><b style="color:' + esc(c.col || '#ccc') + '">' + esc(c.n) + '</b>' +
        '<div class="mute" style="font-size:12px">' + esc((R.CUR_GRP && R.CUR_GRP[c.grp]) || c.grp || '') + '</div></td>' +
        '<td>' + esc(c.d) + '</td><td class="t-num">' + (c.w || 0) + '</td><td class="t-num">' + (c.v || 0) + ' c</td></tr>';
    }).join('');

    /* 符文之语 */
    var runeName = function (q) {
      if (typeof q === 'string') {
        var c = R.CUR[q];
        return c ? c.n : q;
      }
      return '符文 #' + q;
    };
    var rwRows = (M.runewords || []).map(function (w) {
      var seq = (w.seq || []).map(function (q) { return '<span class="chip">' + esc(runeName(q)) + '</span>'; }).join(' ');
      return '<tr id="exp-rw-' + esc(w.id) + '"><td style="white-space:nowrap"><b style="color:var(--gold)">' + esc(w.n) + '</b>' +
        (w.legend ? ' <span class="chip">传奇词缀</span>' : '') + '</td>' +
        '<td style="white-space:nowrap">' + seq + '</td><td class="mute">' + esc(reqName(w.req)) + '</td>' +
        '<td class="md" style="color:#c8c0ff">' + esc(fxList(w.w)) + '</td>' +
        '<td class="md" style="color:#9fd8b0">' + esc(fxList(w.a)) + '</td>' +
        '<td class="mute" style="font-size:12.5px">' + esc((w.d && w.d[0]) || '') + '</td></tr>';
    }).join('');

    /* 天赋珠宝 */
    var jwRows = (M.jewels || []).map(function (j) {
      var stats = (j.stats || []).map(function (p) { return fx(p[0], p[1]); }).join(' · ');
      return '<tr id="exp-jw-' + esc(j.id) + '"><td><b style="color:var(--r2)">' + esc(j.n) + '</b></td>' +
        '<td class="t-num">T' + esc(j.tier || 1) + '</td><td class="t-num">' + (j.w == null ? 10 : j.w) + '</td>' +
        '<td class="md">' + esc(stats) + '</td></tr>';
    }).join('');

    /* 星图联动 */
    var starRows = (M.stars || []).map(function (x) {
      var req = x.require || {};
      var cond = (req.tags || []).map(function (t) { return '<span class="tag">' + esc(t) + '</span>'; }).join(' ') +
        (req.min ? ' <span class="mute">≥' + req.min + ' 个</span>' : '') +
        ((req.nodes && req.nodes.length) ? ' <span class="mute">必须点亮 ' + req.nodes.map(esc).join(', ') + '</span>' : '');
      return '<tr id="exp-star-' + esc(x.id) + '"><td style="white-space:nowrap"><b style="color:var(--cold)">' + esc(x.n) + '</b></td>' +
        '<td class="mute">' + esc(REGN[x.region] || x.region || '') + '</td><td>' + cond + '</td><td>' + esc(x.d || '') + '</td></tr>';
    }).join('');

    /* 加固 */
    var guardHtml = (E.guards || []).map(function (g) {
      return '<div style="margin:4px 0"><span class="chip">' + (g.applied ? '已注入' : '未注入') + '</span> <b>' + esc(g.n) + '</b> <span class="mute">— ' + esc(g.d) + '</span></div>';
    }).join('');

    return '<div class="page wide">' +
      secH('exp-top', 'MOD · 异界内容扩展 ' + E.ver, '异界扩展：本改版新增内容',
        '官方 Wiki 的页面结构、词条与公式全部沿用；扩展包额外带来的内容集中在本页，并已并入对应的官方页签。') +
      banner +

      secH('exp-sum', 'OVERVIEW', '内容清单', '数量由构建脚本从扩展包源文件实时统计，不是手写文案。') +
      '<div class="tw"><table><tr><th>类型</th><th class="t-num">数量</th><th>在哪看</th></tr>' + rows + '</table></div>' +

      secH('exp-num', 'BALANCE', '数值与机制改动', '以下改动由扩展包的构建补丁与热修配置落实，官方原版没有。') +
      '<div class="tw"><table><tr><th>项目</th><th class="t-num">官方 v19</th><th class="t-num">异界扩展</th><th>说明</th></tr>' + patchRows + '</table></div>' +

      secH('exp-uniq', 'ITEMS', '新增暗金', '基底均取自当前底包，掉落概率写在扩展包的平衡表里。') +
      '<div class="cards">' + uniqCards + '</div>' +

      secH('exp-skill', 'GEMS', '新增主动技能', '') +
      '<div class="cards">' + skillCards + '</div>' +
      '<h3 style="margin-top:18px">新增辅助宝石</h3><div class="tw"><table><tr><th>名称</th><th>适用</th><th>效果</th></tr>' + supRows + '</table></div>' +
      '<h3>新增通货</h3><div class="tw"><table><tr><th>名称</th><th>作用</th><th class="t-num">掉落权重</th><th class="t-num">估值</th></tr>' + curRows + '</table></div>' +

      secH('exp-rune', 'RUNEWORDS', '符文之语', '把指定顺序的符文镶嵌进同色插槽即可成词。「符文 #N」对应扩展包的 40 级符文阶梯（rune_01–rune_40）。') +
      '<div class="tw"><table><tr><th>名称</th><th>符文序列</th><th>适用</th><th>武器效果</th><th>防具效果</th><th>定位</th></tr>' + rwRows + '</table></div>' +

      secH('exp-jewel', 'JEWELS', '天赋树珠宝', '掉落后可镶嵌到高级天赋树的珠宝栏位（需先点亮该栏位）。') +
      '<div class="tw"><table><tr><th>名称</th><th class="t-num">阶级</th><th class="t-num">权重</th><th>属性</th></tr>' + jwRows + '</table></div>' +

      secH('exp-star', 'STARS', '星图联动效果', '基底天赋组合满足条件时触发的特殊词条，所以先看「触发条件」再看数值。') +
      '<div class="tw"><table><tr><th>名称</th><th>区域</th><th>触发条件</th><th>效果</th></tr>' + starRows + '</table></div>' +

      secH('exp-guard', 'STABILITY', '防崩加固', '扩展包向底包注入的容错补丁：孤立的绘制异常不再中断整帧（避免吞字、贴图丢失）。') +
      '<div style="margin-top:6px">' + guardHtml + '</div>' +

      secH('exp-apply', 'HOW TO', '怎么用这个改版', '') +
      '<div class="tw"><table><tr><th>方式</th><th>做法</th></tr>' +
      '<tr><td style="white-space:nowrap"><b>单文件版</b></td><td>直接打开 <b>余烬裂隙-异界内容扩展-v' + esc(E.ver) + '-v19.html</b>（mods、热修、样式已内联，离线可跑）。</td></tr>' +
      '<tr><td style="white-space:nowrap"><b>本地预览</b></td><td>在仓库执行 <b>npm run dev</b>，访问 <b>http://127.0.0.1:8787/</b>。</td></tr>' +
      '<tr><td style="white-space:nowrap"><b>线上版 + 修改器</b></td><td>装 Tampermonkey 后导入 <b>cheat/ember-rift-gui.user.js</b>，打开官方线上版即可出现悬浮面板。</td></tr>' +
      '</table></div>' +
      '<p class="cap">热修说明：' + esc(E.hotfixNotes || '') + '</p>' +
      '<p class="cap">免责声明：本站为个人学习用途的同人内容与二次开发产物，与游戏官方无关；游戏本体与原始扩展包版权归各自作者所有，请勿用于商业用途。若权利人提出异议请提 issue，会立即下架相关内容。</p>' +
      '</div>';
  }

  /* ---------------- 3. 挂页面 / 导航 / 搜索 ---------------- */

  try {
    PAGES.exp = ['异界扩展', pageExp];
  } catch (e) {
    console.error('[wiki-exp] 注册页面失败', e);
    return;
  }

  try {
    var at = -1;
    for (var i = 0; i < NAV.length; i++) if (NAV[i][0] === 'faq') { at = i; break; }
    NAV.splice(at < 0 ? NAV.length : at, 0, ['exp', '异界扩展']);
    // 侧栏已渲染，手工插一条锚点（不重跑 shell()，避免重复绑定事件）
    var nav = document.getElementById('nav');
    if (nav && !nav.querySelector('a[data-p="exp"]')) {
      var a = document.createElement('a');
      a.href = '#exp'; a.dataset.p = 'exp'; a.textContent = '异界扩展';
      var faq = nav.querySelector('a[data-p="faq"]');
      if (faq) nav.insertBefore(a, faq); else nav.appendChild(a);
    }
    var nsub = document.querySelector('.nav .sub a[data-p="db-cur"]');
    if (nsub && !document.querySelector('#nav a[data-p="exp"]')) { /* 已插入，忽略 */ }
  } catch (e) { console.warn('[wiki-exp] 导航注入失败', e); }

  try {
    var origIndex = buildIndex;
    buildIndex = function () {
      var I = origIndex();
      I.push({ n: '异界扩展 新增内容总览', sub: '改版 · 符文之语 / 星图 / 珠宝 / 暗金', page: 'exp', f: null, s: '异界扩展 改版 新增 暗金 符文之语 星图 珠宝 闪现 工匠石 掉落' });
      (E.uniques || []).forEach(function (u) { I.push({ n: u.n, sub: '暗金 · 异界扩展', page: 'exp', f: { id: 'exp-uniq-' + u.id }, s: (u.n + ' ' + u.base + ' 改版 暗金').toLowerCase() }); });
      (M.runewords || []).forEach(function (w) { I.push({ n: w.n, sub: '符文之语 · 异界扩展', page: 'exp', f: { id: 'exp-rw-' + w.id }, s: (w.n + ' 符文之语 runeword').toLowerCase() }); });
      (M.stars || []).forEach(function (x) { I.push({ n: x.n, sub: '星图联动 · 异界扩展', page: 'exp', f: { id: 'exp-star-' + x.id }, s: (x.n + ' 星图 联动 star').toLowerCase() }); });
      (M.jewels || []).forEach(function (j) { I.push({ n: j.n, sub: '天赋珠宝 · 异界扩展', page: 'exp', f: { id: 'exp-jw-' + j.id }, s: (j.n + ' 珠宝 jewel').toLowerCase() }); });
      return I;
    };
  } catch (e) { console.warn('[wiki-exp] 搜索索引扩展失败', e); }

  // 侧栏版本脚注追加改版标识（不改官方文案）
  try {
    var foot = document.querySelector('.railfoot');
    if (foot) {
      var line = document.createElement('div');
      line.style.cssText = 'margin-top:4px;color:#e9c26b';
      line.textContent = '异界内容扩展 ' + E.ver;
      foot.appendChild(line);
    }
  } catch (e) {}

  window.__EMBER_WIKI_READY = true;
})();
