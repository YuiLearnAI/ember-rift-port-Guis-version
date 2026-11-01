// Headless smoke test + targeted unit tests for the Omen system.
// Loads the game's main IIFE inside jsdom with stubbed canvas/audio APIs.
const fs = require("node:fs");
const path = require("node:path");
const { JSDOM } = require("C:/Users/33266/AppData/Local/Temp/dsh-e951uk/er-dom/node_modules/jsdom");

const htmlPath = process.argv[2];
const html = fs.readFileSync(htmlPath, "utf8");

// --- extract inline script blocks (skip external src scripts) ---
const scriptRe = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi;
const blocks = [];
let m;
while ((m = scriptRe.exec(html))) blocks.push(m[1]);
if (blocks.length < 1) throw new Error("no inline script found");
let mainCode = blocks[blocks.length - 1];

// --- build DOM ---
const dom = new JSDOM(html, {
  runScripts: "outside-only",
  pretendToBeVisual: true,
  url: "file:///C:/game.html",
});
const { window } = dom;
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


// ============ 通用引导测试（不依赖游戏内部符号名） ============
const errors2 = [];
window.addEventListener("error", (e) => errors2.push("window error: " + (e.error && e.error.stack ? e.error.stack : e.message)));
const consoleErrors = [];
const origErrFn = console.error;
console.error = (...a) => { consoleErrors.push(a.map(String).join(" ")); origErrFn(...a); };

let fatal = null;
try { window.eval(mainCode); } catch (e) { fatal = e; }
console.log("eval:", fatal ? "FATAL " + (fatal.stack || fatal) : "OK");
if (fatal) process.exit(2);

function runFrames(n, t0) {
  for (let f = 0; f < n; f++) {
    const q = rafQueue.splice(0, rafQueue.length);
    const t = (t0 || 0) + 16.7 * (f + 1);
    for (const cb of q) cb(t);
  }
}
let frameErr = null;
try { runFrames(30); } catch (e) { frameErr = e; }
console.log("frames(30):", frameErr ? "ERROR " + (frameErr.stack || frameErr) : "OK");
console.log("title DOM length:", doc.body ? doc.body.innerHTML.length : -1);

const fails = [];
function ok(name, cond, extra) {
  if (cond) console.log("  PASS " + name);
  else { console.log("  FAIL " + name + (extra ? " :: " + extra : "")); fails.push(name); }
}

let started = false, playErr = null;
try {
  const bDbg = doc.querySelector("#bDbg");
  if (!bDbg) throw new Error("no #bDbg debug button");
  bDbg.click();
  runFrames(5);
  const cards = doc.querySelectorAll("#overlay .clscard");
  if (!cards.length) throw new Error("no class cards");
  (doc.querySelector('#overlay .clscard[data-cls="ranger"]') || cards[0]).click();
  runFrames(180, 1000);
  started = true;
} catch (e) { playErr = e; }
console.log("character flow:", playErr ? "ERROR " + (playErr.stack || playErr) : started ? "OK" : "not started");

ok("eval no fatal", !fatal);
ok("frames no error", !frameErr, frameErr ? String(frameErr && frameErr.message) : "");
ok("no window.onerror", errors2.length === 0, errors2.slice(0, 3).join(" | "));
ok("no console.error", consoleErrors.length === 0, consoleErrors.slice(0, 3).join(" | "));
ok("character created", started, playErr ? String(playErr && playErr.message || playErr) : "");
try {
  ok("canvas exists", !!doc.querySelector("canvas"));
  const curbar = doc.querySelector("#curbar");
  ok("currency bar rendered", !!curbar && (curbar.innerHTML || "").length > 10, curbar ? String((curbar.innerHTML || "").length) : "no #curbar");
} catch (e) { ok("ui probe", false, String(e)); }

if (errors2.length) console.log("window errors:", errors2.slice(0, 5));
if (consoleErrors.length) console.log("console.error:", consoleErrors.slice(0, 5));
console.log(fails.length ? "RESULT: FAIL (" + fails.join(", ") + ")" : "RESULT: ALL PASS");
process.exit(fails.length ? 1 : 0);
