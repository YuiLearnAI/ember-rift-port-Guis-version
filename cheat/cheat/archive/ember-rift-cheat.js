/* ============================================================
 *  《余烬裂隙》Ember Rift — 通货修改器 (v19.x)
 *  用法：F12 打开控制台 → 粘贴 → 回车
 *  之后用 ER.list() / ER.set() / ER.all() 操作
 * ============================================================ */

/* ---------- 通货 ID 对照表（游戏内 z / CUR 表） ----------
 * 基础通货 basic
 *   trans 蜕变石      aug   增幅石      alt  改造石
 *   alch  点金石      regal 富豪石      chaos 混沌石
 *   annul 废除石      exalt 崇高石      divine 神圣石
 *   frac  破溃石      ember 余烬之心    ash  余烬残片
 *   chance 机会石     scour 剥离石      vaal 瓦尔宝珠
 * 插槽 sock
 *   jewel1 次级珠宝匠石  jewel2 高级珠宝匠石  jewel3 完美珠宝匠石  artif 工匠石
 * 符文 rune
 *   rune_fire 灼热符文  rune_cold 冰川符文  rune_light 风暴符文
 *   rune_iron 钢铁符文  rune_body 生命符文  rune_mind 心灵符文
 * 精华 ess
 *   ess_life 贪婪精华  ess_fire 愤怒精华  ess_crit 苦难精华
 *   ess_es   恐惧精华  ess_speed 嫉妒精华
 * 印记 sig
 *   sig_crypt 主教印记  sig_lava 君王印记  sig_ice 女王印记  sig_swamp 巨母印记
 * ------------------------------------------------------- */

(() => {
  const R = window.__rift;
  if (!R || !R.WALLET) {
    console.error('[ER] 没拿到 __rift.WALLET。请确认：\n' +
      '1) 已经进入游戏主界面（不是在 itch.io 外壳页面）\n' +
      '2) 控制台左上角的执行环境选中的是游戏那个 frame');
    return;
  }

  const W = R.WALLET;          // 内存中的钱包对象 { key, cur, codes, chars, looks }
  const CUR = R.CUR || {};     // 通货定义表
  W.cur = W.cur || {};

  const pickKey = () => {
    if (W.key) return W.key;
    try {
      if (localStorage.getItem('ember-rift-wallet-debug')) return 'ember-rift-wallet-debug';
    } catch (e) {}
    return 'ember-rift-wallet';
  };

  const api = {
    /* 列出当前所有通货及数量 */
    list() {
      const rows = Object.keys(CUR).map(id => ({
        id,
        名称: CUR[id].n,
        分类: CUR[id].grp,
        数量: W.cur[id] || 0
      }));
      console.table(rows);
      return W.cur;
    },

    /* 设置某一种：ER.set('chaos', 99999) */
    set(id, n) {
      if (!CUR[id]) {
        console.error('[ER] 未知通货 id：' + id + '\n可用 id：' + Object.keys(CUR).join(', '));
        return;
      }
      W.cur[id] = Math.max(0, Math.floor(n));
      this.save();
      console.log('[ER] ' + CUR[id].n + ' → ' + W.cur[id]);
    },

    /* 按名称模糊设置：ER.setByName('混沌', 99999) */
    setByName(name, n) {
      const hit = Object.keys(CUR).filter(k => CUR[k].n.includes(name));
      if (!hit.length) { console.error('[ER] 没匹配到：' + name); return; }
      hit.forEach(k => { W.cur[k] = Math.max(0, Math.floor(n)); console.log('[ER] ' + CUR[k].n + ' → ' + W.cur[k]); });
      this.save();
    },

    /* 批量：ER.setMany({ chaos: 99999, exalt: 9999, divine: 999 }) */
    setMany(obj) {
      for (const k in obj) {
        if (!CUR[k]) { console.warn('[ER] 跳过未知 id：' + k); continue; }
        W.cur[k] = Math.max(0, Math.floor(obj[k]));
      }
      this.save();
      this.list();
    },

    /* 增减：ER.add('chaos', 500) */
    add(id, n) {
      if (!CUR[id]) { console.error('[ER] 未知通货 id：' + id); return; }
      W.cur[id] = Math.max(0, (W.cur[id] || 0) + Math.floor(n));
      this.save();
      console.log('[ER] ' + CUR[id].n + ' → ' + W.cur[id]);
    },

    /* 全部拉满：ER.all() 或 ER.all(99999) */
    all(n = 99999) {
      for (const k in CUR) W.cur[k] = Math.max(0, Math.floor(n));
      this.save();
      console.log('[ER] 全部通货已设为 ' + n);
      this.list();
    },

    /* 清零：ER.clear() */
    clear() {
      for (const k in CUR) delete W.cur[k];
      this.save();
      console.log('[ER] 通货已清空');
    },

    /* 写回存档（内存 + localStorage 都写） */
    save() {
      try { R.saveWallet && R.saveWallet(); } catch (e) { console.warn('[ER] saveWallet 失败:', e); }
      try {
        localStorage.setItem(pickKey(), JSON.stringify({
          v: 1,
          cur: W.cur,
          codes: W.codes || [],
          chars: W.chars || 0,
          looks: W.looks || {},
          wt: Date.now()
        }));
      } catch (e) { console.error('[ER] localStorage 写入失败:', e); return false; }
      // 尝试刷新界面上的通货栏
      try { R.curBar && R.curBar(); } catch (e) {}
      return true;
    },

    /* 导出当前背包通货 JSON，方便备份 */
    dump() { return JSON.stringify(W.cur, null, 2); }
  };

  window.ER = api;
  console.log('%c[余烬裂隙] 通货修改器已就绪','color:#ff7a30;font-weight:bold;font-size:14px');
  console.log('ER.list()              查看全部通货');
  console.log("ER.set('chaos', 99999) 设置混沌石数量");
  console.log("ER.setByName('混沌', 99999)  按中文名设置");
  console.log('ER.all(99999)          全部拉满');
  api.list();
})();
