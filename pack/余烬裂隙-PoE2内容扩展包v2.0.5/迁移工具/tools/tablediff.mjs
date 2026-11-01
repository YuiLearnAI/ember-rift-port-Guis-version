// tablediff.mjs —— 分析我们改过的数据表（changedVars）在 NEW 上该怎么合并
// 用法: node tablediff.mjs old.js cur.js out/table_diff.json
import fs from "node:fs";
import * as acorn from "./jstools/node_modules/acorn/dist/acorn.mjs";

const [, , oldPath, curPath, outPath] = process.argv;
const TARGETS = ["p1", "P", "Ax", "ct", "Na", "As", "M2", "yv", "Av", "qh", "Jy"];

function parseIife(path) {
  const src = fs.readFileSync(path, "utf8");
  const ast = acorn.parse(src, { ecmaVersion: "latest", sourceType: "script", locations: true });
  function findIife(n) {
    if (!n || typeof n.type !== "string") return null;
    if (n.type === "ExpressionStatement" && n.expression.type === "CallExpression") {
      const ce = n.expression.callee;
      if (ce && (ce.type === "ArrowFunctionExpression" || ce.type === "FunctionExpression")) return ce;
    }
    for (const k of Object.keys(n)) {
      if (k === "loc" || k === "start" || k === "end" || k === "type") continue;
      const v = n[k];
      if (Array.isArray(v)) { for (const c of v) { const r = findIife(c); if (r) return r; } }
      else if (v && typeof v.type === "string") { const r = findIife(v); if (r) return r; }
    }
    return null;
  }
  return { src, body: findIife(ast).body.body };
}

const norm = (s) => s.replace(/\s+/g, " ").trim();
const O = parseIife(oldPath), C = parseIife(curPath);

function declMap(P) {
  const m = new Map();
  for (const st of P.body) {
    if (st.type === "VariableDeclaration") for (const d of st.declarations) if (d.id.type === "Identifier") m.set(d.id.name, d);
  }
  return m;
}
const od = declMap(O), cd = declMap(C);

function keyOf(prop) {
  if (prop.computed) return null;
  if (prop.key.type === "Identifier") return prop.key.name;
  if (prop.key.type === "Literal") return String(prop.key.value);
  return null;
}

const report = {};
const snippets = {};
for (const name of TARGETS) {
  const dOld = od.get(name), dCur = cd.get(name);
  if (!dOld || !dCur) { report[name] = { status: "missing-decl" }; continue }
  const iOld = dOld.init, iCur = dCur.init;
  if (!iOld || !iCur) { report[name] = { status: "no-init" }; continue }
  if (iOld.type !== iCur.type) { report[name] = { status: "type-mismatch", old: iOld.type, cur: iCur.type }; continue }

  if (iCur.type === "ObjectExpression") {
    const hasSpread = (e) => e.properties.some((p) => p.type === "SpreadElement");
    if (hasSpread(iOld) || hasSpread(iCur)) { report[name] = { status: "has-spread" }; continue }
    const oMap = new Map(), cMap = new Map();
    for (const p of iOld.properties) { const k = keyOf(p); if (k != null) oMap.set(k, O.src.slice(p.start, p.end)); }
    for (const p of iCur.properties) { const k = keyOf(p); if (k != null) cMap.set(k, C.src.slice(p.start, p.end)); }
    const added = [], modified = [], removed = [];
    for (const [k, v] of cMap) {
      if (!oMap.has(k)) added.push(k);
      else if (norm(oMap.get(k)) !== norm(v)) modified.push(k);
    }
    for (const k of oMap.keys()) if (!cMap.has(k)) removed.push(k);
    report[name] = { status: "ok", kind: "object", oldKeys: oMap.size, curKeys: cMap.size,
                     added: added.length, modified: modified.length, removed: removed.length,
                     addedSample: added.slice(0, 8), modifiedSample: modified.slice(0, 8), removedSample: removed.slice(0, 8) };
    // 生成合并代码：Object.assign(NAME, { 新增 + 修改 })
    const parts = [];
    for (const k of [...added, ...modified]) parts.push("  " + cMap.get(k));
    snippets[name] = parts.length
      ? "      Object.assign(" + name + ", {\n" + parts.join(",\n") + "\n      });"
      : "      /* " + name + ": 无变化 */";
  } else if (iCur.type === "ArrayExpression") {
    const oEls = iOld.elements.map((e) => e ? norm(O.src.slice(e.start, e.end)) : null);
    const cEls = iCur.elements.map((e) => e ? norm(C.src.slice(e.start, e.end)) : null);
    const addedIdx = [], changedIdx = [];
    for (let i = 0; i < cEls.length; i++) {
      if (i >= oEls.length) addedIdx.push(i);
      else if (oEls[i] !== cEls[i]) changedIdx.push(i);
    }
    report[name] = { status: "ok", kind: "array", oldLen: oEls.length, curLen: cEls.length,
                     addedIdx, changedIdx };
    const ops = [];
    for (const i of changedIdx) ops.push("      " + name + "[" + i + "] = " + C.src.slice(iCur.elements[i].start, iCur.elements[i].end) + ";");
    // 追加元素：逐个 push
    const tail = iCur.elements.slice(oEls.length).filter(Boolean);
    if (tail.length) ops.push("      " + name + ".push(" + tail.map((e) => C.src.slice(e.start, e.end)).join(", ") + ");");
    snippets[name] = ops.join("\n") || "      /* " + name + ": 无变化 */";
  } else {
    report[name] = { status: "scalar", type: iCur.type };
    snippets[name] = "      " + name + " = " + C.src.slice(iCur.start, iCur.end) + ";";
  }
}
fs.writeFileSync(outPath, JSON.stringify({ report, snippets }, null, 1), "utf8");
for (const [k, v] of Object.entries(report)) {
  console.log(k.padEnd(4), JSON.stringify(v).slice(0, 300));
}
