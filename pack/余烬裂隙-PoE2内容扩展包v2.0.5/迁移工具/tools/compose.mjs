// compose.mjs —— 合成最终移植块（OLD 名空间，随后交给 rewrite.mjs 翻译成 NEW 名）
//
//   node compose.mjs --out out/block_final.js [--merges out/merges] [--css out/port_css.css]
//
// 组成：
//   1. 我们新增的顶层变量
//   2. 我们新增的函数
//   3. 我们新增的顶层语句（含 i18n Object.assign）
//   4. 数据表差异合并（新增键/改值键/删键，而不是整表替换 → 保留新基础自己的新增）
//   5. 核心函数覆盖：优先用三方合并结果 out/merges/<name>.js，缺失则用我们 v1.04 版本
//   6. 初始化补丁 + 藏身处物件 + CSS 注入
import fs from "node:fs";
import path from "node:path";
import * as acorn from "./jstools/node_modules/acorn/dist/acorn.mjs";

const arg = (n, d) => { const i = process.argv.indexOf("--" + n); return i >= 0 ? process.argv[i + 1] : d; };
const OUT = arg("out", "out/block_final.js");
const MERGES = arg("merges", "out/merges");
const CSSPATH = arg("css", "out/port_css.css");
const DROPPATH = arg("drop", "out/drop_funcs.json");
const DROP = fs.existsSync(DROPPATH) ? new Set(JSON.parse(fs.readFileSync(DROPPATH, "utf8"))) : new Set();

const OLD = JSON.parse(fs.readFileSync("out/decls_old.json", "utf8")).decls;
const CUR = JSON.parse(fs.readFileSync("out/decls_cur.json", "utf8")).decls;
const DIFF = JSON.parse(fs.readFileSync("out/decl_diff.json", "utf8"));
const oldMap = Object.fromEntries(OLD.map((d) => [d.name, d]));
const curMap = Object.fromEntries(CUR.map((d) => [d.name, d]));

const norm = (s) => s.replace(/\s+/g, " ").trim();

// ---------- 对象字面量逐键比较 ----------
function parseInitExpr(declSrc) {
  // declSrc 形如 `NAME = <expr>`；取出 <expr>
  const eq = declSrc.indexOf("=");
  if (eq < 0) return null;
  const exprSrc = declSrc.slice(eq + 1).trim().replace(/;$/, "");
  try {
    const ast = acorn.parse("(" + exprSrc + ")", { ecmaVersion: "latest", sourceType: "script" });
    const e = ast.body[0].expression;
    return { src: exprSrc, node: e };
  } catch (err) {
    return null;
  }
}

function propText(exprSrc, prop) {
  // 用源切片取属性文本（含 key 与 value）
  return exprSrc.slice(prop.start - 1, prop.end - 1);
}

function objectDiff(name, oSrc, cSrc) {
  const o = parseInitExpr(oSrc), c = parseInitExpr(cSrc);
  if (!o || !c || o.node.type !== "ObjectExpression" || c.node.type !== "ObjectExpression") return null;
  const keyOf = (p) => {
    if (!p.computed && p.key.type === "Identifier") return p.key.name;
    if (!p.computed && p.key.type === "Literal") return String(p.key.value);
    return null;
  };
  const om = new Map(), cm = new Map();
  for (const p of o.node.properties) { const k = keyOf(p); if (k) om.set(k, propText(o.src, p)); }
  for (const p of c.node.properties) { const k = keyOf(p); if (k) cm.set(k, propText(c.src, p)); }
  if (om.size === 0 || cm.size === 0) return null;
  const added = [], changed = [], removed = [];
  for (const [k, v] of cm) {
    if (!om.has(k)) added.push([k, v]);
    else if (norm(om.get(k)) !== norm(v)) changed.push([k, v]);
  }
  for (const k of om.keys()) if (!cm.has(k)) removed.push(k);
  return { added, changed, removed, oCount: om.size, cCount: cm.size };
}

function arrayDiff(oSrc, cSrc) {
  const o = parseInitExpr(oSrc), c = parseInitExpr(cSrc);
  if (!o || !c || o.node.type !== "ArrayExpression" || c.node.type !== "ArrayExpression") return null;
  const oEls = o.node.elements, cEls = c.node.elements;
  if (!oEls.length || !cEls.length) return null;
  // 前缀是否一致
  let same = 0;
  while (same < oEls.length && same < cEls.length && oEls[same] && cEls[same] &&
         norm(o.src.slice(oEls[same].start - 1, oEls[same].end - 1)) === norm(c.src.slice(cEls[same].start - 1, cEls[same].end - 1))) same++;
  const extra = cEls.slice(oEls.length).filter(Boolean).map((e) => c.src.slice(e.start - 1, e.end - 1));
  return { samePrefix: same, oLen: oEls.length, cLen: cEls.length, extra };
}

const parts = [];
const stats = { newVars: 0, newFuncs: 0, newStmts: 0, tableMerge: [], tableReplace: [], funcFromMerge: 0, funcFromOurs: 0, funcFromMergesMissing: [] };
parts.push("/* ===== 1. 新增顶层变量 ===== */");
for (const n of DIFF.newVars) {
  const d = curMap[n];
  parts.push("      " + (d.kind || "var") + " " + d.src + ";");
  stats.newVars++;
}
parts.push("");
parts.push("/* ===== 2. 新增函数 ===== */");
for (const n of DIFF.newFuncs) { parts.push(curMap[n].src); stats.newFuncs++; }
parts.push("");
parts.push("/* ===== 3. 新增顶层语句（i18n 等，非词缀定义） ===== */");
const ALL_STMTS = fs.existsSync("out/new_stmts.json") ? JSON.parse(fs.readFileSync("out/new_stmts.json", "utf8")) : [];
const affixStmts = ALL_STMTS.filter((s) => /^\s*ue\s*\(/.test(s));
const plainStmts = ALL_STMTS.filter((s) => !/^\s*ue\s*\(/.test(s));
for (const s of plainStmts) {
  parts.push("      " + s.replace(/\n/g, "\n      "));
  stats.newStmts++;
}
parts.push("");
parts.push("/* ===== 4. 数据表差异合并 ===== */");
for (const n of DIFF.changedVars) {
  const o = oldMap[n], c = curMap[n];
  if (!o || !c) continue;
  const od = objectDiff(n, o.src, c.src);
  if (od && (od.added.length || od.changed.length || od.removed.length)) {
    if (od.added.length) {
      const body = od.added.map(([k, v]) => "        " + v.replace(/,$/, "")).join(",\n");
      parts.push("      Object.assign(" + n + ", {\n" + body + ",\n      });");
    }
    for (const [k, v] of od.changed) {
      const eq = v.indexOf(":");
      const val = eq >= 0 ? v.slice(eq + 1).trim() : v;
      parts.push("      " + n + "[" + JSON.stringify(k) + "] = " + val.replace(/,$/, "") + ";");
    }
    for (const k of od.removed) parts.push("      delete " + n + "[" + JSON.stringify(k) + "];");
    stats.tableMerge.push([n, od.added.length, od.changed.length, od.removed.length]);
    continue;
  }
  const ad = arrayDiff(o.src, c.src);
  if (ad && ad.extra.length) {
    for (const e of ad.extra) parts.push("      " + n + ".push(" + e + ");");
    stats.tableMerge.push([n, ad.extra.length, 0, 0]);
    continue;
  }
  parts.push("      " + c.src + ";");
  stats.tableReplace.push(n);
}
parts.push("");
parts.push("/* ===== 5. 核心函数覆盖 ===== */");
const mergeFiles = fs.existsSync(MERGES) ? new Set(fs.readdirSync(MERGES).filter((f) => f.endsWith(".js")).map((f) => f.slice(0, -3))) : new Set();
for (const n of DIFF.changedFuncs) {
  if (DROP.has(n)) { stats.dropped = (stats.dropped || []); stats.dropped.push(n); continue; }
  let src = null;
  if (mergeFiles.has(n)) {
    src = fs.readFileSync(path.join(MERGES, n + ".js"), "utf8").trim();
    stats.funcFromMerge++;
  } else if (mergeFiles.has(n + "__" ) || [...mergeFiles].some((m) => m.startsWith(n + "__"))) {
    const f = [...mergeFiles].find((m) => m.startsWith(n + "__"));
    src = fs.readFileSync(path.join(MERGES, f + ".js"), "utf8").trim();
    stats.funcFromMerge++;
  } else {
    const d = curMap[n];
    const body = d.src.replace(/^function\s+[A-Za-z_$][\w$]*\s*/, "");
    src = "      " + n + " = function " + body + ";";
    stats.funcFromOurs++;
    stats.funcFromMergesMissing.push(n);
  }
  parts.push(src);
}

parts.push("");
parts.push("/* ===== 5b. 自定义词缀定义（必须在 ue 覆盖之后，才能带上 dsec/fac 标记） ===== */");
parts.push(`      try {
        for (var _pi = zn.length - 1; _pi >= 0; _pi--) {
          if (zn[_pi] && String(zn[_pi].id).indexOf("ds_") === 0) zn.splice(_pi, 1);
        }
        ["ds_es","ds_cast","ds_skill","ds_life","ds_atk","ds_leech","ds_crit","ds_move","ds_rarity","ds_res"].forEach(function (id) { delete Ct[id]; });
      } catch (e) {}`);
for (const s of affixStmts) {
  parts.push("      " + s.replace(/\n/g, "\n      "));
  stats.newStmts++;
}
parts.push("");
parts.push("/* ===== 6. 初始化补丁 ===== */");
parts.push(`      try {
        lt.length = 0;
        Object.keys(P).forEach(function (k) { lt.push(k); });
        Ts = {};
        Na.forEach(function (b) {
          b.nodes.forEach(function (nd, i) { nd.b = b.key; nd.i = i; Ts[nd.k] = nd; });
        });
        ["ds_es","ds_cast","ds_skill","ds_life","ds_atk","ds_leech","ds_crit","ds_move","ds_rarity","ds_res"].forEach(function (id) {
          if (Ct[id] && zn.indexOf(Ct[id]) < 0) zn.push(Ct[id]);
        });
        if (typeof x1 === "function") x1();
        if (typeof Cx === "function") Cx();
        /* 不在初始化时强开面板/通货栏：由基础自己的渲染时机触发，避免抢状态 */
      } catch (e) { window.__portInitErr = String(e); console.warn("[PORT] init", e); }
      var EXTRA_UNIQUES = [];
      window.__EXTRA_UNIQUES = EXTRA_UNIQUES;
      try {
        if (o.Z && o.Z.type === "hideout" && o.pl && o.objs) {
          if (!o.objs.some(function (x) { return x.kind === "well"; })) o.objs.push({ kind: "well", x: o.pl.x + 90, y: o.pl.y + 20, r: 14 });
          if (!o.objs.some(function (x) { return x.kind === "simulacrum"; })) o.objs.push({ kind: "simulacrum", x: o.pl.x + 140, y: o.pl.y - 30, r: 14 });
        }
      } catch (e) { window.__portHideoutErr = String(e); }`);
parts.push("");
const block = parts.join("\n");
fs.writeFileSync(OUT, block, "utf8");
fs.writeFileSync("out/compose_stats.json", JSON.stringify(stats, null, 1), "utf8");
console.log("wrote", OUT, "chars", block.length, "lines", block.split("\n").length);
console.log("newVars", stats.newVars, "newFuncs", stats.newFuncs, "newStmts", stats.newStmts);
console.log("tables merged:", stats.tableMerge.map((t) => t[0] + "(+" + t[1] + "~" + t[2] + "-" + t[3] + ")").join(" "));
console.log("tables replaced:", stats.tableReplace.join(" "));
console.log("funcs from merges:", stats.funcFromMerge, "from ours:", stats.funcFromOurs);
console.log("ours (no merge):", stats.funcFromMergesMissing.join(" "));
