/**
 * remap.mjs — 把移植块里的「底包自由引用」按 symbol_map 重命名到目标基底符号。
 *
 * 原则：
 *  1. 只改「未被本块任何作用域声明遮蔽」的标识符引用（真正指向底包 IIFE 作用域的自由变量）。
 *  2. 不改属性名 / 对象字面量键 / 方法名 / 标签 / 字符串 / 模板字符串内容。
 *  3. 按 AST range 从后往前替换，其余字符原样保留（格式、注释、缩进不动）。
 *  4. 输出未覆盖清单，供人工补齐。
 *
 * 用法：node remap.mjs <block.js> <symbol_map.json> <out.js> <report.json>
 */
import fs from "node:fs";
import * as acorn from "./jstools/node_modules/acorn/dist/acorn.mjs";

const [, , BLOCK, MAPJSON, OUT, REPORT] = process.argv;
if (!BLOCK) {
  console.error("usage: node remap.mjs <block.js> <map.json> <out.js> <report.json>");
  process.exit(1);
}

const src = fs.readFileSync(BLOCK, "utf8");
const map = JSON.parse(fs.readFileSync(MAPJSON, "utf8"));
const globals = map.globals || {};

/* ---------------- 作用域分析 ---------------- */
class Scope {
  constructor(parent, isFn) {
    this.parent = parent;
    this.isFn = isFn;
    this.names = new Set();
  }
  has(name) {
    let s = this;
    while (s) {
      if (s.names.has(name)) return true;
      s = s.parent;
    }
    return false;
  }
  fnScope() {
    let s = this;
    while (s && !s.isFn) s = s.parent;
    return s || this;
  }
}

const freeRefs = []; // {name,start,end}
const declaredTop = new Set();

function declarePattern(node, scope) {
  if (!node) return;
  switch (node.type) {
    case "Identifier":
      scope.names.add(node.name);
      break;
    case "ObjectPattern":
      for (const p of node.properties) {
        if (p.type === "RestElement") declarePattern(p.argument, scope);
        else declarePattern(p.value, scope);
      }
      break;
    case "ArrayPattern":
      for (const el of node.elements) declarePattern(el, scope);
      break;
    case "AssignmentPattern":
      declarePattern(node.left, scope);
      break;
    case "RestElement":
      declarePattern(node.argument, scope);
      break;
    default:
      break;
  }
}

/**
 * 函数级 var 提升：只扫到内层函数为止，把所有 var 挂到该函数作用域。
 * 这样函数内「先用后声明」的 var 也能正确解析为局部变量。
 */
function hoistVars(node, fnScope) {
  if (!node || typeof node !== "object") return;
  const t = node.type;
  if (t === "VariableDeclaration") {
    if (node.kind === "var") {
      for (const d of node.declarations) declarePattern(d.id, fnScope);
    }
    return;
  }
  if (t === "FunctionDeclaration") {
    if (node.id) fnScope.names.add(node.id.name);
    return; // 不进入内层函数体
  }
  if (t === "FunctionExpression" || t === "ArrowFunctionExpression") return;
  for (const k in node) {
    if (k === "type" || k === "start" || k === "end" || k === "loc" || k === "range") continue;
    const v = node[k];
    if (Array.isArray(v)) {
      for (const c of v) if (c && typeof c.type === "string") hoistVars(c, fnScope);
    } else if (v && typeof v.type === "string") hoistVars(v, fnScope);
  }
}

/** 块级 let/const 声明（含 for 头部），只处理当前层的直接声明 */
function declareBlockLevel(node, scope) {
  const stmts =
    node.type === "Program" || node.type === "BlockStatement" || node.type === "SwitchCase"
      ? node.body || node.consequent || []
      : [node];
  for (const st of stmts) {
    if (!st || typeof st.type !== "string") continue;
    if (st.type === "VariableDeclaration" && st.kind !== "var") {
      for (const d of st.declarations) declarePattern(d.id, scope);
    } else if (st.type === "FunctionDeclaration" && st.id) {
      scope.names.add(st.id.name);
    } else if (st.type === "ForStatement" || st.type === "ForOfStatement" || st.type === "ForInStatement") {
      const init = st.type === "ForStatement" ? st.init : st.left;
      if (init && init.type === "VariableDeclaration" && init.kind !== "var") {
        for (const d of init.declarations) declarePattern(d.id, scope);
      }
    } else if (st.type === "ClassDeclaration" && st.id) {
      scope.names.add(st.id.name);
    }
  }
}

function isNonRef(node, parent) {
  if (!parent) return false;
  switch (parent.type) {
    case "MemberExpression":
      return parent.property === node && !parent.computed;
    case "Property":
      return parent.key === node && !parent.computed;
    case "MethodDefinition":
    case "PropertyDefinition":
      return parent.key === node && !parent.computed;
    case "LabeledStatement":
    case "BreakStatement":
    case "ContinueStatement":
      return parent.label === node;
    case "ExportSpecifier":
    case "ImportSpecifier":
      return true;
    default:
      return false;
  }
}

function isPatternPos(node, parent) {
  if (!parent) return false;
  // 声明/参数/捕获中的绑定位置不算引用
  if (parent.type === "VariableDeclarator" && parent.id === node) return true;
  if ((parent.type === "FunctionDeclaration" || parent.type === "FunctionExpression" || parent.type === "ArrowFunctionExpression") && parent.params.includes(node)) return true;
  if (parent.type === "CatchClause" && parent.param === node) return true;
  if (parent.type === "AssignmentPattern" && parent.left === node) return true;
  if (parent.type === "RestElement" && parent.argument === node) return true;
  if ((parent.type === "ObjectPattern" || parent.type === "ArrayPattern")) return true;
  return false;
}

function walk(node, scope, parent) {
  if (!node || typeof node !== "object") return;
  const t = node.type;

  if (t === "FunctionDeclaration" || t === "FunctionExpression" || t === "ArrowFunctionExpression") {
    const inner = new Scope(scope, true);
    if (t === "FunctionExpression" && node.id) inner.names.add(node.id.name);
    for (const p of node.params) declarePattern(p, inner);
    if (node.body) {
      hoistVars(node.body, inner);
      if (node.body.type === "BlockStatement") declareBlockLevel(node.body, inner);
      walk(node.body, inner, node);
    }
    return;
  }

  if (t === "CatchClause") {
    const inner = new Scope(scope, false);
    if (node.param) declarePattern(node.param, inner);
    hoistVars(node.body, scope.fnScope());
    walk(node.body, inner, node);
    return;
  }

  if (t === "BlockStatement" || t === "SwitchStatement" || t === "SwitchCase") {
    const inner = new Scope(scope, false);
    hoistVars(node, scope.fnScope());
    declareBlockLevel(node, inner);
    for (const k in node) {
      if (k === "type" || k === "start" || k === "end" || k === "loc" || k === "range") continue;
      const v = node[k];
      if (Array.isArray(v)) {
        for (const c of v) if (c && typeof c.type === "string") walk(c, inner, node);
      } else if (v && typeof v.type === "string") walk(v, inner, node);
    }
    return;
  }

  if (t === "ForStatement" || t === "ForInStatement" || t === "ForOfStatement") {
    const inner = new Scope(scope, false);
    hoistVars(node, scope.fnScope());
    declareBlockLevel(node, inner);
    for (const k in node) {
      if (k === "type" || k === "start" || k === "end" || k === "loc" || k === "range") continue;
      const v = node[k];
      if (Array.isArray(v)) {
        for (const c of v) if (c && typeof c.type === "string") walk(c, inner, node);
      } else if (v && typeof v.type === "string") walk(v, inner, node);
    }
    return;
  }

  if (t === "Identifier") {
    if (!isNonRef(node, parent) && !isPatternPos(node, parent) && !scope.has(node.name)) {
      freeRefs.push({ name: node.name, start: node.start, end: node.end });
    }
    return;
  }

  for (const k in node) {
    if (k === "type" || k === "start" || k === "end" || k === "loc" || k === "range") continue;
    const v = node[k];
    if (Array.isArray(v)) {
      for (const c of v) if (c && typeof c.type === "string") walk(c, scope, node);
    } else if (v && typeof v.type === "string") walk(v, scope, node);
  }
}

const ast = acorn.parse(src, { ecmaVersion: "latest", sourceType: "script" });
const top = new Scope(null, true);
hoistVars({ type: "Program", body: ast.body }, top);
declareBlockLevel(ast, top);
for (const st of ast.body) {
  if (st.type === "VariableDeclaration") for (const d of st.declarations) if (d.id.name) declaredTop.add(d.id.name);
  if (st.type === "FunctionDeclaration" && st.id) declaredTop.add(st.id.name);
}
for (const st of ast.body) walk(st, top, ast);

/* ---------------- 替换 ---------------- */
const JS_BUILTINS = new Set(["Set", "Map", "URL", "arguments", "globalThis", "self", "top", "parent", "frames", "Object", "Array", "String", "Number", "Math", "JSON", "Date", "Promise", "WeakMap", "WeakSet", "Symbol", "BigInt", "Boolean", "RegExp", "Error", "TypeError", "RangeError", "Proxy", "Reflect", "Intl", "ArrayBuffer", "Uint8Array", "Float32Array", "Int32Array", "Uint16Array", "Uint32Array", "Uint8ClampedArray", "Infinity", "NaN", "undefined", "parseInt", "parseFloat", "isNaN", "isFinite", "encodeURIComponent", "decodeURIComponent", "document", "window", "localStorage", "sessionStorage", "requestAnimationFrame", "cancelAnimationFrame", "performance", "AudioContext", "webkitAudioContext", "Image", "Audio", "fetch", "setTimeout", "setInterval", "clearTimeout", "clearInterval", "console", "navigator", "location", "alert", "confirm", "prompt", "Blob", "FileReader", "Worker", "TextDecoder", "TextEncoder", "structuredClone", "atob", "btoa", "crypto", "matchMedia", "getComputedStyle", "customElements", "HTMLElement", "HTMLElement", "DOMParser", "ResizeObserver", "IntersectionObserver", "MutationObserver", "OffscreenCanvas", "Path2D", "SVGElement", "Event", "CustomEvent", "KeyboardEvent", "MouseEvent", "TouchEvent", "PointerEvent", "HTMLCanvasElement", "ImageData", "CanvasRenderingContext2D", "Notification", "screen", "history", "devicePixelRatio", "innerWidth", "innerHeight", "addEventListener", "removeEventListener", "dispatchEvent", "queueMicrotask", "Float64Array", "Int8Array", "Uint8Array", "BigInt64Array", "WeakRef", "FinalizationRegistry", "DOMRect", "XMLHttpRequest", "WebSocket", "indexedDB", "caches", "speechSynthesis", "AudioBuffer", "MediaStream", "requestIdleCallback"]);

const resolved = [];
const unresolved = new Map();
for (const r of freeRefs) {
  if (JS_BUILTINS.has(r.name)) continue;
  const e = globals[r.name];
  if (e && e.new) {
    resolved.push({ ...r, to: e.new, confidence: e.confidence || "high" });
  } else {
    if (!unresolved.has(r.name)) unresolved.set(r.name, { name: r.name, count: 0, conf: e ? e.confidence : null });
    unresolved.get(r.name).count++;
  }
}

resolved.sort((a, b) => b.start - a.start);
let out = src;
let changed = 0;
for (const r of resolved) {
  if (r.name === r.to) continue;
  out = out.slice(0, r.start) + r.to + out.slice(r.end);
  changed++;
}

fs.writeFileSync(OUT, out, "utf8");
const rep = {
  generatedAt: new Date().toISOString(),
  source: BLOCK,
  totalFreeRefs: freeRefs.length,
  distinctFree: new Set(freeRefs.map((r) => r.name)).size,
  replacedOccurrences: changed,
  unresolved: [...unresolved.values()].sort((a, b) => b.count - a.count),
  mediumConfidence: [...new Set(resolved.filter((r) => r.confidence !== "high").map((r) => r.name))],
};
fs.writeFileSync(REPORT, JSON.stringify(rep, null, 2), "utf8");
console.log(`free refs: ${freeRefs.length} (distinct ${rep.distinctFree})`);
console.log(`replaced occurrences: ${changed}`);
console.log(`unresolved symbols: ${rep.unresolved.length}`);
for (const u of rep.unresolved.slice(0, 40)) console.log(`  ${u.name} x${u.count}`);
console.log(`wrote ${OUT}`);
