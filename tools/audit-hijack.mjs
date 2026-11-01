/**
 * audit-hijack.mjs —— 官方符号接管清单（EMB-112）
 *
 * 扩展块以「IIFE 尾部注入」的方式运行，与宿主共享同一个作用域。它一旦对宿主的
 * 变量/函数赋值，就是覆盖官方实现；而官方升版不会通知我们，覆盖就会变成
 * 「官方新内容被扩展的旧实现吃掉」—— v19.2 传奇珠宝显示不出来就是这么发生的。
 *
 * 本工具用 AST + 作用域分析找出扩展块里所有对「宿主符号」的写入，并区分：
 *   REPLACE  给宿主函数/对象赋新值（整体替换或包装）
 *   PROPERTY 给宿主对象的属性赋值
 *   MUTATE   调用宿主数组/对象的原地修改方法
 *
 * 判据：被写入的名字不在扩展块自身的作用域链里声明过，却在宿主 IIFE 顶层声明过。
 *
 * 用法：node tools/audit-hijack.mjs [--json]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as acorn from "./jstools/node_modules/acorn/dist/acorn.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const W = path.resolve(__dirname, "..");
const BASE = path.join(W, "base", "v19-online.html");
const BLOCK = path.join(W, "build", "block_v19.js");

function mainScript(html) {
  const tagRe = /<script\b[^>]*>/gi;
  let best = null;
  let m;
  while ((m = tagRe.exec(html))) {
    if (/\bsrc\s*=/i.test(m[0])) continue;
    const closeRe = /<\/script\s*>/gi;
    closeRe.lastIndex = m.index + m[0].length;
    const c = closeRe.exec(html);
    if (!c) break;
    best = { start: m.index + m[0].length, end: c.index };
    tagRe.lastIndex = c.index + c[0].length;
  }
  if (!best) throw new Error("no inline script");
  return html.slice(best.start, best.end);
}

function hostTopLevelNames(code) {
  const ast = acorn.parse(code, { ecmaVersion: "latest", sourceType: "script" });
  let iife = null;
  for (const st of ast.body) {
    if (st.type === "ExpressionStatement" && st.expression.type === "CallExpression") {
      const c = st.expression.callee;
      if (c && (c.type === "ArrowFunctionExpression" || c.type === "FunctionExpression")) {
        iife = c;
        break;
      }
    }
  }
  if (!iife) throw new Error("main IIFE not found");
  const names = new Set();
  for (const st of iife.body.body) {
    if (st.type === "FunctionDeclaration" || st.type === "ClassDeclaration") {
      if (st.id) names.add(st.id.name);
    } else if (st.type === "VariableDeclaration") {
      for (const d of st.declarations) if (d.id.type === "Identifier") names.add(d.id.name);
    }
  }
  return names;
}

/* 收集一个函数作用域内的 var / function 声明（不进入嵌套函数体） */
const FUNC = new Set(["FunctionDeclaration", "FunctionExpression", "ArrowFunctionExpression"]);
function collectDecls(node, out) {
  if (!node || typeof node.type !== "string") return;
  if (node.type === "VariableDeclaration") {
    for (const d of node.declarations) if (d.id.type === "Identifier") out.add(d.id.name);
  }
  if (node.type === "FunctionDeclaration" && node.id) out.add(node.id.name);
  for (const key of Object.keys(node)) {
    if (key === "params" || key === "id") continue;
    const v = node[key];
    if (Array.isArray(v)) {
      for (const c of v) {
        if (c && typeof c.type === "string") {
          if (FUNC.has(c.type)) continue; // 嵌套函数单独成域
          collectDecls(c, out);
        }
      }
    } else if (v && typeof v.type === "string") {
      if (!FUNC.has(v.type)) collectDecls(v, out);
    }
  }
}

const MUTATORS = new Set(["push", "unshift", "splice", "sort", "reverse", "fill", "pop", "shift"]);

function main() {
  const host = hostTopLevelNames(mainScript(fs.readFileSync(BASE, "utf8")));
  const blockCode = fs.readFileSync(BLOCK, "utf8");
  const ast = acorn.parse(blockCode, { ecmaVersion: "latest", sourceType: "script" });

  const replace = [];
  const property = [];
  const mutate = [];
  const topScope = new Set();
  collectDecls(ast, topScope);

  function inScope(chain, name) {
    for (const s of chain) if (s.has(name)) return true;
    return false;
  }

  function walk(node, chain) {
    if (!node || typeof node.type !== "string") return;
    if (FUNC.has(node.type)) {
      const sc = new Set();
      for (const p of node.params || []) {
        if (p.type === "Identifier") sc.add(p.name);
      }
      if (node.type === "FunctionExpression" && node.id) sc.add(node.id.name);
      if (node.body) collectDecls(node.body, sc);
      chain = [sc, ...chain];
    }
    const line = () => blockCode.slice(0, node.start).split("\n").length;

    if (node.type === "AssignmentExpression" && node.left.type === "Identifier") {
      const nm = node.left.name;
      if (host.has(nm) && !inScope(chain, nm) && !topScope.has(nm)) {
        const isFn = node.right.type === "FunctionExpression" || node.right.type === "ArrowFunctionExpression";
        replace.push({ line: line(), name: nm, wrapper: isFn, kind: node.operator });
      }
    }
    if (node.type === "AssignmentExpression" && node.left.type === "MemberExpression") {
      const o = node.left.object;
      if (o.type === "Identifier" && host.has(o.name) && !inScope(chain, o.name) && !topScope.has(o.name)) {
        const prop = node.left.computed ? "[expr]" : node.left.property.name;
        property.push({ line: line(), name: o.name, prop });
      }
    }
    if (node.type === "CallExpression" && node.callee.type === "MemberExpression") {
      const c = node.callee;
      const pname = c.computed ? null : c.property.name;
      if (pname && MUTATORS.has(pname) && c.object.type === "Identifier" && host.has(c.object.name) && !inScope(chain, c.object.name) && !topScope.has(c.object.name)) {
        mutate.push({ line: line(), name: c.object.name, fn: pname });
      }
    }

    for (const key of Object.keys(node)) {
      const v = node[key];
      if (Array.isArray(v)) {
        for (const c of v) if (c && typeof c.type === "string") walk(c, chain);
      } else if (v && typeof v.type === "string") {
        walk(v, chain);
      }
    }
  }
  walk(ast, []);

  const dedupe = (arr, keyf) => {
    const seen = new Map();
    for (const x of arr) {
      const k = keyf(x);
      if (!seen.has(k)) seen.set(k, x);
    }
    return [...seen.values()];
  };

  const R = dedupe(replace, (x) => x.name);
  const P = dedupe(property, (x) => x.name + "." + x.prop);
  const M = dedupe(mutate, (x) => x.name + "." + x.fn);

  if (process.argv.includes("--json")) {
    console.log(JSON.stringify({ hostSymbols: host.size, replace: R, property: P, mutate: M }, null, 2));
    return;
  }

  console.log(`宿主 IIFE 顶层符号 ${host.size} 个 · 扩展块 ${blockCode.split("\n").length} 行`);
  console.log(`\nREPLACE（给宿主符号赋新值）${R.length} 个符号`);
  for (const r of R.sort((a, b) => a.line - b.line)) {
    console.log(`  L${String(r.line).padStart(6)}  ${r.name.padEnd(16)} ${r.kind === "=" ? "" : r.kind + " "}${r.wrapper ? "function 包装" : "非函数替换"}`);
  }
  console.log(`\nPROPERTY（改宿主对象属性）${P.length} 个`);
  for (const p of P.sort((a, b) => a.line - b.line)) console.log(`  L${String(p.line).padStart(6)}  ${p.name}.${p.prop}`);
  console.log(`\nMUTATE（原地改宿主数组/对象）${M.length} 个`);
  for (const m of M.sort((a, b) => a.line - b.line)) console.log(`  L${String(m.line).padStart(6)}  ${m.name}.${m.fn}()`);
}

main();
