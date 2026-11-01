// 校验 symbol_map 的目标符号是否都真实存在于 v19 顶层声明
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as acorn from "./jstools/node_modules/acorn/dist/acorn.mjs";
const W = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const h = fs.readFileSync(path.join(W, "base", "v19-online.html"), "utf8");
let code = null;
for (const m of h.matchAll(/<script\b([^>]*)>/gi)) {
  if (/\bsrc\s*=/i.test(m[1])) continue;
  const ci = h.slice(m.index).search(/<\/script\s*>/i);
  code = h.slice(m.index + m[0].length, m.index + ci);
}
const ast = acorn.parse(code, { ecmaVersion: "latest", sourceType: "script" });
let iife = null;
for (const st of ast.body) {
  if (st.type === "ExpressionStatement" && st.expression.type === "CallExpression") {
    const c = st.expression.callee;
    if (c && (c.type === "ArrowFunctionExpression" || c.type === "FunctionExpression")) { iife = c; break; }
  }
}
const top = new Set();
for (const st of iife.body.body) {
  if (st.type === "VariableDeclaration") for (const d of st.declarations) if (d.id.type === "Identifier") top.add(d.id.name);
  if (st.type === "FunctionDeclaration" && st.id) top.add(st.id.name);
}
const map = JSON.parse(fs.readFileSync(path.join(W, "out", "symbol_map_18to19.json"), "utf8")).globals;
const missing = [], bad = [];
for (const [old, e] of Object.entries(map)) {
  if (!e || !e.new) continue;
  if (!top.has(e.new)) missing.push({ old, new: e.new, method: e.method, conf: e.confidence });
}
console.log("v19 top-level names:", top.size, "| map:", Object.keys(map).length);
console.log("mapped targets NOT found in v19 top-level:", missing.length);
for (const m of missing.slice(0, 25)) console.log("  ", m.old, "->", m.new, `[${m.method}/${m.conf}]`);
// 统计 method 分布
const byMethod = {};
for (const e of Object.values(map)) if (e && e.method) byMethod[e.method] = (byMethod[e.method] || 0) + 1;
console.log("method distribution:", byMethod);
const byConf = {};
for (const e of Object.values(map)) if (e && e.confidence) byConf[e.confidence] = (byConf[e.confidence] || 0) + 1;
console.log("confidence distribution:", byConf);
