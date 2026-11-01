// decls.mjs —— 输出主 IIFE 顶层声明的名字、种类、字符区间
// 用法: node decls.mjs <script.js> <out.json>
import fs from "node:fs";
import * as acorn from "./jstools/node_modules/acorn/dist/acorn.mjs";

const path = process.argv[2];
const outPath = process.argv[3];
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
    if (Array.isArray(v)) {
      for (const c of v) { const r = findIife(c); if (r) return r; }
    } else if (v && typeof v.type === "string") {
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
  if (st.type === "FunctionDeclaration" && st.id) {
    decls.push({ name: st.id.name, kind: "function", start: st.start, end: st.end, line: st.loc.start.line, endLine: st.loc.end.line, src: src.slice(st.start, st.end) });
  } else if (st.type === "VariableDeclaration") {
    for (const d of st.declarations) {
      if (d.id.type === "Identifier") {
        decls.push({ name: d.id.name, kind: st.kind, start: d.start, end: d.end, line: d.loc.start.line, endLine: d.loc.end.line,
                     hasInit: !!d.init, initType: d.init ? d.init.type : null, src: src.slice(d.start, d.end) });
      }
    }
  } else if (st.type === "ClassDeclaration" && st.id) {
    decls.push({ name: st.id.name, kind: "class", start: st.start, end: st.end, line: st.loc.start.line, endLine: st.loc.end.line, src: src.slice(st.start, st.end) });
  }
}
fs.writeFileSync(outPath, JSON.stringify({ file: path, count: decls.length, decls }, null, 1), "utf8");
console.log(path + ": " + decls.length + " top-level decls -> " + outPath);
