// 检查移植块顶层声明与 v19 顶层声明是否重名（同一 IIFE 作用域内 var 会互相覆盖）
import fs from "node:fs";
import * as acorn from "./jstools/node_modules/acorn/dist/acorn.mjs";

function topNames(src, useIife = true) {
  const ast = acorn.parse(src, { ecmaVersion: "latest", sourceType: "script" });
  const out = new Map();
  let iife = null;
  for (const st of ast.body) {
    if (st.type === "ExpressionStatement" && st.expression.type === "CallExpression") {
      const c = st.expression.callee;
      if (c && (c.type === "ArrowFunctionExpression" || c.type === "FunctionExpression")) { iife = c; break; }
    }
  }
  const body = useIife && iife && iife.body.type === "BlockStatement" ? iife.body.body : ast.body;
  for (const st of body) {
    if (st.type === "VariableDeclaration") for (const d of st.declarations) if (d.id.type === "Identifier") out.set(d.id.name, st.kind);
    if (st.type === "FunctionDeclaration" && st.id) out.set(st.id.name, "function");
  }
  return out;
}

const h = fs.readFileSync("../base/v19-online.html", "utf8");
let code = null;
for (const m of h.matchAll(/<script\b([^>]*)>/gi)) {
  if (/\bsrc\s*=/i.test(m[1])) continue;
  const ci = h.slice(m.index).search(/<\/script\s*>/i);
  code = h.slice(m.index + m[0].length, m.index + ci);
}
const base = topNames(code);
const block = topNames(fs.readFileSync("../build/block_v19.js", "utf8"), false);

console.log("v19 top:", base.size, "| block top:", block.size);
const clash = [...block.keys()].filter((k) => base.has(k));
console.log("重名冲突:", clash.length);
const byKind = {};
for (const k of clash) { const kk = block.get(k) + "/" + base.get(k); byKind[kk] = (byKind[kk] || 0) + 1; }
console.log("按声明种类:", byKind);
console.log("\n列表（block声明 -> 覆盖了 v19 同名）:");
for (const k of clash.slice(0, 60)) console.log("  ", k, `[block:${block.get(k)} | v19:${base.get(k)}]`);
