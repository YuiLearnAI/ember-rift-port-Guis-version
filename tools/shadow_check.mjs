// 检查移植块顶层声明与 v19 顶层声明是否重名（同一 IIFE 作用域内 var 会互相覆盖）
//
// 为什么要有这道门：扩展块直接跑在宿主 IIFE 里，顶层 `var` 会静默覆盖宿主同名变量，
// 表现是官方某个功能莫名失效，且报错为零。EMB-112 的「官方传奇珠宝失明」就是这类事故的变体。
//
// 用法：node tools/shadow_check.mjs   （仓库根或 tools/ 下执行都行）
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as acorn from "./jstools/node_modules/acorn/dist/acorn.mjs";

const W = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

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

const basePath = path.join(W, "base", "v19-online.html");
const blockPath = path.join(W, "build", "block_v19.js");
for (const p of [basePath, blockPath]) {
  if (!fs.existsSync(p)) {
    console.error(`缺少文件：${p}\n大文件/产物不在版本库，先跑 npm run assets:pull 与 npm run build`);
    process.exit(1);
  }
}

const h = fs.readFileSync(basePath, "utf8");
let code = null;
for (const m of h.matchAll(/<script\b([^>]*)>/gi)) {
  if (/\bsrc\s*=/i.test(m[1])) continue;
  const ci = h.slice(m.index).search(/<\/script\s*>/i);
  code = h.slice(m.index + m[0].length, m.index + ci);
}
const base = topNames(code);
const block = topNames(fs.readFileSync(blockPath, "utf8"), false);

console.log("v19 顶层声明:", base.size, "| 移植块顶层声明:", block.size);
const clash = [...block.keys()].filter((k) => base.has(k));
const byKind = {};
for (const k of clash) { const kk = block.get(k) + "/" + base.get(k); byKind[kk] = (byKind[kk] || 0) + 1; }

if (clash.length) {
  console.error(`\n重名冲突 ${clash.length} 处（移植块会覆盖宿主同名声明）：`);
  for (const k of clash) console.error(`  ${k}  [block:${block.get(k)} | v19:${base.get(k)}]`);
  console.error(`按声明种类: ${JSON.stringify(byKind)}`);
  console.error("\n修法：改名，或改用块级作用域（let/const 包在外层函数里），不要指望覆盖宿主");
  process.exit(1);
}

console.log("重名冲突: 0");
console.log("RESULT: ALL OK");
