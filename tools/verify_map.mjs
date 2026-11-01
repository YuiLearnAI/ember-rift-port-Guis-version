/**
 * verify_map.mjs —— 校验 symbol_map 的目标符号是否都真实存在于当前底包顶层声明
 *
 * 作用：symbol_map 是「旧底包名字 → 新底包名字」的推导结果，推导可能出错。
 * 这里拿目标底包（base/v19-online.html）的顶层声明做一次硬校验：
 * 映射指向的名字如果根本不存在，说明这一步推导是错的，必须停下。
 *
 * 用法：
 *   node tools/verify_map.mjs                       # 默认校验当前升级对的映射
 *   node tools/verify_map.mjs out/xxx.json          # 指定映射文件
 *   node tools/verify_map.mjs out/xxx.json base/xxx.html
 *
 * 退出码：有目标符号缺失 → 1（CI 会因此中断），否则 0。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as acorn from "./jstools/node_modules/acorn/dist/acorn.mjs";

const W = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// 当前生效的升级对。官方再升版时改这两行即可。
const DEFAULT_MAP = path.join(W, "out", "symbol_map_19to192.json");
const DEFAULT_BASE = path.join(W, "base", "v19-online.html");

const MAP = process.argv[2] ? path.resolve(process.argv[2]) : DEFAULT_MAP;
const BASE = process.argv[3] ? path.resolve(process.argv[3]) : DEFAULT_BASE;

for (const [label, p] of [["映射文件", MAP], ["底包", BASE]]) {
  if (!fs.existsSync(p)) {
    console.error(`缺少${label}：${p}`);
    if (label === "底包") console.error("底包由 GitHub Release 承载，先执行 npm run assets:pull");
    process.exit(1);
  }
}

/* ---------- 取底包主内联脚本 ---------- */
const html = fs.readFileSync(BASE, "utf8");
let code = null;
for (const m of html.matchAll(/<script\b([^>]*)>/gi)) {
  if (/\bsrc\s*=/i.test(m[1])) continue;
  const ci = html.slice(m.index).search(/<\/script\s*>/i);
  code = html.slice(m.index + m[0].length, m.index + ci);
}
if (!code) {
  console.error("底包里找不到内联主脚本");
  process.exit(1);
}

/* ---------- 主 IIFE 的顶层声明 ---------- */
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
if (!iife || iife.body.type !== "BlockStatement") {
  console.error("底包里找不到主 IIFE");
  process.exit(1);
}

const top = new Set();
for (const st of iife.body.body) {
  if (st.type === "VariableDeclaration") {
    for (const d of st.declarations) if (d.id.type === "Identifier") top.add(d.id.name);
  }
  if (st.type === "FunctionDeclaration" && st.id) top.add(st.id.name);
  if (st.type === "ClassDeclaration" && st.id) top.add(st.id.name);
}

/* ---------- 比对 ---------- */
const map = JSON.parse(fs.readFileSync(MAP, "utf8")).globals;
const missing = [];
let identity = 0;
for (const [oldName, e] of Object.entries(map)) {
  if (!e || !e.new) continue;
  if (e.new === oldName) identity++;
  if (!top.has(e.new)) missing.push({ old: oldName, new: e.new, method: e.method, conf: e.confidence });
}

const byMethod = {};
const byConf = {};
for (const e of Object.values(map)) {
  if (!e) continue;
  if (e.method) byMethod[e.method] = (byMethod[e.method] || 0) + 1;
  if (e.confidence) byConf[e.confidence] = (byConf[e.confidence] || 0) + 1;
}

console.log(`映射文件 ${path.relative(W, MAP)}`);
console.log(`底包     ${path.relative(W, BASE)}`);
console.log(`底包顶层声明 ${top.size} | 映射条目 ${Object.keys(map).length}（其中恒等 ${identity}）`);
console.log("method 分布:", byMethod);
console.log("confidence 分布:", byConf);
console.log(`目标符号缺失 ${missing.length}`);
for (const m of missing.slice(0, 25)) console.log("  ", m.old, "->", m.new, `[${m.method}/${m.conf}]`);

if (missing.length) {
  console.error(`\nRESULT: FAIL —— ${missing.length} 条映射指向底包里不存在的符号`);
  process.exit(1);
}
console.log("RESULT: ALL OK");
