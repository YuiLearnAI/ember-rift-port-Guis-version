// diffdecls.mjs —— 比较 OLD(v1.04父本) 与 CUR(v1.04) 的主 IIFE 顶层声明/语句，产出移植块
// 用法:
//   node diffdecls.mjs old.js cur.js --report out/decl_diff.json
//   node diffdecls.mjs old.js cur.js --emit out/gen_block.js
import fs from "node:fs";
import * as acorn from "./jstools/node_modules/acorn/dist/acorn.mjs";

const oldPath = process.argv[2];
const curPath = process.argv[3];
const mode = process.argv[4];
const outPath = process.argv[5];

function parseIife(path) {
  const src = fs.readFileSync(path, "utf8");
  const ast = acorn.parse(src, { ecmaVersion: "latest", sourceType: "script", locations: true });
  function findIife(node) {
    if (!node || typeof node.type !== "string") return null;
    if (node.type === "ExpressionStatement" && node.expression.type === "CallExpression") {
      const ce = node.expression.callee;
      if (ce && (ce.type === "ArrowFunctionExpression" || ce.type === "FunctionExpression")) return ce;
    }
    for (const k of Object.keys(node)) {
      if (k === "loc" || k === "start" || k === "end" || k === "type") continue;
      const v = node[k];
      if (Array.isArray(v)) { for (const c of v) { const r = findIife(c); if (r) return r; } }
      else if (v && typeof v.type === "string") { const r = findIife(v); if (r) return r; }
    }
    return null;
  }
  const iife = findIife(ast);
  return { src, body: iife.body.body };
}

function declMap(parsed) {
  const m = new Map();
  for (const st of parsed.body) {
    if (st.type === "FunctionDeclaration" && st.id) {
      m.set(st.id.name, { kind: "function", node: st, src: parsed.src.slice(st.start, st.end) });
    } else if (st.type === "VariableDeclaration") {
      for (const d of st.declarations) {
        if (d.id.type !== "Identifier") continue;
        m.set(d.id.name, { kind: st.kind, node: d, src: parsed.src.slice(d.start, d.end),
                           init: d.init, nodeStart: d.start, declStart: st.start });
      }
    } else if (st.type === "ClassDeclaration" && st.id) {
      m.set(st.id.name, { kind: "class", node: st, src: parsed.src.slice(st.start, st.end) });
    }
  }
  return m;
}

const O = parseIife(oldPath), C = parseIife(curPath);
const od = declMap(O), cd = declMap(C);

const norm = (s) => s.replace(/\s+/g, " ").trim();
// PROTECT：三方合并结果里某些 NEW 名与 OLD 顶层名同名不同义，改名阶段绝不能碰 → 先替换成哨兵
let PROTECT_ALL = [];
let PROTECT_PER = {};
try {
  const rg = JSON.parse(fs.readFileSync("out/reverse_gap.json", "utf8"));
  PROTECT_ALL = rg.collide_all || rg.collide || [];
  PROTECT_PER = rg.per_function || {};
} catch (e) {}
function protectText(t, fnName) {
  // 按函数精确保护：只有该函数的合并结果里确实来自新基础的名字才跳过改名
  const list = (PROTECT_PER && PROTECT_PER[fnName]) || [];
  if (!list.length) return t;
  const re = new RegExp("(?<![\\w$.])(?:" + list.join("|") + ")(?![\\w$])", "g");
  return t.replace(re, (m) => "__RG_" + m);
}
const newVars = [], newFuncs = [], changedVars = [], changedFuncs = [], sameDecls = [];
for (const [name, d] of cd) {
  const o = od.get(name);
  if (!o) { (d.kind === "function" ? newFuncs : newVars).push(name); continue; }
  if (norm(o.src) === norm(d.src)) { sameDecls.push(name); continue; }
  (d.kind === "function" ? changedFuncs : changedVars).push(name);
}

// 顶层语句（非声明）差异：CUR 有而 OLD 没有的语句
const stmtSrc = (p) => p.body.filter((st) => !(st.type === "FunctionDeclaration" || st.type === "VariableDeclaration" || st.type === "ClassDeclaration"))
  .map((st) => ({ node: st, src: p.src.slice(st.start, st.end) }));
const oStmts = new Set(stmtSrc(O).map((s) => norm(s.src)));
const newStmts = stmtSrc(C).filter((s) => !oStmts.has(norm(s.src)));

const report = {
  oldTop: od.size, curTop: cd.size,
  newVars, newFuncs, changedVars, changedFuncs,
  sameCount: sameDecls.length,
  newStmtCount: newStmts.length,
  newStmts: newStmts.map((s) => ({ type: s.node.type, src: s.src.slice(0, 160), len: s.src.length })),
};
if (mode === "--report") {
  fs.writeFileSync(outPath, JSON.stringify(report, null, 1), "utf8");
  console.log("newVars", newVars.length, "newFuncs", newFuncs.length,
    "changedVars", changedVars.length, "changedFuncs", changedFuncs.length,
    "same", sameDecls.length, "newStmts", newStmts.length);
  console.log("changedVars:", changedVars.join(" "));
  console.log("changedFuncs:", changedFuncs.join(" "));
  console.log("newFuncs:", newFuncs.join(" "));
  console.log("newVars:", newVars.join(" "));
  process.exit(0);
}

// ---- emit ----
function varToAssign(name, d) {
  // d.src 形如 `NAME = <value>`（声明符不含 var 关键字）
  return d.src.replace(/^[A-Za-z_$][\w$]*/, name) + ";";
}
function fnToAssign(name, d) {
  const body = d.src.replace(/^function\s+[A-Za-z_$][\w$]*\s*/, "");
  return "      " + name + " = function " + body + ";";
}
const parts = [];
parts.push("/* ===== 余烬裂隙移植块（由 v1.04 自动生成） ===== */");
parts.push("");
parts.push("      /* --- 1. 新增顶层变量 --- */");
for (const n of newVars) {
  const d = cd.get(n);
  parts.push("      " + d.kind + " " + d.src + ";");
}
parts.push("");
parts.push("      /* --- 2. 新增函数 --- */");
for (const n of newFuncs) parts.push(cd.get(n).src);
parts.push("");
parts.push("      /* --- 3. 数据表增量合并（保留新基础自身的条目） --- */");
const tableDiffPath = "out/table_diff.json";
let tableSnippets = {};
try { tableSnippets = JSON.parse(fs.readFileSync(tableDiffPath, "utf8")).snippets || {}; } catch (e) {}
for (const n of changedVars) {
  if (tableSnippets[n]) parts.push(tableSnippets[n]);
  else parts.push("      " + varToAssign(n, cd.get(n)));
}
parts.push("");
parts.push("      /* --- 4. 替换核心函数（优先用三方合并结果，保留新基础 v0.4 的改动） --- */");
let mergedCount = 0;
for (const n of changedFuncs) {
  const mp = "out/merges/" + n + ".js";
  if (fs.existsSync(mp)) {
    parts.push("      /* merged: " + n + " (三方合并，含新基础改动) */");
    parts.push(protectText(fs.readFileSync(mp, "utf8").trim(), n));
    mergedCount++;
  } else {
    parts.push(fnToAssign(n, cd.get(n)));
  }
}
console.log("using 3-way merged functions:", mergedCount, "/", changedFuncs.length);
parts.push("");
parts.push("      /* --- 5. 新增顶层语句 --- */");
for (const s of newStmts) parts.push("      " + s.src.replace(/\n/g, "\n      "));
parts.push("");
try { parts.push(fs.readFileSync("out/block_footer.js", "utf8")); } catch (e) { console.log("no footer"); }
const block = parts.join("\n");
fs.writeFileSync(outPath, block, "utf8");
console.log("wrote block", outPath, "chars", block.length, "lines", block.split("\n").length);
