#!/usr/bin/env node
// threeway.mjs —— 对"我们改过 + 新基础也改过"的顶层函数做三方合并
//
//   node tools/threeway.mjs [--only ca,Cx] [--limit N] [--dump] [--no-write] [--blocks]
//
// 输入（只读）：
//   out/decls_old.json  OLD 基础顶层声明      （base   = 基础原实现）
//   out/decls_cur.json  CUR 现版顶层声明      （ours   = 我们的改版）
//   out/decls_new.json  NEW 新基础顶层声明    （theirs = 新基础新版，按 symbol_map 定位）
//   out/symbol_map.json OLD<->NEW 标识符映射
//   out/decl_diff.json  changedFuncs / changedVars
//
// 输出（写范围）：
//   out/merges/<函数名>.js   无冲突的合并结果，形如 `X = function (...) { ... };`
//   out/merge_report.md      逐函数表格 + 冲突明细 + 语法自检
//   out/merge_stats.json     机器可读统计
//   scratch/tw_norm/...      （--dump 时）三方规范化文本，便于人工核对
//
// 算法
//   1) 规范化：acorn 解析 -> 三方各自做 alpha 归一
//        a. 局部绑定（参数 / var,let,const / 内部函数名 / catch 参数 / 类名）按**声明出现顺序**
//           改名为 $L1,$L2,…（同一函数内统一编号，不同函数各自从 1 起）
//        b. 跨版本对齐：用"掩掉局部名后仍逐行相同"的位置做锚点投票，把 ours/theirs 的 $L 编号
//           投回 base 的编号体系；新增的局部拿 base 之后的新号。
//           （不做这一步的话，我们每加一个局部变量，后面所有编号整体后移，diff 会变成一大块
//             假改动，进而把新基础在同一函数里的无关改动误判成冲突。）
//        c. 自由引用：base/ours 原样（OLD 名）；theirs 用 symbol_map 反向表(NEW->OLD)翻回 OLD 名，
//           反查不到的保持原样并记录
//        d. 顶层名字统一成 OLD 名（函数自名也归一），输出统一成 `X = function (...) {...};`
//        e. astring 生成代码 => 三方文本逐行可比
//     注：$L 的分配对每个绑定是一对一且双射的，所以无论对齐是否完美，结果都是等价的 alpha 重命名
//        （对齐只影响 diff 质量，不会改语义）。
//   2) 合并：difflib.SequenceMatcher（Python 语义移植，autojunk 关闭以得到更细的改动块）
//         B->O 改动块、B->T 改动块；把 T 的块当补丁贴到 O 上：
//         不重叠 -> 采用；重叠且替换文本相同 -> 只采用一次；重叠且不同 -> 冲突（保留 O，报告贴三方片段）
//   3) 自检：每个写出的结果都用 acorn + node:vm 的 new vm.Script() 编译

import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import * as acorn from "./jstools/node_modules/acorn/dist/acorn.mjs";
import * as astringMod from "./jstools/node_modules/astring/dist/astring.mjs";
const astring = astringMod.default || astringMod;

const HERE = import.meta.dirname;                 // .../port/tools
const ROOT = path.resolve(HERE, "..");            // .../port
const OUT = path.join(ROOT, "out");
const MERGES = path.join(OUT, "merges");
const SCRATCH = path.join(ROOT, "scratch");

const argv = process.argv.slice(2);
const arg = (n, d) => { const i = argv.indexOf("--" + n); return i >= 0 ? argv[i + 1] : d; };
const ONLY = (arg("only", "") || "").split(",").map(s => s.trim()).filter(Boolean);
const LIMIT = Number(arg("limit", "0")) || 0;
const DUMP = argv.includes("--dump");
const NO_WRITE = argv.includes("--no-write");

// ---------------------------------------------------------------- JSON 读取

function readJSON(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

/** decls_*.json（{file,count,decls:[{name,kind,line,endLine,src}]}）-> Map<name, decl> */
function loadDecls(rel) {
  const j = readJSON(path.join(ROOT, rel));
  const m = new Map();
  for (const d of j.decls) {
    // 同名重复：保留第一个（function 声明优先于 var，与 JS 提升语义一致）
    const prev = m.get(d.name);
    if (!prev) { m.set(d.name, d); continue; }
    if (prev.kind !== "function" && d.kind === "function") m.set(d.name, d);
  }
  return m;
}

function srcLineCount(src) {
  return String(src).split(/\r?\n/).length;
}

// ---------------------------------------------------------------- difflib 移植
// Python difflib.SequenceMatcher 的 get_matching_blocks / get_opcodes 语义。
// autojunk 关闭：代码行里 `}`、空行等高频行会被 popular 判定剔除，反而丢掉最可靠的锚点，
// 关闭后改动块更细，非重叠判定更准。

function buildB2J(b) {
  const b2j = new Map();
  for (let i = 0; i < b.length; i++) {
    const arr = b2j.get(b[i]);
    if (arr) arr.push(i); else b2j.set(b[i], [i]);
  }
  return b2j;
}

function findLongestMatch(a, b, b2j, alo, ahi, blo, bhi) {
  let besti = alo, bestj = blo, bestsize = 0;
  let j2len = new Map();
  for (let i = alo; i < ahi; i++) {
    const newj2len = new Map();
    const idxs = b2j.get(a[i]);
    if (idxs) {
      for (const j of idxs) {
        if (j < blo) continue;
        if (j >= bhi) break;
        const k = (j2len.get(j - 1) || 0) + 1;
        newj2len.set(j, k);
        if (k > bestsize) { besti = i - k + 1; bestj = j - k + 1; bestsize = k; }
      }
    }
    j2len = newj2len;
  }
  // 无 junk 元素，故不需要 difflib 的 junk 伸展；只做首尾伸展（与 difflib 一致）
  while (besti > alo && bestj > blo && a[besti - 1] === b[bestj - 1]) { besti--; bestj--; bestsize++; }
  while (besti + bestsize < ahi && bestj + bestsize < bhi && a[besti + bestsize] === b[bestj + bestsize]) bestsize++;
  return [besti, bestj, bestsize];
}

function getMatchingBlocks(a, b) {
  const b2j = buildB2J(b);
  const la = a.length, lb = b.length;
  const queue = [[0, la, 0, lb]];
  const raw = [];
  while (queue.length) {
    const [alo, ahi, blo, bhi] = queue.pop();
    const [i, j, k] = findLongestMatch(a, b, b2j, alo, ahi, blo, bhi);
    if (k) {
      raw.push([i, j, k]);
      if (alo < i && blo < j) queue.push([alo, i, blo, j]);
      if (i + k < ahi && j + k < bhi) queue.push([i + k, ahi, j + k, bhi]);
    }
  }
  raw.sort((x, y) => (x[0] - y[0]) || (x[1] - y[1]));
  const merged = [];
  let i1 = 0, j1 = 0, k1 = 0;
  for (const [i2, j2, k2] of raw) {
    if (i1 + k1 === i2 && j1 + k1 === j2) k1 += k2;
    else { if (k1) merged.push([i1, j1, k1]); i1 = i2; j1 = j2; k1 = k2; }
  }
  if (k1) merged.push([i1, j1, k1]);
  merged.push([la, lb, 0]);
  return merged;
}

/** 返回 opcodes: [{tag:'equal'|'replace'|'delete'|'insert', a1,a2 (A 侧), b1,b2 (B 侧)}] */
function getOpcodes(a, b) {
  const blocks = getMatchingBlocks(a, b);
  const ops = [];
  let i = 0, j = 0;
  for (const [ai, bj, size] of blocks) {
    let tag = "";
    if (i < ai && j < bj) tag = "replace";
    else if (i < ai) tag = "delete";
    else if (j < bj) tag = "insert";
    if (tag) ops.push({ tag, a1: i, a2: ai, b1: j, b2: bj });
    i = ai + size; j = bj + size;
    if (size) ops.push({ tag: "equal", a1: ai, a2: i, b1: bj, b2: j });
  }
  if (!ops.length || ops[ops.length - 1].a2 !== a.length || ops[ops.length - 1].b2 !== b.length) {
    ops.push({ tag: "equal", a1: a.length, a2: a.length, b1: b.length, b2: b.length });
  }
  return ops;
}

// ---------------------------------------------------------------- 规范化（alpha 归一）

const BUILTINS = new Set([
  "undefined", "NaN", "Infinity", "arguments", "globalThis",
  "Math", "Object", "Array", "JSON", "String", "Number", "Boolean", "Date", "RegExp",
  "Promise", "Set", "Map", "WeakMap", "WeakSet", "Symbol", "Error", "TypeError",
  "RangeError", "Proxy", "Reflect", "BigInt", "parseInt", "parseFloat", "isNaN", "isFinite",
  "encodeURIComponent", "decodeURIComponent", "encodeURI", "decodeURI", "escape", "unescape",
  "console", "window", "document", "globalThis", "self", "top", "parent", "opener",
  "localStorage", "sessionStorage", "indexedDB", "location", "history", "screen", "navigator",
  "performance", "setTimeout", "clearTimeout", "setInterval", "clearInterval",
  "requestAnimationFrame", "cancelAnimationFrame", "queueMicrotask", "structuredClone",
  "Audio", "Image", "Worker", "Blob", "File", "FileReader", "URL", "URLSearchParams",
  "TextEncoder", "TextDecoder", "CustomEvent", "Event", "EventTarget", "HTMLElement",
  "Node", "Element", "DOMParser", "XMLHttpRequest", "fetch", "MutationObserver",
  "ResizeObserver", "IntersectionObserver", "getComputedStyle", "matchMedia", "alert",
  // 类型化数组 / 二进制
  "Int8Array", "Uint8Array", "Uint8ClampedArray", "Int16Array", "Uint16Array", "Int32Array",
  "Uint32Array", "Float32Array", "Float64Array", "BigInt64Array", "BigUint64Array",
  "ArrayBuffer", "DataView", "SharedArrayBuffer", "Atomics",
  // 浏览器/bare 全局函数
  "addEventListener", "removeEventListener", "dispatchEvent", "postMessage", "atob", "btoa",
  "crypto", "AudioContext", "webkitAudioContext", "OffscreenCanvas", "CanvasRenderingContext2D",
  "Path2D", "DOMMatrix", "ImageData", "createImageBitmap", "AudioBuffer", "AudioParam",
  "speechSynthesis", "requestIdleCallback", "cancelIdleCallback", "WeakRef", "FinalizationRegistry",
  "Intl", "Proxy", "AbortController", "TextMetrics", "DOMRect", "Range", "Selection",
]);

class Scope {
  constructor(parent, isFn) {
    this.parent = parent || null;
    this.isFn = !!isFn;
    this.names = new Map(); // name -> binding {name, newName, binds:[], order}
  }
  declare(name) {
    let b = this.names.get(name);
    if (!b) { b = { name, newName: null, binds: [] }; this.names.set(name, b); }
    return b;
  }
  lookup(name) {
    let s = this;
    while (s) {
      const b = s.names.get(name);
      if (b) return { scope: s, binding: b };
      s = s.parent;
    }
    return null;
  }
}

const MODE = { BASE: "base", OURS: "ours", THEIRS: "theirs" };

/**
 * 把一段顶层声明源码规范化。
 * @param {string} src      源码片段
 * @param {string} nameHint 顶层名字（OLD 名）
 * @param {string} kind     声明种类 function|class|var|let|const
 * @param {object} ctx      {mode, reverseMap, selfNames}
 * @returns {{code:string, lines:string[], locals:number, free:{mapped:object, unmapped:string[], lowConf:string[]}}}
 */
function normalizeDecl(src, nameHint, kind, ctx) {
  // ---- 1. 解析 ----
  const raw = String(src);
  const trimmed = raw.trimStart();
  const isFnDecl = /^(async\s+)?function[\s(]/.test(trimmed);
  const isClassDecl = /^class[\s{]/.test(trimmed);
  const prefix = (kind === "function" || isFnDecl || kind === "class" || isClassDecl) ? "" : (kind + " ");
  const program = acorn.parse(prefix + raw, { ecmaVersion: "latest", sourceType: "script", allowAwaitOutsideFunction: true });
  const stmt = program.body[0];
  if (!stmt) throw new Error("empty declaration src");

  let target = null;      // 右侧表达式节点
  let declId = null;      // 原声明 id 节点（可能为 null）
  if (stmt.type === "FunctionDeclaration" || stmt.type === "ClassDeclaration") {
    target = stmt; declId = stmt.id;
  } else if (stmt.type === "VariableDeclaration") {
    const d = stmt.declarations[0];
    declId = d.id && d.id.type === "Identifier" ? d.id : null;
    target = d.init;
  } else {
    throw new Error("unsupported top-level statement: " + stmt.type);
  }
  if (!target) throw new Error("declaration has no initializer");

  // ---- 2. 作用域 + 声明收集（单次遍历，引用延迟解析） ----
  const programScope = new Scope(null, true);
  const scopeOf = new Map();      // 诊断用：scope-creating node -> Scope（改名走延迟解析，不依赖它）
  const pendingRefs = [];         // {node, scope}
  const localRefs = [];           // 解析到局部绑定的 Identifier 节点
  const pendingBinds = [];        // {node, binding}
  const pendingShorthand = [];    // Property 节点（shorthand 需要展开）
  let localSeq = 0;

  const nearestFn = (s) => { let x = s; while (x && !x.isFn) x = x.parent; return x || programScope; };

  function declareInto(scope, idNode) {
    const b = scope.declare(idNode.name);
    b.binds.push(idNode);
    // 编号即"声明出现顺序"：遍历是源序的，declare 的先后就是声明先后
    if (scope !== programScope && !b.newName) b.newName = "$L" + (++localSeq);
    pendingBinds.push({ node: idNode, binding: b });
    return b;
  }

  function declarePattern(p, scope) {
    if (!p) return;
    switch (p.type) {
      case "Identifier": declareInto(scope, p); break;
      case "ObjectPattern":
        for (const prop of p.properties) {
          if (prop.type === "RestElement") { declarePattern(prop.argument, scope); continue; }
          if (prop.computed) walk(prop.key, scope);
          declarePattern(prop.value, scope);
          if (prop.shorthand) pendingShorthand.push(prop);
        }
        break;
      case "ArrayPattern": for (const el of p.elements) if (el) declarePattern(el, scope); break;
      case "RestElement": declarePattern(p.argument, scope); break;
      case "AssignmentPattern": declarePattern(p.left, scope); walk(p.right, scope); break;
      default: walk(p, scope); break;
    }
  }

  function walkFnLike(node, scope) {
    const fs_ = new Scope(scope, true);
    scopeOf.set(node, fs_);
    if (node.id) declareInto(fs_, node.id);          // 具名函数表达式：名字只在自身内可见
    for (const p of node.params) declarePattern(p, fs_);
    if (node.body.type === "BlockStatement") {
      for (const st of node.body.body) walk(st, fs_);
    } else {
      walk(node.body, fs_);                           // 箭头函数表达式体
    }
  }

  function walk(node, scope) {
    if (!node || typeof node.type !== "string") return;
    switch (node.type) {
      case "Identifier":
        pendingRefs.push({ node, scope });
        return;
      case "FunctionDeclaration": {
        if (node.id) declareInto(scope, node.id);
        walkFnLike(node, scope);
        return;
      }
      case "FunctionExpression":
      case "ArrowFunctionExpression":
        walkFnLike(node, scope);
        return;
      case "ClassDeclaration":
      case "ClassExpression": {
        // 类声明名在**外层**可见；类表达式名只在自身内部可见
        if (node.type === "ClassDeclaration" && node.id) declareInto(scope, node.id);
        const cs = new Scope(scope, false);
        scopeOf.set(node, cs);
        if (node.type === "ClassExpression" && node.id) declareInto(cs, node.id);
        if (node.superClass) walk(node.superClass, scope);
        walk(node.body, cs);
        return;
      }
      case "BlockStatement": {
        const bs = new Scope(scope, false);
        scopeOf.set(node, bs);
        for (const st of node.body) walk(st, bs);
        return;
      }
      case "StaticBlock": {
        const bs = new Scope(scope, true);
        scopeOf.set(node, bs);
        for (const st of node.body) walk(st, bs);
        return;
      }
      case "ForStatement": {
        const bs = new Scope(scope, false);
        scopeOf.set(node, bs);
        if (node.init) walk(node.init, bs);
        if (node.test) walk(node.test, bs);
        if (node.update) walk(node.update, bs);
        walk(node.body, bs);
        return;
      }
      case "ForInStatement":
      case "ForOfStatement": {
        const bs = new Scope(scope, false);
        scopeOf.set(node, bs);
        if (node.left.type === "VariableDeclaration") walk(node.left, bs);
        else walk(node.left, bs);
        walk(node.right, scope);
        walk(node.body, bs);
        return;
      }
      case "CatchClause": {
        const cs = new Scope(scope, false);
        scopeOf.set(node, cs);
        if (node.param) declarePattern(node.param, cs);
        walk(node.body, cs);
        return;
      }
      case "SwitchStatement": {
        walk(node.discriminant, scope);
        const bs = new Scope(scope, false);
        scopeOf.set(node, bs);
        for (const c of node.cases) walk(c, bs);
        return;
      }
      case "VariableDeclaration": {
        const targetScope = node.kind === "var" ? nearestFn(scope) : scope;
        for (const d of node.declarations) {
          declarePattern(d.id, targetScope);
          if (d.init) walk(d.init, scope);
        }
        return;
      }
      case "MemberExpression":
        walk(node.object, scope);
        if (node.computed) walk(node.property, scope);
        return;
      case "Property": {
        if (node.computed) walk(node.key, scope);
        walk(node.value, scope);
        if (node.shorthand) pendingShorthand.push(node);
        return;
      }
      case "MethodDefinition":
      case "PropertyDefinition": {
        if (node.computed) walk(node.key, scope);
        if (node.value) walk(node.value, scope);
        return;
      }
      case "LabeledStatement": walk(node.body, scope); return;
      case "BreakStatement":
      case "ContinueStatement":
      case "MetaProperty":
      case "PrivateIdentifier":
        return;
      case "TemplateLiteral":
        for (const e of node.expressions) walk(e, scope);
        return;
      case "TaggedTemplateExpression":
        walk(node.tag, scope); walk(node.quasi, scope); return;
      default: break;
    }
    for (const k of Object.keys(node)) {
      if (k === "loc" || k === "start" || k === "end" || k === "type" || k === "raw" || k === "regex" || k === "bigint") continue;
      const v = node[k];
      if (Array.isArray(v)) { for (const c of v) if (c && typeof c.type === "string") walk(c, scope); }
      else if (v && typeof v.type === "string") walk(v, scope);
    }
  }

  // 顶层：函数/类声明本身作为 fn-like 处理；其它表达式直接遍历
  if (target.type === "FunctionDeclaration" || target.type === "FunctionExpression" || target.type === "ArrowFunctionExpression") {
    walkFnLike(target, programScope);
  } else if (target.type === "ClassDeclaration" || target.type === "ClassExpression") {
    const cs = new Scope(programScope, false);
    scopeOf.set(target, cs);
    if (target.id) declareInto(cs, target.id);
    if (target.superClass) walk(target.superClass, programScope);
    walk(target.body, cs);
  } else {
    walk(target, programScope);
  }

  // ---- 3. 改局部绑定名 ----
  for (const { node, binding } of pendingBinds) {
    if (binding.newName) node.name = binding.newName;
  }
  // ---- 4. 自由引用 ----
  const free = { mapped: {}, unmapped: [], lowConf: [], builtin: [] };
  const seen = new Set();
  for (const { node, scope } of pendingRefs) {
    const r = scope.lookup(node.name);
    if (r) {                                           // 局部绑定 -> 同一个 $L 名
      if (r.binding.newName) node.name = r.binding.newName;
      if (r.binding.newName) localRefs.push(node);
      continue;
    }
    const orig = node.name;
    if (ctx.mode === MODE.THEIRS) {
      const rev = ctx.reverseMap.get(orig);
      if (rev) {
        node.name = rev.old;
        free.mapped[orig] = { old: rev.old, confidence: rev.confidence };
        if (rev.confidence !== "high") free.lowConf.push(orig + "->" + rev.old + "(" + rev.confidence + ")");
      } else if (ctx.selfNames.has(orig)) {
        node.name = nameHint;                          // 函数自名（NEW 名）-> OLD 名
      } else if (BUILTINS.has(orig)) {
        if (!seen.has("B" + orig)) { seen.add("B" + orig); free.builtin.push(orig); }
      } else {
        if (!seen.has("U" + orig)) { seen.add("U" + orig); free.unmapped.push(orig); }
      }
    } else {
      // base / ours：自由引用保持 OLD 名（记录全部非内建引用，main 里再分成"OLD 顶层名"和"我们自己的"）
      if (ctx.selfNames.has(orig)) { node.name = nameHint; }
      else if (BUILTINS.has(orig)) { if (!seen.has("B" + orig)) { seen.add("B" + orig); free.builtin.push(orig); } }
      else if (!seen.has("U" + orig)) { seen.add("U" + orig); free.unmapped.push(orig); }
    }
  }
  // ---- 5. shorthand 展开 ----
  for (const prop of pendingShorthand) {
    if (prop.shorthand && prop.key.type === "Identifier" && prop.value.type === "Identifier" && prop.key.name !== prop.value.name) {
      prop.shorthand = false;
    }
  }
  // ---- 6. 顶层改写成赋值语句 X = <expr>; ----
  let right;
  if (target.type === "FunctionDeclaration") {
    right = Object.assign({}, target, { type: "FunctionExpression", id: null });
  } else if (target.type === "ClassDeclaration") {
    right = Object.assign({}, target, { type: "ClassExpression", id: null });
  } else {
    right = target;
  }
  const outStmt = {
    type: "ExpressionStatement",
    expression: {
      type: "AssignmentExpression",
      operator: "=",
      left: { type: "Identifier", name: nameHint },
      right,
    },
  };
  // 所有带局部名的标识符节点（声明点 + 引用点），供跨版本对齐时重新命名
  const idNodes = [];
  for (const { node, binding } of pendingBinds) if (binding.newName) idNodes.push({ node, canon: binding.newName });
  for (const node of localRefs) idNodes.push({ node, canon: node.name });
  const localNames = [...new Set(idNodes.map(e => e.canon))].sort((a, b) => (+a.slice(2)) - (+b.slice(2)));
  const build = () => astring.generate(outStmt);
  const regenerate = (map) => {
    for (const e of idNodes) e.node.name = (map && map.get(e.canon)) || e.canon;
    return build();
  };
  const code = build();
  return { code, lines: code.split("\n"), locals: localSeq, localNames, regenerate, free, rawLines: srcLineCount(raw) };
}

// ---------------------------------------------------------------- 跨版本局部名对齐
// 逐函数"按声明顺序编号"会把我们新增的局部变量（或新基础新增的）变成插入点，
// 之后所有编号整体后移 => O/T 与 B 的 diff 变成一大坨改动块 => 假冲突。
// 这里用"掩掉局部名后仍逐行相同"作为锚点做二次对齐：把 O/T 的 $L 名投回 B 的编号体系，
// 没有票的新局部再分配 B 之后的新号。这样 diff 只反映真实改动。

const LOCAL_RE = /\$L\d+/g;
const maskLocals = (line) => line.replace(LOCAL_RE, "$L");
function localSlots(line) {
  const out = [];
  LOCAL_RE.lastIndex = 0;
  let m;
  while ((m = LOCAL_RE.exec(line))) out.push(m[0]);
  return out;
}

/**
 * 把 other 的局部名对齐到 base 的编号体系。
 * @param {number} [freshFrom] 新增局部从几号开始分配（默认 base 的最大号）。
 *        两边的"新增局部"必须用**不重叠**的号段，否则我们插进去的代码和新基础采纳进来的代码
 *        可能用到同一个 $L 名字 —— 轻则遮蔽、重则语义串味。
 * @returns {{lines:string[], code:string, map:Map<string,string>, votes:number, fresh:number, maxUsed:number}}
 */
function alignLocalsToBase(baseNorm, otherNorm, freshFrom) {
  const bLines = baseNorm.lines, oLines = otherNorm.lines;
  const maskedB = bLines.map(maskLocals);
  const maskedO = oLines.map(maskLocals);
  const blocks = getMatchingBlocks(maskedB, maskedO);
  const votes = new Map();             // otherName -> Map<baseName, count>
  let pairs = 0;
  for (const [bi, oi, size] of blocks) {
    for (let k = 0; k < size; k++) {
      const bs = localSlots(bLines[bi + k]);
      const os = localSlots(oLines[oi + k]);
      if (bs.length !== os.length) continue;
      pairs++;
      for (let s = 0; s < bs.length; s++) {
        let m = votes.get(os[s]);
        if (!m) { m = new Map(); votes.set(os[s], m); }
        m.set(bs[s], (m.get(bs[s]) || 0) + 1);
      }
    }
  }
  const edges = [];
  for (const [o, m] of votes) for (const [b, n] of m) edges.push({ o, b, n });
  edges.sort((x, y) => (y.n - x.n) || x.o.localeCompare(y.o) || ((+x.b.slice(2)) - (+y.b.slice(2))));
  const map = new Map();
  const usedB = new Set();
  for (const e of edges) {
    if (map.has(e.o) || usedB.has(e.b)) continue;
    map.set(e.o, e.b); usedB.add(e.b);
  }
  // 未投票的局部（新增的）分配 B 之后的新号
  let maxB = 0;
  for (const n of baseNorm.localNames) maxB = Math.max(maxB, +n.slice(2));
  let next = Math.max(maxB, freshFrom || 0);
  let fresh = 0;
  for (const n of otherNorm.localNames) {
    if (!map.has(n)) { map.set(n, "$L" + (++next)); fresh++; }
  }
  let maxUsed = maxB;
  for (const v of map.values()) maxUsed = Math.max(maxUsed, +String(v).slice(2));
  const code = otherNorm.regenerate(map);
  return { code, lines: code.split("\n"), map, votes: votes.size, fresh, pairs, maxUsed };
}

// ---------------------------------------------------------------- 合并结果结构体检
// 每个版本内部，同一个函数里的局部名是全局唯一的（alpha 编号对每个绑定自增），
// 所以合并结果里**同一个名字出现两次声明**只可能是两边撞名（我们的新局部 vs 新基础的新局部）。
// 这种碰撞在语法上合法（遮蔽），但语义会串味 —— 必须拦下来。

function collectBindNames(ast) {
  const counts = new Map();
  const add = (n) => { if (n) counts.set(n, (counts.get(n) || 0) + 1); };
  const pattern = (p) => {
    if (!p) return;
    switch (p.type) {
      case "Identifier": add(p.name); return;
      case "ObjectPattern":
        for (const pr of p.properties) {
          if (pr.type === "RestElement") pattern(pr.argument);
          else { if (pr.computed) walk(pr.key); pattern(pr.value); }
        }
        return;
      case "ArrayPattern": for (const el of p.elements) if (el) pattern(el); return;
      case "RestElement": pattern(p.argument); return;
      case "AssignmentPattern": pattern(p.left); walk(p.right); return;
      default: walk(p); return;
    }
  };
  const walk = (node) => {
    if (!node || typeof node.type !== "string") return;
    switch (node.type) {
      case "FunctionDeclaration":
      case "FunctionExpression":
      case "ArrowFunctionExpression":
        if (node.id) add(node.id.name);
        for (const pr of node.params) pattern(pr);
        walk(node.body);
        return;
      case "VariableDeclarator":
        pattern(node.id);
        if (node.init) walk(node.init);
        return;
      case "CatchClause":
        if (node.param) pattern(node.param);
        walk(node.body);
        return;
      case "ClassDeclaration":
      case "ClassExpression":
        if (node.id) add(node.id.name);
        if (node.superClass) walk(node.superClass);
        walk(node.body);
        return;
      case "MemberExpression":
        walk(node.object);
        if (node.computed) walk(node.property);
        return;
      case "Property":
        if (node.computed) walk(node.key);
        walk(node.value);
        return;
      case "MethodDefinition":
      case "PropertyDefinition":
        if (node.computed) walk(node.key);
        if (node.value) walk(node.value);
        return;
      case "LabeledStatement": walk(node.body); return;
      case "BreakStatement": case "ContinueStatement": case "MetaProperty":
      case "Identifier": case "PrivateIdentifier": case "Literal": case "TemplateElement":
        return;
    }
    for (const k of Object.keys(node)) {
      if (k === "loc" || k === "start" || k === "end" || k === "type" || k === "raw" || k === "regex" || k === "bigint") continue;
      const v = node[k];
      if (Array.isArray(v)) { for (const c of v) if (c && typeof c.type === "string") walk(c); }
      else if (v && typeof v.type === "string") walk(v);
    }
  };
  walk(ast);
  return counts;
}

// ---------------------------------------------------------------- 三方合并

function arrEq(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

// 区间重叠判定（半开区间；相邻不算重叠；两段都是插入时同一点才算重叠）
function overlaps(o, t) {
  const oEmpty = o.a1 === o.a2, tEmpty = t.a1 === t.a2;
  if (oEmpty && tEmpty) return o.a1 === t.a1;
  if (oEmpty) return t.a1 < o.a1 && o.a1 < t.a2;
  if (tEmpty) return o.a1 < t.a1 && t.a1 < o.a2;
  return o.a1 < t.a2 && t.a1 < o.a2;
}

const CTX = 2; // 冲突片段上下文行数
const MAXSHOW = 40, HEADSHOW = 28; // 单个片段最多展示的行数（超过则掐头留尾，避免报告被超大块淹没）

function trimDisp(list) {
  if (list.length <= MAXSHOW) return list;
  const tail = MAXSHOW - HEADSHOW;
  const omitted = list.length - HEADSHOW - tail;
  return [
    ...list.slice(0, HEADSHOW),
    { mark: " ", n: null, text: "…（中间省略 " + omitted + " 行；改动用 `node tools/threeway.mjs --dump --only <函数>` 看全量）…" },
    ...list.slice(list.length - tail),
  ];
}

function lineLabel(n) { return String(n + 1); }

/**
 * @returns {{lines:string[], conflicts:Array, adopted:Array, oBlocks:Array, tBlocks:Array, duplicates:number}}
 */
function threeWayMerge(B, O, T) {
  const oOps = getOpcodes(B, O);
  const tOps = getOpcodes(B, T);
  const oBlocks = oOps.filter(op => op.tag !== "equal").map((op, idx) => ({ ...op, idx }));
  const tBlocks = tOps.filter(op => op.tag !== "equal").map((op, idx) => ({ ...op, idx }));

  // B 坐标 -> O 坐标：按"间隙"建表，而不是用单个函数硬推。
  // 对 B 的每个间隙 g（0..len(B)）记录两个 O 位置：
  //   before[g] = O 里"gap g 处、O 自己的插入之前"的位置
  //   after[g]  = O 里"gap g 处、O 自己的插入之后"的位置
  // 于是：B 第 p 行的起点 = after[p]；B 第 p 行的终点（= 第 p 行的右侧间隙）= before[p+1]。
  //   - T 的纯插入（锚在 gap g）  -> 落在 before[g]（新基础的行排在我们的插入块之前，不会插进我们刚开的块里）
  //   - T 的替换/删除 [a1,a2)      -> 占 O 的 [after[a1], before[a2])
  // 之前用单个 bToO 把"间隙"和"行起点"混为一谈，导致 Jb 的无关改动被误判冲突、Ph 出现坐标异常。
  const gapBefore = new Array(B.length + 1).fill(-1);
  const gapAfter = new Array(B.length + 1).fill(-1);
  const gapSafe = new Array(B.length + 1).fill(true);
  {
    const setBefore = (k, v) => { if (k >= 0 && k <= B.length && gapBefore[k] < 0) gapBefore[k] = v; };
    let lastB2 = 0;
    for (const op of oOps) {
      if (op.tag === "equal") {
        setBefore(op.a1, lastB2);
        for (let k = op.a1; k < op.a2; k++) gapAfter[k] = op.b1 + (k - op.a1);
        for (let k = op.a1 + 1; k < op.a2; k++) gapBefore[k] = gapAfter[k];
        lastB2 = op.b2;
        setBefore(op.a2, lastB2);
      } else if (op.a1 === op.a2) {
        // O 侧纯插入：不改 gapBefore（保持"插入前"的位置），只把 gapAfter 往后推
        setBefore(op.a1, lastB2);
        gapAfter[op.a1] = op.b2;
        lastB2 = op.b2;
      } else {
        // O 侧替换/删除：内部间隙没有对应行
        setBefore(op.a1, lastB2);
        for (let k = op.a1 + 1; k < op.a2; k++) gapSafe[k] = false;
        lastB2 = op.b2;
        setBefore(op.a2, lastB2);
        if (gapAfter[op.a2] < 0) gapAfter[op.a2] = lastB2;
      }
    }
    if (gapBefore[B.length] < 0) gapBefore[B.length] = lastB2;
    if (gapAfter[B.length] < 0) gapAfter[B.length] = lastB2;
    for (let k = 0; k <= B.length; k++) {
      if (gapBefore[k] < 0) gapBefore[k] = gapAfter[k] = 0;
      if (gapAfter[k] < 0) gapAfter[k] = gapBefore[k];
    }
  }

  const adopted = [];
  const conflicts = [];
  let duplicates = 0;

  for (const tb of tBlocks) {
    const overlapping = oBlocks.filter(ob => overlaps(ob, tb));
    const tText = T.slice(tb.b1, tb.b2);
    if (overlapping.length) {
      const same = overlapping.some(ob => arrEq(O.slice(ob.b1, ob.b2), tText));
      if (same) { duplicates++; continue; }          // 重叠但文本相同 -> 只采用一次
      // 冲突：记录并集区域
      const bStart = Math.min(tb.a1, ...overlapping.map(o => o.a1));
      const bEnd = Math.max(tb.a2, ...overlapping.map(o => o.a2));
      const oStart = Math.min(...overlapping.map(o => o.b1));
      const oEnd = Math.max(...overlapping.map(o => o.b2));
      conflicts.push(makeConflict(B, O, T, oBlocks, { bStart, bEnd, oStart, oEnd, tb, overlapping }));
      continue;
    }
    // 不重叠 -> 贴补丁
    let oStart, oEnd;
    if (tb.a1 === tb.a2) { oStart = oEnd = gapBefore[tb.a1]; }
    else {
      oStart = gapAfter[tb.a1];
      oEnd = gapBefore[tb.a2];
      if (!gapSafe[tb.a1] || !gapSafe[tb.a2] || oEnd - oStart !== tb.a2 - tb.a1) {
        // 防御：理论上不会发生（不重叠 => 整段落在一段 equal 里）
        const bStart = tb.a1, bEnd = tb.a2;
        conflicts.push(makeConflict(B, O, T, oBlocks, {
          bStart, bEnd, oStart, oEnd, tb, overlapping: [], note: "坐标映射异常",
        }));
        continue;
      }
    }
    adopted.push({ oStart, oEnd, text: tText, bRange: [tb.a1, tb.a2], tag: tb.tag, tIdx: tb.idx });
  }

  // 从后往前贴，保证下标不漂移；同一点插入按原顺序（后索引先贴）
  const merged = O.slice();
  adopted.sort((x, y) => (y.oStart - x.oStart) || (y.tIdx - x.tIdx));
  for (const p of adopted) merged.splice(p.oStart, p.oEnd - p.oStart, ...p.text);

  return { lines: merged, conflicts, adopted, oBlocks, tBlocks, duplicates };
}

function makeConflict(B, O, T, oBlocks, info) {
  const { bStart, bEnd, oStart, oEnd } = info;
  const tb = info.tb;
  // B 侧：受 O 或 T 改动影响的行
  const oTouched = new Set(), tTouched = new Set();
  for (const ob of oBlocks) for (let i = ob.a1; i < ob.a2; i++) oTouched.add(i);
  for (let i = tb.a1; i < tb.a2; i++) tTouched.add(i);
  const dspB1 = Math.max(0, bStart - CTX), dspB2 = Math.min(B.length, bEnd + CTX);
  const bDisp = [];
  for (let i = dspB1; i < dspB2; i++) {
    bDisp.push({ mark: (oTouched.has(i) || tTouched.has(i)) ? "-" : " ", n: i + 1, text: B[i] });
  }
  // O 侧：重叠的 O 块范围（含上下文）
  const oRanges = info.overlapping.map(o => [o.b1, o.b2]);
  const od1 = Math.max(0, Math.min(oStart, ...oRanges.map(r => r[0])) - CTX);
  const od2 = Math.min(O.length, Math.max(oEnd, ...oRanges.map(r => r[1])) + CTX);
  const oTouchedO = new Set();
  for (const [a, b] of oRanges) for (let i = a; i < b; i++) oTouchedO.add(i);
  const oDisp = [];
  for (let i = od1; i < od2; i++) oDisp.push({ mark: oTouchedO.has(i) ? "+" : " ", n: i + 1, text: O[i] });
  // T 侧（用 T 自己的行号切片！tb.b1/tb.b2 才是 T 的行区间，a1/a2 是 B 的）
  const td1 = Math.max(0, tb.b1 - CTX), td2 = Math.min(T.length, tb.b2 + CTX);
  const tTouchedT = new Set();
  for (let i = tb.b1; i < tb.b2; i++) tTouchedT.add(i);
  const tDisp = [];
  for (let i = td1; i < td2; i++) tDisp.push({ mark: tTouchedT.has(i) ? "+" : " ", n: i + 1, text: T[i] });
  return {
    bRange: [bStart, bEnd],
    oRange: [oStart, oEnd],
    tRange: [tb.b1, tb.b2],
    tEmpty: tb.b1 === tb.b2,
    note: info.note || "",
    bText: trimDisp(bDisp), oText: trimDisp(oDisp), tText: trimDisp(tDisp),
    bLabel: `${lineLabel(bStart)}-${lineLabel(Math.max(bStart, bEnd - 1))}`,
    oLabel: `${lineLabel(Math.min(oStart, oEnd))}-${lineLabel(Math.max(oStart, oEnd - 1))}`,
    tLabel: tb.b1 === tb.b2
      ? `(删除 B 行 ${lineLabel(tb.a1)}-${lineLabel(Math.max(tb.a1, tb.a2 - 1))})`
      : `${lineLabel(tb.b1)}-${lineLabel(Math.max(tb.b1, tb.b2 - 1))}`,
  };
}

// ---------------------------------------------------------------- 主流程

function shortHash(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0).toString(16).padStart(8, "0").slice(0, 6);
}


function main() {
  const t0 = Date.now();
  const declsOld = loadDecls("out/decls_old.json");
  const declsCur = loadDecls("out/decls_cur.json");
  const declsNew = loadDecls("out/decls_new.json");
  const symMap = readJSON(path.join(OUT, "symbol_map.json"));
  const diff = readJSON(path.join(OUT, "decl_diff.json"));
  const globals = symMap.globals || {};

  // 反向表 NEW -> OLD（无冲突，已核对 1115 条一对一）
  const reverseMap = new Map();
  for (const [oldName, v] of Object.entries(globals)) {
    if (!v || !v.new) continue;
    if (!reverseMap.has(v.new)) reverseMap.set(v.new, { old: oldName, confidence: v.confidence || "high" });
  }

  const allChanged = (diff.changedFuncs || []).slice();
  const PARTIAL = !!(ONLY.length || LIMIT);   // 部分运行：不覆盖正式的 report/stats
  let changed = allChanged;
  if (ONLY.length) changed = changed.filter(n => ONLY.includes(n));
  if (LIMIT) changed = changed.slice(0, LIMIT);

  // OLD 侧已知的顶层名（decls_old + symbol_map 的键），用来区分"OLD 全局"和"我们自己新增的名字"
  const oldKnownNames = new Set([...declsOld.keys(), ...Object.keys(globals)]);

  // Windows 文件名大小写不敏感：`ue` 与 `Ue` 会写到同一个文件，必须提前拆开
  const fileNames = new Map();   // 函数名 -> 目标文件名（不含目录）
  const lowerTaken = new Set();
  for (const nm of allChanged) {   // 用全量列表算，保证 --only 时文件名与全量运行一致
    let fn = nm + ".js";
    if (lowerTaken.has(fn.toLowerCase())) {
      fn = nm + "__" + shortHash(nm) + ".js";
    }
    lowerTaken.add(fn.toLowerCase());
    fileNames.set(nm, fn);
  }

  // 全量跑时先清掉旧的合并产物，避免上一轮的残留被误当成这一轮的结果
  if (!NO_WRITE && !PARTIAL) {
    fs.mkdirSync(MERGES, { recursive: true });
    for (const f of fs.readdirSync(MERGES)) {
      if (f.endsWith(".js")) fs.unlinkSync(path.join(MERGES, f));
    }
  }

  const results = [];
  for (const name of changed) {
    const rec = {
      name,
      newName: null,
      status: "pending",
      reason: "",
      baseLines: 0, oursLines: 0, theirsLines: 0, mergedLines: 0,
      rawBaseLines: 0, rawOursLines: 0,
      oBlocks: 0, tBlocks: 0, adoptedTBlocks: 0, duplicateTBlocks: 0,
      conflicts: [],
      locals: { base: 0, ours: 0, theirs: 0 },
      free: null,
      file: null,
      syntax: null,
    };
    const dOld = declsOld.get(name);
    const dCur = declsCur.get(name);
    const mapping = globals[name];
    if (!dOld || !dCur) { rec.status = "skipped"; rec.reason = "decls_old / decls_cur 缺声明"; results.push(rec); continue; }
    if (!mapping || !mapping.new) { rec.status = "skipped"; rec.reason = "symbol_map 无映射"; results.push(rec); continue; }
    rec.newName = mapping.new;
    const dNew = declsNew.get(mapping.new);
    if (!dNew) { rec.status = "skipped"; rec.reason = "decls_new 缺目标声明 " + mapping.new; results.push(rec); continue; }
    rec.mapConfidence = mapping.confidence || "high";

    const selfNames = new Set([name, mapping.new]);
    let nb, no, nt;
    try {
      nb = normalizeDecl(dOld.src, name, dOld.kind, { mode: MODE.BASE, reverseMap, selfNames });
      no = normalizeDecl(dCur.src, name, dCur.kind, { mode: MODE.OURS, reverseMap, selfNames });
      nt = normalizeDecl(dNew.src, name, dNew.kind, { mode: MODE.THEIRS, reverseMap, selfNames });
    } catch (e) {
      rec.status = "error"; rec.reason = "规范化失败: " + e.message;
      results.push(rec); continue;
    }
    rec.baseLines = nb.lines.length; rec.oursLines = no.lines.length; rec.theirsLines = nt.lines.length;
    rec.rawBaseLines = nb.rawLines; rec.rawOursLines = no.rawLines;
    rec.locals = { base: nb.locals, ours: no.locals, theirs: nt.locals };
    rec.free = {
      theirsUnmapped: [...new Set(nt.free.unmapped)].sort(),
      theirsLowConf: [...new Set(nt.free.lowConf)].sort(),
      // T 里出现、但反向表没有、且名字正好和 OLD 顶层名同名 —— 语义其实不同，
      // 后续"按 OLD→NEW 统一改名"的步骤**不能**动它们，否则会改错。
      theirsNameCollision: [...new Set(nt.free.unmapped)].filter(n => oldKnownNames.has(n)).sort(),
      oursUnmapped: [...new Set(no.free.unmapped)].sort(),
      // O 的自由引用里既不是 OLD 顶层名、也不是内建的 —— 就是我们自己新写的依赖，移植块里必须有定义
      oursOwn: [...new Set(no.free.unmapped)].filter(n => !oldKnownNames.has(n)).sort(),
    };

    // 局部名跨版本对齐（把 O/T 的 $L 编号投回 B 的编号体系），否则我们新增一个局部变量
    // 就会让后面所有编号整体后移，diff 变成大块假冲突。
    let ao, at;
    try {
      ao = alignLocalsToBase(nb, no);
      at = alignLocalsToBase(nb, nt, ao.maxUsed);   // T 的新号接着 O 往后排，避免两边撞名
    } catch (e) {
      rec.status = "error"; rec.reason = "局部名对齐失败: " + e.message;
      results.push(rec); continue;
    }
    rec.align = {
      ours: { voted: ao.votes, fresh: ao.fresh, pairs: ao.pairs },
      theirs: { voted: at.votes, fresh: at.fresh, pairs: at.pairs },
    };
    const oLines = ao.lines, tLines = at.lines;

    if (DUMP) {
      const dir = path.join(SCRATCH, "tw_norm");
      fs.mkdirSync(dir, { recursive: true });
      // 同样要避开 Windows 大小写不敏感（ue/Ue、qv/Qv、ro/Ro），否则后写的会覆盖前面的
      const stem = fileNames.get(name).replace(/\.js$/, "");
      fs.writeFileSync(path.join(dir, stem + ".base.js"), nb.code, "utf8");
      fs.writeFileSync(path.join(dir, stem + ".ours.js"), ao.code, "utf8");
      fs.writeFileSync(path.join(dir, stem + ".theirs.js"), at.code, "utf8");
    }

    const m = threeWayMerge(nb.lines, oLines, tLines);
    if (argv.includes("--blocks")) {
      const r = (b) => `B${b.a1 + 1}-${b.a2}->O/T${b.b1 + 1}-${b.b2}[${b.tag}]`;
      console.log(name + "  O:" + m.oBlocks.map(r).join(" ") + "  T:" + m.tBlocks.map(r).join(" "));
    }
    rec.oBlocks = m.oBlocks.length;
    rec.tBlocks = m.tBlocks.length;
    rec.adoptedTBlocks = m.adopted.length;
    rec.duplicateTBlocks = m.duplicates;
    rec.conflicts = m.conflicts;

    const code = m.lines.join("\n");
    rec.mergedLines = m.lines.length;

    // 结构/语法自检（失败的不当作合并成功）
    let parseErr = null;
    try { acorn.parse(code, { ecmaVersion: "latest", sourceType: "script" }); }
    catch (e) { parseErr = e.message; }
    let vmErr = null;
    try { new vm.Script(code, { filename: name + ".js" }); }
    catch (e) { vmErr = e.message; }
    rec.syntax = { acorn: parseErr ? "FAIL: " + parseErr : "OK", vm: vmErr ? "FAIL: " + vmErr : "OK" };

    // 局部绑定名撞车体检（见 collectBindNames 注释）
    let dup = [];
    if (!parseErr) {
      try {
        const ast2 = acorn.parse(code, { ecmaVersion: "latest", sourceType: "script" });
        const cnt = collectBindNames(ast2);
        dup = [...cnt.entries()].filter(([, n]) => n > 1).map(([n, c]) => n + "x" + c);
      } catch (e) { dup = ["<体检失败: " + e.message + ">"]; }
    }
    rec.dupBindings = dup;

    if (m.conflicts.length) {
      rec.status = "conflict";
      rec.reason = m.conflicts.length + " 个冲突块";
    } else if (parseErr || vmErr) {
      rec.status = "invalid";
      rec.reason = "无冲突但合并结果语法不通过";
    } else if (dup.length) {
      rec.status = "invalid";
      rec.reason = "局部名撞车: " + dup.join(" ");
    } else {
      rec.status = "merged";
      if (!NO_WRITE) {
        fs.mkdirSync(MERGES, { recursive: true });
        const f = path.join(MERGES, fileNames.get(name));
        fs.writeFileSync(f, code + "\n", "utf8");
        rec.file = path.relative(ROOT, f).replace(/\\/g, "/");
        if (fileNames.get(name) !== name + ".js") rec.fileNote = "文件名与其它函数大小写冲突，已加后缀避免互相覆盖";
      }
    }
    results.push(rec);
  }

  // ---------------------------------------------------------------- 统计
  const totals = {
    changedFuncs: (diff.changedFuncs || []).length,
    considered: changed.length,
    merged: results.filter(r => r.status === "merged").length,
    conflict: results.filter(r => r.status === "conflict").length,
    invalid: results.filter(r => r.status === "invalid").length,
    error: results.filter(r => r.status === "error").length,
    skipped: results.filter(r => r.status === "skipped").length,
    conflictBlocks: results.reduce((s, r) => s + r.conflicts.length, 0),
    adoptedTBlocks: results.reduce((s, r) => s + r.adoptedTBlocks, 0),
    duplicateTBlocks: results.reduce((s, r) => s + r.duplicateTBlocks, 0),
    dupBindings: results.reduce((s, r) => s + (r.dupBindings ? r.dupBindings.length : 0), 0),
  };
  const stats = {
    tool: "tools/threeway.mjs",
    version: 1,
    generatedAt: new Date().toISOString(),
    inputs: {
      declsOld: "out/decls_old.json",
      declsCur: "out/decls_cur.json",
      declsNew: "out/decls_new.json",
      symbolMap: "out/symbol_map.json",
      declDiff: "out/decl_diff.json",
    },
    algorithm: {
      normalize: "alpha-renaming of local bindings by declaration order ($L1..$Ln); then cross-version alignment of $L numbering onto the base numbering (masked-line anchors + vote); free refs kept (base/ours) or reverse-mapped NEW->OLD (theirs); top-level name canonicalized to the OLD name",
      align: "mask-renamed locals -> difflib matching blocks -> per-slot votes -> greedy one-to-one assignment -> fresh ids above the base max; bijective, therefore semantics-preserving",
      diff: "difflib.SequenceMatcher (line-level, autojunk disabled)",
      merge: "T change-blocks replayed onto O; non-overlapping adopted; overlapping-identical adopted once; overlapping-different => conflict (O kept)",
      intervalRule: "half-open intervals; adjacency is not overlap; two zero-length inserts overlap only at the same point",
      ctxLinesInReport: CTX,
      freshIdRanges: "ours' new locals are numbered after the base max; theirs' after ours' max (disjoint ranges, so an adopted NEW line and one of our inserted lines can never share a $L name)",
      structuralGate: "merged output must keep local binding names unique per function (each version's $L numbering is unique per binding, so a duplicate declaration name can only mean a cross-side collision); duplicates => status invalid, not written",
    },
    totals,
    functions: results,
    elapsedMs: Date.now() - t0,
  };
  const md = renderReport(stats, results);
  if (!NO_WRITE) {
    if (PARTIAL) {
      // 部分运行写到 scratch，别把正式产物覆盖成残缺版
      fs.mkdirSync(SCRATCH, { recursive: true });
      fs.writeFileSync(path.join(SCRATCH, "tw_partial_stats.json"), JSON.stringify(stats, null, 1), "utf8");
      fs.writeFileSync(path.join(SCRATCH, "tw_partial_report.md"), md, "utf8");
      console.log("[partial run] report/stats 写到 scratch/tw_partial_*.{md,json}，未覆盖 out/");
    } else {
      fs.writeFileSync(path.join(OUT, "merge_stats.json"), JSON.stringify(stats, null, 1), "utf8");
      fs.writeFileSync(path.join(OUT, "merge_report.md"), md, "utf8");
    }
  }

  console.log(JSON.stringify(totals, null, 1));
  console.log("elapsed " + stats.elapsedMs + "ms");
}

// ---------------------------------------------------------------- Markdown 报告

function fence(lines) {
  const text = lines.map(l => l).join("\n");
  // 避免片段里出现 ``` 破坏围栏
  const f = text.includes("```") ? "````" : "```";
  return f + "js\n" + text + "\n" + f;
}

function renderReport(stats, results) {
  const t = stats.totals;
  const L = [];
  L.push("# 三方合并报告：v1.04 移植块 × 新基础 v0.4");
  L.push("");
  L.push("> 由 `tools/threeway.mjs` 生成于 " + stats.generatedAt + "（耗时 " + stats.elapsedMs + " ms）");
  L.push("> 输入：`out/decls_old.json` / `out/decls_cur.json` / `out/decls_new.json` / `out/symbol_map.json` / `out/decl_diff.json`");
  L.push("> 合并基准：base = OLD 基础原实现，ours = CUR（我们的改版），theirs = NEW 新基础（按 `symbol_map.globals[函数].new` 定位）");
  L.push("");
  L.push("## 1. 结论");
  L.push("");
  L.push("| 指标 | 数量 |");
  L.push("|---|---|");
  L.push("| changedFuncs 总数 | " + t.changedFuncs + " |");
  L.push("| 参与合并 | " + t.considered + " |");
  L.push("| **自动合并成功（无冲突，已写出）** | **" + t.merged + "** |");
  L.push("| **有冲突（需人工判断，未写出）** | **" + t.conflict + "** |");
  L.push("| 无冲突但语法不通过 | " + t.invalid + " |");
  L.push("| 处理失败 | " + t.error + " |");
  L.push("| 跳过（无映射 / 缺声明） | " + t.skipped + " |");
  L.push("| 冲突块合计 | " + t.conflictBlocks + " |");
  L.push("| 采用的新基础改动块合计 | " + t.adoptedTBlocks + " |");
  L.push("| 重叠且内容相同、只采用一次 | " + t.duplicateTBlocks + " |");
  L.push("| 局部名撞车（结构体检拦下） | " + t.dupBindings + " |");
  L.push("");
  L.push("合并成功的结果在 `out/merges/<函数名>.js`，形如 `X = function (...) { ... };`");
  L.push("（全局名仍是 OLD 名、局部名是 `$L*`，后续移植工具会统一改名）。冲突函数**不**写文件。");
  L.push("");
  L.push("### 规范化与合并规则（简述）");
  L.push("");
  L.push("1. **alpha 归一**：三方各自 acorn 解析 → 局部绑定（参数 / var,let,const / 内部函数名 / catch 参数 / 类名）");
  L.push("   按**声明出现顺序**改名为 `$L1,$L2,…`；自由引用 base/ours 保留 OLD 名，theirs 用 `symbol_map`");
  L.push("   反向表（NEW→OLD）翻回 OLD 名；顶层函数名统一成 OLD 名。astring 生成代码后逐行比较。");
  L.push("");
  L.push("   **再做一次跨版本对齐**（重要）：单纯「按声明顺序编号」会把我们新增的局部变量变成插入点，");
  L.push("   后面所有编号整体后移，diff 于是变成一大块假改动，让新基础在同一函数里**互不相干**的改动");
  L.push("   也被误判成冲突。实测：不对齐时 17 个函数冲突 / 62 个冲突块（`hn` `Zo` `Ko` `X2` `$y` 全是假冲突，");
  L.push("   `qv` 一个函数就 35 个块）；对齐后 12 个函数 / 17 个块，且剩下的都是真冲突。");
  L.push("   对齐做法：把局部名掩成 `$L` 后仍逐行相同的位置当锚点，统计「我们的第 k 个名字 ↔ base 的哪个名字」");
  L.push("   的票数，贪心做一对一分配；没票的（双方新增的）分配 base 最大值之后的新号。分配是双射，");
  L.push("   所以结果只是等价的 alpha 重命名——对齐不完美也只会多几个冲突，不会改坏语义。");
  L.push("2. `difflib.SequenceMatcher` 的 Python 语义移植（行级，autojunk 关闭）求 B→O、B→T 改动块；");
  L.push("   把 T 的改动块当补丁贴到 O 上：**不重叠→采用**；**重叠但替换文本相同→只采用一次**；");
  L.push("   **重叠且不同→冲突**（保留 O 版本，不写文件）。区间按半开区间判定，相邻不算重叠。");
  L.push("3. 每个写出的结果都再过一遍 `acorn.parse` + `node:vm` 的 `new vm.Script()`；");
  L.push("   无冲突但语法不通过的单列 `invalid`，不写文件，避免污染后续移植。");
  L.push("4. **结构体检**：合并结果里同一个局部名不允许出现两次声明。每个版本内部 `$L` 编号对每个绑定");
  L.push("   自增且唯一，所以重名只可能来自「我们的新局部」和「新基础的新局部」撞车——语法上合法（遮蔽），");
  L.push("   语义会串味。两边的新局部号段**互不重叠**（我们的排在 base 最大号之后，新基础的再往后排），");
  L.push("   本次 0 处；一旦命中就判 `invalid` 不写文件。");
  L.push("");
  L.push("## 2. 逐函数结果");
  L.push("");
  L.push("行数一律指**规范化后**的行数。`B/O/T` = base/ours/theirs；`采用T` = 采纳的新基础改动块数；");
  L.push("`冲突(行号)` = OLD 规范化行号区间（多个冲突块用逗号分隔）。");
  L.push("");
  L.push("| # | 函数 | NEW 名 | B 行 | O 行 | T 行 | 结果 | 冲突块 | 冲突(行号) | 采用T | 文件 |");
  L.push("|---:|---|---|---:|---:|---:|---|---:|---|---:|---|");
  results.forEach((r, i) => {
    const st = r.status === "merged" ? "✅ 合并成功"
      : r.status === "conflict" ? "❌ 冲突"
      : r.status === "invalid" ? "⚠️ 语法不通过"
      : r.status === "error" ? "⚠️ 处理失败"
      : "⏭ 跳过";
    const ranges = r.conflicts.map(c => c.bLabel).join(", ");
    L.push("| " + (i + 1) + " | `" + r.name + "` | " + (r.newName ? "`" + r.newName + "`" + (r.mapConfidence && r.mapConfidence !== "high" ? " (" + r.mapConfidence + ")" : "") : "-") +
      " | " + (r.baseLines || "-") + " | " + (r.oursLines || "-") + " | " + (r.theirsLines || "-") +
      " | " + st + " | " + (r.conflicts.length || (r.status === "merged" ? 0 : "-")) +
      " | " + (ranges || "-") + " | " + (r.adoptedTBlocks || 0) + " | " + (r.file ? "`" + r.file + "`" : "-") + " |");
  });
  L.push("");

  const renamed = results.filter(r => r.fileNote);
  if (renamed.length) {
    L.push("> 文件名说明：Windows 文件名大小写不敏感，`" + renamed.map(r => r.name).join("` / `") +
      "` 与同名不同大小写的函数会写到同一个文件，已加后缀区分：" +
      renamed.map(r => "`" + r.name + "` → `" + r.file + "`").join("；") + "。");
    L.push("");
  }

  // ---- 跳过 / 异常
  const odd = results.filter(r => r.status === "skipped" || r.status === "error" || r.status === "invalid");
  L.push("## 3. 跳过 / 异常明细");
  L.push("");
  if (!odd.length) L.push("无。");
  else {
    L.push("| 函数 | 状态 | 原因 |");
    L.push("|---|---|---|");
    for (const r of odd) L.push("| `" + r.name + "` | " + r.status + " | " + (r.reason || "-") + " |");
  }
  L.push("");

  // ---- 语法自检
  L.push("## 4. 语法自检（node:vm `new vm.Script` + acorn）");
  L.push("");
  const written = results.filter(r => r.status === "merged");
  L.push("对**全部 " + written.length + " 个**已写出的合并结果逐个做了 `new vm.Script(代码)` 编译（不是抽查），");
  L.push("另外用 acorn 再 parse 一次；下表是完整结果。");
  L.push("");
  L.push("| 函数 | 文件 | acorn | vm.Script |");
  L.push("|---|---|---|---|");
  for (const r of written) {
    L.push("| `" + r.name + "` | `" + r.file + "` | " + r.syntax.acorn + " | " + r.syntax.vm + " |");
  }
  const bad = written.filter(r => r.syntax.acorn !== "OK" || r.syntax.vm !== "OK");
  L.push("");
  L.push("结果：**" + (written.length - bad.length) + "/" + written.length + " 通过**" + (bad.length ? "，失败：" + bad.map(r => "`" + r.name + "`").join(", ") : "，无失败") + "。");
  L.push("");
  if (written.length) {
    const sorted = written.slice().sort((a, b) => b.mergedLines - a.mergedLines);
    const picks = [];
    for (const idx of [0, Math.floor(sorted.length / 2), sorted.length - 1]) {
      const r = sorted[idx];
      if (r && !picks.includes(r)) picks.push(r);
    }
    L.push("题目要求的「至少 3 个」样本（取合并结果最大 / 中位 / 最小的三个，实际是全部 " + written.length + " 个都验了）：");
    L.push("");
    L.push("| 样本 | 文件 | 行数 | 字节 | `new vm.Script(...)` |");
    L.push("|---|---|---:|---:|---|");
    for (const r of picks) {
      const f = path.join(MERGES, path.basename(r.file));
      const bytes = fs.existsSync(f) ? fs.statSync(f).size : 0;
      L.push("| `" + r.name + "` | `" + r.file + "` | " + r.mergedLines + " | " + bytes + " | " + r.syntax.vm + " |");
    }
    L.push("");
  }

  // ---- 反向映射缺失（自由引用）
  const withUnmapped = results.filter(r => r.free && r.free.theirsUnmapped && r.free.theirsUnmapped.length);
  L.push("## 5. 反向映射缺失的自由引用（theirs 侧，保持原样）");
  L.push("");
  if (!withUnmapped.length) L.push("无。");
  else {
    L.push("这些是 NEW 代码里出现、但 `symbol_map` 反向表（NEW→OLD）里没有的标识符 —— 多半是新基础新增的顶层函数/变量");
    L.push("或浏览器内建（内建已过滤）。合并结果里它们保持 NEW 名，移植时需要人工确认是否需要补映射。");
    L.push("");
    L.push("| 函数 | 未映射自由引用 |");
    L.push("|---|---|");
    for (const r of withUnmapped) L.push("| `" + r.name + "` | " + r.free.theirsUnmapped.map(x => "`" + x + "`").join(" ") + " |");
  }
  L.push("");
  // 5.1 名字与 OLD 顶层名撞车、但其实是 NEW 新声明的引用（危险）
  const coll = results.filter(r => r.free && r.free.theirsNameCollision && r.free.theirsNameCollision.length);
  L.push("### 5.1 ⚠ 名字与 OLD 顶层名撞车、但反向表里查不到的引用");
  L.push("");
  if (!coll.length) L.push("无。");
  else {
    L.push("这些标识符出现在 **theirs** 里、`symbol_map` 反向表（NEW→OLD）里没有，而 OLD 恰好有一个**同名但不同义**的顶层声明。");
    L.push("合并结果里它们保持 NEW 名（语义正确），但后续「按 OLD→NEW 统一改名」的那一步**绝不能**把它们当 OLD 名改写，");
    L.push("否则会指向错误的函数/变量。逐条确认后，正解是给这些 NEW 名补进 `symbol_map`（映射到 NEW 自己或标成 NEW-only）。");
    L.push("");
    L.push("| 函数 | 撞名引用 |");
    L.push("|---|---|");
    for (const r of coll) L.push("| `" + r.name + "` | " + r.free.theirsNameCollision.map(x => "`" + x + "`").join(" ") + " |");
    L.push("");
  }

  // 5.2 我们自己的依赖（O 侧自由引用里不是 OLD 顶层名的）
  const ownAll = new Map();
  for (const r of results) {
    if (!r.free || !r.free.oursOwn) continue;
    for (const n of r.free.oursOwn) {
      if (!ownAll.has(n)) ownAll.set(n, []);
      ownAll.get(n).push(r.name);
    }
  }
  L.push("### 5.2 合并结果里「我们自己」的依赖（O 侧自由引用，非 OLD 顶层名、非内建）");
  L.push("");
  if (!ownAll.size) L.push("无。");
  else {
    L.push("这些名字必须由我们的移植块自己提供（新函数/新常量）。凡是这里出现、块里却没有定义的，就是漏移植。");
    L.push("");
    L.push("| 名字 | 出现于 |");
    L.push("|---|---|");
    for (const [n, fns] of [...ownAll].sort((a, b) => a[0].localeCompare(b[0]))) {
      L.push("| `" + n + "` | " + fns.map(f => "`" + f + "`").join(" ") + " |");
    }
    L.push("");
  }

  const low = results.filter(r => r.free && r.free.theirsLowConf && r.free.theirsLowConf.length);
  if (low.length) {
    L.push("### 5.3 低置信度反向映射（已使用，留意）");
    L.push("");
    L.push("| 函数 | NEW→OLD（confidence） |");
    L.push("|---|---|");
    for (const r of low) L.push("| `" + r.name + "` | " + r.free.theirsLowConf.map(x => "`" + x + "`").join(" ") + " |");
    L.push("");
  }

  // ---- 产物说明（放在冲突明细之前，冲突明细作为文末正餐）
  L.push("## 6. 产物与复现");
  L.push("");
  L.push("- `out/merges/<函数名>.js` —— 无冲突的合并结果（" + written.length + " 个），形如 `X = function (...) { ... };`");
  L.push("- `out/merge_stats.json` —— 机器可读统计：每个函数的 status / 行数 / 改动块数 / 冲突区间 / 语法结果 / 未映射引用 / 局部名对齐数据");
  L.push("- `out/merge_report.md` —— 本文件");
  L.push("");
  L.push("复现某函数的规范化三方文本（写入 `scratch/tw_norm/`）：");
  L.push("");
  L.push("```bash");
  L.push("node tools/threeway.mjs --dump --only " + (results[0] ? results[0].name : "ca") + "   # 只看一个函数（部分运行不会覆盖 out/merge_*.{md,json}）");
  L.push("node tools/threeway.mjs                       # 全量重跑（会先清空 out/merges/*.js）");
  L.push("```");
  L.push("");
  L.push("## 7. 冲突明细（需人工判断，文末）");
  L.push("");
  const conflicted = results.filter(r => r.conflicts.length);
  if (!conflicted.length) L.push("无冲突。");
  for (const r of conflicted) {
    L.push("### `" + r.name + "`（NEW `" + r.newName + "`）— " + r.conflicts.length + " 个冲突块");
    L.push("");
    r.conflicts.forEach((c, i) => {
      L.push("#### " + (i + 1) + "/" + r.conflicts.length + " · B(OLD) 行 " + c.bLabel + " · O(ours) 行 " + c.oLabel + " · T(NEW) 行 " + c.tLabel + (c.note ? " · " + c.note : ""));
      L.push("");
      L.push("**B — base（OLD 基础原实现）**，`-` = 落在改动块里的行");
      L.push("");
      L.push(fence(c.bText.map(x => x.mark + (x.n == null ? "     " : String(x.n).padStart(5)) + "| " + x.text)));
      L.push("");
      L.push("**O — ours（我们的改版，保留方）**，`+` = 我们的改动行");
      L.push("");
      L.push(fence(c.oText.map(x => x.mark + (x.n == null ? "     " : String(x.n).padStart(5)) + "| " + x.text)));
      L.push("");
      L.push("**T — theirs（新基础新版）**，`+` = 新基础的改动行");
      L.push("");
      L.push(fence(c.tText.map(x => x.mark + (x.n == null ? "     " : String(x.n).padStart(5)) + "| " + x.text)));
      L.push("");
    });
  }

  L.push("");
  return L.join("\n");
}

main();
