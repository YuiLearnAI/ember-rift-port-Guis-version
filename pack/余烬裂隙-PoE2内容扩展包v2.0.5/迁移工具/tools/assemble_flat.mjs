// assemble_flat.mjs —— 把移植块**直接**插进主 IIFE 顶层（不包函数，这样劫持赋值才生效）
//   node assemble_flat.mjs <base.html> <block.js> <out.html> [--css <css>] [--indent 6]
import fs from "node:fs";
import * as acorn from "./jstools/node_modules/acorn/dist/acorn.mjs";

const args = process.argv.slice(2);
const cssIdx = args.indexOf("--css");
const cssPath = cssIdx >= 0 ? args[cssIdx + 1] : null;
const indIdx = args.indexOf("--indent");
const indent = indIdx >= 0 ? Number(args[indIdx + 1]) : 6;
const pos = args.filter((a, i) =>
  !(a === "--css" || (cssIdx >= 0 && i === cssIdx + 1) || a === "--indent" || (indIdx >= 0 && i === indIdx + 1)));
const [basePath, blockPath, outPath] = pos;

const html = fs.readFileSync(basePath, "utf8");
const block = fs.readFileSync(blockPath, "utf8");

const tagRe = /<script\b[^>]*>/gi, closeRe = /<\/script\s*>/gi, srcRe = /\bsrc\s*=/i;
let best = null, m;
while ((m = tagRe.exec(html))) {
  closeRe.lastIndex = m.index + m[0].length;
  const c = closeRe.exec(html);
  if (!c) break;
  if (!srcRe.test(m[0])) best = { start: m.index + m[0].length, end: c.index };
  tagRe.lastIndex = c.index + c[0].length;
}
if (!best) { console.error("no inline script found"); process.exit(2); }
const code = html.slice(best.start, best.end);
const ast = acorn.parse(code, { ecmaVersion: "latest", sourceType: "script", locations: true });
function isIifeCall(st) {
  if (!st || st.type !== "ExpressionStatement") return null;
  const e = st.expression;
  if (!e || e.type !== "CallExpression") return null;
  const c = e.callee;
  return c && (c.type === "ArrowFunctionExpression" || c.type === "FunctionExpression") ? c : null;
}
let iife = null;
for (const st of ast.body) { iife = isIifeCall(st); if (iife) break; }
if (!iife || iife.body.type !== "BlockStatement") { console.error("main IIFE not found"); process.exit(2); }

const insertAt = best.start + iife.body.end - 1; // IIFE 的 `}` 之前
const EOL = html.includes("\r\n") ? "\r\n" : "\n";
const pad = " ".repeat(indent);
const body = block.split("\n").map((l) => (l.trim() ? pad + l : l)).join(EOL);
const wrapped = [EOL, pad + "/* ==================== 余烬裂隙 PoE2 内容扩展 移植块（自动生成） ==================== */", body, ""].join("");

let out = html.slice(0, insertAt) + wrapped + html.slice(insertAt);
if (cssPath && fs.existsSync(cssPath)) {
  const css = fs.readFileSync(cssPath, "utf8");
  const cssTag = "<style>" + EOL + "/* 移植块样式（v1.04 新增 CSS） */" + EOL + css + "</style>";
  const headEnd = out.search(/<\/head>/i);
  out = headEnd >= 0 ? out.slice(0, headEnd) + cssTag + EOL + out.slice(headEnd) : cssTag + EOL + out;
  console.log("css injected:", css.split("\n").length, "lines");
}
fs.writeFileSync(outPath, out, "utf8");
console.log("base:", basePath);
console.log("block lines:", block.split("\n").length, "-> inserted flat at html offset", insertAt);
console.log("out bytes:", Buffer.byteLength(out, "utf8"));
