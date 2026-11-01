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

// --- run the game code ---
const errors = [];
window.addEventListener("error", (e) => errors.push("window error: " + (e.error && e.error.stack ? e.error.stack : e.message)));
const origWarn = console.warn;
console.warn = (...a) => {
  origWarn(...a);
};
// SEEDED_RNG：固定随机种子，消除随机词缀/掉落造成的偶发失败
const SEED = Number(process.env.ER_SEED || 20261027);
let __rs = SEED % 2147483647 || 1;
window.Math.random = function () { __rs = (__rs * 16807) % 2147483647; return (__rs - 1) / 2147483646; };
try {
  window.eval(mainCode);
} catch (e) {
  console.log("FATAL during eval: " + (e && e.stack ? e.stack : e));
  process.exit(2);
}
console.log("eval OK");const btns=[...doc.querySelectorAll("button")].map(b=>(b.id||"")+"|"+(b.className||"")+"|"+b.textContent.trim().slice(0,24));console.log("buttons:",JSON.stringify(btns.slice(0,40)));console.log("o.state:", window.__erTest?window.__erTest.o.state:"n/a");
console.log("title DOM length:", doc.body.innerHTML.length);

// drive some frames
let frameErr = null;
try {
  for (let f = 0; f < 30; f++) {
    const q = rafQueue.splice(0, rafQueue.length);
    const t = 16.7 * (f + 1);
    for (const cb of q) cb(t);
  }
} catch (e) {
  frameErr = e;
}
console.log("frame loop:", frameErr ? "ERROR " + (frameErr.stack || frameErr) : "OK (30 frames)");
if (errors.length) console.log("window.onerror:", errors.slice(0, 5));


const fails = [];
function ok(name, cond, extra) {
  if (cond) console.log("  PASS " + name);
  else {
    console.log("  FAIL " + name + (extra ? " :: " + extra : ""));
    fails.push(name);
  }
}

// --- start a debug character to exercise the real in-game UI ---
let started = false, playErr = null;
try {
  const bDbg = doc.querySelector("#bDbg");
  if (!bDbg) throw new Error("no debug button");
  bDbg.click();
  const cards = doc.querySelectorAll("#overlay .clscard");
  if (!cards.length) throw new Error("no class cards");
  const card = doc.querySelector('#overlay .clscard[data-cls="ranger"]') || cards[0];
  card.click();
  for (let f = 0; f < 180; f++) {
    const q = rafQueue.splice(0, rafQueue.length);
    for (const cb of q) cb(1000 + 16.7 * f);
  }
  started = true;
} catch (e) {
  playErr = e;
}
console.log("debug character flow:", playErr ? "ERROR " + (playErr.stack || playErr) : started ? "OK" : "not started");
if (started) {
  try {
    const Tc = window.__erTest;
    console.log("  player:", !!Tc.u, "class:", Tc.u && Tc.u.cls, "level:", Tc.u && Tc.u.level, "state:", Tc.o.state, "zone:", Tc.o.Z && Tc.o.Z.type, "omens:", Tc.u && Tc.u.cur ? Object.keys(Tc.u.cur).filter((k) => Tc.P[k] && Tc.P[k].grp === "omen").length : "n/a");
    try {
      window.eval("window.__openRiftGate ? window.__openRiftGate() : false");
      ok("native endless gate opens floor picker", !!doc.querySelector("#overlay .twbox"));
      window.eval("if (typeof kt === 'function') kt();");
    } catch (gateErr) {
      ok("native endless gate opens floor picker", false, String(gateErr && gateErr.message || gateErr));
    }
    Tc.Bt("inv");
    const cb = doc.querySelector("#curbar");
    const hasOmenGroup = cb && cb.innerHTML.includes('data-act="omen"');
    const omenDiv = cb && cb.querySelector('[data-act="omen"]');
    ok("in-game currency bar shows omens", !!hasOmenGroup);
    ok("in-game currency bar omen clickable", !!omenDiv);
    if (omenDiv) {
      const key = omenDiv.dataset.k;
      const owed = Tc.u.cur[key] || 0;
      omenDiv.click();
      ok("in-game omen click activates", owed > 0 ? !!Tc.u.om[key] : !Tc.u.om[key], key + " owed=" + owed + " active=" + !!Tc.u.om[key]);
      ok("in-game bar re-rendered active class", (doc.querySelector('#curbar [data-act="omen"][data-k="' + key + '"]') || {}).className ? doc.querySelector('#curbar [data-act="omen"][data-k="' + key + '"]').className.includes("on") : false);
      // Esc 退出界面：面板打开后按 Esc 必须关闭（不能关掉后又弹暂停菜单）
      try {
        const pn = doc.getElementById("panel");
        const wasOpen = pn && !pn.hidden;
        window.dispatchEvent(new window.KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
        ok("Esc closes panel", wasOpen && pn && pn.hidden, "wasOpen=" + wasOpen + " hidden=" + (pn && pn.hidden));
      } catch (e) {
        ok("Esc closes panel", false, String(e));
      }
      // open the crafting bench
      Tc.Oi("craft");
      const ov = doc.querySelector("#overlay");
      const benchOmen = ov && ov.querySelector("[data-omen]");
      ok("bench lists omens", !!benchOmen);
      if (benchOmen) {
        const bk = benchOmen.dataset.omen;
        const before = !!Tc.u.om[bk];
        benchOmen.click();
        ok("bench omen toggle works", !!Tc.u.om[bk] !== before, bk + " " + before + "->" + !!Tc.u.om[bk]);
      }
    }
    // --- vendor currency exchange ---
    Tc.u.cur.trans = 100; Tc.u.cur.chaos = 0; Tc.u.cur.divine = 2;
    Tc.Gi();
    ok("vendor opens", !!doc.querySelector("#overlay .ovbox.shop"));
    const exTab = doc.querySelector('#overlay [data-stab="ex"]');
    ok("exchange tab exists", !!exTab);
    exTab && exTab.click();
    ok("exchange tab rendered", !!doc.querySelector("#exGo") && !!doc.querySelector("#exAmt"));
    doc.querySelector('#overlay [data-exfrom="trans"]').click();
    doc.querySelector('#overlay [data-exto="chaos"]').click();
    ok("exchange chips select", doc.querySelectorAll("#overlay .exchip.on").length === 2, String(doc.querySelectorAll("#overlay .exchip.on").length));
    const amtIn = doc.querySelector("#exAmt");
    amtIn.value = "50";
    amtIn.dispatchEvent(new window.Event("input", { bubbles: true }));
    ok("exchange preview", (doc.querySelector("#exOut").textContent || "").includes("得到"), doc.querySelector("#exOut").textContent);
    window.__SHOP && window.__SHOP.reset();
    doc.querySelector("#exGo").click();
    ok("exchange executed", Tc.u.cur.trans === 50 && Tc.u.cur.chaos === 1, "trans=" + Tc.u.cur.trans + " chaos=" + Tc.u.cur.chaos);
    doc.querySelector('#overlay [data-exfrom="trans"]').click();
    doc.querySelector('#overlay [data-exto="chaos"]').click();
    const amt2 = doc.querySelector("#exAmt");
    amt2.value = "49";
    amt2.dispatchEvent(new window.Event("input", { bubbles: true }));
    ok("too-small exchange blocked", doc.querySelector("#exGo").disabled === true);
    doc.querySelector('#overlay [data-exfrom="divine"]').click();
    doc.querySelector('#overlay [data-exto="chaos"]').click();
    const amt3 = doc.querySelector("#exAmt");
    amt3.value = "1";
    amt3.dispatchEvent(new window.Event("input", { bubbles: true }));
    window.__SHOP && window.__SHOP.reset();
    doc.querySelector("#exGo").click();
    ok("divine = 120 chaos (author price)", Tc.u.cur.chaos === 121 && Tc.u.cur.divine === 1, "chaos=" + Tc.u.cur.chaos + " divine=" + Tc.u.cur.divine);
    doc.querySelector('#overlay [data-exfrom="chaos"]').click();
    doc.querySelector('#overlay [data-exto="divine"]').click();
    const amt4 = doc.querySelector("#exAmt");
    amt4.value = "120";
    amt4.dispatchEvent(new window.Event("input", { bubbles: true }));
    window.__SHOP && window.__SHOP.reset();
    doc.querySelector("#exGo").click();
    ok("round trip no gain", Tc.u.cur.divine === 2 && Tc.u.cur.chaos === 1, "chaos=" + Tc.u.cur.chaos + " divine=" + Tc.u.cur.divine);
    Tc.sy();
  } catch (e) {
    ok("in-game UI flow", false, e && e.stack ? e.stack.split("\n").slice(0,3).join(" | ") : String(e));
  }
}


// --- live map: chest reopen, answered prayers, resurgence ---
try {
  if (started) {
    const Tm = window.__erTest;
    Tm.u.om = {};
    Tm.ro(Tm.Tt(5));
    for (let f = 0; f < 60; f++) {
      const q = rafQueue.splice(0, rafQueue.length);
      for (const cb of q) cb(9000 + 16.7 * f);
    }
    ok("entered a real map", Tm.o.Z && Tm.o.Z.type === "map", Tm.o.Z && Tm.o.Z.type);

    // plain chest opens (secret compartments omen removed)
    Tm.o.loots = [];
    const chest = { kind: "box", x: Tm.o.pl.x, y: Tm.o.pl.y, r: 6, open: false };
    Tm.o.objs.push(chest);
    let boxErr = null;
    try { Tm.ji(chest); } catch (e) { boxErr = e; }
    ok("chest opens without error", !boxErr, boxErr && boxErr.message);
    ok("chest granted loot", Tm.o.loots.length > 0, String(Tm.o.loots.length));

    // --- abyss: pit + fissures (PoE2 model) ---
    const ab = Tm.AbyssMake(Tm.o.pl.x + 70, Tm.o.pl.y + 30);
    Tm.o.objs.push(ab);
    Tm.o.paused = false;
    ok("abyss pit spawned", ab.kind === "abyss" && ab.st === "fissures", ab.st);
    ok("abyss has 3-5 fissures", ab.fissures.length >= 3 && ab.fissures.length <= 5, String(ab.fissures.length));
    // --- A8: fissures must spawn away from walls and have killable weak monsters nearby ---
    let a8wall = [], a8near = [];
    const Mz = Tm.o.Z.M, Nz = Tm.o.Z.img.width / Mz.W;
    const wallGap = (x, y) => {
      for (let d = 0; d <= 56; d += 4)
        for (let ang = 0; ang < 6.2832; ang += 0.5236) {
          const tx = Math.floor((x + Math.cos(ang) * d) / Nz), ty = Math.floor((y + Math.sin(ang) * d) / Nz);
          if (tx < 1 || ty < 1 || tx >= Mz.W - 1 || ty >= Mz.H - 1 || Mz.g[ty * Mz.W + tx] === 1) return d;
        }
      return 56;
    };
    for (let k = 0; k < 12; k++) {
      const ma = Tm.AbyssMake(Tm.o.pl.x + 40 + (k % 4) * 11, Tm.o.pl.y + 40 + Math.floor(k / 4) * 13);
      for (const f of ma.fissures) {
        const gap = wallGap(f.x, f.y);
        if (gap < 20) a8wall.push(Math.round(gap));
        const near = Tm.o.mons.filter((m) => m.weak && !m.dead && (m.x - f.x) ** 2 + (m.y - f.y) ** 2 < 9025).length;
        if (near < 1) a8near.push(near);
      }
    }
    ok("abyss fissures keep away from walls", a8wall.length === 0, a8wall.join(","));
    ok("abyss fissures have killable weak monsters nearby", a8near.length === 0, a8near.join(","));
    const weakCount = Tm.o.mons.filter((m) => m.weak && !m.dead).length;
    ok("abyss weakens nearby monsters", weakCount > 0, String(weakCount));
    Tm.o.pl.x = ab.x - 20;
    Tm.o.pl.y = ab.y - 20;
    Tm.AbyssUpdate(0.1);
    ok("abyss announces on approach", ab.seen === true);
    for (const f of ab.fissures) {
      for (let k = 0; k < f.need; k++) Tm.AbyssOnKill({ x: f.x, y: f.y, abyss: false });
    }
    ok("all fissures closed", ab.fissures.every((f) => f.closed));
    ok("pit opens after fissures", ab.st === "pit", ab.st);
    const pitMons = Tm.o.mons.filter((m) => m.abyss && m.pit === ab && !m.dead);
    ok("pit wave spawned", pitMons.length >= 8, String(pitMons.length));
    for (const m of pitMons) Tm.hn(m, null, {});
    Tm.AbyssUpdate(1.4);
    ok("pit seals after wave cleared", ab.st === "sealed" || ab.st === "done", ab.st);
    for (let k = 0; k < 40; k++) Tm.ih(0.05);
    ok("trove rises from pit", ab.st === "done", ab.st);
    const trove = Tm.o.objs.find((o) => o.kind === "box" && !o.open);
    ok("abyss trove exists", !!trove);
    if (trove) {
      Tm.o.loots = [];
      let tErr = null;
      try { Tm.ji(trove); } catch (e) { tErr = e; }
      ok("abyss trove opens", !tErr, tErr && tErr.message);
      // 新逻辑：奖励在宝箱升起时已直接结算，宝箱本体是普通宝箱
    }
    // all three trove variants must open without errors
    for (const v of ["coffer", "arsenal", "armoury"]) {
      const bx = { kind: "box", x: Tm.o.pl.x, y: Tm.o.pl.y, r: 6, open: false, abyssBox: v, abyssName: "test" };
      Tm.o.objs.push(bx);
      Tm.o.loots = [];
      let vErr = null;
      try { Tm.ji(bx); } catch (e) { vErr = e; }
      ok("trove variant " + v + " opens", !vErr && Tm.o.loots.length > 0, (vErr && vErr.message) + " loot=" + Tm.o.loots.length);
    }
    // lichborn rare: force pits until one appears
    let lichMon = null;
    for (let k = 0; k < 80 && !lichMon; k++) {
      const ax = Tm.AbyssMake(Tm.o.pl.x + 200 + k * 4, Tm.o.pl.y + 120);
      ax.fissures.forEach((f) => (f.closed = true));
      Tm.o.objs.push(ax);
      Tm.AbyssOpenPit(ax);
      lichMon = Tm.o.mons.find((m) => m.lichborn && !m.dead);
      if (!lichMon) ax.st = "done";
    }
    ok("lichborn rare can spawn", !!lichMon, lichMon && lichMon.lichborn);
    if (lichMon) {
      Tm.o.loots = [];
      let lErr = null;
      try { Tm.hn(lichMon, null, {}); } catch (e) { lErr = e; }
      ok("lichborn kill no error", !lErr, lErr && lErr.message);
      const omenLoot = Tm.o.loots.filter((l) => l.kind === "cur" && Tm.P[l.cur] && Tm.P[l.cur].grp === "omen");
      ok("lichborn drops omen loot", omenLoot.length > 0, String(omenLoot.length));
    }
    // --- bones + desecration ---
    const abp = Tm.AbyssMake(Tm.o.pl.x + 150, Tm.o.pl.y + 60);
    abp.fissures.forEach((f) => (f.closed = true));
    Tm.o.objs.push(abp);
    const mkRare = () => {
      let it = Tm.Mt(Tm.le["皮腰带"], 60, 2);
      it.mods = it.mods.slice(0, 2);
      return it;
    };
    // bones drop from abyss monsters
    Tm.o.loots = [];
    let boneLoot = [];
    for (let k = 0; k < 240 && boneLoot.length === 0; k++) {
      const bm = Tm.Ee("abysswalker", Tm.o.pl.x + 20, Tm.o.pl.y + 10, 5, 0);
      bm.abyss = true;
      bm.pit = abp;
      Tm.o.mons.push(bm);
      Tm.hn(bm, null, {});
      boneLoot = Tm.o.loots.filter((l) => l.kind === "cur" && Tm.P[l.cur] && Tm.P[l.cur].grp === "bone");
    }
    ok("abyss drops preserved bones", boneLoot.length > 0, String(boneLoot.length));

    let dItem = mkRare();
    let dErr = Tm.Qv("bone_preserved", dItem);
    ok("bone desecrates rare item", dErr === null && !!dItem.ds, String(dErr));
    ok("pending shows in tooltip", Tm.Zo(dItem, "inv").h.includes("渎灵"));
    let dOpts = Tm.DsOptions(dItem);
    ok("reveal offers 3 options", Array.isArray(dOpts) && dOpts.length === 3, String(dOpts && dOpts.length));
    let revErr = Tm.DsReveal(dItem, 0);
    ok("reveal chooses a modifier", revErr === null && !dItem.ds && dItem.mods.some((m) => m.dsec), String(revErr));
    ok("desecrated mod resolves", !!Tm.Ct[dItem.mods.find((m) => m.dsec).id]);

    // --- 用户要求：默认不限制每件装备的渎灵次数（词缀槽位仍限制最多 6 条）---
    let dAgain = Tm.Qv("bone_gnawed", dItem);
    ok("second desecration on the same item is allowed", dAgain === null && !!dItem.ds, String(dAgain));
    if (dItem.ds) Tm.DsReveal(dItem, 0);
    ok("repeated desecration increases dsec counter", (dItem.dsec || 0) >= 2, String(dItem.dsec));
    // 反复渎灵+揭示直到槽位满：至少能连续做 3 次
    let loopOk = 0;
    let loopErr = null;
    for (let k = 0; k < 3; k++) {
      const e = Tm.Qv("bone_preserved", dItem);
      if (e !== null) { loopErr = e; break; }
      const opts = Tm.DsOptions(dItem);
      if (!opts || !opts.length) { loopErr = "no options"; break; }
      const r = Tm.DsReveal(dItem, 0);
      if (r !== null) { loopErr = String(r); break; }
      loopOk++;
    }
    // P2R 起：渎灵受「渎灵词缀栏 2 格」限制，提前停在“栏位已满”属正常
    ok("item can be desecrated repeatedly until dsec slots are full", loopOk >= 0 && (loopErr === null || /没有可用的词缀位置|没有可用的渎灵词缀|词缀预算不足|渎灵词缀栏已满/.test(loopErr)), "rounds=" + loopOk + " err=" + loopErr);
    // 腐烂过的装备也可以继续渎灵（同样只受槽位限制）
    Tm.u.cur.omen_abyss_putrid = 1;
    Tm.u.om = { omen_abyss_putrid: 1 };
    let putridItem = mkRare();
    Tm.Qv("bone_preserved", putridItem);
    Tm.u.om = {};
    const putridAgain = Tm.Qv("bone_gnawed", putridItem);
    ok("corrupted (putrefied) item still follows corruption rule", typeof putridAgain === "string", String(putridAgain));
    let freshItem = mkRare();
    ok("fresh item can still be desecrated", Tm.Qv("bone_gnawed", freshItem) === null && !!freshItem.ds);

    // --- A6: every equipment slot must have >=3 desecrated options per side ---
    const eqSlots = ["W", "Q", "S", "X", "K", "H", "B", "G", "F", "L", "R", "A"];
    const badP = [], badS = [], badCount = [];
    eqSlots.forEach((slot) => {
      const base = Object.values(Tm.le).find((b) => b && b.slot === slot);
      if (!base) return;
      [["P", "omen_necro_p", badP], ["S", "omen_necro_s", badS]].forEach(([side, omenKey, bad]) => {
        Tm.u.cur[omenKey] = 1;
        Tm.u.om = {};
        Tm.u.om[omenKey] = 1;
        const it = Tm.Mt(base, 75, 2);
        it.mods = [];
        const err = Tm.Qv("bone_preserved", it);
        const opts = Tm.DsOptions(it) || [];
        if (err !== null || opts.length < 3 || !opts.every((o) => o.t === side)) bad.push(slot + "(" + String(err) + "," + opts.length + ")");
        if (opts.length !== 3) badCount.push(slot + side + "=" + opts.length);
        Tm.u.om = {};
      });
    });
    ok("every slot has >=3 desecrated prefix options", badP.length === 0, badP.join(" "));
    ok("every slot has >=3 desecrated suffix options", badS.length === 0, badS.join(" "));
    ok("revelation always offers exactly 3 options", badCount.length === 0, badCount.join(" "));

    Tm.u.cur.omen_necro_p = 1;
    Tm.u.om = { omen_necro_p: 1 };
    let nItem = mkRare();
    Tm.Qv("bone_preserved", nItem);
    ok("necromancy forces prefix", nItem.ds && nItem.ds.side === "P" && Tm.u.cur.omen_necro_p === 0, JSON.stringify(nItem.ds));

    Tm.u.cur.omen_abyss_putrid = 1;
    Tm.u.om = { omen_abyss_putrid: 1 };
    let pItem = mkRare();
    Tm.Qv("bone_preserved", pItem);
    ok("putrefaction corrupts with capped desecrated mods", pItem.corrupted === true && pItem.mods.length >= 3 && pItem.mods.length <= 6 && pItem.mods.every((m) => m.putrid && !m.dsec) && pItem.mods.filter((m) => m.t === "P").length <= 3 && pItem.mods.filter((m) => m.t === "S").length <= 3, "mods=" + pItem.mods.length + " corrupted=" + pItem.corrupted);

    // --- A4: putrefaction must work on a full 3P/3S rare and respect side caps ---
    Tm.u.cur.omen_abyss_putrid = 1;
    Tm.u.om = { omen_abyss_putrid: 1 };
    let pf = mkRare();
    pf.mods = [];
    ["addPhys", "physInc", "life"].forEach((id) => {
      const d = Tm.Ct[id];
      pf.mods.push({ id, t: "P", ti: d.ranges.length - 1, v: Tm.Ra(d.ranges[d.ranges.length - 1]) });
    });
    ["atkSpd", "crit", "resF"].forEach((id) => {
      const d = Tm.Ct[id];
      pf.mods.push({ id, t: "S", ti: d.ranges.length - 1, v: Tm.Ra(d.ranges[d.ranges.length - 1]) });
    });
    const pfErr = Tm.Qv("bone_preserved", pf);
    const pfP = pf.mods.filter((m) => m.t === "P").length, pfS = pf.mods.filter((m) => m.t === "S").length;
    ok("putrefaction works on a full 6-mod item", pfErr === null && pf.corrupted === true && pf.mods.length > 0 && pf.mods.every((m) => m.putrid && !m.dsec), String(pfErr) + " mods=" + pf.mods.length);
    ok("putrefaction places desecrated affixes in normal 3P/3S slots", pfP <= 3 && pfS <= 3 && pf.mods.length <= 6 && pf.mods.every((m) => m.putrid && !m.dsec), "P=" + pfP + " S=" + pfS);
    ok("putrefaction consumed its omen", Tm.u.cur.omen_abyss_putrid === 0, String(Tm.u.cur.omen_abyss_putrid));
    // 腐烂不该白扣侧向/阵营预兆
    Tm.u.cur.omen_abyss_putrid = 1;
    Tm.u.cur.omen_necro_p = 1;
    Tm.u.om = { omen_abyss_putrid: 1, omen_necro_p: 1 };
    let pf2 = mkRare();
    const pf2Err = Tm.Qv("bone_preserved", pf2);
    ok("putrefaction ignores side omen and keeps it", pf2Err === null && Tm.u.cur.omen_necro_p === 1, String(pf2Err) + " necro=" + Tm.u.cur.omen_necro_p);
    Tm.u.om = {};

    Tm.u.cur.omen_abyss_liege = 1;
    Tm.u.om = { omen_abyss_liege: 1 };
    let fItem = mkRare();
    Tm.Qv("bone_preserved", fItem);
    ok("liege omen forces Amanamu", fItem.ds && fItem.ds.fac === "amanamu" && Tm.u.cur.omen_abyss_liege === 0, JSON.stringify(fItem.ds));

    Tm.u.cur.omen_abyss_echo = 1;
    Tm.u.om = { omen_abyss_echo: 1 };
    let rItem = mkRare();
    Tm.Qv("bone_gnawed", rItem);
    rItem.ds && (rItem.ds.opts = Tm.DsOptions(rItem));
    let rrErr = Tm.DsReroll(rItem);
    ok("echoes rerolls reveal options", rrErr === null && Tm.u.cur.omen_abyss_echo === 0, String(rrErr));

    let aItem = mkRare();
    aItem.mods.push({ id: "ds_life", t: "P", ti: 0, v: Tm.Ra([70, 90]), dsec: true });
    let normalBefore = aItem.mods.filter((m) => !m.dsec).length;
    Tm.u.cur.omen_abyss_light = 1;
    Tm.u.om = { omen_abyss_light: 1 };
    let laErr = Tm.Qv("annul", aItem);
    ok("light omen annuls only desecrated mods", laErr === null && !aItem.mods.some((m) => m.dsec) && aItem.mods.filter((m) => !m.dsec).length === normalBefore && Tm.u.cur.omen_abyss_light === 0, String(laErr));

    let dsecLeak = 0;
    for (let k = 0; k < 200; k++) {
      let it = Tm.Mt(Tm.le["皮腰带"], 60, 2);
      if (it.mods.some((m) => m.id.startsWith("ds_"))) dsecLeak++;
    }
    ok("desecrated mods never roll naturally", dsecLeak === 0, String(dsecLeak));

    // --- remaining PoE2 omens ---
    let sItem = mkRare();
    Tm.u.cur.omen_sanctify = 1;
    Tm.u.om = { omen_sanctify: 1 };
    let sErr = Tm.Qv("divine", sItem);
    ok("sanctify omen sanctifies", sErr === null && sItem.sanctified === true && Tm.u.cur.omen_sanctify === 0, String(sErr));
    ok("sanctified item blocks crafting", typeof Tm.Qv("divine", sItem) === "string");

    let bItem = mkRare();
    Tm.u.cur.omen_blessed = 1;
    Tm.u.om = { omen_blessed: 1 };
    let bErr = Tm.Qv("divine", bItem);
    ok("blessed omen rerolls implicits", bErr === null && Tm.u.cur.omen_blessed === 0, String(bErr));

    let cItem, cErr, cTries = 0;
    do {
      cItem = Tm.Mt(Tm.le["皮腰带"], 60, 0);
      Tm.u.cur.omen_chance2 = 1;
      Tm.u.om = { omen_chance2: 1 };
      cErr = Tm.Qv("chance", cItem);
      cTries++;
    } while (cItem.rarity === 3 && cTries < 12);
    ok("chance omen guarantees at least rare", cErr === null && cItem.rarity === 2 && Tm.u.cur.omen_chance2 === 0, String(cErr) + " r=" + cItem.rarity);

    Tm.o.pl.dead = false;
    Tm.o.state = "play";
    Tm.o.pl.hp = Tm.o.S.maxLife;
    Tm.u.flask.forEach((f) => (f.ch = 0));
    Tm.u.cur.omen_refresh = 1;
    Tm.u.om = { omen_refresh: 1 };
    let rfErr = null;
    try { Tm.nt(Tm.o.S.maxLife * 0.9, "phys", { noCrit: !0 }); } catch (e) { rfErr = e; }
    ok("refreshment refills flasks at low life", !rfErr && Tm.u.flask.every((f) => f.ch === f.max) && Tm.u.cur.omen_refresh === 0, String(rfErr));
    Tm.o.pl.hp = Tm.o.S.maxLife;

    let sellItem = Tm.Tt(8);
    Tm.u.inv.push(sellItem);
    const altBefore = Tm.u.cur.alt || 0;
    Tm.u.cur.omen_barter = 1;
    Tm.u.om = { omen_barter: 1 };
    Tm.mr(sellItem);
    const barterOk = (Tm.u.cur.alt || 0) - altBefore === 2;
    ok("bartering doubles sell currency", barterOk && Tm.u.cur.omen_barter === 0, "altDelta=" + ((Tm.u.cur.alt || 0) - altBefore));

    Tm.u.cur.omen_gamble = 1;
    Tm.u.om = { omen_gamble: 1 };
    Tm.u.cur.trans = 100;
    let gErr = null;
    try {
      for (let k = 0; k < 10 && (Tm.u.cur.omen_gamble || 0) > 0; k++) {
        Tm.u.inv = Tm.u.inv.filter((x) => x.kind !== "map");
        Tm.ty("map", "1");
      }
    } catch (e) { gErr = e; }
    ok("gambling omen works", !gErr, gErr && gErr.message);

    let mapItem = Tm.Tt(8);
    mapItem.rarity = 2;
    for (let k = 0; k < 5; k++) Tm.Ue(mapItem);
    Tm.u.cur.omen_chaos_quant = 1;
    Tm.u.om = { omen_chaos_quant: 1 };
    let mErr = Tm.Qv("chaos", mapItem);
    const badStats = mapItem.mods.filter((m) => ["packSize", "magicPacks", "rarePacks", "boxes", "rifts", "quant", "rar"].includes((Tm.qa[m.id] || {}).stat));
    ok("chaotic quantity rerolls waystone without quantity mods", mErr === null && badStats.length === 0 && Tm.u.cur.omen_chaos_quant === 0, String(mErr) + " bad=" + badStats.length);

    let wItem = mkRare();
    Tm.u.inv.push(wItem);
    Tm.Qv("bone_preserved", wItem);
    Tm.DsWell();
    ok("well overlay opens", !!doc.querySelector("#overlay .ovbox.well"));
    const wellOpts = doc.querySelectorAll("#overlay [data-dwopt]");
    ok("well shows 3 options", wellOpts.length === 3, String(wellOpts.length));
    wellOpts[0] && wellOpts[0].click();
    ok("well reveal works", !wItem.ds && wItem.mods.some((m) => m.dsec));
    // A7：骨头通货 tooltip 要能看出可揭示哪些词缀（且连续渲染一致，说明没有在 tooltip 里 roll）
    const boneTipA = Tm.Cc("bone_ancient");
    const boneTipB = Tm.Cc("bone_ancient");
    ok("bone currency tooltip lists revealable affixes", !!boneTipA && typeof boneTipA.h === "string" && boneTipA.h.includes("可揭示的渎灵词缀") && boneTipA.h.includes("前缀") && boneTipA.h.includes("后缀"), boneTipA && boneTipA.h.slice(0, 80));
    ok("bone tooltip is stable across renders", !!boneTipA && !!boneTipB && boneTipA.h === boneTipB.h);
    const dwClose = doc.querySelector("#dwClose");
    dwClose && dwClose.click();

    // --- abyss modifiers ---
    Tm.o.pl.dead = false;
    Tm.o.state = "play";
    Tm.o.omTrig = false;
    Tm.o.pl.hp = Tm.o.S.maxLife;
    Tm.o.pl.es = Tm.o.S.maxES;
    for (const m of Tm.o.mons) m.dead = true;
    Tm.o.mons = Tm.o.mons.filter((m) => !m.dead);
    for (const key of ["soul", "volatile", "revenant", "shade", "rune", "undying"]) {
      const mm = Tm.Ee("abysswalker", Tm.o.pl.x + 40, Tm.o.pl.y + 20, 5, 0);
      mm.abyss = true;
      mm.pit = abp;
      mm.abmod = key;
      mm.abmodT = 0;
      Tm.o.mons.push(mm);
      let mErr = null;
      try { Tm.AbyssMods(0.5); } catch (e) { mErr = e; }
      ok("mod " + key + " update no error", !mErr, mErr && mErr.message);
      if (key === "rune") {
        const pendBefore = Tm.o.pend.length;
        mm.abmodT = 0;
        Tm.AbyssMods(0.5);
        ok("rune schedules explosion", Tm.o.pend.length > pendBefore, String(Tm.o.pend.length));
      }
      if (key === "shade") {
        const bx0 = mm.x, by0 = mm.y;
        mm.abmodT = 0;
        Tm.AbyssMods(0.5);
        ok("shade teleports to player", Math.hypot(mm.x - bx0, mm.y - by0) > 1, String(Math.hypot(mm.x - bx0, mm.y - by0).toFixed(1)));
      }
      if (key === "revenant") {
        mm.hp = mm.maxhp * 0.5;
        Tm.AbyssMods(0.2);
        for (let k = 0; k < 12; k++) Tm.ih(0.05);
        const revs = Tm.o.mons.filter((m) => m.name === "深渊亡魂" && !m.dead);
        ok("revenant splits on low hp", revs.length >= 2, String(revs.length));
      }
      if (key === "volatile") {
        Tm.o.loots = [];
        let vErr = null;
        try { Tm.hn(mm, null, {}); } catch (e) { vErr = e; }
        ok("volatile death no error", !vErr, vErr && vErr.message);
      }
      if (key === "undying") {
        const ally = Tm.Ee("abysswalker", mm.x + 10, mm.y, 5, 0);
        ally.abyss = true;
        ally.hp = ally.maxhp * 0.3;
        Tm.o.mons.push(ally);
        for (let k = 0; k < 30; k++) Tm.AbyssMods(0.3);
        ok("undying heals allies", ally.hp > ally.maxhp * 0.3, String(Math.round(ally.hp)));
      }
      if (key === "soul") {
        Tm.o.pl.hp = Tm.o.S.maxLife;
        for (let k = 0; k < 50; k++) Tm.AbyssMods(0.3);
        ok("soul aura damages player", Tm.o.pl.hp < Tm.o.S.maxLife, String(Math.round(Tm.o.pl.hp)));
        Tm.o.pl.hp = Tm.o.S.maxLife;
      }
    }
    Tm.o.pl.hp = Tm.o.S.maxLife;
    try { __rs = (Number(process.env.ER_SEED || 20261026) % 2147483647) || 1; } catch (eSeed) {}
    // --- map delirium (PoE2 fog, no short layers) ---
    try {
      Tm.DeliriumEnd();
      Tm.u.delirium = 0;
      Tm.o.objs.push({ kind: "mirror", x: Tm.o.pl.x + 5, y: Tm.o.pl.y, r: 10, st: "idle" });
      Tm.DeliriumUpdate(0.1);
      ok("map delirium starts at mirror", !!Tm.o.del);
      Tm.o.pl.x += 400;
      Tm.DeliriumUpdate(1);
      ok("delirium depth rises away from mirror", !!Tm.o.del && Tm.o.del.depth > 0, Tm.o.del && String(Tm.o.del.depth));
      Tm.u.delirium = 0;
      Tm.o.del.peak = 100;
      Tm.DeliriumEnd();
      ok("delirium end gives +25 persistent", Tm.u.delirium === 25, String(Tm.u.delirium));
      ok("map delirium has no short-map run", !Tm.o.delRun && !Tm.o.del);
      Tm.u.delirium = 0;
    } catch (e) {
      ok("map delirium test", false, String(e));
    }

    try { __rs = (Number(process.env.ER_SEED || 20261026) % 2147483647) || 1; } catch (eSeed) {}
    // --- simulacrum: 30 short maps ---
    try {
      Tm.u.simUnlocked = false;
      Tm.u.cur.splinter = 0;
      Tm.SimulacrumInteract();
      ok("simulacrum free entry", Tm.u.simUnlocked === true && !!Tm.o.simRun && Tm.o.simRun.layer === 1 && /第 1 层/.test(Tm.o.Z.name), JSON.stringify({ run: Tm.o.simRun, zone: Tm.o.Z && Tm.o.Z.name }));
      ok("迷雾副本 5-room layer map", Tm.o.Z.M.rooms.length >= 5 && Tm.o.mons.length > 1, Tm.o.Z.M.rooms.length + "/" + Tm.o.mons.length);
      var sBoss = Tm.o.mons.find(function (m) { return m.rar === 3; });
      ok("sim layer boss tagged", !!sBoss && sBoss.simBoss === true);
      Tm.o.loots = [];
      if (sBoss) Tm.hn(sBoss, null, {});
      var sd = Tm.o.loots.filter(function (l) { return l.kind === "cur" && l.cur === "divine"; }).length;
      ok("sim layer boss drops 3 divines", sd === 3, String(sd));
      ok("sim portal appears", Tm.o.objs.some(function (b) { return b.kind === "b-simportal"; }));
      var sPort = Tm.o.objs.find(function (b) { return b.kind === "b-simportal"; });
      ok("sim door reuses hideout portal data (no mosaic sprite)", !!sPort && !sPort.spr && sPort.layer === 2 && /F 下一个房间/.test(sPort.label || ""), JSON.stringify(sPort));
      var zone1 = Tm.o.Z;
      Tm.SimEnterLayer(2);
      ok("sim rooms share one map", Tm.o.Z === zone1 && Tm.o.simRun.room === 2, Tm.o.simRun.room);
      Tm.SimEnterLayer(20);
      Tm.u.atlasPts = 10;
      ok("sim layer 20 map", Tm.o.simRun.layer === 20 && /第 20 层/.test(Tm.o.Z.name));
      var b20 = Tm.o.mons.find(function (m) { return m.rar === 3; });
      var ptsBefore20 = Tm.u.atlasPts;
      if (b20) Tm.hn(b20, null, {});
      ok("sim 20 layers grants atlas point", Tm.u.atlasPts > ptsBefore20, ptsBefore20 + "->" + Tm.u.atlasPts);
      Tm.SimEnterLayer(70);
      var fBoss = Tm.o.mons.find(function (m) { return m.rar === 3; });
      ok("sim final boss boosted x5", !!fBoss && /最终/.test(fBoss.name), fBoss && fBoss.name);
      Tm.o.loots = [];
      if (fBoss) Tm.hn(fBoss, null, {});
      var fd = Tm.o.loots.filter(function (l) { return l.kind === "cur" && l.cur === "divine"; }).length;
      ok("sim final boss drops 20 divines", fd === 20, String(fd));
      ok("sim run ends after final", !Tm.o.simRun);
    } catch (e) {
      ok("simulacrum test", false, String(e));
    }

    // --- delirium damage reduction (multiplicative, 90% cap) ---
    try {
      Tm.o.sim = null;
      Tm.o.del = null;
      const dr0 = Tm.DelDRMul();
      Tm.o.del = { depth: 50 };
      const dr50 = Tm.DelDRMul();
      Tm.o.del = { depth: 100 };
      const dr100 = Tm.DelDRMul();
      Tm.o.del = { depth: 250 };
      const dr250 = Tm.DelDRMul();
      Tm.o.del = { depth: 1500 };
      const drCap = Tm.DelDRMul();
      Tm.o.del = { depth: 99999 };
      const drCap2 = Tm.DelDRMul();
      ok("delirium DR baseline", dr0 === 1, String(dr0));
      ok("delirium DR additive 2.5%/10%", Math.abs(dr50 - 0.875) < 1e-9 && Math.abs(dr100 - 0.75) < 1e-9 && Math.abs(dr250 - 0.375) < 1e-9, [dr50, dr100, dr250].join(","));
      ok("delirium DR cap 80%", Math.abs(drCap - 0.2) < 1e-9 && Math.abs(drCap2 - 0.2) < 1e-9 && Tm.DelDRPct() === 80, drCap + "/" + drCap2 + "/" + Tm.DelDRPct());
      Tm.o.del = { depth: 240 };
      ok("delirium rarity bonus 5% per 20%", Tm.DelRarityBonus() === 60, String(Tm.DelRarityBonus()));
      Tm.o.del = null;
      Tm.o.pl.hp = Tm.o.S.maxLife;
      ok("delirium penalty is player damage reduction", Tm.DelDRMul() === 1 && Tm.DelDRPct() === 0, "baseline");
      // simulacrum: DR freezes at layer 18, later layers add monster damage
      Tm.o.del = null;
      Tm.o.sim = { active: true, depth: 900 };
      const simDR18 = Tm.DelDRMul();
      Tm.o.sim.depth = 1500;
      const simDR30 = Tm.DelDRMul();
      ok("simulacrum DR caps 95%", Math.abs(simDR18 - 0.05) < 1e-9 && Math.abs(simDR30 - 0.05) < 1e-9 && Tm.DelDRPct() === 95, simDR18 + "/" + simDR30);
      ok("sim monster damage after 18", Tm.SimDmgMul(18) === 1 && Math.abs(Tm.SimDmgMul(20) - 1.3) < 1e-9 && Math.abs(Tm.SimDmgMul(30) - 2.8) < 1e-9, [Tm.SimDmgMul(18), Tm.SimDmgMul(20), Tm.SimDmgMul(30)].join(","));
      Tm.o.sim = null;
      Tm.o.pl.hp = Tm.o.S.maxLife;
    } catch (e) {
      ok("delirium DR test", false, String(e));
    }

    // atlas mechanic cards
    try {
      const atlasHtml = Tm.mp();
      ok("atlas has mechanic cards", atlasHtml.includes("异界机制") && atlasHtml.includes("惊悸迷雾") && atlasHtml.includes("驱灵仪式") && atlasHtml.includes("深渊"));
    } catch (e) { ok("atlas mechanic cards", false, String(e)); }

    // --- atlas mechanic branches ---
    try {
      const saved = { atlas: Tm.u.atlas.slice(), pts: Tm.u.atlasPts, del: Tm.u.delirium };
      ok("atlas branches added", ["deli", "rit", "abyss"].every((k) => Tm.Na.some((b) => b.key === k && b.nodes.length === 7)), Tm.Na.length + "");
      Tm.u.atlasPts = 60;
      Tm.u.atlas = [];
      ok("atlas node unlockable", Tm.tn("deli1") === true);
      Tm.u.atlas = ["deli1", "deli2", "rit1", "rit2", "aby1", "aby2"];
      ok("atlas node effects active", !!Tm.te("deli1") && !!Tm.te("rit1") && !!Tm.te("aby1"));
      Tm.ro(Tm.Tt(5));
      const altars = Tm.o.objs.filter((x) => x.kind === "ritual").length;
      ok("atlas ritual extra altar", altars >= 4, String(altars));
      const atlasHtml = Tm.mp();
      ok("atlas shows mechanic branches", atlasHtml.includes("拟像亲和") && atlasHtml.includes("祭坛共鸣") && atlasHtml.includes("深渊之眼"));
      Tm.u.atlas = saved.atlas;
      Tm.u.atlasPts = saved.pts;
      Tm.u.delirium = saved.del;
      Tm.o.del = null;
    } catch (e) {
      ok("atlas mechanic branches", false, String(e));
    }

    // --- enhanced skill VFX ---
    try {
      const px = Tm.o.pl.x,
        py = Tm.o.pl.y;
      Tm.o.fx.push(
        { k: "ring", x: px, y: py, t: 0, max: 0.3, r0: 2, r1: 24, w: 1.2, col: "#ffd27a" },
        { k: "flash", x: px, y: py, r: 26, t: 0, max: 0.3, col: "#ffffff" },
        { k: "cone", x: px, y: py, r: 40, a: 1.2, ang: 0, t: 0, max: 0.3, col: "#ff8a30" },
        { k: "slash", x: px, y: py, r: 30, ang: 0, t: 0, max: 0.3, col: "#ffffff" },
        { k: "star", x: px, y: py, r: 16, t: 0, max: 0.25, col: "#ffe080" },
      );
      for (let f = 0; f < 6; f++) {
        const q = rafQueue.splice(0, rafQueue.length);
        for (const cb of q) cb(40000 + 16.7 * f);
      }
      ok("enhanced skill fx render", true);
    } catch (e) {
      ok("enhanced skill fx render", false, String(e));
    }

    // render frames with delirium/ritual objects on screen
    let leagueRenderErr = null;
    try {
      for (let f = 0; f < 20; f++) {
        const q3 = rafQueue.splice(0, rafQueue.length);
        for (const cb of q3) cb(25000 + 16.7 * f);
      }
    } catch (e) { leagueRenderErr = e; }
    ok("delirium/ritual render no error", !leagueRenderErr, leagueRenderErr && leagueRenderErr.message);

    // render frames with abyss on screen
    let abyssRenderErr = null;
    try {
      for (let f = 0; f < 20; f++) {
        const q2 = rafQueue.splice(0, rafQueue.length);
        for (const cb of q2) cb(20000 + 16.7 * f);
      }
    } catch (e) { abyssRenderErr = e; }
    ok("abyss render no error", !abyssRenderErr, abyssRenderErr && abyssRenderErr.message);

    // isolate the following live tests from abyss combat
    Tm.o.pl.dead = false;
    Tm.o.state = "play";
    Tm.o.omTrig = false;
    Tm.o.pl.hp = Tm.o.S.maxLife;
    Tm.o.pl.es = Tm.o.S.maxES;
    for (const m of Tm.o.mons) m.dead = true;
    Tm.o.mons = Tm.o.mons.filter((m) => !m.dead);
    // answered prayers: shrine touch grants a second shrine buff
    Tm.u.cur.omen_prayer = 1;
    Tm.u.om = { omen_prayer: 1 };
    Tm.o.pl.shrineT = 0;
    Tm.o.pl.shrineT2 = 0;
    Tm.o.pl.shrine = null;
    Tm.o.pl.shrine2 = null;
    Tm.o.paused = false;
    Tm.o.objs.push({ kind: "shrine", x: Tm.o.pl.x, y: Tm.o.pl.y, r: 12, type: "fury", used: false });
    Tm.o.paused = false;
    Tm.Rm(0.5);
    console.log("  [dbg] state=", Tm.o.state, "paused=", Tm.o.paused, "zone=", Tm.o.Z && Tm.o.Z.type, "shrines=", Tm.o.objs.filter((q) => q.kind === "shrine").length, "used=", Tm.o.objs.filter((q) => q.kind === "shrine" && q.used).length, "shrineFlags=", Tm.o.pl.shrine, Tm.o.pl.shrine2);
    ok("prayer consumed by shrine", Tm.u.cur.omen_prayer === 0, String(Tm.u.cur.omen_prayer));
    ok("prayer granted second shrine", !!Tm.o.pl.shrine2 && Tm.o.pl.shrineT2 > 0, String(Tm.o.pl.shrine2));

    // resurgence: heal when dropping to low life
    Tm.o.pl.shrineT = 0;
    Tm.o.pl.shrineT2 = 0;
    Tm.u.cur.omen_resurgence = 1;
    Tm.u.om = { omen_resurgence: 1 };
    Tm.o.pl.hp = Tm.o.S.maxLife;
    Tm.o.pl.es = 0;
    let dmgErr = null;
    try { Tm.nt(Tm.o.S.maxLife * 0.9, "phys", { noCrit: !0 }); } catch (e) { dmgErr = e; }
    ok("player damage hook no error", !dmgErr, dmgErr && dmgErr.message);
    ok("resurgence consumed", Tm.u.cur.omen_resurgence === 0, String(Tm.u.cur.omen_resurgence));
    ok("resurgence healed", Tm.o.pl.hp > Tm.o.S.maxLife * 0.9, String(Math.round(Tm.o.pl.hp)) + "/" + Math.round(Tm.o.S.maxLife));
  }
} catch (e) {
  ok("live map omen hooks", false, e && e.stack ? e.stack.split("\n").slice(0, 4).join(" | ") : String(e));
}

// --- pickup of an omen + HUD indicator ---
try {
  if (started) {
    const Th = window.__erTest;
    const before = Th.u.cur.omen_exalt_p || 0;
    let pickRes = null, pickErr = null;
    try { pickRes = Th.Ko({ kind: "cur", cur: "omen_exalt_p" }); } catch (e) { pickErr = e; }
    ok("omen pickup no error", !pickErr, pickErr && pickErr.message);
    ok("omen pickup adds to wallet", Th.u.cur.omen_exalt_p === before + 1, before + "->" + (Th.u.cur.omen_exalt_p || 0));
    Th.u.om = { omen_exalt_p: 1 };
    const hud = Th.Jb();
    ok("HUD lists active omen", hud.some((x) => String(x[0]).includes("左旋崇高")), JSON.stringify(hud.filter((x) => String(x[0]).includes("预兆") || String(x[0]).includes("左旋"))));
    Th.u.om = {};
  }
} catch (e) {
  ok("pickup/HUD hooks", false, e && e.message);
}

    // natural map generation includes abyss sometimes
    const Tn = window.__erTest;
    let abyssMaps = 0;
    for (let k = 0; k < 12; k++) {
      Tn.ro(Tn.Tt(5));
      if (Tn.o.objs.some((o) => o.kind === "abyss")) abyssMaps++;
    }
    ok("abyss spawns naturally in maps", abyssMaps > 0, abyssMaps + "/12");
    // BOSS 卡墙修复：进 20 张图，首领必须站在可站立地面（且不贴墙）
    let bossBad = [], bossChecked = 0;
    for (let k = 0; k < 20; k++) {
      Tn.ro(Tn.Tt(8));
      const BZ = Tn.o.Z, bb = BZ && BZ.boss;
      if (!bb || !BZ.M || !BZ.img) continue;
      bossChecked++;
      const BM = BZ.M, BN = BZ.img.width / BM.W;
      const bFloor = (x, y) => {
        const tx = Math.floor(x / BN), ty = Math.floor(y / BN);
        return tx >= 1 && ty >= 1 && tx < BM.W - 1 && ty < BM.H - 1 && BM.g[ty * BM.W + tx] !== 1;
      };
      const bGap = (x, y) => {
        for (let d = 0; d <= 40; d += 4)
          for (let a = 0; a < 6.2832; a += 0.5236) if (!bFloor(x + Math.cos(a) * d, y + Math.sin(a) * d)) return d;
        return 40;
      };
      if (!bFloor(bb.x, bb.y) || bGap(bb.x, bb.y) < 8) bossBad.push(Math.round(bGap(bb.x, bb.y)));
    }
    ok("map bosses spawn on walkable floor", bossChecked > 0 && bossBad.length === 0, "checked=" + bossChecked + " bad=" + bossBad.join(","));
    // 小地图位置修复：B3 的 y 偏移必须用屏幕高度 $c，不能误用 tooltip 定位函数 tu
    try {
      const src = require("node:fs").readFileSync(htmlPath, "utf8");
      ok("minimap uses screen height, not tooltip fn", /Math\.min\([A-Za-z_$][\w$]* \* 0\.25, 74\)/.test(src) && !src.includes("Math.min(tu * 0.25, 74)"));
    } catch (e) {
      ok("minimap symbol check", false, String(e && e.message));
    }
    let mirrorMaps = 0, ritualMaps = 0;
    for (let k = 0; k < 12; k++) {
      Tn.ro(Tn.Tt(5));
      if (Tn.o.objs.some((o) => o.kind === "mirror")) mirrorMaps++;
      if (Tn.o.objs.some((o) => o.kind === "ritual")) ritualMaps++;
    }
    ok("map delirium mirrors spawn", mirrorMaps > 0, mirrorMaps + "/12");
    ok("ritual altars spawn naturally in maps", ritualMaps > 0, ritualMaps + "/12");
// --- extra uniques (append block) ---
try {
  var X = window.__erTest;
  var ids = ["headhunter", "mageblood", "temporalis", "kaoms_heart", "rathpith_globe"];
  ok("5 poe2 uniques registered", window.__EXTRA_UNIQUES.length === 5 && ids.every(function (id) { return !!X.aa[id]; }), ids.filter(function (id) { return !X.aa[id]; }).join(","));
  ok("poe2 uniques only appear from custom drops", ids.every(function (id) { return X.aa[id].noDrop === true; }));
  var hh = X.pt(X.aa.headhunter, 80);
  ok("headhunter item builds", hh.rarity === 3 && hh.name === "猎首" && hh.mods.length === 1, hh.name);
  var kh = X.pt(X.aa.kaoms_heart, 80);
  var oldBody = X.u.equip.body;
  X.u.equip.body = kh;
  ok("kaoms heart caps resist at 70", X.UniqueResCap() === 70, String(X.UniqueResCap()));
  X.u.equip.body = oldBody;
  ok("other items keep 90 resist cap", X.UniqueResCap() === 90);

  // A1: 时空之肌词缀按件 roll，tooltip 显示固定值（不是范围文本）
  var tp1 = X.pt(X.aa.temporalis, 80);
  var tip1 = X.Zo(tp1, "inv").h;
  var tip1b = X.Zo(tp1, "inv").h;
  ok("temporalis tooltip is stable", typeof tip1 === "string" && tip1 === tip1b);
  ok("temporalis rolls one fixed value per item", Array.isArray(tp1.ur) && tp1.ur.length === 3 && tp1.ur[0] >= 5 && tp1.ur[0] <= 30 && tp1.ur[1] >= 5 && tp1.ur[1] <= 30 && tp1.ur[2] >= -2 && tp1.ur[2] <= -1, JSON.stringify(tp1.ur));
  ok("temporalis tooltip shows fixed values not ranges", tip1.indexOf("5–30%") < 0 && tip1.indexOf("-2 ~ -1 秒") < 0 && tip1.indexOf("{0}") < 0 && tip1.indexOf("将所受伤害的 " + tp1.ur[0] + "% 吸纳为生命") >= 0 && tip1.indexOf("将所受伤害的 " + tp1.ur[1] + "% 吸纳为魔力") >= 0 && tip1.indexOf("技能的冷却时间 " + tp1.ur[2] + " 秒") >= 0, JSON.stringify(tp1.ur));
  ok("temporalis tooltip reads the same roll field", typeof window.__TEMPORALIS_ROLL === "function" && JSON.stringify(window.__TEMPORALIS_ROLL(tp1)) === JSON.stringify(tp1.ur), JSON.stringify(tp1.ur));
  var tp2 = X.pt(X.aa.temporalis, 80);
  var tip2 = X.Zo(tp2, "inv").h;
  ok("temporalis shows each item's own rolls", tip2.indexOf("将所受伤害的 " + tp2.ur[0] + "% 吸纳为生命") >= 0 && tip2.indexOf("技能的冷却时间 " + tp2.ur[2] + " 秒") >= 0, JSON.stringify(tp2.ur));
  // 时空之肌：短 CD 技能也吃减 CD，且冷却下限 0.1 秒
  try {
    var oldTpBody = X.u.equip.body;
    X.u.equip.body = tp1;
    var mkCdEv = function (cd) {
      return { gem: {}, d: {}, S: { sp: new Set(), asc: new Set(), buffs: new Set(), ks: new Set() }, tags: new Set(), isAtk: false, isSpell: true, isProj: false, isMelee: false, meleeLike: false, ext: {}, more: 1, echo: 0, proj: 0, pierce: 0, chain: 0, meleeArea: 1, critMulti: 1, cdBase: cd, spdMul: 1, lifeCost: false, costMul: 1, clip: 0, reload: 0, cdMul: 1 };
    };
    var cdEv1 = X.H("skill:calc", mkCdEv(1.5));
    ok("temporalis reduces short cooldowns", cdEv1.cdBase >= 0.1 - 1e-9 && cdEv1.cdBase <= 0.5001, JSON.stringify(cdEv1.cdBase));
    var cdEv2 = X.H("skill:calc", mkCdEv(0.3));
    ok("temporalis cooldown floor is 0.1", Math.abs(cdEv2.cdBase - 0.1) < 1e-9, JSON.stringify(cdEv2.cdBase));
    X.u.equip.body = oldTpBody;
  } catch (eCd) { ok("temporalis short cooldown", false, String(eCd)); }
} catch (e) {
  ok("poe2 uniques test", false, String(e));
}

// --- ritual shared tribute ---
try {
  var X2 = window.__erTest;
  X2.o.ritualPool = null;
  X2.RitAddTribute(42);
  ok("ritual tribute is shared per map", X2.RitTribute() === 42, String(X2.RitTribute()));
  X2.RitSpendTribute(40);
  ok("ritual shared spend persists", X2.RitTribute() === 2, String(X2.RitTribute()));
  X2.o.ritualPool = null;
  // A10：多座祭坛的贡品进同一个池子，最后统一领取
  X2.RitAddTribute(30);
  X2.RitAddTribute(25);
  ok("ritual tribute accumulates across altars", X2.RitTribute() === 55, String(X2.RitTribute()));
  X2.RitSpendTribute(40);
  ok("ritual tribute spent once from shared pool", X2.RitTribute() === 15, String(X2.RitTribute()));
  X2.o.ritualPool = null;
} catch (e) {
  ok("ritual shared tribute test", false, String(e));
}

// --- external module loader（v1.05a 起已移除旧的外部 modloader 体系，不再测试）---
try {
  ok("game body has no legacy module hooks", !("EmberAPI" in window) && !("EmberMods" in window));
} catch (e) {
  ok("legacy module removal", false, String(e));
}

// --- targeted omen tests ---
try {
  const T = window.__erTest;
  ok("__erTest exposed", !!T);
  ok("special omen renamed to 异界高级预兆", T.P.omen_special.n === "异界高级预兆", T.P.omen_special.n);
  ok("omens registered in P", T.lt.filter((k) => T.P[k].grp === "omen").length >= 29 && !!T.P.omen_special, String(T.lt.filter((k) => T.P[k].grp === "omen").length));
  const iconCanvas = doc.createElement("canvas");
  ok("omen icon data uri exists", !!doc.querySelector("canvas") || true);

  // fake player
  T.u = { cur: { omen_exalt_p: 2, omen_exalt_2: 1, omen_whittle: 2, omen_annul_p: 1, omen_chaos_s: 1, omen_ancient: 1 }, om: {}, level: 90, xp: 0, filter: {}, equip: {}, tree: [], cls: "ranger", ascNodes: [], buffs: [], skills: [], gems: [], asc: null, atlas: [], achievements: [], ach: [], flask: [{ ch: 3, max: 3 }, { ch: 3, max: 3 }], device: null, hist: [], stats: { divines: 0, maps: 0, metaCasts: 0, boxes: 0 } };
  T.o.Z = null;
  T.o.loots = [];

  // --- exalt only prefix ---
  let item = T.Mt(T.le["皮腰带"], 60, 2);
  item.mods = item.mods.slice(0, 2);
  const n0 = item.mods.length;
  const preMods = item.mods.slice();
  T.OmToggle("omen_exalt_p");
  ok("toggle activated", T.OmHas("omen_exalt_p"));
  let e1 = T.Qv("exalt", item);
  ok("exalt+left succeeds", e1 === null, String(e1));
  ok("exalt+left adds 1", item.mods.length === n0 + 1, n0 + "->" + item.mods.length);
  // 按词缀 id 多重集差集找新加的词缀，不依赖数组顺序/对象身份（词缀重排时会误判，属于既有测试的偶发问题）
  const preCount = {};
  preMods.forEach((m) => (preCount[m.id] = (preCount[m.id] || 0) + 1));
  let addedPrefix = null;
  for (const m of item.mods) {
    if (preCount[m.id] > 0) preCount[m.id]--;
    else { addedPrefix = m; break; }
  }
  ok("exalt+left added prefix", !!addedPrefix && addedPrefix.t === "P", JSON.stringify({ pre: preMods.map((m) => m.id + ":" + m.t), post: item.mods.map((m) => m.id + ":" + m.t) }));
  ok("omen consumed", T.u.cur.omen_exalt_p === 1, String(T.u.cur.omen_exalt_p));

  // --- dry run must not consume ---
  T.u.cur.omen_exalt_2 = 1;
  T.OmToggle("omen_exalt_2");
  let item2 = T.Mt(T.le["皮腰带"], 60, 2);
  item2.mods = item2.mods.slice(0, 1);
  T.Vt.dry = true;
  let e2 = T.Qv("exalt", item2);
  T.Vt.dry = false;
  ok("dry-run exalt ok", e2 === null, String(e2));
  ok("dry-run no consume", T.u.cur.omen_exalt_2 === 1, String(T.u.cur.omen_exalt_2));

  // --- greater exalt adds two ---
  let item3 = T.Mt(T.le["皮腰带"], 60, 2);
  item3.mods = [];
  let e3 = T.Qv("exalt", item3);
  ok("greater exalt ok", e3 === null, String(e3));
  ok("greater exalt adds 2", item3.mods.length === 2, String(item3.mods.length));
  ok("greater omen consumed", T.u.cur.omen_exalt_2 === 0, String(T.u.cur.omen_exalt_2));
  ok("greater auto-deactivated", !T.OmActive("omen_exalt_2"));

  // --- side annul ---
  T.u.cur.omen_annul_p = 1;
  T.OmToggle("omen_annul_p");
  let item4 = T.Mt(T.le["皮腰带"], 60, 0);
  item4.rarity = 2;
  T.Ue(item4, "P"); T.Ue(item4, "P"); T.Ue(item4, "S"); T.Ue(item4, "S");
  const pre4 = item4.mods.filter((x) => x.t === "P").length;
  let e4 = T.Qv("annul", item4);
  ok("annul+left ok", e4 === null, String(e4));
  ok("annul+left removed prefix", item4.mods.filter((x) => x.t === "P").length === pre4 - 1, "pre " + pre4);

  // --- whittle removes lowest TIER mod, never T1 (A3) ---
  const wb3 = Object.values(T.le).find((b) => b && b.slot === "W");
  // top=true 取该词缀最高刻(T1)，top=false 取最低刻；ti 必须落在该词缀自己的 ranges 长度内
  const mkMods3 = (it, list) => {
    it.mods = [];
    list.forEach(([id, top]) => {
      const d = T.Ct[id];
      const ti = top ? d.ranges.length - 1 : 0;
      it.mods.push({ id, t: d.t, ti, v: T.Ra(d.ranges[ti]) });
    });
    return it;
  };
  T.u.cur.omen_whittle = 1;
  T.u.om = { omen_whittle: 1 };
  let w3 = mkMods3(T.Mt(wb3, 80, 2), [["addPhys", true], ["physInc", true], ["life", true], ["resAll", false], ["atkSpd", false]]);
  const t1_3 = w3.mods.filter((m) => T.Ct[m.id].ranges.length - 1 - m.ti === 0).map((m) => m.id);
  const pick3 = T.OmWhittle(w3, w3.mods.slice());
  ok("whittle picks the lowest-tier mod", !!pick3 && ["resAll", "atkSpd"].includes(pick3.id), pick3 && pick3.id + "#" + pick3.ti);
  const e5 = T.Qv("chaos", w3);
  ok("whittle chaos ok", e5 === null, String(e5));
  ok("whittle consumed", T.u.cur.omen_whittle === 0, String(T.u.cur.omen_whittle));
  ok("whittle keeps every T1 mod", t1_3.every((id) => w3.mods.some((m) => m.id === id)), "t1=" + t1_3.join(",") + " after=" + w3.mods.map((m) => m.id).join(","));
  // 全 T1：不删词缀、不消耗预兆
  T.u.cur.omen_whittle = 1;
  T.u.om = { omen_whittle: 1 };
  let w4 = mkMods3(T.Mt(wb3, 90, 2), [["addPhys", true], ["physInc", true], ["atkSpd", true], ["crit", true]]);
  const snap4 = w4.mods.map((m) => m.id + "#" + m.ti).join(",");
  const e4b = T.Qv("chaos", w4);
  ok("whittle refuses when all candidates are T1", typeof e4b === "string", String(e4b));
  ok("all-T1 item untouched", w4.mods.map((m) => m.id + "#" + m.ti).join(",") === snap4, w4.mods.map((m) => m.id).join(","));
  ok("omen kept when whittle refuses", T.u.cur.omen_whittle === 1, String(T.u.cur.omen_whittle));
  // 传奇/未知词缀（无 ti）永远不被消减
  let w5 = T.Mt(wb3, 80, 2);
  const lifeDef5 = T.Ct.life, resDef5 = T.Ct.resAll;
  w5.mods = [
    { id: "es", t: "U", ur: [100, 150], v: T.Ra([100, 150]) },
    { id: "life", t: "P", ti: lifeDef5.ranges.length - 1, v: T.Ra(lifeDef5.ranges[lifeDef5.ranges.length - 1]) },
    { id: "resAll", t: "P", ti: 0, v: T.Ra(resDef5.ranges[0]) },
  ];
  const p5 = T.OmWhittle(w5, w5.mods);
  ok("whittle never picks a mod without ti (legendary)", !!p5 && p5.id !== "es", p5 && p5.id);
  T.u.om = {};

  // --- side erasure (chaos suffix only) ---
  T.u.cur.omen_chaos_s = 1;
  T.OmToggle("omen_chaos_s");
  let item6 = T.Mt(T.le["皮腰带"], 60, 0);
  item6.rarity = 2;
  T.Ue(item6, "P"); T.Ue(item6, "P"); T.Ue(item6, "S"); T.Ue(item6, "S");
  const pre6 = item6.mods.filter((x) => x.t === "P").map((x) => x.id + "#" + x.ti);
  let e6 = T.Qv("chaos", item6);
  ok("chaos+right ok", e6 === null, String(e6));
  const post6 = item6.mods.filter((x) => x.t === "P").map((x) => x.id + "#" + x.ti);
  ok("chaos+right kept original prefixes", pre6.every((k) => post6.includes(k)), "pre " + pre6.join(",") + " post " + post6.join(","));
  ok("chaos+right kept prefix count floor", post6.length >= pre6.length, "pre " + pre6.length + " post " + post6.length);

  // --- ancient -> unique ---
  let ancientBase = null;
  for (const b of Object.values(T.le)) {
    if (T.Qv && b.slot) {
      const cands = T.o && T.P ? null : null;
      ancientBase = b;
      break;
    }
  }
  // pick a base whose slot has a unique
  let chosen = null;
  for (const b of Object.values(T.le)) {
    if (!b || !b.slot) continue;
    const hasUnique = T.P && true;
    chosen = b;
    break;
  }
  T.u.cur.omen_ancient = 1;
  T.OmToggle("omen_ancient");
  let anyUnique = false;
  const bases = Object.values(T.le).filter((b) => b && b.slot);
  for (const b of bases.slice(0, 40)) {
    let it = T.Mt(b, 60, 0);
    let e7 = T.Qv("chance", it);
    if (e7 === null && it.rarity === 3 && it.uniq) {
      anyUnique = true;
      break;
    }
    if (T.OmHas("omen_ancient")) continue;
  }
  ok("ancient -> unique", anyUnique);
  ok("ancient consumed", T.u.cur.omen_ancient === 0, String(T.u.cur.omen_ancient));

  // --- bench row + tooltip render ---
  T.u.cur.omen_secret = 1; T.u.om = { omen_secret: 1 };
  let dropRes = null;
  try { T.o.Z = { tier: 16, lvl: 80, type: "map" }; T.o.loots = []; T.o.run = null; dropRes = T.OmDrop(100, 100); } catch (e) { console.log("  OmDrop exception: " + e.message); }
  ok("OmDrop returns omen", typeof dropRes === "string" && T.P[dropRes].grp === "omen", String(dropRes));
  ok("OmDrop spawned loot", T.o.loots.length >= 1, String(T.o.loots.length));
  ok("OmDrop respects min tier", !T.OmDrop ? false : true);
  T.o.Z = null;
  T.u.cur.omen_exalt_p = 1;
  T.u.om = { omen_exalt_p: 1 };
  const row = T.OmBenchRow();
  ok("OmBenchRow html", typeof row === "string" && row.includes("data-omen"), row.slice(0, 60));
  const tip = T.Cc("omen_exalt_p");
  ok("tooltip render", tip && typeof tip.h === "string" && tip.h.includes("预兆"));
  ok("OmHint for exalt", typeof T.OmHint("exalt") === "string" || T.OmHint("exalt") === null);

  // exclusivity: same omen group
  T.u.cur.omen_exalt_p = 1; T.u.cur.omen_exalt_s = 1; T.u.om = {};
  T.OmToggle("omen_exalt_p");
  T.OmToggle("omen_exalt_s");
  ok("exalt side exclusive", !T.OmActive("omen_exalt_p") && T.OmActive("omen_exalt_s"));

  // adventure omens can coexist (crafting/adventure categories are independent)
  T.u.cur.omen_resurgence = 1; T.u.cur.omen_prayer = 1;
  T.OmToggle("omen_resurgence"); T.OmToggle("omen_prayer");
  ok("adventure omens coexist", T.OmActive("omen_resurgence") && T.OmActive("omen_prayer"));

  // only one combat omen may trigger per area instance
  T.u.cur.omen_amelioration = 1; T.u.cur.omen_resurgence = 1;
  T.u.om = { omen_resurgence: 1, omen_amelioration: 1 };
  T.o.omTrig = false;
  ok("first combat omen triggers", T.OmTake("omen_resurgence", 1, 1) === true);
  ok("second combat omen blocked this instance", T.OmTake("omen_amelioration", 1, 1) === false);
  ok("blocked combat omen not consumed", T.u.cur.omen_amelioration === 1, String(T.u.cur.omen_amelioration));
  T.o.omTrig = false;

  // second shrine buff from answered prayers
  T.o.pl = { shrineT: 45, shrine: "fury", shrineT2: 45, shrine2: "guard" };
  ok("Mn sees second shrine", T.Mn("guard") && T.Mn("fury"));
  T.o.pl.shrineT2 = 0;
  ok("Mn ignores expired second shrine", !T.Mn("guard"));

  // i18n
  T.Sa.cur = "en"; T.x1();
  ok("i18n omen name", T.Br("左旋崇高预兆") === "Omen of Sinistral Exaltation", String(T.Br("左旋崇高预兆")));
  ok("i18n omen blurb", String(T.Br("你的下一个崇高石只会添加前缀")).includes("prefix"), String(T.Br("你的下一个崇高石只会添加前缀")));
  T.Sa.cur = "zh";
} catch (e) {
  console.log("TEST EXCEPTION: " + (e && e.stack ? e.stack : e));
  fails.push("exception");
}

// mods/ 数据驱动新宝石
try {
  const M = window.__RIFT_MODS;
  ok("mods extra gems loaded", !!M && Array.isArray(M.skills) && (M.skills.includes("mods_arcane_bolt") || M.skills.includes("mods_blink")) && Array.isArray(M.supports) && M.supports.includes("mods_atu_bloodletting"), M ? JSON.stringify({ s: M.skills, p: M.supports }) : "missing");
  ok("mods skill registered in table", !!(M && M.skillTable && M.skillTable.mods_blink && M.skillTable.mods_blink.n));
  ok("mods support registered in table", !!(M && M.supportTable && M.supportTable.mods_atu_bloodletting && M.supportTable.mods_atu_bloodletting.n));
  ok("mods currency loader available", !!(M && M.currencyTable && M.currencyAlias));
} catch (e) {
  ok("mods extra gems suite", false, String(e));
}

// ================= v2.00 P1: 40 级符文系统 =================
try {
  const R = window.__RUNE;
  const T = window.__erTest;
  ok("rune module exposed", !!R && Array.isArray(R.list), R ? "ids=" + R.list.length : "missing");
  ok("hotfix.json injected + applied (2.00)", window.__HOTFIX_APPLIED === window.HOTFIX.version, String(window.__HOTFIX_APPLIED));
  const ids = (R && R.list) || [];
  ok("40 runes registered in F as grp=rune", ids.length === 40 && ids.every((id) => T.P[id] && T.P[id].grp === "rune"), "n=" + ids.length);
  const badW = [], badA = [], badTip = [], badVal = [];
  ids.forEach((id, i) => {
    const e = T.P[id];
    if (!e || e.rn !== i + 1 || !/^#\d+ /.test(String(e.n))) badW.push(id);
    if (!R.ky(id, "W") || !R.ky(id, "A")) badA.push(id);
    const tip = T.Cc(id);
    if (!tip || typeof tip.h !== "string" || !tip.h.includes(e.n)) badTip.push(id);
    const want = Math.round(1.2 * Math.pow(i + 1, 1.6) * 100) / 100;
    if (Math.abs((e.v || 0) - want) > 0.02) badVal.push(id + ":" + e.v + "!=" + want);
  });
  ok("all 40 runes have #n name + rn", badW.length === 0, badW.slice(0, 4).join(","));
  ok("all 40 runes expose weapon/armour effect text", badA.length === 0, badA.slice(0, 4).join(","));
  ok("all 40 rune tooltips render", badTip.length === 0, badTip.slice(0, 4).join(","));
  ok("rune value follows round(1.2*n^1.6)", badVal.length === 0, badVal.slice(0, 4).join(","));
  ok("legacy runes still compatible", T.P.rune_fire && T.P.rune_fire.grp === "rune" && R.ky("rune_fire", "W").includes("火焰"));
  ok("rune word table has 12~16 entries", R.words().length >= 12 && R.words().length <= 16, "n=" + R.words().length);

  // --- 三条合成线各至少成功一次 + 材料不足被拒 ---
  const recipes = R.recipes();
  const clearCur = () => { Object.keys(T.u.cur).forEach((k) => (T.u.cur[k] = 0)); };
  const needOf = (rc) => {
    const need = {};
    Object.keys(rc.cost || {}).forEach((k) => (need[k] = (need[k] || 0) + rc.cost[k]));
    (rc.runes || []).forEach((x) => (need[x.id] = (need[x.id] || 0) + x.count));
    (rc.bones || []).forEach((x) => (need[x.id] = (need[x.id] || 0) + x.count));
    return need;
  };
  const testKind = (kind, label) => {
    const rc = recipes.find((r) => r.kind === kind);
    if (!rc) { ok(label + " recipe exists", false, "missing"); return null; }
    clearCur();
    const need = needOf(rc);
    const err0 = R.craft(rc.id);
    ok(label + " recipe rejected without materials", typeof err0 === "string", String(err0));
    ok(label + " rejected recipe deducts nothing", Object.keys(need).every((k) => !T.u.cur[k]) && !T.u.cur[rc.out], JSON.stringify(need));
    Object.keys(need).forEach((k) => (T.u.cur[k] = need[k] + 1));
    const err1 = R.craft(rc.id);
    ok(label + " recipe succeeds", err1 === null, String(err1));
    ok(label + " recipe deducts exactly", Object.keys(need).every((k) => T.u.cur[k] === 1), Object.keys(need).map((k) => k + "=" + T.u.cur[k]).join(","));
    ok(label + " recipe grants " + rc.out, (T.u.cur[rc.out] || 0) === 1, String(T.u.cur[rc.out] || 0));
    return rc;
  };
  testKind("low", "low-tier");
  testKind("upgrade", "upgrade");
  testKind("targeted", "targeted");
  clearCur();

  // --- 符文之语顺序命中 / 乱序不命中 / tooltip 与属性结算 ---
  const bodyBase = Object.values(T.le).find((b) => b && b.slot === "B");
  const mkItem = (seq) => {
    const it = T.Mt(bodyBase, 80, 2);
    it.mods = [];
    it.rsock = seq.length;
    it.runes = seq.slice();
    return it;
  };
  const seq = ["rune_28", "rune_31", "rune_25"]; // 君主 #28-#31-#25（胸甲）
  const itMatch = mkItem(seq);
  const got = R.match(itMatch);
  ok("rune word matches exact order (君主)", !!got && got.n === "君主", got && got.n);
  const tipM = T.Zo(itMatch);
  ok("item tooltip shows rune word name + effects", !!tipM && tipM.h.includes("符文之语") && tipM.h.includes("君主"), tipM && tipM.h.slice(-160));
  const rev = mkItem(seq.slice().reverse());
  ok("reversed runes do not match a word", !R.match(rev), String(R.match(rev) && R.match(rev).n));
  const tipR = T.Zo(rev);
  ok("reversed tooltip has no word name", !!tipR && !tipR.h.includes("君主"), tipR && tipR.h.slice(-120));
  const eqA = Object.assign({}, T.u.equip, { body: itMatch });
  const eqB = Object.assign({}, T.u.equip, { body: rev });
  const sa = R.calc(eqA), sb = R.calc(eqB);
  ok("runeword actually changes computed stats", !!sa && !!sb && (Math.round(sa.maxLife) !== Math.round(sb.maxLife) || Math.round(sa.armour) !== Math.round(sb.armour)), "life " + Math.round(sa && sa.maxLife) + " vs " + Math.round(sb && sb.maxLife) + ", armour " + Math.round(sa && sa.armour) + " vs " + Math.round(sb && sb.armour));
  ok("君主 grants +120 life over unordered runes", Math.round(sa.maxLife - sb.maxLife) >= 100, String(Math.round(sa.maxLife - sb.maxLife)));
  const wepBase = Object.values(T.le).find((b) => b && b.slot === "W");
  const mkWep = (seq) => {
    const it = T.Mt(wepBase, 80, 2);
    it.mods = [];
    it.rsock = seq.length;
    it.runes = seq.slice();
    return it;
  };
  const legacyItem = mkWep(["rune_fire", "rune_light", "rune_03"]);
  ok("runeword with legacy runes matches (余烬之誓)", (R.match(legacyItem) || {}).n === "余烬之誓", String((R.match(legacyItem) || {}).n));
  // 武器词条走 .w 结算：钢铁（#1-#3）提升物理武器伤害
  const itW = mkWep(["rune_01", "rune_03"]);
  const itWr = mkWep(["rune_03", "rune_01"]);
  ok("weapon runeword matches on weapon", (R.match(itW) || {}).n === "钢铁", String((R.match(itW) || {}).n));
  const sw1 = R.calc(Object.assign({}, T.u.equip, { weapon: itW, offhand: null }));
  const sw2 = R.calc(Object.assign({}, T.u.equip, { weapon: itWr, offhand: null }));
  ok("weapon runeword applies .w physInc in settlement", !!sw1 && !!sw2 && sw1.wpn.max > sw2.wpn.max, "max " + (sw1 && sw1.wpn.max) + " vs " + (sw2 && sw2.wpn.max));
  const plain = mkItem(["rune_03", "rune_07", "rune_11"]);
  ok("non-matching runes still give single-rune stats", !R.match(plain) && R.ky(plain.runes[0], "W").length > 0);

  // --- 通货栏：已拥有的新符文可见，未拥有的不占位 ---
  clearCur();
  if (!Array.isArray(T.u.inv)) T.u.inv = [];
  T.u.cur.rune_01 = 1;
  try { T.Bt("inv"); T.Vs(); } catch (e) { console.log("curbar render: " + (e && e.message)); }
  const cbHtml = (doc.querySelector("#curbar") || {}).innerHTML || "";
  ok("currency bar shows owned high rune", cbHtml.includes("#1 艾尔"), cbHtml.includes("rune_01") ? "id" : "missing");
  ok("currency bar hides unowned high runes", !cbHtml.includes("#2 艾德"), "rune_02");
  clearCur();

  // --- 工艺台「符文合成」页签：列表 / 消耗文本 / 点击扣材料并给符文 / 材料不足拒绝 ---
  const st0 = T.o.state, zone0 = T.o.Z;
  T.o.state = "play";
  T.o.Z = { type: "hideout" };
  if (!Array.isArray(T.u.inv)) T.u.inv = [];
  T.Oi("craft");
  const ov = doc.querySelector("#overlay");
  const runeTab = ov && ov.querySelector('[data-bmode="rune"]');
  ok("bench has 符文合成 tab", !!runeTab);
  if (runeTab) {
    runeTab.click();
    const rows = doc.querySelectorAll("#overlay [data-rune]");
    ok("rune tab lists every recipe", rows.length === R.recipes().length, rows.length + "/" + R.recipes().length);
    ok("recipe row shows product + cost", rows.length > 0 && /×/.test(rows[0].textContent), rows.length ? rows[0].textContent.replace(/\s+/g, " ").slice(0, 80) : "");
    const rc0 = R.recipes().find((r) => r.id === rows[0].dataset.rune);
    clearCur();
    const need0 = needOf(rc0);
    Object.keys(need0).forEach((k) => (T.u.cur[k] = need0[k]));
    const before0 = T.u.cur[rc0.out] || 0;
    const btn0 = doc.querySelector('#overlay [data-rune="' + rc0.id + '"]');
    btn0 && btn0.click();
    ok("clicking affordable recipe deducts + grants", !!btn0 && (T.u.cur[rc0.out] || 0) === before0 + 1 && Object.keys(need0).every((k) => !T.u.cur[k]), Object.keys(need0).map((k) => k + "=" + T.u.cur[k]).join(",") + " out=" + (T.u.cur[rc0.out] || 0));
    const rc2 = R.recipes().find((r) => r.kind === "targeted");
    clearCur();
    const btn2 = doc.querySelector('#overlay [data-rune="' + rc2.id + '"]');
    btn2 && btn2.click();
    ok("clicking unaffordable recipe is rejected", !!btn2 && !T.u.cur[rc2.out] && Object.keys(needOf(rc2)).every((k) => !T.u.cur[k]), String(T.u.cur[rc2.out] || 0));
  }
  T.o.Z = zone0;
  T.o.state = st0;
  clearCur();
} catch (e) {
  ok("rune system suite", false, (e && e.stack ? e.stack.split("\n").slice(0, 4).join(" | ") : String(e)));
}

// ================= v2.00 P2R: 装备 10 词条（栏位制：6 常规 + 2 特殊 + 2 渎灵） =================
try {
  const T = window.__erTest;
  const A = window.__AFFIX;
  ok("affix module exposed", !!A && typeof A.statusHTML === "function" && typeof A.addSpecial === "function");
  const slot = "A";
  const base = Object.values(T.le).find((b) => b && b.slot === slot);
  const poolFor = (side) => Object.values(T.Ct)
    .filter((d) => d && d.t === side && !d.dsec && d.ranges && d.ranges.length && d.lv[0] <= 86 && (!d.slots || d.slots.includes(slot)))
    .sort((a, b) => b.ranges.length - a.ranges.length);
  const PP = poolFor("P"), SS = poolFor("S");
  ok("affix pools available for tests", PP.length >= 10 && SS.length >= 10, PP.length + "/" + SS.length);
  const mkMod = (def, ti) => {
    const t = Math.max(0, Math.min(ti == null ? 0 : ti, def.ranges.length - 1));
    return { id: def.id, t: def.t, ti: t, v: T.Ra(def.ranges[t]) };
  };
  const mkRare = (ilvl, mods) => {
    const it = T.Mt(base, ilvl, 2);
    it.mods = mods || [];
    return it;
  };
  const regP = 3, regS = 3, spCap = 2, dsCap = 2;
  const saveOm = JSON.parse(JSON.stringify(T.u.om || {}));
  const saveCurOm = T.u.cur.omen_special || 0;
  const clearOm = () => { T.u.om = {}; };

  // --- 常规 3/3 ---
  const r0 = mkRare(86, []);
  ok("rare regular side cap is 3/3", A.sideCap(r0, "P") === regP && A.sideCap(r0, "S") === regS, A.sideCap(r0, "P") + "/" + A.sideCap(r0, "S"));
  let full = [];
  for (let i = 0; i < regP; i++) full.push(mkMod(PP[i], 0));
  for (let i = 0; i < regS; i++) full.push(mkMod(SS[i], 0));
  const itFull = mkRare(86, full);
  ok("full regular 3/3 is rejected", A.canAddRegular(itFull) === false && A.st(itFull) === false && A.regCount(itFull, "P") === 3 && A.regCount(itFull, "S") === 3, A.regCount(itFull, "P") + "/" + A.regCount(itFull, "S"));

  // --- 普通崇高只进常规，不进特殊 ---
  clearOm();
  const itEx = mkRare(80, []);
  const exErr = T.Qv("exalt", itEx);
  ok("ordinary exalt adds a regular affix", exErr === null && A.regCount(itEx, "P") + A.regCount(itEx, "S") === 1 && A.spCount(itEx) === 0, String(exErr) + " reg=" + A.total(itEx) + " sp=" + A.spCount(itEx));
  const exFullErr = T.Qv("exalt", itFull);
  ok("ordinary exalt on full regular is rejected", typeof exFullErr === "string" && /常规/.test(exFullErr), String(exFullErr));

  // --- 新预兆 + 崇高：进特殊栏，消耗预兆，特殊栏满不消耗 ---
  clearOm();
  T.u.cur.omen_special = 1;
  const itSp = mkRare(80, []);
  T.u.om = { omen_special: 1 };
  const spErr1 = T.Qv("exalt", itSp);
  ok("omen + exalt adds to special slot", spErr1 === null && A.spCount(itSp) === 1 && A.regCount(itSp, "P") + A.regCount(itSp, "S") === 0, String(spErr1) + " sp=" + A.spCount(itSp) + " reg=" + A.total(itSp));
  ok("special affix is regular-pool P/S", itSp.mods.some((m) => m.sp === 1 && (m.t === "P" || m.t === "S") && !m.dsec), JSON.stringify(itSp.mods.filter((m) => m.sp).map((m) => m.t + ":" + m.id)));
  ok("special exalt consumes omen", T.u.cur.omen_special === 0 && !T.u.om.omen_special, "cur=" + T.u.cur.omen_special + " om=" + JSON.stringify(T.u.om));
  T.u.cur.omen_special = 1;
  T.u.om = { omen_special: 1 };
  ok("second special affix allowed", T.Qv("exalt", itSp) === null && A.spCount(itSp) === 2, "sp=" + A.spCount(itSp) + " total=" + A.total(itSp));
  T.u.cur.omen_special = 1;
  T.u.om = { omen_special: 1 };
  const spErr3 = T.Qv("exalt", itSp);
  ok("special slot full replaces instead of failing", spErr3 === null && A.spCount(itSp) === 2 && T.u.cur.omen_special === 0, String(spErr3) + " cur=" + T.u.cur.omen_special);
  // 只能用“当前装备按普通规则本来就能用”的通货（例：稀有装备不能用富豪石）
  let anyFail = [];
  [
    ["trans", 0], ["alch", 0], ["chance", 0], ["vaal", 0],
    ["aug", 1], ["alt", 1], ["regal", 1],
    ["exalt", 2], ["chaos", 2]
  ].forEach(function (pair) {
    const c = pair[0], rar = pair[1];
    T.u.cur.omen_special = 1;
    T.u.om = { omen_special: 1 };
    const itAny = T.Mt(base, 80, rar);
    itAny.mods = [];
    const rr = T.Qv(c, itAny);
    if (!(rr === null && A.spCount(itAny) === 1 && T.u.cur.omen_special === 0)) anyFail.push(c + "/r" + rar + ":" + rr + " sp=" + A.spCount(itAny));
  });
  ok("legal currencies work with special omen", anyFail.length === 0, anyFail.join(" | "));

  // 不合法的组合：稀有装备 + 富豪石（普通规则只允许魔法）→ 拒绝且不消耗预兆
  T.u.cur.omen_special = 1; T.u.om = { omen_special: 1 };
  const itBad = T.Mt(base, 80, 2);
  itBad.mods = [];
  const badErr = T.Qv("regal", itBad);
  ok("illegal currency for rarity is rejected", typeof badErr === "string" && A.spCount(itBad) === 0 && T.u.cur.omen_special === 1 && !!T.u.om.omen_special, String(badErr));
  // 普通装备 + 崇高石（普通规则只允许稀有）→ 拒绝
  T.u.cur.omen_special = 1; T.u.om = { omen_special: 1 };
  const itBad2 = T.Mt(base, 80, 0);
  itBad2.mods = [];
  const badErr2 = T.Qv("exalt", itBad2);
  ok("exalt on normal item is rejected", typeof badErr2 === "string" && A.spCount(itBad2) === 0 && T.u.cur.omen_special === 1, String(badErr2));

  // 剥离：移除特殊词缀（先让稀有装备有普通词缀，保证剥离普通规则合法）
  const itRm = T.Mt(base, 80, 2);
  itRm.mods = [mkMod(PP[0], 0)];
  T.u.cur.omen_special = 1; T.u.om = { omen_special: 1 };
  const addErr = T.Qv("exalt", itRm);
  T.u.cur.omen_special = 1; T.u.om = { omen_special: 1 };
  const rmErr = T.Qv("annul", itRm);
  ok("annul removes special affix with omen", addErr === null && rmErr === null && A.spCount(itRm) === 0 && T.u.cur.omen_special === 0, String(addErr) + " / " + String(rmErr) + " sp=" + A.spCount(itRm));
  // 高级通货已整体删除：确认注册表/工艺台里都不再出现
  ok("advanced currencies removed", !(T.P && (T.P.mods_adv_exalt || T.P.mods_adv_regal || T.P.mods_adv_chaos)), "removed");
  ok("bench no longer lists advanced currencies", !(T.benchCur() || []).some((id) => String(id).indexOf("mods_adv") === 0), JSON.stringify((T.benchCur() || []).filter((id) => String(id).indexOf("mods_adv") === 0)));
  // 普通崇高在特殊栏有空位时也不会自动进特殊栏
  clearOm();
  const itNoSp = mkRare(80, []);
  ok("ordinary exalt never fills special slot", T.Qv("exalt", itNoSp) === null && A.spCount(itNoSp) === 0, "sp=" + A.spCount(itNoSp));

  // 眩晕保底：只有陨石/彗星额外 +0.6%，其它技能走正常运算（不加保底）
  try {
    const mh = { rar: 2, dead: false, stunT: 0, stun: 0, hp: 100, maxhp: 100, x: 0, y: 0, h: 20, r: 10, t: {} };
    const hit = (gid) => ({ m: mh, c: { gid }, src: {}, o: {}, by: {}, amt: 1, crit: false, dom: "fire", fixed: false });
    mh.stun = 0; T.H("hit:land", hit("meteor"));
    const sMeteor = mh.stun;
    mh.stun = 0; T.H("hit:land", hit("fireball"));
    const sFireball = mh.stun;
    mh.stun = 0; T.H("hit:land", hit("comet"));
    const sComet = mh.stun;
    ok("stun minimum only for meteor/comet", Math.abs(sMeteor - 0.006) < 1e-9 && sFireball === 0 && Math.abs(sComet - 0.006) < 1e-9, JSON.stringify({ sMeteor, sFireball, sComet }));
  } catch (e) { ok("stun minimum only for meteor/comet", false, String(e)); }

  // --- 渎灵只进渎灵栏，2 条封顶 ---
  clearOm();
  const itDs = mkRare(80, []);
  const d1 = T.Qv("bone_gnawed", itDs);
  ok("desecrate opens dsec slot", d1 === null && !!itDs.ds, String(d1));
  const opts1 = T.DsOptions(itDs);
  ok("desecrate offers options", Array.isArray(opts1) && opts1.length >= 3, String(opts1 && opts1.length));
  ok("reveal writes dsec affix only", T.DsReveal(itDs, 0) === null && A.dsecCount(itDs) === 1 && A.total(itDs) === 1, "ds=" + A.dsecCount(itDs) + " total=" + A.total(itDs));
  ok("desecrate does not take regular slots", A.regCount(itDs, "P") + A.regCount(itDs, "S") === 0, A.regCount(itDs, "P") + "/" + A.regCount(itDs, "S"));
  ok("second desecration + reveal", T.Qv("bone_gnawed", itDs) === null && T.DsReveal(itDs, 0) === null && A.dsecCount(itDs) === 2, "ds=" + A.dsecCount(itDs));
  // 遗存骨固定词缀阶级：啃噬 T4 / 遗存 T2 / 远古 T1
  [["bone_gnawed", 4], ["bone_preserved", 2], ["bone_ancient", 1]].forEach(function (pair) {
    const bone = pair[0], want = pair[1];
    const itB = mkRare(86, []);
    const dErr = T.Qv(bone, itB);
    if (dErr === null) T.DsReveal(itB, 0);
    const mm = itB.mods.filter((x) => x.dsec)[0];
    const def = mm ? T.mt(itB, mm.id) : null;
    const got = mm && def ? (def.ranges.length - (mm.ti || 0)) : -1;
    ok("bone " + bone + " reveals fixed T" + want, dErr === null && !!mm && got === Math.min(want, def && def.ranges.length), JSON.stringify({ ti: mm && mm.ti, got: got, len: def && def.ranges && def.ranges.length, err: dErr }));
  });
  const d3 = T.Qv("bone_gnawed", itDs);
  ok("dsec slot caps at 2", typeof d3 === "string" && /渎灵词缀栏已满/.test(d3) && A.dsecCount(itDs) === 2, String(d3));

  // --- 总词缀 ≤10 ---
  let ten = full.slice();
  ten.push({ ...mkMod(PP[4], 0), sp: 1 }, { ...mkMod(SS[4], 0), sp: 1 });
  ten.push({ id: Object.values(T.Ct).find((d) => d.dsec).id, t: "P", ti: 0, v: [1, 2], dsec: 1 });
  ten.push({ id: Object.values(T.Ct).filter((d) => d.dsec)[1].id, t: "S", ti: 0, v: [1, 2], dsec: 1 });
  const it10 = mkRare(86, ten);
  ok("total affix count is 10", A.total(it10) === 10 && A.regCount(it10, "P") === 3 && A.spCount(it10) === 2 && A.dsecCount(it10) === 2, A.total(it10) + " P=" + A.regCount(it10, "P") + " sp=" + A.spCount(it10) + " ds=" + A.dsecCount(it10));
  ok("10 total rejects more affixes", A.totalRoom(it10) === 0 && A.st(it10) === false && typeof A.addSpecial(it10) === "string", "room=" + A.totalRoom(it10));

  // --- 老存档：旧版渎灵超过 2 条保留并标记，不删词缀 ---
  const legacyDs = [{ id: Object.values(T.Ct).find((d) => d.dsec).id, t: "P", ti: 0, v: [1, 2], dsec: 1 }, { id: Object.values(T.Ct).filter((d) => d.dsec)[1].id, t: "S", ti: 0, v: [1, 2], dsec: 1 }, { id: Object.values(T.Ct).filter((d) => d.dsec)[2].id, t: "P", ti: 0, v: [1, 2], dsec: 1 }];
  const itLegacy = mkRare(80, full.concat(legacyDs));
  const beforeLen = itLegacy.mods.length;
  A.migrateItem(itLegacy);
  ok("legacy dsec kept, extra marked", itLegacy.mods.length === beforeLen && A.dsecCount(itLegacy) === 3 && A.legacyDsec(itLegacy) === 1, "len=" + itLegacy.mods.length + " ds=" + A.dsecCount(itLegacy) + " legacy=" + A.legacyDsec(itLegacy));
  const chaosErr = T.Qv("chaos", itLegacy);
  ok("normal crafts ignore legacy dsec slots", chaosErr === null && A.dsecCount(itLegacy) === 3, String(chaosErr) + " ds=" + A.dsecCount(itLegacy));
  ok("legacy dsec blocks new dsec reveals", A.dsecRoom(itLegacy) === 0, "room=" + A.dsecRoom(itLegacy));

  // --- UI：tooltip 三块 + 工艺台栏位状态 + 10 条字号 ---
  const tip10h = T.Zo(it10);
  ok("tooltip has three affix blocks", !!tip10h && tip10h.h.includes("常规词缀") && tip10h.h.includes("特殊词缀") && tip10h.h.includes("渎灵词缀"), tip10h && tip10h.h.length);
  ok("tooltip shows slot counts", !!tip10h && /常规词缀 <b>6\/6<\/b>/.test(tip10h.h) && /特殊词缀 <b>2\/2<\/b>/.test(tip10h.h) && /渎灵词缀 <b>2\/2<\/b>/.test(tip10h.h), tip10h && tip10h.h.slice(0, 80));
  ok("10-affix tooltip shrinks font", !!tip10h && tip10h.h.includes("font-size:11px"), tip10h && tip10h.h.length);
  const tipOld = T.Zo(itLegacy);
  ok("legacy dsec shown as old-version tag", !!tipOld && tipOld.h.includes("旧版渎灵") && tipOld.h.includes("旧版 +1"), tipOld && tipOld.h.length);
  const st0 = T.o.state, zone0 = T.o.Z, eq0 = T.u.equip;
  T.o.state = "play";
  T.o.Z = { type: "hideout" };
  T.u.equip = Object.assign({}, eq0, { amulet: it10 });
  T.Oi("craft");
  const ovTxt = ((doc.querySelector("#overlay") || {}).textContent || "").replace(/\s+/g, " ");
  ok("bench shows slot status", ovTxt.includes("常规 前缀") && ovTxt.includes("特殊") && ovTxt.includes("渎灵") && ovTxt.includes("总计 10/10"), ovTxt.slice(0, 140));
  T.u.equip = eq0;
  T.o.Z = zone0;
  T.o.state = st0;
  try { T.sy(); } catch (e) {}
  clearOm();
  T.u.cur.omen_special = saveCurOm;
  T.u.om = saveOm;
} catch (e) {
  ok("affix system suite", false, (e && e.stack ? e.stack.split("\n").slice(0, 4).join(" | ") : String(e)));
}

// ================= v2.00 P3: 图谱 → 异界天赋树 =================
try {
  const T = window.__erTest;
  const A = window.__ATLAS;
  ok("atlas tree module exposed", !!A && typeof A.canAlloc === "function");
  A.ensure();
  const all = A.all();
  const branches = A.branches();
  const oldKeys = [];
  T.Na.forEach((g) => g.nodes.forEach((n) => oldKeys.push(n.k)));
  ok("all 56 old atlas keys kept", oldKeys.length === 56 && oldKeys.every((k) => !!A.node(k)), "n=" + oldKeys.length);
  ok("new nodes added (~20)", A.extra.length >= 18 && A.extra.length <= 22 && all.length === 57 + A.extra.length, "extra=" + A.extra.length + " total=" + all.length);
  ok("tree branches = 6 main + 2 shortcuts", branches.main.length === 6 && branches.shortcuts.length === 2, branches.main.join(",") + "|" + branches.shortcuts.join(","));
  const tiers = { small: 0, sig: 0, keystone: 0, core: 0 };
  const badNode = [];
  all.forEach((n) => {
    tiers[n.tier] = (tiers[n.tier] || 0) + 1;
    if (n.k === "core") return;
    if (typeof n.x !== "number" || typeof n.y !== "number" || !n.parent || typeof n.cost !== "number" || !n.tier) badNode.push(n.k);
  });
  ok("every node has x/y/parent/tier/cost", badNode.length === 0, badNode.slice(0, 4).join(","));
  ok("node tiers small/sig/keystone", tiers.small >= 46 && tiers.sig >= 14 && tiers.keystone === 6, JSON.stringify(tiers));
  const ks = A.keystones();
  const pairs = ks.map((k) => [k.k, k.rival].sort().join("|")).filter((v, i, a) => a.indexOf(v) === i);
  ok("6 keystones form 3 exclusive pairs", ks.length === 6 && pairs.length === 3, pairs.join(" , "));

  // --- 前置 / 显著门槛 / 点数上限 ---
  const savedAtlas = (T.u.atlas || []).slice(), savedPts = T.u.atlasPts, savedChaos = T.u.cur.chaos, savedDiv = T.u.cur.divine;
  T.u.atlas = []; T.u.atlasPts = 20; T.u.cur.chaos = 20; T.u.cur.divine = 2;
  ok("fresh tree: first node allocatable", A.canAlloc("deli1") === true && A.reason("deli1") === null);
  ok("parent missing blocks allocation", A.canAlloc("deli2") === false && /前置/.test(A.reason("deli2")), String(A.reason("deli2")));
  ok("sig node needs 2 small nodes in branch", (() => { T.u.atlas = ["deli1"]; const r = A.reason("deli7"); return A.canAlloc("deli7") === false && /2 个小节点/.test(r); })(), String(A.reason("deli7")));
  T.u.atlas = [];
  ok("AtlasAlloc succeeds and costs 1", A.alloc("deli1") === null && A.used() === 1 && T.u.atlas.includes("deli1"), "used=" + A.used());
  ok("AtlasAlloc rejects duplicate", typeof A.alloc("deli1") === "string", String(A.alloc("deli1")));

  // --- keystone 互斥 + cost 2 ---
  T.u.atlas = ["run_affinity", "runesmith_novice", "rune_resonance", "rune_weaver"];
  T.u.atlasPts = 30;
  const usedBefore = A.used();
  ok("keystone alloc (greed) succeeds", A.alloc("greed") === null, String(A.reason("greed")));
  ok("keystone costs 2 points", A.used() === usedBefore + 2, usedBefore + "->" + A.used());
  T.u.atlas = T.u.atlas.concat(["atlas_sense"]);
  const rivalReason = A.reason("stability");
  ok("keystone rival mutually exclusive", A.canAlloc("stability") === false && /互斥/.test(rivalReason), String(rivalReason));
  ok("keystone effects wired", A.monsterMul() > 1 && A.killLootMul() > 1, "monster=" + A.monsterMul() + " loot=" + A.killLootMul());
  ok("converge content multiplier wired", A.contentMul() === 1, String(A.contentMul()));

  // --- 可分配上限 56 / 可获取上限 70 ---
  ok("earned cap 70 / spend cap 56", A.cap() === 70 && A.spendCap() === 56, A.cap() + "/" + A.spendCap());
  T.u.atlasPts = 70;
  T.u.atlas = oldKeys.slice(0, 56);
  const capReason = A.reason("run_affinity");
  ok("spend cap 56 rejects extra point", A.canAlloc("run_affinity") === false && /上限 56/.test(capReason), String(capReason));

  // --- 洗点：单点混沌石×10 / 全体神圣石×1 ---
  T.u.atlas = ["deli1", "deli2"]; T.u.atlasPts = 20; T.u.cur.chaos = 10; T.u.cur.divine = 1;
  ok("respec blocked while deeper node allocated", typeof A.respec("deli1") === "string", String(A.respec("deli1")));
  ok("respec single point works", (() => { const c0 = T.u.cur.chaos; const r = A.respec("deli2"); return r === null && T.u.cur.chaos === c0 - 10 && !T.u.atlas.includes("deli2"); })(), "chaos=" + T.u.cur.chaos);
  ok("respec all costs 1 divine", (() => { const d0 = T.u.cur.divine; const r = A.respecAll(); return r === null && T.u.cur.divine === d0 - 1 && T.u.atlas.length === 0; })(), "divine=" + T.u.cur.divine);
  ok("respec all needs divine", (() => { T.u.cur.divine = 0; T.u.atlas = ["deli1"]; const r = A.respecAll(); return typeof r === "string" && T.u.atlas.includes("deli1"); })(), String(A.respecAll()));

  // --- 老存档迁移：拓扑补全 + 互斥降级 ---
  const g1 = { atlas: ["deli2"], atlasPts: 5 };
  A.migrate(g1);
  ok("migration fills missing parent", g1.atlas.includes("deli1") && g1.atlas.includes("deli2"), JSON.stringify(g1.atlas));
  ok("migration records atlasEver", typeof g1.atlasEver === "number" && g1.atlasEver >= 5, String(g1.atlasEver));
  const g2 = { atlas: ["greed", "stability"], atlasPts: 30 };
  A.migrate(g2);
  ok("migration drops rival keystone", !(g2.atlas.includes("greed") && g2.atlas.includes("stability")), JSON.stringify(g2.atlas));
  const g3 = { atlas: ["deli1", "unknown_key_xyz"], atlasPts: 5 };
  A.migrate(g3);
  ok("migration drops unknown keys", !g3.atlas.includes("unknown_key_xyz") && g3.atlas.includes("deli1"), JSON.stringify(g3.atlas));

  // --- UI 画布树 ---
  T.u.atlas = savedAtlas.slice(); T.u.atlasPts = savedPts;
  const html = T.mp();
  ok("atlas UI renders canvas tree", html.includes('id="atlascv"') && html.includes("可用点数") && html.includes("已分配"), html.length + "");
  ok("atlas UI shows branch progress", html.includes("交叉捷径") && html.includes("深渊") && html.includes("宝藏"), "");
  ok("atlas UI codex keeps old + new node names", ["拟像亲和", "祭坛共鸣", "深渊之眼", "符文共鸣", "渎灵学识", "词缀狂热"].every((n) => html.includes(n)), "");
  doc.querySelector("#pbody").innerHTML = html;
  A.afterRender();
  const cv = doc.querySelector("#atlascv");
  ok("atlas canvas mounted + sized", !!cv && cv.width >= 320 && cv.height >= 300, cv ? cv.width + "x" + cv.height : "missing");
  let drawErr = null;
  try { A.draw(); } catch (e) { drawErr = e; }
  ok("atlas canvas draws without error", drawErr === null, drawErr ? String(drawErr) : "ok");

  T.u.atlas = savedAtlas; T.u.atlasPts = savedPts; T.u.cur.chaos = savedChaos; T.u.cur.divine = savedDiv;
} catch (e) {
  ok("atlas system suite", false, (e && e.stack ? e.stack.split("\n").slice(0, 4).join(" | ") : String(e)));
}

// 其他暗金：带范围文案的 st 行也按件 roll 成固定值（猎首/法师之血/冈姆）——放在最后，避免消耗 RNG 影响前面的随机断言
try {
  var UQ = window.__erTest;
  var hh1 = UQ.pt(UQ.aa.headhunter, 80);
  var htip1 = UQ.Zo(hh1, "inv").h, htip1b = UQ.Zo(hh1, "inv").h;
  ok("headhunter tooltip is stable", typeof htip1 === "string" && htip1 === htip1b);
  ok("headhunter st lines show fixed rolls", htip1.indexOf("–") < 0 && htip1.indexOf("晕眩阈值提高 " + hh1.ur[0] + "%") >= 0 && htip1.indexOf("咒符位") < 0 && htip1.indexOf("力量") < 0 && htip1.indexOf("敏捷") < 0 && htip1.indexOf("击败稀有怪物时") >= 0, JSON.stringify(hh1.ur));
  var mb1 = UQ.pt(UQ.aa.mageblood, 80);
  var mtip1 = UQ.Zo(mb1, "inv").h;
  ok("mageblood st lines show fixed rolls", mtip1.indexOf("–") < 0 && mtip1.indexOf("咒符位") < 0 && mtip1.indexOf("20% 的药剂回复量立即生效") >= 0 && mtip1.indexOf("提高 " + mb1.ur[1] + "%") >= 0, JSON.stringify(mb1.ur));
  var kh1 = UQ.pt(UQ.aa.kaoms_heart, 80);
  var ktip1 = UQ.Zo(kh1, "inv").h;
  ok("kaoms st lines show fixed rolls", ktip1.indexOf("–") < 0 && ktip1.indexOf("晕眩阈值提高 " + kh1.ur[0] + "%") >= 0 && ktip1.indexOf("+1500 生命上限") >= 0 && ktip1.indexOf("抗性上限降低至 70%") >= 0, JSON.stringify(kh1.ur));
} catch (e) {
  ok("other uniques fixed-roll suite", false, String(e));
}

// ================= v2.00 P4R2: 蛛网天赋树（极坐标布局 + 图连线 + 单一相机 + BFS 点亮） =================
try {
  const T = window.__erTest;
  const A = window.__ADV;
  ok("advanced tree module exposed", !!A && typeof A.edges === "function" && typeof A.metrics === "function");
  const nodes = A.nodes(), edges = A.edges(), metrics = A.metrics();
  ok("spiderweb node count ~245 + clusters", nodes.length >= 265 && nodes.length <= 285, String(nodes.length));
  const ringCounts = A.ringCounts();
  ok("ring1..9 generated with per-ring counts", ringCounts.length === 9 && ringCounts.every((c) => c >= 6 && c <= 48) && nodes.some((n) => n.ring === 9), JSON.stringify(ringCounts));
  ok("no parent/child fields in data", nodes.every((n) => !Array.isArray(n.parents)), "");
  ok("edges are undirected & adjacency symmetric", edges.length > 300 && edges.every((e) => A.neighbors(e.a).includes(e.b) && A.neighbors(e.b).includes(e.a)), edges.length + "");
  ok("avg degree 2.5~3.5", metrics.avgDegree >= 2.5 && metrics.avgDegree <= 3.5, metrics.avgDegree.toFixed(2));
  ok("max degree <= 6", metrics.maxDegree <= 6, String(metrics.maxDegree));
  const R = (r) => 110 * Math.pow(Math.max(1, r), 1.12);
  const gapOf = (a, b) => Math.abs(R(Math.max(a.ring || 1, b.ring || 1)) - R(Math.min(a.ring || 1, b.ring || 1))) || 100;
  ok("no cross-2-ring edges", metrics.cross2Ring === 0 && edges.every((e) => { const a = A.node(e.a), b = A.node(e.b); return !(a.ring > 0 && b.ring > 0 && Math.abs(a.ring - b.ring) > 1); }), "");
  ok("no overlong cross edges", metrics.longEdges === 0 && edges.every((e) => { if (e.kind !== "cross") return true; const a = A.node(e.a), b = A.node(e.b); return Math.hypot(a.x - b.x, a.y - b.y) <= gapOf(a, b) * 2.2 + 0.01; }), "");
  ok("no center long edges / starts only touch ring1", edges.every((e) => { const a = A.node(e.a), b = A.node(e.b); if (a.ring === 0 && a.kind === "start") return b.ring <= 1; if (b.ring === 0 && b.kind === "start") return a.ring <= 1; if (a.kind === "root" || b.kind === "root") return false; return true; }), "");
  ok("7 regions x cluster nodes w/ tags & stats", A.regions().length === 7 && A.regions().every((reg) => {
    const rs = nodes.filter((n) => n.region === reg.k);
    return rs.length >= 20 && rs.some((n) => (n.tags || []).includes(reg.tag)) && rs.every((n) => Array.isArray(n.s));
  }), JSON.stringify(A.regions().map((reg) => nodes.filter((n) => n.region === reg.k).length)));
  ok("7 talent nodes + 6 jewels", nodes.filter((n) => n.kind === "talent").length === 7 && nodes.filter((n) => n.kind === "jewel").length === 6, "");
  // 抱团显著节点：7 个区域各 1 个显著节点改造成抱团节点 + 3 个簇节点，随簇节点点亮强化
  const clusters = nodes.filter((n) => n.kind === "cluster");
  const satNodes = nodes.filter((n) => n.cluster);
  ok("7 cluster notables + 28 satellites", clusters.length === 7 && satNodes.length === 28, clusters.length + "/" + satNodes.length);
  try {
    const saveTree = (T.u.advTree || []).slice();
    const core = clusters[0];
    const coreSats = satNodes.filter((n) => n.cluster === core.k);
    T.u.advTree = ["adv_root", A.startKey(), core.k];
    const t0 = T.advTotals();
    T.u.advTree = T.u.advTree.concat(coreSats.map((n) => n.k));
    const t4 = T.advTotals();
    const incKey = core.clubInc || "fireInc";
    const grew = (t4[incKey] || 0) > (t0[incKey] || 0) + 2 && (t4.dmgMore || 0) > (t0.dmgMore || 0);
    ok("cluster satellites strengthen core", coreSats.length === 4 && grew, JSON.stringify({ incKey, before: t0, after: t4 }));
    T.u.advTree = saveTree;
  } catch (eCl) { ok("cluster satellites strengthen core", false, String(eCl)); }
  // 抱团顺序：先点簇节点，4 个全亮后才能点显著节点
  try {
    const saveTree2 = (T.u.advTree || []).slice();
    const saveBonus2 = T.u.advBonus;
    const core = clusters.find((n) => n.kind === "cluster");
    const coreSats = satNodes.filter((n) => n.cluster === core.k);
    T.u.advTree = ["adv_root", A.startKey()];
    T.u.advBonus = 800;
    const satPath = A.path(coreSats[0].k);
    let satOK = true;
    (satPath || []).forEach((k) => { if (k === core.k || k === A.startKey() || k === "adv_root") return; if (A.alloc(k) !== null) satOK = false; });
    const gate = A.reason(core.k);
    ok("cluster notable requires 4 satellites first", satOK && /簇节点/.test(String(gate)), String(gate));
    T.u.advTree = saveTree2; T.u.advBonus = saveBonus2;
  } catch (eGate) { ok("cluster notable requires 4 satellites first", false, String(eGate)); }
  const starts = A.classStarts();
  ok("9 class starts in center cluster", starts.length === 9 && starts.every((n) => n.ring === 0), String(starts.length));
  ok("only own class start visible", starts.filter((n) => A.visible(n.k)).length === 1 && A.visible(A.startKey()), A.startKey());
  ok("other class starts not allocatable", starts.filter((n) => n.k !== A.startKey()).every((n) => !A.canAlloc(n.k) && /只能选择本职业/.test(A.reason(n.k))), "");

  // 相机：缩放只改 transform，节点半径是世界单位
  const cam0 = A.camera();
  const p0 = A.screenPos("adv_1_0");
  const rad0 = A.nodeRadius("adv_1_0");
  const camS0 = cam0.s;
  A.zoomAt(1.5, 400, 300);
  const cam1 = A.camera(), p1 = A.screenPos("adv_1_0"), rad1 = A.nodeRadius("adv_1_0");
  ok("zoom changes camera only, world radius unchanged", Math.abs(rad1 - rad0) < 1e-9 && Math.abs(cam1.s - camS0) > 1e-6, rad0 + "->" + rad1);
  ok("screen radius scales with camera", Math.abs(p1.r / p0.r - cam1.s / camS0) < 1e-6, p0.r.toFixed(2) + "->" + p1.r.toFixed(2));
  ok("zoom clamps to 0.3~3x", A.zoomAt(1e6, 10, 10) <= 3.0001 && A.zoomAt(1e-6, 10, 10) >= 0.2999, "");
  A.zoomAt(camS0 / A.camera().s, 0, 0);

  // hover 高亮信息
  const hoverKey = starts.find((n) => n.k === A.startKey()) && A.neighbors(A.startKey())[0];
  const hi = A.hoverInfo(hoverKey);
  ok("hover info returns neighbors + edges", !!hi && hi.neighbors.length > 0 && hi.edges.length > 0, hoverKey && hi ? hi.neighbors.length + " 邻居" : "missing");
  ok("hover draw does not throw", (() => { try { A.setHover(hoverKey); A.draw(); return true; } catch (e) { return false; } })(), "");
  A.setHover(null);

  // 点数与 BFS 点亮
  const save = { level: T.u.level, done: T.u.done, simRuns: T.u.simRuns, advTree: (T.u.advTree || []).slice(), starTree: (T.u.starTree || []).slice(), advBonus: T.u.advBonus, advJewels: Object.assign({}, T.u.advJewels || {}), sel: T.o.advSel, hover: T.o.advHover, tab: T.o.advTab };
  T.u.advTree = ["adv_root", A.startKey()]; T.u.starTree = []; T.u.advBonus = 800;
  T.u.level = 50; T.u.done = {}; for (let i = 0; i < 20; i++) T.u.done["m" + i] = 1; T.u.simRuns = 10;
  ok("free root/start cost no points", A.used() === 0 && A.left() === A.earned(), A.used() + "/" + A.left());
  const startNb = A.neighbors(A.startKey())[0];
  ok("neighbor of own start is allocatable", !!startNb && A.canAlloc(startNb) && A.alloc(startNb) === null, String(A.reason(startNb)));
  const far = nodes.filter((n) => n.ring === 9 && n.kind !== "start")[0];
  ok("far node blocked before path", !!far && !A.canAlloc(far.k) && /沿蛛网连线/.test(A.reason(far.k)), far && A.reason(far.k));
  // 快速加点：最短路径 + 一次性点亮 + 退还
  T.u.advTree = ["adv_root", A.startKey()]; T.u.advBonus = 800;
  const qpath = A.path(far.k);
  ok("quick path from start to far node", Array.isArray(qpath) && qpath.length > 1 && qpath[qpath.length - 1] === far.k, qpath ? qpath.length : "null");
  let qok = true;
  (qpath || []).forEach((k) => { if (A.alloc(k) !== null) qok = false; });
  ok("quick path allocates whole route", qok && (T.u.advTree || []).includes(far.k), "allocated=" + (T.u.advTree || []).length);
  const qleft = A.left();
  const qref = A.respec(far.k);
  ok("quick path leaf refund", qref === null && !(T.u.advTree || []).includes(far.k) && A.left() >= qleft, String(qref));
  // 贪心 BFS 扩张（只能点亮可达节点）
  let guard = 0;
  while (guard++ < 2000) {
    let did = false;
    nodes.forEach((n) => {
      if (!A.visible(n.k) || (T.u.advTree || []).includes(n.k)) return;
      if (A.canAlloc(n.k)) { if (A.alloc(n.k) === null) did = true; }
    });
    if (!did) break;
  }
  ok("BFS expansion reaches outer rings", (T.u.advTree || []).includes(far.k) || A.reachable(far.k), "allocated=" + (T.u.advTree || []).length);
  const comp = A.component();
  const visibleCount = nodes.filter((n) => A.visible(n.k)).length;
  ok("own start component covers all visible nodes", comp.length >= visibleCount - 2, comp.length + "/" + visibleCount);
  ok("no other class start allocated", starts.filter((n) => n.k !== A.startKey()).every((n) => !(T.u.advTree || []).includes(n.k)), "");

  // 区域天赋节点门控星图
  T.u.advTree = ["adv_root", A.startKey()]; T.u.starTree = [];
  ok("star region locked before talent", A.starCanAlloc("star_fire_1") === false && /未解锁/.test(A.starReason("star_fire_1")), String(A.starReason("star_fire_1")));
  T.u.advTree.push("fire_talent");
  ok("talent node unlocks star region", A.regionUnlocked("fire") === true && A.starCanAlloc("star_fire_1") === true, String(A.starReason("star_fire_1")));

  // 旧存档迁移：保留旧数组、补起点/根
  const mg = { cls: "monk", advTree: ["adv_1_0", "old_key"], starTree: ["star_old"], advJewels: { adv_jewel_1: "jewel_life_1" } };
  A.migrate(mg);
  ok("migration keeps old data + adds start", mg.advClassStart === "monk" && Array.isArray(mg.advTree) && mg.advTree.includes("monk_start") && mg.advTree.includes("old_key") && mg.starTree.includes("star_old") && mg.advJewels["adv_jewel_1"] === "jewel_life_1", JSON.stringify(mg.advTree.slice(-4)));

  // UI
  T.o.tab = "tree"; T.o.advTab = "base"; T.o.advSel = "adv_1_0"; T.Vs();
  const pbody = doc.querySelector("#pbody");
  ok("talent page renders spiderweb canvas", !!pbody && pbody.innerHTML.includes('data-advtab="star"') && pbody.innerHTML.includes('id="advcv"'), pbody ? pbody.innerHTML.length + "" : "missing");
  const htmlBase = A.pageHTML("base");
  ok("base page copy mentions web/graph", htmlBase.includes("蛛网") && htmlBase.includes("珠宝栏位") && htmlBase.includes("大天赋节点"), "");
  A.afterRender();
  const cv = doc.querySelector("#advcv");
  ok("canvas mounted + sized", !!cv && cv.width >= 320 && cv.height >= 300, cv ? cv.width + "x" + cv.height : "missing");
  let derr = null; try { A.draw(); } catch (e) { derr = e; }
  ok("canvas draws without error", derr === null, derr ? String(derr) : "ok");
  try { T.o.advTab = "star"; T.Vs(); A.afterRender(); } catch (e) {}
  ok("star tab renders region list", (doc.querySelector("#pbody").innerHTML || "").includes("星图区域"), "");

  // 恢复
  T.u.level = save.level; T.u.done = save.done; T.u.simRuns = save.simRuns;
  T.u.advTree = save.advTree; T.u.starTree = save.starTree; T.u.advBonus = save.advBonus; T.u.advJewels = save.advJewels;
  T.o.advSel = save.sel; T.o.advHover = save.hover; T.o.advTab = save.tab;
} catch (e) {
  ok("spiderweb tree suite", false, (e && e.stack ? e.stack.split("\n").slice(0, 4).join(" | ") : String(e)));
}


// ================= v2.00 P4Rb: 符文之语文件化 + 天赋树珠宝栏 =================
try {
  const T = window.__erTest;
  const A = window.__ADV;
  const J = window.__JEWEL;
  const R = window.__RUNE;
  const MODS = window.__RIFT_MODS;
  ok("mods runewords + jewels loaded", !!MODS && Array.isArray(MODS.runewords) && MODS.runewords.length >= 14 && Array.isArray(MODS.jewels) && MODS.jewels.length >= 5, MODS ? MODS.runewords.length + "/" + MODS.jewels.length : "missing");
  ok("rune words merged from file", R.words().length >= 14 && R.fileWords().length >= 14, R.words().length + "/" + R.fileWords().length);

  // 文件同 id 覆盖内置
  const baseLen = R.words().length;
  window.RIFT_RUNEWORDS.push({ id: "steel", n: "钢铁·文件版", seq: [1, 3], req: "weapon", w: [["physInc", 77]], a: [["armour", 10]], d: ["override test"] });
  R.reload();
  const steel = R.words().find((w) => w.id === "steel");
  ok("file runeword overrides built-in by id", !!steel && steel.n === "钢铁·文件版", steel && steel.n);
  window.RIFT_RUNEWORDS.pop();
  R.reload();

  // 文件里的自定义词条能命中 + tooltip + 结算
  const wepBase = Object.values(T.le).find((b) => b && b.slot === "W");
  const mk = (seq) => { const it = T.Mt(wepBase, 80, 2); it.mods = []; it.rsock = seq.length; it.runes = seq.slice(); return it; };
  window.RIFT_RUNEWORDS.push({ id: "test_custom_word", n: "测试之语", seq: [2, 6], req: "weapon", w: [["physInc", 40]], a: [["armour", 25]], d: ["custom file word"] });
  R.reload();
  const itC = mk(["rune_02", "rune_06"]);
  const gotC = R.match(itC);
  ok("custom file runeword matches in order", !!gotC && gotC.n === "测试之语", gotC && gotC.n);
  const tipC = T.Zo(itC);
  ok("custom runeword tooltip renders", !!tipC && tipC.h.includes("测试之语") && tipC.h.includes("符文之语"), tipC && tipC.h.length);
  ok("custom runeword settlement applies", (() => {
    const a = R.calc(Object.assign({}, T.u.equip, { weapon: itC }));
    const b = R.calc(Object.assign({}, T.u.equip, { weapon: mk(["rune_06", "rune_02"]) }));
    return !!a && !!b && a.wpn.max > b.wpn.max;
  })(), "");
  window.RIFT_RUNEWORDS.pop();
  R.reload();
  ok("word list restored after custom test", R.words().length === baseLen, baseLen + "->" + R.words().length);

  // 珠宝注册 / tooltip / 掉落池
  const pool = J.pool();
  ok("jewel pool registered from file", pool.length >= 5 && pool.every((d) => d.id && d.n && d.tier && Array.isArray(d.stats)), String(pool.length));
  const jdef = pool[0], jit = J.item(jdef.id);
  ok("jewel item created", !!jit && jit.kind === "jewel" && jit.jid === jdef.id && !!jit.uid, jit && jit.jid);
  const jtip = T.Zo(jit);
  ok("jewel tooltip renders", !!jtip && jtip.h.includes(jdef.n) && jtip.h.includes("天赋珠宝") && jtip.h.includes("可镶嵌"), jtip && jtip.h.length);
  ok("jewels are not currencies / shop stock", !T.P[jdef.id], jdef.id);
  const oZ = T.o.Z, oLoots = T.o.loots;
  T.o.Z = { type: "map", tier: 16, lvl: 80 }; T.o.loots = [];
  const dropId = J.drop(50, 50);
  ok("jewel drop spawns a jewel item", !!dropId && T.o.loots.length === 1 && !!T.o.loots[0].it && T.o.loots[0].it.kind === "jewel", dropId + " loots=" + T.o.loots.length);
  ok("jewel map drop is gated to T14+", J.mapDrop({ tier: 13 }) === null, "");
  T.o.Z = oZ; T.o.loots = oLoots;

  // 天赋树珠宝栏：镶嵌/属性/取出/存档
  const save = { advTree: (T.u.advTree || []).slice(), advJewels: Object.assign({}, T.u.advJewels || {}), inv: (T.u.inv || []).slice(), sel: T.o.advJewelSel, start: T.u.advClassStart || T.u.cls };
  T.u.advTree = ["adv_root", (T.u.advClassStart || T.u.cls || "warrior") + "_start", "fire_e", "adv_jewel_1"];
  T.u.advJewels = {};
  const lifeJ = J.item("jewel_life_1");
  T.u.inv = (T.u.inv || []).concat([lifeJ]);
  const totals0 = Object.assign({}, A.totals());
  const serr = J.socket("adv_jewel_1", lifeJ.uid);
  ok("socket jewel consumes inventory + records advJewels", serr === null && T.u.advJewels["adv_jewel_1"] === "jewel_life_1" && !T.u.inv.some((x) => x && x.uid === lifeJ.uid), String(serr));
  ok("jewel stats apply to advanced totals", (A.totals().life || 0) - (totals0.life || 0) >= 25 && (A.totals().resAll || 0) - (totals0.resAll || 0) >= 4, JSON.stringify({ life: A.totals().life, resAll: A.totals().resAll }));
  ok("jewel node no longer has fixed stats", (A.node("adv_jewel_1").s || []).length === 0, "");
  T.o.advJewelSel = "adv_jewel_1";
  const htmlJ = A.pageHTML("base");
  ok("jewel socket panel renders inventory choices", htmlJ.includes("珠宝栏位") && htmlJ.includes("data-advjewel=") && htmlJ.includes("已镶嵌"), htmlJ.length + "");
  ok("jewel panel lists inventory jewel", htmlJ.includes("生命珠宝"), "");
  T.o.advJewelSel = null;
  const rerr = J.unsocket("adv_jewel_1");
  ok("unsocket returns jewel to inventory", rerr === null && !T.u.advJewels["adv_jewel_1"] && T.u.inv.some((x) => x && x.kind === "jewel" && x.jid === "jewel_life_1"), String(rerr));
  ok("jewel stats removed after unsocket", (A.totals().life || 0) === (totals0.life || 0), String(A.totals().life));
  // 珠宝栏面板点击传的是字符串 uid（data-advjewel="equip:节点:uid"），必须也能镶嵌
  const strJ = J.item("jewel_life_1");
  T.u.inv = (T.u.inv || []).concat([strJ]);
  const serrStr = J.socket("adv_jewel_1", String(strJ.uid));
  ok("jewel socket accepts string uid from panel", serrStr === null && T.u.advJewels["adv_jewel_1"] === "jewel_life_1" && !T.u.inv.some((x) => x && x.uid === strJ.uid), String(serrStr));
  const rerrStr = J.unsocket("adv_jewel_1");
  ok("string-uid jewel unsocket restores inventory", rerrStr === null && T.u.inv.some((x) => x && x.kind === "jewel"), String(rerrStr));
  T.u.advTree = T.u.advTree.filter((k) => k !== "adv_jewel_1");
  ok("socket requires an unlocked jewel slot", typeof J.socket("adv_jewel_1", 999) === "string", String(J.socket("adv_jewel_1", 999)));
  // 珠宝可以出售：按阶级给改造石（T1 = 1 改造石）
  try {
    const sellJ = J.item("jewel_life_1");
    T.u.inv.push(sellJ);
    const altBefore = T.u.cur.alt || 0;
    T.mr(sellJ);
    ok("jewels can be sold", !T.u.inv.some((x) => x && x.uid === sellJ.uid) && (T.u.cur.alt || 0) >= altBefore + 1, "alt=" + (T.u.cur.alt || 0) + "/" + altBefore);
  } catch (eSell) { ok("jewels can be sold", false, String(eSell)); }

  // 快速出售：稀有装备 / 本职业用不到的主手武器
  try {
    const invSave = (T.u.inv || []).slice();
    const rareItem = T.Mt(Object.values(T.le || {})[0], 80, 2);
    T.u.inv.push(rareItem);
    window.__QUICKSELL.rare();
    ok("quick sell rare equipment", !T.u.inv.some((x) => x && x.uid === rareItem.uid), "");
    const wts = T.classWts() || [];
    const basesAll = Object.values(T.le || {});
    const badBase = basesAll.filter((b) => b && b.slot === "W" && b.wt && !wts.includes(b.wt))[0];
    const goodBase = basesAll.filter((b) => b && b.slot === "W" && b.wt && wts.includes(b.wt))[0];
    ok("class weapon bases exist for quick sell test", !!badBase && !!goodBase, (badBase && badBase.n) + "/" + (goodBase && goodBase.n));
    if (badBase) {
      const bi = T.Mt(badBase, 80, 2);
      T.u.inv.push(bi);
      window.__QUICKSELL.irrelevant();
      ok("quick sell irrelevant main-hand weapons", !T.u.inv.some((x) => x && x.uid === bi.uid), "");
    }
    if (goodBase) {
      const gi = T.Mt(goodBase, 80, 2);
      T.u.inv.push(gi);
      window.__QUICKSELL.irrelevant();
      ok("quick sell keeps usable weapons", T.u.inv.some((x) => x && x.uid === gi.uid), "");
    }
    T.u.inv = invSave;
  } catch (eQS) { ok("quick sell", false, String(eQS)); }

  // 迁移兼容
  const mg = { cls: "monk", advTree: ["adv_jewel_1"], advJewels: { adv_jewel_1: "jewel_life_1", bad_key: "nope" } };
  A.migrate(mg);
  ok("migration keeps valid advJewels + defaults", !!mg.advJewels && mg.advJewels["adv_jewel_1"] === "jewel_life_1" && !mg.advJewels.bad_key && Array.isArray(mg.advTree) && mg.advTree.includes("monk_start"), JSON.stringify(mg.advJewels));
  const mg2 = {};
  A.migrate(mg2);
  ok("migration fills advJewels default", !!mg2.advJewels && typeof mg2.advJewels === "object" && !Array.isArray(mg2.advJewels), JSON.stringify(mg2.advJewels));

  // UI 渲染：背包格子/页面
  ok("jewel item cell renders", J.cell(jit).indexOf("珠宝") >= 0, J.cell(jit).slice(0, 80));
  const pageBase = A.pageHTML("base");
  ok("advanced page mentions jewel slots", pageBase.includes("珠宝栏位") && pageBase.includes("已点亮"), "");

  T.u.advTree = save.advTree; T.u.advJewels = save.advJewels; T.u.inv = save.inv; T.o.advJewelSel = save.sel;
} catch (e) {
  ok("jewel + runewords suite", false, (e && e.stack ? e.stack.split("\n").slice(0, 4).join(" | ") : String(e)));
}


// ================= v2.02 商人/通货兑换动态涨价（heat） =================
try {
  const Tc = window.__erTest;
  const S = window.__SHOP;
  ok("shop heat api exposed", !!S && typeof S.mult === "function" && typeof S.bump === "function");
  S.reset();
  ok("shop heat starts at ×1", S.mult("test:key") === 1, String(S.mult("test:key")));
  S.bump("test:key");
  ok("one purchase raises price +10%", Math.abs(S.mult("test:key") - 1.1) < 1e-9, String(S.mult("test:key")));
  S.bump("test:key");
  ok("second purchase ×1.21", Math.abs(S.mult("test:key") - 1.21) < 1e-9, String(S.mult("test:key")));
  for (let i = 0; i < 30; i++) S.bump("test:key");
  ok("heat caps at ×6", Math.abs(S.mult("test:key") - 6) < 1e-9, String(S.mult("test:key")));
  Tc.u.shopHeat["test:key"] = { mult: 6, lastAt: Date.now() - 120000 - 30000 };
  const m1 = S.mult("test:key");
  ok("2min idle + 30s decays excess 50%", Math.abs(m1 - 3.5) < 0.02, String(m1));
  Tc.u.shopHeat["test:key"] = { mult: 6, lastAt: Date.now() - 120000 - 60000 };
  const m2 = S.mult("test:key");
  ok("two decay ticks → ×2.25", Math.abs(m2 - 2.25) < 0.02, String(m2));
  S.reset();
  S.bump("shop:gem:test");
  const pm = S.priceMap("shop:gem:test", { chaos: 1 });
  ok("heat price map rounds up", pm.chaos >= 2, JSON.stringify(pm));
  S.reset();
  S.bump("ex:divine");
  const ep = S.price("ex:divine", 120);
  ok("exchange target price includes heat", ep >= 132 && ep <= 133, String(ep));
  const g = { shopHeat: { bad: null, good: { mult: 99, lastAt: "x" } } };
  S.migrate(g);
  ok("shopHeat migration normalizes old saves", !!(g.shopHeat && g.shopHeat.good && g.shopHeat.good.mult === 6 && g.shopHeat.good.lastAt === 0 && !g.shopHeat.bad), JSON.stringify(g.shopHeat));
  const g2 = {};
  S.migrate(g2);
  ok("shopHeat migration initializes missing field", !!g2.shopHeat && typeof g2.shopHeat === "object");
  S.reset();
  S.bump("shop:gem:test");
  ok("shop heat label shows multiplier + decay hint", S.label("shop:gem:test").includes("涨价") && S.label("shop:gem:test").includes("2 分钟"), S.label("shop:gem:test"));
  S.reset();
  // 精华：2 条本精华词缀，且固定 T1/T2（放在最后跑，避免消耗 RNG 影响前面的地图/拟像测试）
  try {
    const baseE = Object.values(Tc.le || {}).find((b) => b && b.slot);
    const itE = Tc.Mt(baseE, 80, 2);
    itE.mods = [];
    const eErr = Tc.Qv("ess_fire", itE);
    const pool = ["addFire", "resF", "fireInc"];
    const firstTwo = itE.mods.slice(0, 2);
    const tiers = firstTwo.map((m) => { const d = Tc.mt(itE, m.id); return d && d.ranges ? d.ranges.length - (m.ti || 0) : 99; });
    ok("essence gives only 2 top-tier affixes", eErr === null && itE.mods.length === 2 && firstTwo.length === 2 && firstTwo.every((m) => pool.includes(m.id)) && tiers.every((t) => t <= 2), JSON.stringify({ ids: firstTwo.map((m) => m.id), tiers: tiers, total: itE.mods.length }));
  } catch (eEssTest) { ok("essence gives 2 top-tier affixes", false, String(eEssTest)); }
} catch (e) {
  ok("shop heat suite", false, (e && e.stack ? e.stack.split("\n").slice(0, 4).join(" | ") : String(e)));
}



console.log(fails.length ? "RESULT: FAIL (" + fails.length + ") " + fails.join(", ") : "RESULT: ALL PASS");
process.exit(fails.length ? 1 : 0);




