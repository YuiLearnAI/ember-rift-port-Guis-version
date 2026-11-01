// Headless smoke test + targeted unit tests for the Omen system.
// Loads the game's main IIFE inside jsdom with stubbed canvas/audio APIs.
const fs = require("node:fs");
const path = require("node:path");
let JSDOM; try { JSDOM = require("C:/Users/33266/AppData/Local/Temp/dsh-e951uk/er-dom/node_modules/jsdom").JSDOM; } catch (e) { JSDOM = require("jsdom").JSDOM; }

const ARGS = process.argv.slice(2);
function argNum(name, def) {
  const a = ARGS.find((x) => x === name || x.startsWith(name + "="));
  if (!a) return def;
  const v = a.includes("=") ? a.split("=")[1] : ARGS[ARGS.indexOf(a) + 1];
  const n = Number(v);
  return Number.isFinite(n) ? n : def;
}
const MINUTES = Math.max(0.2, argNum("--minutes", 2));
const SEED = Math.floor(argNum("--seed", (Date.now() % 100000000) + 1));
const htmlPath = ARGS.find((a, i) => !a.startsWith("--") && !(i > 0 && ARGS[i - 1].startsWith("--") && !ARGS[i - 1].includes("="))) || path.join(__dirname, "..", "test-build.html");
const html = fs.readFileSync(htmlPath, "utf8");

// --- extract inline script blocks (skip external src scripts) ---
const scriptRe = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi;
const blocks = [];
let m;
while ((m = scriptRe.exec(html))) blocks.push(m[1]);
if (blocks.length < 1) throw new Error("no inline script");
let mainCode = blocks[blocks.length - 1];

// expose 由迁移构建自身注入（assemble.mjs --expose），此处不再处理
// --- build DOM ---
const dom = new JSDOM(html, {
  runScripts: "outside-only",
  pretendToBeVisual: true,
  url: "file:///C:/game.html",
});
const { window } = dom;
// v2.00：test-build.html 本身不内嵌热修；这里把 hotfix.json 注入，让回归测试走与发布版相同的热修路径。
try {
  const hfPath = path.join(__dirname, "..", "hotfix", "hotfix.json");
  window.HOTFIX = JSON.parse(fs.readFileSync(hfPath, "utf8"));
} catch (e) {
  console.log("hotfix.json load skipped: " + (e && e.message));
}
const noop = () => {};
const doc = window.document;

// canvas 2d stub
const gradient = () => ({ addColorStop: noop });
function makeCtx(canvas) {
  const base = {
    canvas,
    measureText: () => ({ width: 10, actualBoundingBoxAscent: 6, actualBoundingBoxDescent: 2 }),
    createLinearGradient: gradient,
    createRadialGradient: gradient,
    createConicGradient: gradient,
    createPattern: () => ({}),
    getImageData: (x, y, w, h) => ({
      data: new Uint8ClampedArray(Math.max(4, (w | 0) * (h | 0) * 4)),
      width: w | 0,
      height: h | 0,
    }),
    createImageData: (w, h) => ({
      data: new Uint8ClampedArray(Math.max(4, (w | 0) * (h | 0) * 4)),
      width: w | 0,
      height: h | 0,
    }),
    putImageData: noop,
    getLineDash: () => [],
    setLineDash: noop,
    isPointInPath: () => false,
    isPointInStroke: () => false,
    getTransform: () => ({ a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 }),
    setTransform: noop,
    resetTransform: noop,
    save: noop,
    restore: noop,
    translate: noop,
    rotate: noop,
    scale: noop,
    beginPath: noop,
    closePath: noop,
    moveTo: noop,
    lineTo: noop,
    arc: noop,
    ellipse: noop,
    rect: noop,
    fill: noop,
    stroke: noop,
    clip: noop,
    fillRect: noop,
    strokeRect: noop,
    clearRect: noop,
    fillText: noop,
    strokeText: noop,
    drawImage: noop,
    globalAlpha: 1,
    globalCompositeOperation: "source-over",
    fillStyle: "#000",
    strokeStyle: "#000",
    lineWidth: 1,
    font: "10px sans-serif",
    textAlign: "left",
    textBaseline: "alphabetic",
    shadowBlur: 0,
    shadowColor: "#000",
    imageSmoothingEnabled: true,
    lineCap: "butt",
    lineJoin: "miter",
  };
  return new Proxy(base, {
    get(t, p) {
      if (p in t) return t[p];
      return noop;
    },
    set(t, p, v) {
      t[p] = v;
      return true;
    },
  });
}
const proto = window.HTMLCanvasElement.prototype;
proto.getContext = function () {
  this.__ctx = this.__ctx || makeCtx(this);
  return this.__ctx;
};
proto.toDataURL = () => "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
if (window.OffscreenCanvas) {
  window.OffscreenCanvas.prototype.getContext = function () {
    return makeCtx({ width: this.width, height: this.height });
  };
}
window.HTMLCanvasElement.prototype.getBoundingClientRect = function () {
  return { x: 0, y: 0, width: this.width || 1280, height: this.height || 720, top: 0, left: 0, right: 1280, bottom: 720 };
};

// rAF: capture callbacks so we can drive frames manually
const rafQueue = [];
window.requestAnimationFrame = (cb) => {
  rafQueue.push(cb);
  return rafQueue.length;
};
window.cancelAnimationFrame = noop;
window.requestIdleCallback = (cb) => {
  setTimeout(() => cb({ timeRemaining: () => 5, didTimeout: false }), 0);
  return 1;
};
window.cancelIdleCallback = noop;

// audio
class GainNode {
  constructor() {
    this.gain = { value: 1, setValueAtTime: noop, linearRampToValueAtTime: noop, exponentialRampToValueAtTime: noop, cancelScheduledValues: noop };
    this.connect = () => this;
    this.disconnect = noop;
  }
}
class OscNode {
  constructor() {
    this.frequency = { value: 440, setValueAtTime: noop, linearRampToValueAtTime: noop, exponentialRampToValueAtTime: noop };
    this.detune = { value: 0, setValueAtTime: noop };
    this.type = "sine";
    this.connect = () => this;
    this.disconnect = noop;
    this.start = noop;
    this.stop = noop;
    this.onended = null;
  }
}
class BufferNode {
  constructor() {
    this.buffer = null;
    this.loop = false;
    this.loopStart = 0;
    this.loopEnd = 0;
    this.playbackRate = { value: 1, setValueAtTime: noop };
    this.gain = { value: 1, setValueAtTime: noop };
    this.connect = () => this;
    this.disconnect = noop;
    this.start = noop;
    this.stop = noop;
    this.onended = null;
  }
}
class FakeAudioCtx {
  constructor() {
    this.currentTime = 0;
    this.sampleRate = 44100;
    this.destination = { connect: noop, disconnect: noop };
    this.state = "running";
    this.listener = { positionX: { value: 0 }, positionY: { value: 0 }, positionZ: { value: 0 } };
  }
  createGain() { return new GainNode(); }
  createOscillator() { return new OscNode(); }
  createBufferSource() { return new BufferNode(); }
  createBuffer(ch, len, rate) {
    return { length: len, numberOfChannels: ch, sampleRate: rate, getChannelData: () => new Float32Array(len), copyToChannel: noop };
  }
  createBiquadFilter() {
    return { type: "lowpass", frequency: { value: 350, setValueAtTime: noop }, Q: { value: 1, setValueAtTime: noop }, gain: { value: 0 }, connect: () => ({}), disconnect: noop };
  }
  createDynamicsCompressor() {
    return { threshold: { value: 0 }, knee: { value: 0 }, ratio: { value: 1 }, attack: { value: 0 }, release: { value: 0 }, connect: () => ({}), disconnect: noop };
  }
  createAnalyser() {
    return { fftSize: 256, frequencyBinCount: 128, getByteFrequencyData: noop, getByteTimeDomainData: noop, connect: () => ({}), disconnect: noop };
  }
  createStereoPanner() { return { pan: { value: 0, setValueAtTime: noop }, connect: () => ({}), disconnect: noop }; }
  createPanner() { return { positionX: { value: 0, setValueAtTime: noop }, positionY: { value: 0 }, positionZ: { value: 0 }, connect: () => ({}), disconnect: noop }; }
  createChannelMerger() { return { connect: () => ({}), disconnect: noop }; }
  createDelay() { return { delayTime: { value: 0, setValueAtTime: noop }, connect: () => ({}), disconnect: noop }; }
  createWaveShaper() { return { curve: null, connect: () => ({}), disconnect: noop }; }
  decodeAudioData(buf, ok, err) {
    const b = { length: 4410, numberOfChannels: 1, sampleRate: 44100, getChannelData: () => new Float32Array(4410), copyToChannel: noop };
    if (ok) ok(b);
    return Promise.resolve(b);
  }
  resume() { return Promise.resolve(); }
  suspend() { return Promise.resolve(); }
  close() { return Promise.resolve(); }
}
window.AudioContext = FakeAudioCtx;
window.webkitAudioContext = FakeAudioCtx;
window.Audio = class {
  constructor(src) { this.src = src; this.volume = 1; this.loop = false; this.currentTime = 0; }
  play() { return Promise.resolve(); }
  pause() {}
  load() {}
  canPlayType() { return "maybe"; }
  addEventListener() {}
  removeEventListener() {}
};
Object.defineProperty(window.HTMLMediaElement.prototype, "play", {
  value: () => Promise.resolve(),
  writable: true,
});
Object.defineProperty(window.HTMLMediaElement.prototype, "pause", { value: noop, writable: true });

// misc browser APIs
window.matchMedia = () => ({ matches: false, media: "", addEventListener: noop, removeEventListener: noop, addListener: noop, removeListener: noop });
window.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
window.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
window.fetch = (u) =>
  Promise.resolve({
    ok: true,
    status: 200,
    url: String(u),
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(64)),
    text: () => Promise.resolve(""),
    json: () => Promise.resolve({}),
  });
window.URL.createObjectURL = () => "blob:stub";
window.URL.revokeObjectURL = noop;
window.crypto = window.crypto || {};
if (!window.crypto.getRandomValues) {
  window.crypto.getRandomValues = (arr) => {
    for (let i = 0; i < arr.length; i++) arr[i] = (Math.random() * 256) | 0;
    return arr;
  };
}
window.scrollTo = noop;
window.Element.prototype.scrollTo = noop;
window.Element.prototype.scrollIntoView = noop;
window.Element.prototype.animate = () => ({ cancel: noop, finished: Promise.resolve(), onfinish: null });
if (window.SVGElement) window.SVGElement.prototype.getBBox = () => ({ x: 0, y: 0, width: 10, height: 10 });
window.Path2D = class { constructor() {} moveTo() {} lineTo() {} arc() {} closePath() {} };
window.ImageData = class { constructor(w, h) { this.width = w; this.height = h; this.data = new Uint8ClampedArray(w * h * 4); } };
window.document.execCommand = () => true;
window.getSelection = () => ({ removeAllRanges: noop, addRange: noop, toString: () => "", rangeCount: 0 });
window.innerWidth = 1280;
window.innerHeight = 720;
window.devicePixelRatio = 1;
Object.defineProperty(window.navigator, "language", { value: "zh-CN", configurable: true });
if (!window.PointerEvent) window.PointerEvent = window.MouseEvent;
if (!window.TouchEvent) window.TouchEvent = window.Event;

// ===================== v2.02 自动试玩 / 找 Bug =====================
const botImportant = [];
const botSmall = [];
const botSteps = [];
let botIterations = 0;
const botCoverage = {};
const origErr = console.error.bind(console);
console.error = (...a) => {
  const msg = a.map((x) => (x && x.stack) || String(x)).join(" ");
  botImportant.push("console.error: " + msg.slice(0, 500));
  origErr(...a);
};
const origWarnLog = console.warn.bind(console);
console.warn = (...a) => {
  const msg = a.map((x) => (x && x.stack) || String(x)).join(" ");
  if (botSmall.length < 30) botSmall.push("console.warn: " + msg.slice(0, 300));
  origWarnLog(...a);
};
window.addEventListener("error", (e) => {
  botImportant.push("window.onerror: " + ((e.error && e.error.stack) || e.message));
});
window.addEventListener("unhandledrejection", (e) => {
  botImportant.push("unhandledrejection: " + ((e.reason && e.reason.stack) || String(e.reason)));
});
function driveFrames(n, tag) {
  let now = globalThis.__botFrameNow || 1e5;
  for (let i = 0; i < n; i++) {
    now += 16.7;
    const q = rafQueue.splice(0, rafQueue.length);
    if (!q.length) { if (botSmall.length < 40) botSmall.push("frame queue empty @ " + (tag || "")); break; }
    for (const cb of q) {
      try { cb(now); } catch (e) { botImportant.push("frame exception @ " + (tag || "") + ": " + ((e && e.stack) || e)); }
    }
  }
  globalThis.__botFrameNow = now;
}
function pressKey(k, mods) {
  window.dispatchEvent(new window.KeyboardEvent("keydown", Object.assign({ key: k, bubbles: true }, mods || {})));
  window.dispatchEvent(new window.KeyboardEvent("keyup", Object.assign({ key: k, bubbles: true }, mods || {})));
}
function clickSel(sel) {
  const el = doc.querySelector(sel);
  if (!el) throw new Error("missing element " + sel);
  el.click();
  return el;
}
function checkNumbers(tag) {
  const T = window.__erTest;
  if (!T || !T.u) return;
  const seen = new Set();
  const bad = [];
  function walk(v, path, depth) {
    if (depth > 3 || v == null) return;
    if (typeof v === "number") {
      if (!Number.isFinite(v)) bad.push(path + "=" + String(v));
      return;
    }
    if (typeof v !== "object" || seen.has(v)) return;
    seen.add(v);
    let i = 0;
    for (const k of Object.keys(v)) {
      if (i++ > 400) break;
      if (/^(img|spr|canvas|ctx|dom|el|node|_)/i.test(k)) continue;
      let nv;
      try { nv = v[k]; } catch (e) { continue; }
      walk(nv, path + "." + k, depth + 1);
    }
  }
  walk(T.u, "u", 0);
  walk(T.o, "o", 0);
  if (bad.length) botImportant.push("数值非法 @" + tag + ": " + bad.slice(0, 8).join(", "));
  if (!T.o || !T.o.pl) return;
  if (T.o.pl.hp < 0 || T.o.pl.mana < 0) botImportant.push("负资源 @" + tag + ": hp=" + T.o.pl.hp + " mana=" + T.o.pl.mana);
}
function step(name, fn) {
  const t0 = Date.now();
  try {
    fn();
    botSteps.push({ name, ok: true, ms: Date.now() - t0 });
  } catch (e) {
    botSteps.push({ name, ok: false, ms: Date.now() - t0, err: (e && e.stack) || String(e) });
    botImportant.push("步骤异常 [" + name + "]: " + ((e && e.stack) || e));
  }
  checkNumbers(name);
}

// --- 启动游戏 ---
window.Math.random = (() => {
  let s = SEED % 2147483647 || 1;
  return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
})();
try {
  window.eval(mainCode);
} catch (e) {
  console.log("FATAL during eval: " + ((e && e.stack) || e));
  process.exit(2);
}
driveFrames(30, "boot");
checkNumbers("boot");

// --- 调试角色 ---
let started = false;
try {
  clickSel("#bDbg");
  const cards = doc.querySelectorAll("#overlay .clscard");
  if (!cards.length) throw new Error("no class cards");
  (doc.querySelector('#overlay .clscard[data-cls="ranger"]') || cards[0]).click();
  driveFrames(120, "debug-create");
  started = true;
} catch (e) {
  botImportant.push("创建调试角色失败: " + ((e && e.stack) || e));
}
const T = window.__erTest;
if (!started || !T || !T.u) {
  botImportant.push("没有可用角色，后续场景跳过");
} else {
  const Tc = T;
  const cov = { currencies: 0, omens: 0, bones: 0, runes: 0, runeWords: 0, jewels: 0, skills: 0, supports: 0, atlasNodes: 0, advNodes: 0, builds: 0, maps: 0, bosses: 0 };
  // --- 全内容领取：调试 grant（所有主动宝石/辅助/精魂/通貨/点数）---
  step("全内容领取", () => {
    Tc.Bt("debug");
    const g = doc.querySelector('#overlay [data-act="dbg"][data-k="grant"]') || doc.querySelector('[data-act="dbg"][data-k="grant"]');
    if (!g) throw new Error("debug grant button missing");
    g.click();
    driveFrames(10, "grant");
    pressKey("Escape");
    if (!Tc.u || !Tc.u.gems) throw new Error("grant did not populate gems");
  });
  // --- 通货 / 预兆 / 遗存骨全量 ---
  step("通货/预兆/骨骸全量", () => {
    const ids = (Tc.lt || []).slice();
    cov.currencies = ids.length;
    for (const id of ids) {
      const f = Tc.P && Tc.P[id];
      if (!f || !f.n) throw new Error("currency missing name: " + id);
      if (f.grp === "omen") { cov.omens++; if (Tc.OmTake) { try { Tc.OmTake(id); } catch (e) {} } }
      if (f.grp === "bone") { cov.bones++; if (Tc.DsOptions) { const o = Tc.DsOptions(); if (o && o.length) { try { Tc.DsReveal && Tc.DsReveal(o[0]); } catch (e) {} } } }
    }
    if (!cov.omens) throw new Error("no omens found");
    if (!cov.bones) throw new Error("no bones found");
  });
  // --- 符文 / 符文之语 / 词缀 / 珠宝全量 ---
  step("符文/珠宝/词缀全量", () => {
    if (!window.__RUNE) throw new Error("__RUNE missing");
    const recs = window.__RUNE.recipes ? window.__RUNE.recipes() : [];
    cov.runes = Array.isArray(window.__RUNE.list) ? window.__RUNE.list.length : (typeof window.__RUNE.list === "function" ? window.__RUNE.list().length : recs.length);
    const words = window.__RUNE.words ? window.__RUNE.words() : [];
    cov.runeWords = words.length;
    if (!recs.length || !words.length) throw new Error("rune data empty");
    if (window.__JEWEL && window.__JEWEL.pool) cov.jewels = window.__JEWEL.pool().length;
    if (!cov.jewels) throw new Error("jewel pool empty");
    if (window.__AFFIX && window.__AFFIX.cfg) window.__AFFIX.cfg();
  });
  // --- 技能 / 辅助 / 当前职业全部流派 ---
  step("技能/辅助/流派全量", () => {
    const mods = window.__RIFT_MODS || {};
    cov.skills = Object.keys(mods.skillTable || {}).length;
    cov.supports = Object.keys(mods.supportTable || {}).length;
    if (!cov.skills || !cov.supports) throw new Error("skill/support table empty");
    Tc.Bt("debug");
    driveFrames(2, "debug-builds");
    const btns = Array.from(doc.querySelectorAll('[data-act="buildApply"]'));
    cov.builds = btns.length;
    for (const b of btns) { try { b.click(); driveFrames(2, "build"); } catch (e) { botSmall.push("build apply: " + e.message); } }
    pressKey("Escape");
  });
  // --- 图谱全部节点（逐个尝试点亮/退还）---
  step("图谱全节点扫描", () => {
    Tc.Bt("atlas"); driveFrames(3, "atlas-scan");
    const all = Tc.atlasAll || [];
    cov.atlasNodes = all.length;
    for (const n of all) {
      try {
        if (Tc.atlasCount && Tc.atlasCount(n.k)) Tc.atlasRespec && Tc.atlasRespec(n.k);
        else Tc.atlasAlloc && Tc.atlasAlloc(n.k);
      } catch (e) { botSmall.push("atlas node " + n.k + ": " + e.message); }
    }
    pressKey("Escape");
  });
  // --- 高级天赋树全部节点/星图 ---
  step("高级树全节点扫描", () => {
    Tc.Bt("tree"); driveFrames(3, "adv-scan");
    if (window.__ADV) {
      const A = window.__ADV;
      const all = A.nodes ? A.nodes() : [];
      cov.advNodes = all.length;
      for (const n of all) {
        try { if (A.canAlloc && A.canAlloc(n.k) && A.alloc) A.alloc(n.k); } catch (e) {}
      }
      if (A.draw) A.draw();
    }
    pressKey("Escape");
  });
  // --- 地图主题 / 首领 / 遭遇 ---
  step("地图主题/首领/遭遇", () => {
    for (const tier of [1, 5, 16]) {
      try {
        Tc.ro(Tc.Tt(tier)); driveFrames(15, "mapT" + tier); cov.maps++;
        Tc.Bt("debug"); driveFrames(2, "dbg-map");
        for (const k of ["boss", "enc", "rift", "abyss", "shrine", "box", "pack", "rain", "stress"]) {
          const b = doc.querySelector('[data-act="dbg"][data-k="' + k + '"]');
          if (b) { try { b.click(); driveFrames(3, "dbg-" + k); if (k === "boss") cov.bosses++; } catch (e) {} }
        }
        pressKey("Escape");
      } catch (e) { botSmall.push("map tier " + tier + ": " + e.message); }
    }
    if (!cov.maps) throw new Error("no map entered");
  });
  // --- 藏身处面板巡览 ---
  for (const tab of ["inv", "gem", "tree", "atlas", "map", "codex", "debug"]) {
    step("打开面板:" + tab, () => {
      Tc.Bt(tab);
      const pbody = doc.querySelector("#pbody");
      if (!pbody || pbody.innerHTML.length < 30) throw new Error("panel empty");
      driveFrames(3, "panel-" + tab);
      pressKey("Escape");
    });
  }
  step("超越地图面板", () => {
    Tc.Bt("map"); driveFrames(3, "beyond-panel");
    const p = doc.querySelector("#pbody #beyondPanel");
    if (!p) throw new Error("地图页没有超越地图面板");
    const lv = doc.querySelector("#beyondLv");
    if (!lv) throw new Error("超越等级输入框缺失");
    pressKey("Escape");
  });
  step("切屏恢复/画布状态", () => {
    try { Object.defineProperty(doc, "hidden", { value: true, configurable: true }); } catch (e) {}
    doc.dispatchEvent(new window.Event("visibilitychange"));
    driveFrames(3, "hidden");
    try { Object.defineProperty(doc, "hidden", { value: false, configurable: true }); } catch (e) {}
    doc.dispatchEvent(new window.Event("visibilitychange"));
    window.dispatchEvent(new window.Event("focus"));
    driveFrames(8, "visible");
    if (!window.__erTest || !window.__erTest.o || !window.__erTest.o.Z) throw new Error("切屏后场景丢失");
  });
  // 工艺台 / 商店 overlays
  step("打开工艺台", () => { Tc.Oi("craft"); if (!doc.querySelector("#overlay")) throw new Error("no overlay"); driveFrames(3, "bench"); pressKey("Escape"); });
  step("角色页/藏身处移动", () => { pressKey("i"); driveFrames(3, "inv-close"); for (const k of ["w", "a", "s", "d"]) { pressKey(k); driveFrames(2, "move-" + k); } });

  // --- 真实地图：生成、移动、击杀、开箱 ---
  step("进入地图", () => {
    Tc.u.om = {};
    Tc.ro(Tc.Tt(5));
    driveFrames(60, "map-enter");
    if (!Tc.o.Z || Tc.o.Z.type !== "map") throw new Error("not in map: " + (Tc.o.Z && Tc.o.Z.type));
  });
  step("地图内战斗+掉落", () => {
    for (const m of (Tc.o.mons || []).slice(0, 12)) {
      if (!m || m.dead) continue;
      try { Tc.hn(m, null, {}); } catch (e) { botSmall.push("击杀异常: " + e.message); }
    }
    driveFrames(80, "map-fight");
    if (!Tc.o.loots) throw new Error("no loots array");
  });
  step("地图内打开背包/地图页", () => { Tc.Bt("inv"); driveFrames(3, "map-inv"); pressKey("Escape"); Tc.Bt("map"); driveFrames(3, "map-map"); pressKey("Escape"); });

  // --- 深渊 ---
  step("深渊: 裂隙/巨坑/保险箱", () => {
    Tc.o.mons = []; Tc.o.loots = []; Tc.o.objs = [];
    driveFrames(10, "abyss-reset");
    const ab = Tc.AbyssMake(Tc.o.pl.x + 80, Tc.o.pl.y + 20);
    if (!ab) throw new Error("AbyssMake failed");
    driveFrames(60, "abyss-update");
    if (Tc.AbyssOpenPit) Tc.AbyssOpenPit(ab);
    driveFrames(20, "abyss-pit");
    for (const m of (Tc.o.mons || []).slice(0, 10)) { if (m && !m.dead) { try { Tc.hn(m, null, {}); } catch (e) {} } }
    driveFrames(40, "abyss-fight");
  });

  // --- 仪式 ---
  step("驱灵仪式", () => {
    Tc.o.mons = []; Tc.o.loots = []; Tc.o.objs = [];
    const r = Tc.RitualMake(Tc.o.pl.x + 90, Tc.o.pl.y + 40);
    if (!r) throw new Error("RitualMake failed");
    driveFrames(30, "ritual");
    if (typeof Tc.RitAddTribute === "function") Tc.RitAddTribute(10);
    driveFrames(10, "ritual-tribute");
  });

  // --- 拟像 70 层 ---
  step("迷雾副本 70 层", () => {
    Tc.o.mons = []; Tc.o.loots = []; Tc.o.objs = [];
    Tc.u.simUnlocked = false;
    Tc.SimulacrumInteract();
    driveFrames(30, "sim-enter");
    if (!Tc.o.simRun || Tc.o.simRun.max !== 70) throw new Error("sim max=" + (Tc.o.simRun && Tc.o.simRun.max));
    // 普通怪受控掉落
    const normals = (Tc.o.mons || []).filter((m) => m && m.rar !== 3);
    Tc.o.loots = [];
    for (const m of normals.slice(0, 40)) { if (m && !m.dead) { try { Tc.hn(m, null, {}); } catch (e) {} } }
    driveFrames(25, "sim-normal-kills");
    if (!(Tc.o.loots || []).length) {
      // 少量怪物不一定命中随机掉落；用 100 次普通怪掉落函数抽样验证配置生效
      const m0 = normals[0] || { x: Tc.o.pl.x, y: Tc.o.pl.y };
      if (window.__DROP) { for (let di = 0; di < 100; di++) window.__DROP.simNormal(m0); }
      if (!(Tc.o.loots || []).length) botSmall.push("拟像普通怪掉落抽样 100 次仍无物资");
    }
    // 第 70 层最终首领
    Tc.SimEnterLayer(70);
    driveFrames(20, "sim-layer70");
    if (!Tc.o.simRun || Tc.o.simRun.layer !== 70) throw new Error("layer70 not entered");
    const fb = (Tc.o.mons || []).find((m) => m.rar === 3);
    if (!fb) throw new Error("no final boss");
    Tc.o.loots = [];
    Tc.hn(fb, null, {});
    driveFrames(20, "sim-final");
    const divs = (Tc.o.loots || []).filter((l) => l.kind === "cur" && l.cur === "divine").length;
    if (divs < 20) throw new Error("final divines=" + divs);
    if (Tc.o.simRun) throw new Error("simRun not finished");
  });

  // --- 图谱 / 蛛网树 / 符文词条 ---
  step("异界天赋树", () => {
    Tc.Bt("atlas");
    driveFrames(5, "atlas-ui");
    if (window.__ATLAS) { const A = window.__ATLAS; A.canAlloc && A.canAlloc("del1"); A.alloc && A.alloc("del1"); A.respec && A.respec("del1"); }
    pressKey("Escape");
  });
  step("蛛网天赋树", () => {
    Tc.Bt("tree");
    if (window.__ADV) {
      const A = window.__ADV;
      if (A.setHover) A.setHover(A.nodes && A.nodes()[0] && A.nodes()[0].k);
      if (A.zoomAt) A.zoomAt(1.2, 400, 300);
      if (A.alloc && A.startKey) { const nbs = A.neighbors ? A.neighbors(A.startKey()) : []; if (nbs[0]) A.alloc(nbs[0]); }
      A.draw && A.draw();
    }
    pressKey("Escape");
  });
  step("符文/词条/珠宝", () => {
    if (window.__RUNE) window.__RUNE.words && window.__RUNE.words();
    if (window.__AFFIX) { window.__AFFIX.cfg && window.__AFFIX.cfg(); }
    if (window.__JEWEL) { const p = window.__JEWEL.pool(); if (p && p[0]) window.__JEWEL.item(p[0].id); }
    Tc.Bt("inv"); driveFrames(3, "inv-runelook"); pressKey("Escape");
  });

  // --- 无尽裂隙入口 ---
  step("无尽裂隙入口", () => {
    const btn = doc.querySelector("#btnEndless");
    if (btn) { btn.click(); driveFrames(30, "endless-picker"); pressKey("Escape"); }
  });

  // --- 随机试玩：面板/按键/地图事件轮转 ---
  const deadline = Date.now() + MINUTES * 60 * 1000;
  let iter = 0;
  const tabs = ["inv", "gem", "tree", "atlas", "map", "codex", "debug"];
  const skillKeys = ["q", "e", "r", "c", "v", "1", "2", "3", "4", "f"];
  while (Date.now() < deadline && iter < 500) {
    iter++; botIterations++;
    step("随机#" + iter, () => {
      if (iter % 7 === 0) Tc.Bt(tabs[iter % tabs.length]);
      if (iter % 5 === 0) pressKey("Escape");
      if (iter % 3 === 0) { for (const k of ["w", "a", "s", "d"]) pressKey(k); }
      pressKey(skillKeys[iter % skillKeys.length]);
      driveFrames(2, "rand" + iter);
      if (iter % 11 === 0 && Tc.o && !Tc.o.Z) throw new Error("zone missing during random play");
    });
  }
  driveFrames(30, "final");
  checkNumbers("final");
  Object.assign(botCoverage, cov);
}

// --- 汇总报告 ---
function uniq(list) { return Array.from(new Set(list)); }
const important = uniq(botImportant);
const small = uniq(botSmall);
const passed = botSteps.filter((s) => s.ok).length;
const failed = botSteps.filter((s) => !s.ok);
const now = new Date();
const stamp = now.toISOString().replace(/T/, " ").slice(0, 19);
const md = [];
md.push("# v2.0.4 自动试玩报告");
md.push("");
md.push("- 生成时间：" + stamp);
md.push("- 种子：" + SEED + "　时长参数：" + MINUTES + " 分钟　实际迭代：" + botIterations + " 次");
md.push("- 构建：`迁移工具/test-build.html`　运行环境：jsdom（stub canvas/audio）");
md.push("- 步骤：" + passed + " 通过 / " + failed.length + " 失败");
md.push("- 内容覆盖：通货 " + (botCoverage.currencies||0) + " · 预兆 " + (botCoverage.omens||0) + " · 骨骸 " + (botCoverage.bones||0) + " · 符文 " + (botCoverage.runes||0) + " · 符文之语 " + (botCoverage.runeWords||0) + " · 珠宝 " + (botCoverage.jewels||0) + " · 技能 " + (botCoverage.skills||0) + " · 辅助 " + (botCoverage.supports||0) + " · 图谱节点 " + (botCoverage.atlasNodes||0) + " · 高级节点 " + (botCoverage.advNodes||0) + " · 流派 " + (botCoverage.builds||0) + " · 地图 " + (botCoverage.maps||0) + " · 首领 " + (botCoverage.bosses||0));
md.push("");
md.push("## 重要 Bug");
md.push("");
if (important.length) important.forEach((x, i) => md.push((i + 1) + ". " + x));
else md.push("未发现重要 Bug（无异常/console.error/NaN/流程卡死/面板打不开）。");
md.push("");
md.push("## 小问题清单");
md.push("");
if (small.length) small.forEach((x, i) => md.push((i + 1) + ". " + x));
else md.push("无。");
md.push("");
md.push("## 场景结果");
md.push("");
if (!botSteps.length) md.push("（没有执行步骤）");
else {
  md.push("| 场景 | 结果 | 耗时 ms |");
  md.push("|---|---|---|");
  for (const s of botSteps) md.push("| " + s.name + " | " + (s.ok ? "✅" : "❌") + " | " + s.ms + " |");
}
md.push("");
md.push("## 数值检查");
md.push("");
md.push("每个场景后扫描角色/场景对象中的 NaN/Infinity 与负 HP/魔力；发现即计入重要 Bug。");
md.push("");
const rel = path.join(__dirname, "..", "..", "..", "余烬裂隙-归档资料", "发布检查", "自动试玩报告.md");
try { fs.writeFileSync(rel, md.join("\n")); } catch (e) { console.log("write report failed: " + e); }
console.log(md.join("\n"));
console.log("自动试玩：" + (important.length ? "FAIL（重要 Bug " + important.length + " 个）" : "PASS"));
process.exit(important.length ? 1 : 0);
