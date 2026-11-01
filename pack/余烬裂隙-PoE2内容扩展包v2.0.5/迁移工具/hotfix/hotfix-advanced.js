/*
 * 2.0.4 问题热修（运行时补丁）
 * 这些补丁会检查新版本里是否已经内置；已内置时不会重复生效。
 */
(function () {
  if (!window.HOTFIX) return;
  window.HOTFIX.apply = function (api) {
    var getO = function () { try { return api.o; } catch (e) { return null; } };

    // 1) 切屏回来：下一帧由主循环做状态复位（不再用 ctx.reset，避免整块画布被清空造成黑屏）
    if (!window.__riftVisibilityReset) {
      window.__riftVisibilityReset = 1;
      var markReset = function () { window.__riftResetNext = true; };
      document.addEventListener("visibilitychange", function () { if (!document.hidden) markReset(); });
      window.addEventListener("focus", markReset);
      window.addEventListener("pageshow", markReset);
    }

    // 2) 首领死亡后隐藏血条
    if (!window.__bossbarFixed) {
      window.__bossbarFixed = 1;
      setInterval(function () {
        try {
          var el = document.getElementById("bossbar");
          if (!el) return;
          var o = getO();
          var boss = o && o.Z && o.Z.boss;
          if (!boss || boss.dead) el.style.display = "none";
          else el.style.display = "";
        } catch (e) {}
      }, 250);
    }

    // 3) 眩晕保底已移到主程序：只有陨石/彗星技能额外 +0.6%，其它技能走正常眩晕运算（这里不再挂全局保底）

    // 4) 新号 T1–T10 地图难度下调
    if (!window.__lowTierEase) {
      window.__lowTierEase = 1;
      var lastZ = null;
      setInterval(function () {
        try {
          var o = getO();
          var Z = o && o.Z;
          if (!Z || Z === lastZ) return;
          lastZ = Z;
          if (Z.type !== "map" || (Z.tier || 1) > 10 || Z.beyond || Z.__lowEased) return;
          var mul = 0.5 + (Z.tier || 1) * 0.02;
          var mons = o.mons || [];
          if (!mons.length) { lastZ = null; return; }
          mons.forEach(function (m) {
            if (!m || m.dead) return;
            m.maxhp = (m.maxhp || 1) * mul;
            m.hp = m.maxhp;
            m.dmg = (m.dmg || 1) * mul;
          });
          Z.__lowEased = 1;
        } catch (e) {}
      }, 300);
    }

    // 5) 剑客飞剑上限降到 8，降低后期掉帧
    if (!window.__swordCapHotfix) {
      window.__swordCapHotfix = 1;
      setInterval(function () {
        try {
          var o = getO();
          if (o && o.S && o.S.jk) o.S.jk.swordCap = Math.min(o.S.jk.swordCap || 12, 8);
        } catch (e) {}
      }, 800);
    }
  };
})();
