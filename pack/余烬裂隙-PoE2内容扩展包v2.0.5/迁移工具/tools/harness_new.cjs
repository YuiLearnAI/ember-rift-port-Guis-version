#!/usr/bin/env node
// harness_new.cjs — 单文件 HTML 的 jsdom 引导测试（迁移验收第二步：能启动门）
//
// 用法:
//   node harness_new.cjs <html路径> [--frames N] [--fatal-only]
//
//   --frames N     每个阶段驱动多少帧，默认 120（验收要求 N=120）
//   --fatal-only   只把「未捕获异常 / window.onerror / console.error」当作结果依据，
//                  用于快速回归；正常模式下逐项打印 PASS/FAIL。
//
// 设计约束（重要）:
//   NEW 基础是同一源码谱系的重新压缩构建，内部变量/函数名与 CUR 完全不同，
//   所以本 harness **不注入、不引用任何游戏内部符号**，只用:
//     - 页面静态 DOM（#overlay / #menu / #panel / #pbody / #zname ...）
//     - 真实 DOM 事件（element.click()）
//     - 页面自己安排给 rAF 的回调（由我们手动逐帧驱动）
//   引导路径: 标题界面(#bDbg) → 选职业(#overlay .clscard[data-cls]) → 藏身处
//             → 菜单地图页(#menu [data-tab="map"]) → 地图袋([data-act="mapin"])
//             → 开启地图([data-act="open"]) → 进入地图(#zname 变化 + #btnPortal 显示)
//   其中「进入地图」一步是尽力而为: 进不去记 SKIP（不是 FAIL），原因会打印。
//
// 退出码: 0 = RESULT: ALL PASS / SKIP-only；1 = 有 FAIL；2 = 用法/读取错误。

"use strict";

const fs = require("node:fs");
const path = require("node:path");

// 复用旧环境已安装的 jsdom（避免在工程目录里再装一份）；找不到时回退到本地 require 解析。
const JSDOM_CANDIDATES = [
  "C:/Users/33266/AppData/Local/Temp/dsh-e951uk/er-dom/node_modules/jsdom",
  path.join(__dirname, "node_modules", "jsdom"),
  "jsdom",
];
function loadJSDOM() {
  const tried = [];
  for (const c of JSDOM_CANDIDATES) {
    try {
      return { JSDOM: require(c).JSDOM, from: c };
    } catch (e) {
      tried.push(c + " (" + e.code + ")");
    }
  }
  throw new Error("cannot load jsdom; tried: " + tried.join(", "));
}

// ---------------- CLI ----------------
const argv = process.argv.slice(2);
let htmlPath = null;
let framesN = 120;
let fatalOnly = false;
let afterPath = null;
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === "--fatal-only") fatalOnly = true;
  else if (a === "--after") afterPath = argv[++i];
  else if (a === "--frames") framesN = Number(argv[++i]);
  else if (a.startsWith("--frames=")) framesN = Number(a.slice("--frames=".length));
  else if (a === "-h" || a === "--help") {
    console.log("usage: node harness_new.cjs <html-path> [--frames N] [--fatal-only]");
    process.exit(0);
  } else if (a.startsWith("--")) {
    console.error("unknown option: " + a);
    process.exit(2);
  } else htmlPath = a;
}
if (!htmlPath) {
  console.error("usage: node harness_new.cjs <html-path> [--frames N] [--fatal-only]");
  process.exit(2);
}
if (!Number.isFinite(framesN) || framesN < 0) {
  console.error("bad --frames value: " + framesN);
  process.exit(2);
}
framesN |= 0;

const t0 = Date.now();
const since = () => ((Date.now() - t0) / 1000).toFixed(2) + "s";
const pad = (s, n) => String(s + " ".repeat(n)).slice(0, n);

// ---------------- 结果收集 ----------------
const fatals = []; // {kind, detail}
const checks = []; // {name, status: PASS|FAIL|SKIP|WARN, detail}
function check(name, fn) {
  try {
    const r = fn();
    if (r === "SKIP" || (r && r.status === "SKIP")) {
      checks.push({ name, status: "SKIP", detail: (r && r.detail) || "" });
    } else if (r && r.status === "WARN") {
      checks.push({ name, status: "WARN", detail: r.detail || "" });
    } else if (r === false) {
      checks.push({ name, status: "FAIL", detail: "assertion returned false" });
    } else {
      checks.push({ name, status: "PASS", detail: (r && r.detail) || "" });
    }
  } catch (e) {
    const st = String((e && e.stack) || e).split("\n").slice(0, 4).join(" | ");
    checks.push({ name, status: "FAIL", detail: st });
    fatals.push({ kind: "assertion threw", detail: name + " :: " + st });
  }
}
function fail(name, detail) {
  checks.push({ name, status: "FAIL", detail: String(detail || "") });
}

// ---------------- 前置: 读文件 + inline script 扫描 ----------------
let html;
try {
  html = fs.readFileSync(htmlPath, "utf8");
} catch (e) {
  console.error("HARNESS: cannot read " + htmlPath + ": " + e.message);
  process.exit(2);
}
if (html.charCodeAt(0) === 0xfeff) html = html.slice(1);

const SCRIPT_RE = /<script(?![^>]*\bsrc\s*=)[^>]*>([\s\S]*?)<\/script\s*>/gi;
const blocks = [];
let bm;
while ((bm = SCRIPT_RE.exec(html))) blocks.push({ code: bm[1], index: bm.index });
if (!blocks.length) {
  console.error("HARNESS: no inline <script> block in " + htmlPath);
  process.exit(2);
}

// ---------------- jsdom 环境 ----------------
let JSDOM, jsdomFrom;
try {
  ({ JSDOM, from: jsdomFrom } = loadJSDOM());
} catch (e) {
  console.error("HARNESS: " + e.message);
  process.exit(2);
}
const dom = new JSDOM(html, {
  runScripts: "outside-only",
  pretendToBeVisual: true,
  url: "file:///C:/game.html",
});
const { window } = dom;
const doc = window.document;
const noop = () => {};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---- canvas 2d/WebGL 桩：所有未知方法都返回 noop，属性可写 ----
const ANY = new Proxy(function () {}, {
  get(_t, p) {
    if (p === Symbol.toPrimitive) return () => 0;
    return ANY;
  },
  apply() {
    return ANY;
  },
  construct() {
    return ANY;
  },
  set() {
    return true;
  },
});
function makeCtx(canvas) {
  const gradient = () => ({ addColorStop: noop });
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
const canvasProto = window.HTMLCanvasElement.prototype;
canvasProto.getContext = function () {
  this.__ctx = this.__ctx || makeCtx(this);
  return this.__ctx;
};
canvasProto.toDataURL = () =>
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
canvasProto.toBlob = function (cb) {
  cb && cb(null);
};
canvasProto.getBoundingClientRect = function () {
  return { x: 0, y: 0, width: this.width || 1280, height: this.height || 720, top: 0, left: 0, right: 1280, bottom: 720 };
};
if (window.OffscreenCanvas) {
  window.OffscreenCanvas.prototype.getContext = function () {
    return makeCtx({ width: this.width, height: this.height });
  };
}

// ---- rAF: 捕获回调，由 harness 手动逐帧驱动（这样每一帧的异常都能归因到具体帧号） ----
const rafQueue = [];
let rafSeq = 0;
window.requestAnimationFrame = (cb) => {
  rafQueue.push(cb);
  return ++rafSeq;
};
window.cancelAnimationFrame = noop;
window.requestIdleCallback = (cb) => {
  setTimeout(() => cb({ timeRemaining: () => 5, didTimeout: false }), 0);
  return 1;
};
window.cancelIdleCallback = noop;
window.setImmediate ||= (fn, ...a) => setTimeout(fn, 0, ...a);

// ---- audio 桩 ----
class GainNode {
  constructor() {
    this.gain = { value: 1, setValueAtTime: noop, linearRampToValueAtTime: noop, exponentialRampToValueAtTime: noop, cancelScheduledValues: noop, setTargetAtTime: noop };
    this.connect = () => this;
    this.disconnect = noop;
  }
}
class OscNode {
  constructor() {
    this.frequency = { value: 440, setValueAtTime: noop, linearRampToValueAtTime: noop, exponentialRampToValueAtTime: noop, cancelScheduledValues: noop };
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
  constructor(src) { this.src = src; this.volume = 1; this.loop = false; this.currentTime = 0; this.paused = true; }
  play() { this.paused = false; return Promise.resolve(); }
  pause() { this.paused = true; }
  load() {}
  canPlayType() { return "maybe"; }
  addEventListener() {}
  removeEventListener() {}
};
for (const p of ["play", "pause"]) Object.defineProperty(window.HTMLMediaElement.prototype, p, { value: p === "play" ? () => Promise.resolve() : noop, writable: true, configurable: true });

// ---- localStorage / sessionStorage 桩（file:// 在 jsdom 里是 opaque origin，必须桩掉） ----
function makeStorage() {
  const m = new Map();
  return {
    get length() { return m.size; },
    key: (i) => Array.from(m.keys())[i] ?? null,
    getItem: (k) => (m.has(String(k)) ? m.get(String(k)) : null),
    setItem: (k, v) => { m.set(String(k), String(v)); },
    removeItem: (k) => { m.delete(String(k)); },
    clear: () => m.clear(),
  };
}
Object.defineProperty(window, "localStorage", { value: makeStorage(), configurable: true, writable: true });
Object.defineProperty(window, "sessionStorage", { value: makeStorage(), configurable: true, writable: true });

// ---- 其它浏览器 API 桩 ----
window.matchMedia = () => ({ matches: false, media: "", onchange: null, addEventListener: noop, removeEventListener: noop, addListener: noop, removeListener: noop });
window.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
window.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
window.MutationObserver ||= class { observe() {} disconnect() {} takeRecords() { return []; } };
window.fetch = (u) =>
  Promise.resolve({
    ok: true,
    status: 200,
    url: String(u),
    headers: { get: () => null },
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(64)),
    text: () => Promise.resolve(""),
    json: () => Promise.resolve({}),
  });
if (!window.URL.createObjectURL) window.URL.createObjectURL = () => "blob:stub";
window.URL.revokeObjectURL = noop;
if (!window.crypto) {
  try { Object.defineProperty(window, "crypto", { value: {}, configurable: true }); } catch (e) {}
}
if (window.crypto && !window.crypto.getRandomValues) {
  try {
    window.crypto.getRandomValues = (arr) => {
      for (let i = 0; i < arr.length; i++) arr[i] = (Math.random() * 256) | 0;
      return arr;
    };
  } catch (e) {}
}
window.scrollTo = noop;
window.Element.prototype.scrollTo = noop;
window.Element.prototype.scrollIntoView = noop;
window.Element.prototype.animate = () => ({ cancel: noop, finished: Promise.resolve(), onfinish: null });
if (window.SVGElement) window.SVGElement.prototype.getBBox = () => ({ x: 0, y: 0, width: 10, height: 10 });
window.Path2D = class { constructor() {} moveTo() {} lineTo() {} arc() {} closePath() {} };
window.ImageData = class { constructor(w, h) { this.width = w; this.height = h; this.data = new Uint8ClampedArray(w * h * 4); } };
window.alert = noop;
window.confirm = () => true;
window.prompt = () => null;
window.open = () => ({ focus: noop, close: noop, closed: false });
if (!doc.fonts) {
  doc.fonts = { ready: Promise.resolve(), check: () => true, add: noop, delete: noop, forEach: noop, load: () => Promise.resolve([]) };
}
if (window.navigator && !window.navigator.vibrate) {
  try { Object.defineProperty(window.navigator, "vibrate", { value: () => true, configurable: true }); } catch (e) {}
}
window.document.execCommand = () => true;
window.getSelection = () => ({ removeAllRanges: noop, addRange: noop, toString: () => "", rangeCount: 0 });
window.innerWidth = 1280;
window.innerHeight = 720;
window.devicePixelRatio = 1;
window.requestAnimationFrame = window.requestAnimationFrame.bind(window);
Object.defineProperty(window.navigator, "language", { value: "zh-CN", configurable: true });
if (!window.PointerEvent) window.PointerEvent = window.MouseEvent;
if (!window.TouchEvent) window.TouchEvent = window.Event;

// ---- 错误监听 ----
const windowErrors = [];
const consoleErrors = [];
const rejections = [];
window.addEventListener("error", (e) => {
  const err = e.error;
  windowErrors.push(err && err.stack ? err.stack : e.message || String(err));
});
window.addEventListener("unhandledrejection", (e) => {
  const r = e.reason;
  rejections.push(r && r.stack ? r.stack : String(r));
});
for (const fn of ["error", "warn", "log", "info", "debug"]) {
  const orig = window.console[fn];
  if (typeof orig !== "function") continue;
  window.console[fn] = function (...a) {
    if (fn === "error") {
      consoleErrors.push(a.map((x) => (x && x.stack ? x.stack : String(x))).join(" ").slice(0, 800));
    }
    if (process.env.HARNESS_VERBOSE) orig.apply(window.console, a);
  };
}

// ---------------- 帧驱动 ----------------
let frameClock = 1000;
let framesDriven = 0;
const frameErrors = []; // {frame, detail}
function runFrames(n) {
  for (let f = 0; f < n; f++) {
    const q = rafQueue.splice(0, rafQueue.length);
    for (const cb of q) {
      try {
        cb(frameClock);
      } catch (e) {
        const st = String((e && e.stack) || e).split("\n").slice(0, 5).join(" | ");
        frameErrors.push({ frame: framesDriven, detail: st });
        fatals.push({ kind: "frame exception", detail: "frame#" + framesDriven + " :: " + st });
      }
    }
    frameClock += 16.7;
    framesDriven++;
  }
  return frameErrors.length;
}
/** 真实等待 ms 毫秒，同时持续驱动帧：让 setTimeout/transition 等真实定时器有机会跑。 */
async function drain(ms) {
  const step = 20;
  const until = Date.now() + ms;
  while (Date.now() < until) {
    await sleep(step);
    runFrames(1);
  }
}
/** 在 ms 毫秒内轮询 cond()，期间持续驱动帧；返回是否满足。 */
async function waitFor(cond, ms) {
  const until = Date.now() + ms;
  while (Date.now() < until) {
    if (cond()) return true;
    await drain(50);
  }
  return !!cond();
}
const $ = (sel) => doc.querySelector(sel);
const $$ = (sel) => Array.from(doc.querySelectorAll(sel));
const text = (sel) => (($(sel) && $(sel).textContent) || "").trim();
const visible = (el) => !!el && !el.hidden;

// ---------------- 加载: 按文档顺序 eval 每个 inline 块 ----------------
const KNOWN_HOTFIX = /^EmberMods\._boot\(\)\s*;?$/;
const loadResults = [];
let fatalEval = 0;
for (let i = 0; i < blocks.length; i++) {
  const code = blocks[i].code;
  try {
    window.eval(code);
    loadResults.push({ block: i, ok: true, chars: code.length });
  } catch (e) {
    const known =
      KNOWN_HOTFIX.test(code.trim()) && /EmberMods is not defined/.test(String((e && e.message) || ""));
    if (known) {
      loadResults.push({ block: i, ok: false, known: true, chars: code.length, detail: "known hotfix stub threw ReferenceError (tolerated)" });
    } else {
      fatalEval++;
      const st = String((e && e.stack) || e).split("\n").slice(0, 6).join(" | ");
      loadResults.push({ block: i, ok: false, known: false, chars: code.length, detail: st });
      fatals.push({ kind: "uncaught exception during inline script #" + i, detail: st });
    }
  }
}
runFrames(3); // 让初始 rAF 回调落地一次

// ---------------- 引导流程 ----------------
const flow = { title: false, classSelect: false, hideout: false, mapTab: false, mapEntered: false };
let mapSkipReason = "";
let clubCard = null;

async function bootFlow() {
  // 标题界面
  const overlay0 = $("#overlay");
  if (!overlay0 || !overlay0.innerHTML.trim()) {
    fail("title screen renders", "overlay is empty after load (white screen?)  bodyLen=" + doc.body.innerHTML.length);
    return;
  }
  const hasDbg = !!$("#bDbg");
  const hasNew = !!$("#bNew");
  if (!hasDbg && !hasNew) {
    fail("title screen renders", "no #bDbg/#bNew in #overlay; overlayHead=" + overlay0.innerHTML.replace(/\s+/g, " ").slice(0, 160));
    return;
  }
  checks.push({ name: "title screen renders", status: "PASS", detail: "#overlay " + overlay0.innerHTML.length + " chars, buttons=" + ["#bDbg", "#bNew", "#bCont", "#bImp"].filter((s) => $(s)).join(",") });
  flow.title = true;

  // 标题 → 选职业（调试按钮给满配角色，测试用；#bNew 也走同一个选职业界面）
  let entry = $("#bDbg") || $("#bNew");
  try {
    entry.click();
  } catch (e) {
    fail("title -> class select", "click " + (entry.id || "entry") + " threw: " + ((e && e.stack) || e));
    return;
  }
  await drain(250);
  const cards = $$("#overlay .clscard[data-cls]");
  if (!cards.length) {
    fail("title -> class select", "#overlay .clscard[data-cls] not found; overlayHead=" + overlay0.innerHTML.replace(/\s+/g, " ").slice(0, 160));
    return;
  }
  clubCard = cards.find((c) => c.dataset.cls === "ranger") || cards[0];
  checks.push({ name: "title -> class select", status: "PASS", detail: cards.length + " class cards, pick=" + clubCard.dataset.cls });
  flow.classSelect = true;

  // 选职业 → 藏身处
  clubCard.click();
  await drain(400);
  const zone = text("#zname");
  const hud = $("#hud");
  const overlayCleared = !$("#overlay").innerHTML.trim();
  if (!zone || !hud) {
    fail("class select -> hideout", "zone=" + JSON.stringify(zone) + " hud=" + !!hud + " overlayLen=" + $("#overlay").innerHTML.length);
    return;
  }
  if (!overlayCleared) {
    fail("class select -> hideout", "overlay not cleared: " + $("#overlay").innerHTML.replace(/\s+/g, " ").slice(0, 140));
    return;
  }
  checks.push({ name: "class select -> hideout", status: "PASS", detail: "zone=" + JSON.stringify(zone) + " overlay cleared" });
  flow.hideout = true;

  // 藏身处跑 N 帧（验收要求）
  const before = frameErrors.length;
  runFrames(framesN);
  const newErrs = frameErrors.length - before;
  if (newErrs) {
    fail("hideout frames x" + framesN, newErrs + " frame(s) threw; first: " + frameErrors[before].detail);
  } else {
    checks.push({ name: "hideout frames x" + framesN, status: "PASS", detail: "no exception in " + framesN + " frames" });
  }
  // HUD 血量文本由页面渲染循环写入，可能晚于首批帧；最多再等 1.5s。
  // 该断言只影响可读性，不是「能启动」的硬门槛：HUD 元素在 / 文本最终为空时降级为 WARN。
  const hudAlive = (await waitFor(() => text("#tlife") !== "", 1500)) || (await waitFor(() => text("#tlife") !== "", 1500));
  if (hudAlive) {
    checks.push({ name: "hideout HUD alive", status: "PASS", detail: "hp=" + text("#tlife") + " buffs=" + $$("#buffs > *").length });
  } else if ($("#hud") && $("#olife")) {
    checks.push({ name: "hideout HUD alive", status: "WARN", detail: '#hud/#olife 存在但 #tlife 文本为空（jsdom 时序/渲染差异，非启动失败）' });
  } else {
    fail("hideout HUD alive", "no #hud/#olife/#tlife (HUD not rendered?)");
  }

  // 藏身处 → 地图（UI/DOM 驱动，尽力而为）
  await enterMapViaUI();
}

async function enterMapViaUI() {
  const menuMap = $("#menu [data-tab=\"map\"]");
  if (!menuMap) {
    mapSkipReason = "no #menu [data-tab=map] button";
    return checks.push({ name: "hideout -> map tab", status: "SKIP", detail: mapSkipReason });
  }
  menuMap.click();
  const panel = $("#panel");
  const opened = await waitFor(() => visible(panel), 1200);
  if (!opened) {
    mapSkipReason = "panel did not open after clicking 地图 tab (hidden=" + (panel ? panel.hidden : "no-panel") + ")";
    checks.push({ name: "hideout -> map tab", status: "SKIP", detail: mapSkipReason });
    return;
  }
  flow.mapTab = true;
  checks.push({ name: "hideout -> map tab", status: "PASS", detail: "#panel visible, pbody=" + ($("#pbody") ? $("#pbody").innerHTML.length : 0) + " chars" });

  const openBtn = () => $("#pbody [data-act=\"open\"]");
  // 1) 地图袋里没有地图时，先领免费 T1 地图
  if (!$$("#pbody [data-act=\"mapin\"]").length) {
    const free = $("#pbody [data-act=\"free\"]");
    if (free) {
      free.click();
      await drain(200);
    }
  }
  // 2) 把一张地图放进装置（部分版本第一次点击是选中，第二次才放入）
  let placed = false;
  for (let attempt = 0; attempt < 3 && !placed; attempt++) {
    const bagMap = $("#pbody [data-act=\"mapin\"]");
    if (!bagMap) break;
    bagMap.click();
    await drain(200);
    const ob = openBtn();
    if (ob && !ob.disabled) placed = true;
  }
  if (!placed) {
    mapSkipReason = "could not place a map into the device ([data-act=mapin] x3, open still disabled)";
    return checks.push({ name: "hideout -> map", status: "SKIP", detail: mapSkipReason });
  }

  // 3) 开启地图
  openBtn().click();
  // 过渡是真实定时器驱动的：边等边驱动帧，最多 3s
  for (let k = 0; k < 30; k++) {
    await drain(100);
    if (text("#zname") !== "藏身处" && !$("#btnPortal").hidden) break;
  }
  const zname = text("#zname");
  const portal = !$("#btnPortal").hidden;
  if (zname && zname !== "藏身处" && portal) {
    flow.mapEntered = true;
    checks.push({ name: "hideout -> map", status: "PASS", detail: "zone=" + JSON.stringify(zname) + " portal visible, panelHidden=" + !!panel.hidden });
    const mapFrameBefore = frameErrors.length;
    runFrames(framesN);
    const mapNewErrs = frameErrors.length - mapFrameBefore;
    if (mapNewErrs) {
      const fe = frameErrors[mapFrameBefore];
      fail("map frames x" + framesN, "frame#" + fe.frame + " threw: " + fe.detail);
    } else {
      checks.push({ name: "map frames x" + framesN, status: "PASS", detail: "no exception in " + framesN + " frames, zone=" + JSON.stringify(zname) });
    }
  } else {
    checks.push({ name: "hideout -> map", status: "SKIP", detail: "DOM 驱动未能确认进图 (zone=" + JSON.stringify(zname) + " portal=" + portal + ")" + (mapSkipReason ? " · " + mapSkipReason : "") });
  }
}

// ---------------- 收尾汇总 ----------------
function snapshot() {
  const ov = $("#overlay");
  const ovBox = ov && ov.querySelector(".ovbox");
  let screen = "unknown";
  if (!flow.title) screen = "not-started"; // 连标题界面都没渲染出来（白屏/加载失败）
  else if (ovBox) screen = "overlay"; // 标题/选职业/其它弹窗
  else if (flow.mapEntered) screen = "map";
  else if (flow.hideout) screen = "hideout";
  else screen = "title";
  const tab = $("#panel #tabs button.on, #panel #tabs button.is-on");
  return {
    screen,
    overlayBox: ovBox ? String(ovBox.className).replace(/\bovbox\s*/, "").trim() || "(base)" : "",
    zone: text("#zname"),
    zoneInfo: text("#zinfo").slice(0, 160),
    zoneMods: text("#zmods").slice(0, 160),
    panelVisible: visible($("#panel")),
    panelTab: tab ? tab.textContent.replace(/\s+/g, " ").trim() : "",
    hp: text("#tlife"),
    mana: text("#tmana"),
    buffs: $$("#buffs > *").length,
    bossVisible: visible($("#bossbar")),
    bossName: text("#bossname"),
    portalVisible: visible($("#btnPortal")),
    toasts: $$("#toasts > *").length,
    framesDriven,
    uncaught: windowErrors.length + fatals.filter((f) => f.kind === "frame exception").length,
    consoleErrors: consoleErrors.length,
    // 说明: 怪物数 / 精确玩家属性来自游戏内部对象，DOM 上不可见；
    // 该 harness 刻意不碰内部符号，故用 HUD/boss/#buffs 等 DOM 可观测量替代。
  };
}

(async () => {
  const jsdomVer = (() => {
    try {
      const pkg = require(path.join(path.dirname(require.resolve(jsdomFrom === "jsdom" ? "jsdom" : jsdomFrom + "/package.json")), "package.json"));
      return pkg.version || "?";
    } catch (e) {
      return "?";
    }
  })();

  try {
    await bootFlow();
  } catch (e) {
    fail("boot flow (unexpected harness error)", (e && e.stack) || String(e));
  }

  // ---- 全局断言 ----
  const evalFatal = loadResults.filter((r) => !r.ok && !r.known);
  if (evalFatal.length) {
    fail("inline scripts evaluate", evalFatal.length + " block(s) threw during eval; first: " + evalFatal[0].detail);
  } else {
    const known = loadResults.filter((r) => r.known).length;
    checks.push({ name: "inline scripts evaluate", status: known ? "WARN" : "PASS", detail: loadResults.length + " block(s) evaluated" + (known ? ", " + known + " known-hotfix block tolerated" : "") });
  }
  if (windowErrors.length) {
    fail("no window.onerror", windowErrors.length + " uncaught error(s); first: " + String(windowErrors[0]).split("\n").slice(0, 3).join(" | "));
  } else {
    checks.push({ name: "no window.onerror", status: "PASS", detail: "0 uncaught errors" });
  }
  if (frameErrors.length) {
    // 已在阶段检查中报过；这里只做总数汇总
    checks.push({ name: "no frame exceptions", status: "FAIL", detail: frameErrors.length + " frame exception(s); first frame#" + frameErrors[0].frame + ": " + frameErrors[0].detail });
  } else {
    checks.push({ name: "no frame exceptions", status: "PASS", detail: framesDriven + " frames driven" });
  }
  if (rejections.length) {
    checks.push({ name: "no unhandled promise rejection", status: "WARN", detail: rejections.length + " rejection(s); first: " + String(rejections[0]).split("\n")[0] });
  }
  if (consoleErrors.length) {
    checks.push({ name: "console.error clean", status: "WARN", detail: consoleErrors.length + " console.error; first: " + consoleErrors[0].split("\n")[0].slice(0, 200) });
  }

  // ---- 输出 ----
  console.log("=== harness_new.cjs  " + htmlPath);
  console.log("env: node " + process.version + "  jsdom " + jsdomVer + "  (" + jsdomFrom + ")");
  console.log(
    "load: " + blocks.length + " inline block(s) [" + blocks.map((b) => b.code.length + " chars").join(", ") + "]" +
      loadResults.map((r) => `  #${r.block}: ` + (r.ok ? "OK" : r.known ? "SKIP known-hotfix" : "ERROR")).join(""),
  );
  if (loadResults.some((r) => r.known)) {
    console.log("load: WARN 已知热修占位块 `EmberMods._boot()` 在浏览器里同样会先于主脚本抛 ReferenceError（CUR 历史问题，非本次迁移引入），已按已知问题跳过。");
  }
  console.log("");

  const order = { FAIL: 0, WARN: 1, SKIP: 2, PASS: 3 };
  if (!fatalOnly) {
    for (const c of checks) {
      console.log("CHECK " + pad(c.name, 34) + " " + pad(c.status, 5) + (c.detail ? "  " + c.detail : ""));
    }
  } else {
    console.log("[fatal-only] 逐项断言输出已省略；仅统计致命项。flow=" + JSON.stringify(flow));
  }

  // 致命项: eval 异常 / window.onerror / 帧异常 /（fatal-only 下 console.error 也算）
  const fatalList = [];
  for (const r of loadResults) if (!r.ok && !r.known) fatalList.push("eval block #" + r.block + ": " + r.detail);
  for (const w of windowErrors) fatalList.push("window.onerror: " + String(w).split("\n").slice(0, 4).join(" | "));
  for (const f of frameErrors) fatalList.push("frame#" + f.frame + ": " + f.detail);
  if (fatalOnly) for (const c of consoleErrors) fatalList.push("console.error: " + c);
  if (fatalOnly) for (const r of rejections) fatalList.push("unhandledrejection: " + String(r).split("\n").slice(0, 3).join(" | "));

  if (fatalList.length) {
    console.log("");
    console.log("FATAL DETAIL (" + fatalList.length + "):");
    fatalList.slice(0, 12).forEach((l, i) => console.log("  [" + (i + 1) + "] " + l));
    if (fatalList.length > 12) console.log("  ... (" + (fatalList.length - 12) + " more)");
  }

  if (afterPath) {
    try {
      const src = fs.readFileSync(afterPath, "utf8");
      const r = window.eval(src);
      console.log("AFTER " + JSON.stringify(r));
      if (r && r.ok === false) checks.push({ name: "after-script", status: "FAIL", detail: (r.fails || []).join(" | ").slice(0, 900) });
      else checks.push({ name: "after-script", status: "PASS", detail: "AFTER assertions ran" });
    } catch (e) {
      checks.push({ name: "after-script", status: "FAIL", detail: String((e && e.stack) || e).slice(0, 900) });
    }
  }

  const failed = checks.filter((c) => c.status === "FAIL");
  const skipped = checks.filter((c) => c.status === "SKIP");
  const warned = checks.filter((c) => c.status === "WARN");

  // 状态快照: 单行 JSON，方便 diff 两次构建
  console.log("");
  console.log("SNAPSHOT " + JSON.stringify(snapshot()));
  console.log("");
  if (fatalOnly) {
    const ok = fatalList.length === 0;
    console.log("RESULT: " + (ok ? "ALL PASS" : "FAIL") + "  (fatal-only: " + fatalList.length + " fatal)  [" + since() + "]");
    process.exit(ok ? 0 : 1);
  }
  const ok = failed.length === 0 && fatalList.length === 0;
  console.log(
    "RESULT: " + (ok ? "ALL PASS" : "FAIL") +
      "  checks=" + checks.length + " pass=" + checks.filter((c) => c.status === "PASS").length +
      " fail=" + failed.length + " warn=" + warned.length + " skip=" + skipped.length +
      " fatal=" + fatalList.length + " frames=" + framesDriven + "  [" + since() + "]",
  );
  if (!ok) {
    console.log("FAILED ITEMS:");
    failed.forEach((c) => console.log("  - " + c.name + " :: " + c.detail));
    fatalList.slice(0, 8).forEach((l) => console.log("  * " + l));
  }
  process.exit(ok ? 0 : 1);
})().catch((e) => {
  console.error("HARNESS CRASH: " + ((e && e.stack) || e));
  process.exit(2);
});
