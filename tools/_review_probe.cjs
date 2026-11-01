#!/usr/bin/env node
/* review-runtime: 真浏览器顺序探针
 * 与 harness 的最大差别：**不预注入 window.HOTFIX**，按文件中 inline 块的真实顺序依次 eval。
 * 用法: node tools/_review_probe.cjs <html> [--inject-hotfix]
 */
const fs = require("node:fs");
const path = require("node:path");
const { JSDOM } = require("/Users/yu/WorkBuddy/余烬/port/tools/node_modules/jsdom");

const file = process.argv[2];
const injectHotfix = process.argv.includes("--inject-hotfix");
const html = fs.readFileSync(file, "utf8");

// 抽取 inline 块（含顺序与偏移）
const scriptRe = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi;
const blocks = [];
let m;
while ((m = scriptRe.exec(html))) {
  blocks.push({ code: m[1], offset: m.index, len: m[1].length });
}

const dom = new JSDOM(html, { runScripts: "outside-only", pretendToBeVisual: true, url: "https://ember-rift.pages.dev/" });
const { window } = dom;
const noop = () => {};
const gradient = () => ({ addColorStop: noop });

function makeCtx(canvas) {
  const base = {
    canvas, globalAlpha: 1, globalCompositeOperation: "source-over", fillStyle: "#000", strokeStyle: "#000",
    lineWidth: 1, font: "10px sans-serif", textAlign: "left", textBaseline: "alphabetic", filter: "none",
    shadowBlur: 0, shadowColor: "#000", lineCap: "butt", lineJoin: "miter", imageSmoothingEnabled: true,
    measureText: () => ({ width: 10, actualBoundingBoxAscent: 6, actualBoundingBoxDescent: 2 }),
    createLinearGradient: gradient, createRadialGradient: gradient, createConicGradient: gradient,
    createPattern: () => ({}),
    getImageData: (x, y, w, h) => ({ data: new Uint8ClampedArray(Math.max(4, (w | 0) * (h | 0) * 4)), width: w | 0, height: h | 0 }),
    createImageData: (w, h) => ({ data: new Uint8ClampedArray(Math.max(4, (w | 0) * (h | 0) * 4)), width: w | 0, height: h | 0 }),
    putImageData: noop, getLineDash: () => [], setLineDash: noop,
    isPointInPath: () => false, isPointInStroke: () => false,
    getTransform: () => ({ a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 }),
  };
  return new Proxy(base, { get(t, p) { if (p in t) return t[p]; return noop; }, set(t, p, v) { t[p] = v; return true; } });
}
const proto = window.HTMLCanvasElement.prototype;
proto.getContext = function () { this.__ctx = this.__ctx || makeCtx(this); return this.__ctx; };
proto.toDataURL = () => "data:image/png;base64,iVBORw0KGgo=";
proto.getBoundingClientRect = function () { return { x: 0, y: 0, width: this.width || 1280, height: this.height || 720, top: 0, left: 0, right: 1280, bottom: 720 }; };
if (window.OffscreenCanvas) window.OffscreenCanvas.prototype.getContext = function () { return makeCtx({ width: this.width, height: this.height }); };

const rafQueue = [];
window.requestAnimationFrame = (cb) => { rafQueue.push(cb); return rafQueue.length; };
window.cancelAnimationFrame = noop;
window.requestIdleCallback = (cb) => { setTimeout(() => cb({ timeRemaining: () => 5, didTimeout: false }), 0); return 1; };
window.cancelIdleCallback = noop;

class Node2 { constructor() { this.gain = { value: 1, setValueAtTime: noop }; this.frequency = { value: 440, setValueAtTime: noop }; this.detune = { value: 0 }; this.connect = () => this; this.disconnect = noop; this.start = noop; this.stop = noop; this.buffer = null; this.playbackRate = { value: 1 }; } }
class FakeAudioCtx {
  constructor() { this.currentTime = 0; this.sampleRate = 44100; this.destination = { connect: noop, disconnect: noop }; this.state = "running"; this.listener = { positionX: { value: 0 }, positionY: { value: 0 }, positionZ: { value: 0 } }; }
  createGain() { return new Node2(); } createOscillator() { return new Node2(); } createBufferSource() { return new Node2(); }
  createBuffer(c, l, r) { return { length: l, numberOfChannels: c, sampleRate: r, getChannelData: () => new Float32Array(l), copyToChannel: noop }; }
  createBiquadFilter() { return new Node2(); } createDynamicsCompressor() { return new Node2(); }
  createAnalyser() { return { fftSize: 256, frequencyBinCount: 128, getByteFrequencyData: noop, getByteTimeDomainData: noop, connect: () => ({}), disconnect: noop }; }
  createStereoPanner() { return new Node2(); } createPanner() { return new Node2(); } createChannelMerger() { return new Node2(); }
  createDelay() { return new Node2(); } createWaveShaper() { return new Node2(); }
  decodeAudioData(b, ok) { const x = { length: 4410, numberOfChannels: 1, sampleRate: 44100, getChannelData: () => new Float32Array(4410), copyToChannel: noop }; if (ok) ok(x); return Promise.resolve(x); }
  resume() { return Promise.resolve(); } suspend() { return Promise.resolve(); } close() { return Promise.resolve(); }
}
window.AudioContext = FakeAudioCtx; window.webkitAudioContext = FakeAudioCtx;
window.Audio = class { constructor(s) { this.src = s; this.volume = 1; this.loop = false; this.currentTime = 0; } play() { return Promise.resolve(); } pause() {} load() {} canPlayType() { return "maybe"; } addEventListener() {} removeEventListener() {} };
Object.defineProperty(window.HTMLMediaElement.prototype, "play", { value: () => Promise.resolve(), writable: true });
Object.defineProperty(window.HTMLMediaElement.prototype, "pause", { value: noop, writable: true });
window.matchMedia = () => ({ matches: false, media: "", addEventListener: noop, removeEventListener: noop, addListener: noop, removeListener: noop });
window.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
window.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
window.fetch = (u) => Promise.resolve({ ok: true, status: 200, url: String(u), arrayBuffer: () => Promise.resolve(new ArrayBuffer(64)), text: () => Promise.resolve(""), json: () => Promise.resolve({}) });
window.URL.createObjectURL = () => "blob:stub"; window.URL.revokeObjectURL = noop;
if (!window.crypto.getRandomValues) window.crypto.getRandomValues = (a) => { for (let i = 0; i < a.length; i++) a[i] = (Math.random() * 256) | 0; return a; };
window.scrollTo = noop; window.Element.prototype.scrollTo = noop; window.Element.prototype.scrollIntoView = noop;
window.Element.prototype.animate = () => ({ cancel: noop, finished: Promise.resolve(), onfinish: null });
if (window.SVGElement) window.SVGElement.prototype.getBBox = () => ({ x: 0, y: 0, width: 10, height: 10 });
window.Path2D = class { moveTo() {} lineTo() {} arc() {} closePath() {} };
window.ImageData = class { constructor(w, h) { this.width = w; this.height = h; this.data = new Uint8ClampedArray(w * h * 4); } };
window.document.execCommand = () => true;
window.getSelection = () => ({ removeAllRanges: noop, addRange: noop, toString: () => "", rangeCount: 0 });
window.innerWidth = 1280; window.innerHeight = 720; window.devicePixelRatio = 1;
Object.defineProperty(window.navigator, "language", { value: "zh-CN", configurable: true });
if (!window.PointerEvent) window.PointerEvent = window.MouseEvent;
if (!window.TouchEvent) window.TouchEvent = window.Event;

const logs = [];
for (const k of ["log", "info", "warn", "error"]) {
  const orig = console[k].bind(console);
  console[k] = (...a) => { logs.push(`[${k}] ` + a.map(String).join(" ")); orig(...a); };
}

const winErr = [];
window.addEventListener("error", (e) => winErr.push(e.error && e.error.stack ? e.error.stack : e.message));

if (injectHotfix) {
  const hfPath = path.join("/Users/yu/WorkBuddy/余烬/port", "pack", "余烬裂隙-PoE2内容扩展包v2.0.5", "迁移工具", "hotfix", "hotfix.json");
  window.HOTFIX = JSON.parse(fs.readFileSync(hfPath, "utf8"));
  console.log(">>> [PROBE] window.HOTFIX 已预注入 (模拟 harness 行为)");
} else {
  console.log(">>> [PROBE] 不预注入 window.HOTFIX —— 与真实浏览器一致");
}

function snap(tag) {
  const g = (k) => { try { return window[k]; } catch (e) { return "<throw>"; } };
  console.log(`--- after block #${tag} ---`);
  console.log(`  typeof window.HOTFIX        = ${typeof g("HOTFIX")}`);
  console.log(`  window.__HOTFIX_APPLIED     = ${JSON.stringify(g("__HOTFIX_APPLIED"))}`);
  console.log(`  window.__PORT               = ${JSON.stringify(g("__PORT"))}`);
  console.log(`  window.__lowTierEase        = ${JSON.stringify(g("__lowTierEase"))}`);
  console.log(`  window.__bossbarFixed       = ${JSON.stringify(g("__bossbarFixed"))}`);
  console.log(`  window.__swordCapHotfix     = ${JSON.stringify(g("__swordCapHotfix"))}`);
  console.log(`  window.__erTest             = ${typeof g("__erTest")}`);
  console.log(`  window.__portDrawCustom     = ${typeof g("__portDrawCustom")}`);
  console.log(`  window.__rift               = ${typeof g("__rift")}`);
}

console.log(`=== ${path.basename(file)} : ${blocks.length} inline blocks ===`);
let i = 0;
for (const b of blocks) {
  i++;
  const head = b.code.trim().slice(0, 60).replace(/\s+/g, " ");
  console.log(`\n### evaluating inline block #${i} (len=${b.len}) : ${head}`);
  try {
    window.eval(b.code);
    console.log(`    eval OK`);
  } catch (e) {
    console.log(`    eval THROW: ${e && e.message}`);
    console.log(String(e && e.stack || "").split("\n").slice(0, 6).join("\n"));
  }
  if (i === blocks.length - 1 || /HOTFIX =/.test(b.code.slice(0, 200)) || b.len > 1e6) snap(i);
}

// 30 frames
let frameErr = null;
try {
  for (let f = 0; f < 30; f++) {
    const q = rafQueue.splice(0, rafQueue.length);
    for (const cb of q) cb(16.7 * (f + 1));
  }
} catch (e) { frameErr = e; }
console.log(`\nframe loop: ${frameErr ? "ERROR " + frameErr.message : "OK (30 frames)"}`);
console.log(`window.onerror: ${winErr.length ? winErr.slice(0, 3).join("\n") : "none"}`);
console.log(`\n=== 关键日志 ===`);
for (const l of logs) if (/hotfix|热修|Hotfix|error|Error|失败/.test(l)) console.log("  " + l.slice(0, 300));
