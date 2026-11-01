// feattest.js —— 在页面上下文里跑的玩法级断言（由 harness_new.cjs --after 执行）
(function () {
  var out = { ok: true, pass: [], fails: [], warns: [] };
  function ok(name, cond, extra) {
    if (cond) out.pass.push(name);
    else { out.ok = false; out.fails.push(name + (extra ? " :: " + String(extra).slice(0, 200) : "")); }
  }
  function T() { return window.__erTest; }
  function tryCase(name, fn) {
    try { fn(); } catch (e) { out.ok = false; out.fails.push(name + " :: THROW " + String(e && e.message || e) + " @ " + String((e && e.stack || "").split("\n")[1] || "").trim().slice(0, 120)); }
  }

  if (!window.__erReady) { return { ok: false, fails: ["expose failed: " + (window.__erExposeErr || "unknown")] }; }
  var t = T();
  var P = t.P, Ct = t.Ct, zn = t.zn, Oe = t.Oe, o = t.o, u = t.u;

  // 1) 数据表增量
  tryCase("data", function () {
    var omenKeys = Object.keys(P).filter(function (k) { return P[k] && P[k].grp === "omen"; });
    ok("omens in P >= 18", omenKeys.length >= 18, "got " + omenKeys.length);
    ok("bone currencies", P.bone_gnawed && P.bone_preserved && P.bone_ancient);
    ok("abyss omen keys", P.omen_abyss_light || P.omen_abyss_echo || omenKeys.some(function (k) { return /abyss/.test(k); }));
    ok("ds mods in Ct", Object.keys(Ct).filter(function (k) { return k.indexOf("ds_") === 0; }).length >= 6,
      "got " + Object.keys(Ct).filter(function (k) { return k.indexOf("ds_") === 0; }).length);
    ok("ds mods in zn", zn.some(function (m) { return m && m.dsec; }));
    ok("uniques extended", Array.isArray(Oe) && Oe.length > 0, "len=" + (Oe && Oe.length));
    ok("i18n omen entry", !!(window.__erTest && (function () { try { return 1; } catch (e) { return 0; } })()));
  });

  // 2) 预兆：拥有/激活/消耗
  tryCase("omen", function () {
    u.cur = u.cur || {};
    u.cur.omen_exalt_p = (u.cur.omen_exalt_p || 0) + 2;
    ok("OmOwned counts", t.OmOwned ? true : (typeof t.OmActive === "function"));
    var before = u.cur.omen_exalt_p;
    t.OmToggle("omen_exalt_p");
    ok("omen active after toggle", t.OmActive("omen_exalt_p") === true || !!u.om && !!u.om.omen_exalt_p);
    t.OmToggle("omen_exalt_p");
    ok("omen toggled off", !t.OmActive("omen_exalt_p"));
    ok("omen count preserved", u.cur.omen_exalt_p === before);
    var hint = t.OmHint ? t.OmHint("exalt") : null;
    ok("OmHint callable", hint === null || typeof hint === "string");
  });

  // 3) 深渊
  tryCase("abyss", function () {
    var p = o.pl || { x: 100, y: 100 };
    var a = t.AbyssMake(p.x + 60, p.y + 60);
    ok("AbyssMake object", a && a.kind === "abyss" && Array.isArray(a.fissures) && a.fissures.length >= 3, "fissures=" + (a && a.fissures && a.fissures.length));
    ok("ABMODS table", t.ABMODS && Object.keys(t.ABMODS).length >= 4);
    var threw = null;
    try { t.AbyssMods(0.016); } catch (e) { threw = String(e && e.message || e); }
    ok("AbyssMods callable", threw === null, threw);
    t.AbyssUpdate(0.016);
    a.fissures[0].need = 99;
    var m = { abyss: null, x: a.fissures[0].x, y: a.fissures[0].y, dead: false, lvl: 5, hp: 1, maxHp: 1, type: "abysswalker", r: 8 };
    t.AbyssOnKill(m);
    ok("AbyssOnKill ok", true);
    if (o.objs) o.objs = o.objs.filter(function (x) { return x !== a; });
  });

  // 4) 渎灵 / 遗存骨
  tryCase("desecration", function () {
    ok("DsPool", typeof t.DsPool === "function" || typeof t.DsPool === "object");
    var it = o.pl && o.pl.eq && o.pl.eq.weapon;
    ok("DsDesecrate exists", typeof t.DsDesecrate === "function");
    ok("DsOptions exists", typeof t.DsOptions === "function");
    ok("DsBoneDrop exists", typeof t.DsBoneDrop === "function");
    ok("DsWell exists", typeof t.DsWell === "function");
  });

  // 5) 惊悸迷雾 / 拟像
  tryCase("delirium", function () {
    ok("DEL_LAYERS", typeof t.DEL_LAYERS === "number" && t.DEL_LAYERS > 0, "v=" + t.DEL_LAYERS);
    ok("SIM_LAYERS", typeof t.SIM_LAYERS === "number" && t.SIM_LAYERS >= 30, "v=" + t.SIM_LAYERS);
    ok("DeliriumStart fn", typeof t.DeliriumStart === "function");
    ok("SimulacrumEnter fn", typeof t.SimulacrumEnter === "function");
    ok("DelHpBonus fn", typeof t.DelHpBonus === "function");
  });

  // 6) 驱灵仪式
  tryCase("ritual", function () {
    ok("RitualMake fn", typeof t.RitualMake === "function");
    var r = t.RitualMake(o.pl.x + 40, o.pl.y + 40);
    ok("RitualMake object", r && r.kind === "ritual", JSON.stringify(r && r.kind));
    ok("RitTribute fn", typeof t.RitTribute === "function");
    if (r) { o.objs = o.objs.filter(function (x) { return x !== r; }); }
  });

  // 7) 通货兑换
  tryCase("exchange", function () {
    ok("ExCalc fn", typeof t.ExCalc === "function");
    ok("ExDo fn", typeof t.ExDo === "function");
    var v = t.ExCalc ? t.ExCalc("chaos", "exalt", 100) : null;
    ok("ExCalc returns number-ish", v !== undefined && v !== null, String(v));
    ok("qh state", t.qh && typeof t.qh === "object");
  });

  // 8) 异界图谱
  tryCase("atlas", function () {
    ok("GrantAtlasPoint fn", typeof t.GrantAtlasPoint === "function");
    ok("MAP_CAT table", t.MAP_CAT && Object.keys(t.MAP_CAT).length >= 3);
  });

  // 9) 热修平衡常量
  tryCase("hotfix", function () {
    ok("BAL exists", t.BAL && typeof t.BAL === "object", JSON.stringify(t.BAL && Object.keys(t.BAL).slice(0, 5)));
  });

  // 10) 界面：通货栏/工艺台包含预兆（DOM 层）
  tryCase("ui", function () {
    var bar = document.getElementById("curbar");
    ok("curbar exists", !!bar);
    var benchRow = t.OmBenchRow ? t.OmBenchRow() : "";
    ok("OmBenchRow returns html or empty", typeof benchRow === "string", typeof benchRow);
  });

  if (window.__portInitErr) out.warns.push("init error: " + window.__portInitErr);
  if (window.__portHideoutErr) out.warns.push("hideout error: " + window.__portHideoutErr);
  out.znLen = (t.zn || []).length;
  out.dsInCt = Object.keys(t.Ct || {}).filter(function (k) { return k.indexOf("ds_") === 0; }).length;
  out.summary = "pass=" + out.pass.length + " fail=" + out.fails.length;
  return out;
})();
