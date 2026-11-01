      /* --- 6. 重初始化 / 重绘（新增通货与数据表后必须重建索引并重跑 UI） --- */
      try {
        if (typeof lt !== "undefined" && lt && lt.length >= 0) {
          lt.length = 0;
          Object.keys(P).forEach(function (k) { lt.push(k); });
        }
      } catch (e) { console.warn("[port] rebuild lt", e); }
      try {
        if (typeof Ts !== "undefined" && typeof Na !== "undefined") {
          Ts = {};
          Na.forEach(function (b) {
            b.nodes.forEach(function (nd, i) { nd.b = b.key; nd.i = i; Ts[nd.k] = nd; });
          });
        }
      } catch (e) { console.warn("[port] rebuild Ts", e); }
      try {
        ["ds_es","ds_cast","ds_skill","ds_life","ds_atk","ds_leech","ds_crit","ds_move","ds_rarity","ds_res"].forEach(function (id) {
          if (Ct[id] && zn.indexOf(Ct[id]) < 0) zn.push(Ct[id]);
        });
      } catch (e) { console.warn("[port] rebuild zn", e); }
      try { if (typeof x1 === "function") x1(); } catch (e) { console.warn("[port] x1", e); }
      try { if (typeof Cx === "function") Cx(); } catch (e) { console.warn("[port] Cx", e); }
      try { if (typeof qv === "function") qv(); } catch (e) { console.warn("[port] qv", e); }
      try { if (typeof Vs === "function") Vs(); } catch (e) { console.warn("[port] Vs", e); }

      /* --- 7. 旧基础独有 API 兜底（新基础已移除的功能，做成空实现避免 ReferenceError） --- */
      var __uploadedSfxMap = (typeof window !== "undefined" && window.__uploadedSfxMap) || {};
      var __uploadedSfxAudio = (typeof window !== "undefined" && window.__uploadedSfxAudio) || null;
      var __uploadedSfxData = (typeof window !== "undefined" && window.__uploadedSfxData) || null;
      var __uploadedSfxLive = (typeof window !== "undefined" && window.__uploadedSfxLive) || null;
      var __uploadedSfxTrim = (typeof window !== "undefined" && window.__uploadedSfxTrim) || 0;
      var __uploadedSfxVolume = (typeof window !== "undefined" && window.__uploadedSfxVolume) || 1;
      var playAssetSfx = (typeof window !== "undefined" && window.playAssetSfx) || function () {};
      var __syncUploadedSfxVolume = (typeof window !== "undefined" && window.__syncUploadedSfxVolume) || function () {};
      var makeEndlessMap = (typeof window !== "undefined" && window.makeEndlessMap) || null;

      window.__PORT = window.__PORT || {};
      window.__PORT.version = "1.05-port";
      window.__PORT.ready = true;
