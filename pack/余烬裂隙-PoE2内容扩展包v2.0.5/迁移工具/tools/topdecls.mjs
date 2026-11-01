// topdecls.mjs —— 列出主 IIFE 顶层的声明名（函数/变量/类），用于区分「真正的全局 API」与片段里的局部名
// 用法: node topdecls.mjs <script.js> [--json out.json]
import fs from "node:fs";
import * as acorn from "./jstools/node_modules/acorn/dist/acorn.mjs";

const path = process.argv[2];
const jsonOut = process.argv.indexOf("--json") >= 0 ? process.argv[process.argv.indexOf("--json") + 1] : null;
const src = fs.readFileSync(path, "utf8");
const ast = acorn.parse(src, { ecmaVersion: "latest", sourceType: "script", locations: true });

// 找到 ((...) => {...})() 或 (function(){...})() 的 IIFE 主体
function findIife(node) {
  if (!node || typeof node.type !== "string") return null;
  if (node.type === "ExpressionStatement" && node.expression.type === "CallExpression") {
    const ce = node.expression.callee;
    if (ce && (ce.type === "ArrowFunctionExpression" || ce.type === "FunctionExpression")) return ce;
  }
  for (const k of Object.keys(node)) {
    if (k === "loc" || k === "start" || k === "end" || k === "type") continue;
    const v = node[k];
    if (Array.isArray(v)) {
      for (const c of v) { const r = findIife(c); if (r) return r; }
    } else if (v && typeof v.next === "undefined" && typeof v.type === "string") {
      const r = findIife(v); if (r) return r;
    }
  }
  return null;
}

const iife = findIife(ast);
if (!iife) { console.error("IIFE not found"); process.exit(1); }
const body = iife.body.body || [];
const decls = [];
for (const st of body) {
  if (st.type === "FunctionDeclaration" && st.id) decls.push({ name: st.id.name, kind: "function", line: st.loc.start.line });
  else if (st.type === "VariableDeclaration") {
    for (const d of st.declarations) {
      if (d.id.type === "Identifier") decls.push({ name: d.id.name, kind: st.kind, line: d.loc.start.line, hasInit: !!d.init });
    }
  } else if (st.type === "ClassDeclaration" && st.id) decls.push({ name: st.id.name, kind: "class", line: st.loc.start.line });
}
console.log(JSON.stringify({ file: path, count: decls.length, decls }, null, 0));
if (jsonOut) fs.writeFileSync(jsonOut, JSON.stringify({ file: path, count: decls.length, decls }, null, 1));
