// cluster_map.mjs —— 用"同一条 var 声明簇"给未映射符号找对应物
// 原理：OLD/NEW 都是同一源码的压缩产物，同一组变量的声明顺序、数量、字面量保持一致；
//       只要簇里有一个已映射的兄弟变量，就能按位次对齐整簇。
// 用法: node cluster_map.mjs out/old.js out/new.js out/symbol_map_final.json out/cluster_map.json
import fs from "node:fs";
import * as acorn from "./jstools/node_modules/acorn/dist/acorn.mjs";

const [, , oldPath, newPath, mapPath, outPath] = process.argv;
const map = JSON.parse(fs.readFileSync(mapPath, "utf8")).globals || {};

function load(path) {
  const src = fs.readFileSync(path, "utf8");
  const ast = acorn.parse(src, { ecmaVersion: "latest", sourceType: "script", locations: true });
  function fi(n) {
    if (!n || typeof n.type !== "string") return null;
    if (n.type === "ExpressionStatement" && n.expression.type === "CallExpression") {
      const ce = n.expression.callee;
      if (ce && (ce.type === "ArrowFunctionExpression" || ce.type === "FunctionExpression")) return ce;
    }
    for (const k of Object.keys(n)) {
      if (k === "loc" || k === "start" || k === "end" || k === "type") continue;
      const v = n[k];
      if (Array.isArray(v)) { for (const c of v) { const r = fi(c); if (r) return r; } }
      else if (v && typeof v.type === "string") { const r = fi(v); if (r) return r; }
    }
    return null;
  }
  return { src, body: fi(ast).body.body };
}
const O = load(oldPath), N = load(newPath);

// name -> {stmtIdx, idx, count, key}
function indexVars(P, tag) {
  const m = new Map();
  P.body.forEach((st, si) => {
    if (st.type !== "VariableDeclaration") return;
    const names = [];
    for (const d of st.declarations) names.push(d.id.type === "Identifier" ? d.id.name : null);
    st.declarations.forEach((d, i) => {
      if (d.id.type !== "Identifier") return;
      m.set(d.id.name, { stmt: tag + si, si, idx: i, count: names.length,
                         names, src: P.src.slice(d.start, d.end),
                         lit: d.init && d.init.type === "Literal" ? String(d.init.value) : null,
                         initType: d.init ? d.init.type : null });
    });
  });
  return m;
}
const ov = indexVars(O, "o"), nv = indexVars(N, "n");

// NEW: 同簇内位次查询
const newByStmt = new Map();
for (const [name, info] of nv) {
  if (!newByStmt.has(info.stmt)) newByStmt.set(info.stmt, {});
  newByStmt.get(info.stmt)[info.idx] = { name, info };
}

const revUsed = new Set(Object.values(map).map((v) => v.new));
const resolved = {};
const ambiguous = {};
for (const [name, info] of ov) {
  if (map[name]) continue;                       // 已映射
  if (info.count < 2) { ambiguous[name] = "not-in-cluster"; continue; }
  const votes = {};
  for (let i = 0; i < info.names.length; i++) {
    const sib = info.names[i];
    if (!sib || sib === name) continue;
    const sibNew = map[sib] && map[sib].new;
    if (!sibNew || !nv.has(sibNew)) continue;
    const sibInfo = nv.get(sibNew);
    if (sibInfo.count !== info.count || sibInfo.idx !== i) continue;   // 结构不一致，跳过
    const cand = newByStmt.get(sibInfo.stmt)[info.idx];
    if (!cand) continue;
    const cn = cand.name;
    const key = cn;
    votes[key] = votes[key] || { n: 0, ev: [] };
    votes[key].n++;
    votes[key].ev.push(sib + "->" + sibNew + " @" + i + "(簇" + info.count + ")");
  }
  const ranked = Object.entries(votes).sort((a, b) => b[1].n - a[1].n);
  if (!ranked.length) { ambiguous[name] = "no-mapped-sibling"; continue; }
  const [cand, v] = ranked[0];
  // 校验：值字面量一致；且该候选没被别的 OLD 名占用
  const candInfo = nv.get(cand);
  if (info.lit != null && candInfo && candInfo.lit != null && info.lit !== candInfo.lit) {
    ambiguous[name] = "literal-mismatch(" + info.lit + " vs " + cand + "=" + candInfo.lit + ")";
    continue;
  }
  if (ranked.length > 1 && ranked[1][1].n === v.n && ranked[1][0] !== cand) {
    ambiguous[name] = "tie:" + ranked.map((r) => r[0]).join("/");
    continue;
  }
  if (revUsed.has(cand)) { ambiguous[name] = "candidate-taken(" + cand + ")"; continue; }
  resolved[name] = { new: cand, evidence: "var-cluster alignment: " + v.ev.slice(0, 3).join("; "), confidence: "high" };
}
fs.writeFileSync(outPath, JSON.stringify({ resolved, ambiguous }, null, 1), "utf8");
console.log("resolved:", Object.keys(resolved).length, "ambiguous:", Object.keys(ambiguous).length);
for (const [k, v] of Object.entries(resolved)) console.log("  " + k + " -> " + v.new + "   [" + v.evidence.slice(0, 90) + "]");
for (const [k, v] of Object.entries(ambiguous)) console.log("  SKIP " + k + ": " + v);
