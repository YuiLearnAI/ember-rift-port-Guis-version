// rewrite.mjs —— 把 v1.04 的代码片段改写成能放进新基础(NEW)的形态
//
//   node rewrite.mjs --map <symbol_map.json> --in <snippet.js> --out <out.js>
//                    [--locals '{"e":"n","t":"x"}']   // 片段所在外层函数的参数/局部名映射
//                    [--report <report.json>]
//
// 规则：
//   1. 片段按 Program 解析（完整语句）；解析失败再按函数体解析一次。
//   2. 片段自身顶层声明（function xxx / var xxx）保留原名 —— 它们会变成 IIFE 作用域里的名字。
//   3. 片段内部所有嵌套绑定（参数、局部 var/let/const、内部函数名、catch 参数）统一改名为 _v1/_v2/… ，
//      避免与新基础的短名全局（如状态对象 n）相互遮蔽。
//   4. 未解析到绑定的标识符 = 自由引用 → 按 symbol_map.json 的 globals 翻译；--locals 里的优先。
//      没有映射的自由引用会原样保留并写进报告的 unmapped，供人工确认。

import fs from "node:fs";
import path from "node:path";
import * as acorn from "./jstools/node_modules/acorn/dist/acorn.mjs";
import * as astringMod from "./jstools/node_modules/astring/dist/astring.mjs";
const astring = astringMod.default || astringMod;

const args = process.argv.slice(2);
function arg(name, def) {
  const i = args.indexOf("--" + name);
  return i >= 0 ? args[i + 1] : def;
}
const mapPath = arg("map");
const inPath = arg("in");
const outPath = arg("out");
const reportPath = arg("report");
const localsRaw = arg("locals", "{}");
const MINIMAL = args.includes("--minimal");
const locals = JSON.parse(localsRaw);

const map = mapPath && fs.existsSync(mapPath)
  ? JSON.parse(fs.readFileSync(mapPath, "utf8"))
  : { globals: {} };

let src = fs.readFileSync(inPath, "utf8");
let mode = "program";
let ast;
try {
  ast = acorn.parse(src, { ecmaVersion: "latest", sourceType: "script", locations: true });
} catch (e) {
  mode = "function-body";
  try {
    ast = acorn.parse("(function(){\n" + src + "\n})", { ecmaVersion: "latest", sourceType: "script", locations: true });
  } catch (e2) {
    console.error("PARSE FAILED: " + e.message + "\n  also as function body: " + e2.message);
    process.exit(2);
  }
}

// ---------- 作用域 ----------
class Scope {
  constructor(parent, isFn) {
    this.parent = parent;
    this.isFn = isFn;
    this.names = new Map(); // name -> {rename:null|string}
  }
  declare(name) {
    if (!this.names.has(name)) this.names.set(name, { rename: null });
    return this.names.get(name);
  }
  lookup(name) {
    let s = this;
    while (s) {
      if (s.names.has(name)) return { scope: s, binding: s.names.get(name) };
      s = s.parent;
    }
    return null;
  }
}

const programScope = new Scope(null, true);
const scopeOf = new Map(); // node -> scope created by node
const blockScopes = new Map();

function fnScopeOf(node) { return scopeOf.get(node) || programScope; }

// 建立作用域树 + 收集声明
function scopePass(node, scope, parentKey, key) {
  if (!node || typeof node.type !== "string") return;
  switch (node.type) {
    case "FunctionDeclaration":
    case "FunctionExpression":
    case "ArrowFunctionExpression": {
      if (node.type === "FunctionDeclaration" && node.id) scope.declare(node.id.name);
      const fs_ = new Scope(scope, true);
      scopeOf.set(node, fs_);
      for (const p of node.params) declarePattern(p, fs_);
      const body = node.body;
      if (body.type === "BlockStatement") {
        for (const st of body.body) scopePass(st, fs_);
      } else {
        scopePass(body, fs_);
      }
      return;
    }
    case "BlockStatement": {
      const bs = new Scope(scope, false);
      blockScopes.set(node, bs);
      for (const st of node.body) scopePass(st, bs);
      return;
    }
    case "ForStatement":
    case "ForInStatement":
    case "ForOfStatement":
    case "SwitchStatement": {
      const bs = new Scope(scope, false);
      blockScopes.set(node, bs);
      // 用块作用域遍历子节点（否则 let/const 声明会落到外层）
      for (const k of Object.keys(node)) {
        if (k === "loc" || k === "start" || k === "end" || k === "type") continue;
        const v = node[k];
        if (Array.isArray(v)) { for (const c of v) if (c && typeof c.type === "string") scopePass(c, bs); }
        else if (v && typeof v.type === "string") scopePass(v, bs);
      }
      return;
    }
    case "VariableDeclaration": {
      const target = node.kind === "var" ? nearestFn(scope) : scopeForBlock(scope);
      for (const d of node.declarations) {
        declarePattern(d.id, target);
        if (d.init) scopePass(d.init, scope);
      }
      return;
    }
    case "ClassDeclaration": {
      if (node.id) scope.declare(node.id.name);
      if (node.superClass) scopePass(node.superClass, scope);
      scopePass(node.body, scope);
      return;
    }
    case "CatchClause": {
      const cs = new Scope(scope, false);
      blockScopes.set(node, cs);
      if (node.param) declarePattern(node.param, cs);
      scopePass(node.body, cs);
      return;
    }
  }
  for (const k of Object.keys(node)) {
    if (k === "loc" || k === "start" || k === "end" || k === "type") continue;
    const v = node[k];
    if (Array.isArray(v)) { for (const c of v) if (c && typeof c.type === "string") scopePass(c, scope); }
    else if (v && typeof v.type === "string") scopePass(v, scope);
  }
}
function nearestFn(scope) { let s = scope; while (s && !s.isFn) s = s.parent; return s || programScope; }
function scopeForBlock(scope) { return scope; }
function declarePattern(p, scope) {
  if (!p) return;
  switch (p.type) {
    case "Identifier": scope.declare(p.name); break;
    case "ObjectPattern":
      for (const prop of p.properties) {
        if (prop.type === "RestElement") declarePattern(prop.argument, scope);
        else { if (prop.computed) declarePattern(prop.key, scope); declarePattern(prop.value, scope); }
      }
      break;
    case "ArrayPattern": for (const el of p.elements) if (el) declarePattern(el, scope); break;
    case "RestElement": declarePattern(p.argument, scope); break;
    case "AssignmentPattern": declarePattern(p.left, scope); declarePattern(p.right, scope); break;
  }
}
scopePass(ast, programScope);

// ---------- 分配新名字 ----------
let vN = 0;
const renamed = new Map(); // binding object -> newName
const targetNames = new Set();
for (const v of Object.values(map.globals || {})) if (v && v.new) targetNames.add(v.new);
function renameFor(binding) {
  if (!binding.rename) binding.rename = "_v" + (++vN);
  return binding.rename;
}
function localRename(binding) {
  if (!MINIMAL) return renameFor(binding);
  return binding.rename || null;  // 只有确实需要时才赋值
}

// ---------- 改写 ----------
const freeUsed = new Set();
const mappedUsed = new Map();
const unmapped = new Set();
const unmappedSamples = new Map();

function resolveIdent(name, scope) {
  return scope.lookup(name);
}

function isReferencePos(node, parent, key) {
  if (!parent) return true;
  switch (parent.type) {
    case "MemberExpression":
      return !(key === "property" && !parent.computed);
    case "Property":
      if (key === "key" && !parent.computed) return false;
      return true; // shorthand 的 value 是引用
    case "MethodDefinition":
    case "PropertyDefinition":
      if (key === "key" && !parent.computed) return false;
      return true;
    case "LabeledStatement":
    case "BreakStatement":
    case "ContinueStatement":
      return false;
    case "ExportSpecifier":
      return key === "local";
    case "ImportSpecifier":
      return false;
  }
  return true;
}

function transform(node, scope, parent, key) {
  if (!node || typeof node.type !== "string") return;
  switch (node.type) {
    case "Identifier": {
      const r = resolveIdent(node.name, scope);
      if (r) {
        if (r.scope === programScope) return; // 保留顶层声明名
        if (MINIMAL) { if (targetNames.has(node.name)) node.name = renameFor(r.binding); return; }
        node.name = renameFor(r.binding);
      } else if (isReferencePos(node, parent, key)) {
        freeUsed.add(node.name);
        const m = locals[node.name] || (map.globals && map.globals[node.name] && map.globals[node.name].new);
        if (m) { node.name = m; mappedUsed.set(node.name, m); }
        else { unmapped.add(node.name); if ((unmappedSamples.get(node.name) || []).length < 3) { const arr = unmappedSamples.get(node.name) || []; arr.push((node.loc ? node.loc.start.line : -1) + ':' + node.name); unmappedSamples.set(node.name, arr); } }
      }
      return;
    }
    case "FunctionDeclaration":
    case "FunctionExpression":
    case "ArrowFunctionExpression": {
      const fs_ = fnScopeOf(node);
      if (node.id) {
        const r = fs_.parent ? fs_.parent.lookup(node.id.name) : null;
        if (r && r.scope !== programScope) { if (!MINIMAL || targetNames.has(node.id.name)) node.id.name = renameFor(r.binding); }
      }
      for (const p of node.params) transformPattern(p, fs_);
      if (node.body.type === "BlockStatement") for (const st of node.body.body) transform(st, fs_, node.body, "body");
      else transform(node.body, fs_);
      return;
    }
    case "BlockStatement": {
      const bs = blockScopes.get(node) || scope;
      for (const st of node.body) transform(st, bs, node, "body");
      return;
    }
    case "ForStatement":
    case "ForInStatement":
    case "ForOfStatement":
    case "SwitchStatement": {
      const fs2 = blockScopes.get(node) || scope;
      for (const k of Object.keys(node)) {
        if (k === "loc" || k === "start" || k === "end" || k === "type") continue;
        const v = node[k];
        if (Array.isArray(v)) { for (const c of v) if (c && typeof c.type === "string") transform(c, fs2, node, k); }
        else if (v && typeof v.type === "string") transform(v, fs2, node, k);
      }
      return;
    }
    case "VariableDeclaration": {
      const target = node.kind === "var" ? nearestFn(scope) : scope;
      for (const d of node.declarations) {
        transformPattern(d.id, target);
        if (d.init) transform(d.init, scope, d, "init");
      }
      return;
    }
    case "ClassDeclaration": {
      if (node.id) {
        const r = scope.lookup(node.id.name);
        if (r && r.scope !== programScope) { if (!MINIMAL || targetNames.has(node.id.name)) node.id.name = renameFor(r.binding); }
      }
      if (node.superClass) transform(node.superClass, scope);
      transform(node.body, scope);
      return;
    }
    case "CatchClause": {
      const cs = blockScopes.get(node) || scope;
      if (node.param) transformPattern(node.param, cs);
      transform(node.body, cs);
      return;
    }
    case "Property": {
      if (node.computed) transform(node.key, scope, node, "key");
      // shorthand 需要展开
      if (node.shorthand && node.value.type === "Identifier") {
        transform(node.value, scope, node, "value");
        if (node.value.name !== node.key.name) node.shorthand = false;
      } else {
        transform(node.value, scope, node, "value");
      }
      return;
    }
    case "MemberExpression": {
      transform(node.object, scope, node, "object");
      if (node.computed) transform(node.property, scope, node, "property");
      return;
    }
  }
  for (const k of Object.keys(node)) {
    if (k === "loc" || k === "start" || k === "end" || k === "type") continue;
    const v = node[k];
    if (Array.isArray(v)) { for (const c of v) if (c && typeof c.type === "string") transform(c, scope, node, k); }
    else if (v && typeof v.type === "string") transform(v, scope, node, k);
  }
}

function transformPattern(p, scope) {
  if (!p) return;
  switch (p.type) {
    case "Identifier": {
      const r = scope.lookup(p.name);
      if (r && r.scope !== programScope) {
        if (MINIMAL) { if (targetNames.has(p.name)) p.name = renameFor(r.binding); }
        else p.name = renameFor(r.binding);
      }
      return;
    }
    case "ObjectPattern":
      for (const prop of p.properties) {
        if (prop.type === "RestElement") { transformPattern(prop.argument, scope); continue; }
        if (prop.computed) transform(prop.key, scope, prop, "key");
        transformPattern(prop.value, scope);
        if (prop.shorthand && prop.value.type === "Identifier" && prop.key.name !== prop.value.name) prop.shorthand = false;
      }
      return;
    case "ArrayPattern": for (const el of p.elements) if (el) transformPattern(el, scope); break;
    case "RestElement": transformPattern(p.argument, scope); break;
    case "AssignmentPattern": transformPattern(p.left, scope); transform(p.right, scope); break;
  }
}

if (mode === "program") {
  transform(ast, programScope);
} else {
  // 函数体模式：ast 是 ExpressionStatement(FunctionExpression)
  const fn = ast.body[0].expression;
  const fs_ = fnScopeOf(fn);
  for (const st of fn.body.body) transform(st, fs_);
}

let out;
if (mode === "program") out = astring.generate(ast);
else out = astring.generate(ast.body[0].expression.body).replace(/^\{\n?/, "").replace(/\n?\}$/, "");

fs.writeFileSync(outPath, out, "utf8");
const report = {
  mode,
  renamedLocals: [...new Set([...renamed.values()])].sort((a, b) => (+a.slice(2)) - (+b.slice(2))).length,
  freeIdentifiers: [...freeUsed].sort(),
  mapped: Object.fromEntries(mappedUsed),
  unmapped: [...unmapped].sort(),
  unmappedSamples: Object.fromEntries(unmappedSamples),
  outBytes: out.length,
};
if (reportPath) fs.writeFileSync(reportPath, JSON.stringify(report, null, 1), "utf8");
console.log(JSON.stringify(report, null, 1));
if (unmapped.size) console.log("WARN unmapped free identifiers: " + [...unmapped].join(", "));
