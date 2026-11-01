// assemble.mjs —— 把移植块插进主 IIFE 的末尾（最后一个语句之后、`})();` 之前），输出构建产物
// 用法: node assemble.mjs <base.html> <block.js> <out.html> [--marker]
import fs from "node:fs";
import * as acorn from "./jstools/node_modules/acorn/dist/acorn.mjs";

const args = process.argv.slice(2);
const cssIdx = args.indexOf("--css");
const cssPath = cssIdx >= 0 ? args[cssIdx + 1] : null;
const exIdx = args.indexOf("--expose");
const exposePath = exIdx >= 0 ? args[exIdx + 1] : null;
const hfIdx = args.indexOf("--hotfix");
const hotfixPath = hfIdx >= 0 ? args[hfIdx + 1] : null;
const useHotfixTag = args.includes("--hotfix-tag");
const pos = args.filter((a, i) => !(a === "--css" || (cssIdx >= 0 && i === cssIdx + 1) || a === "--expose" || (exIdx >= 0 && i === exIdx + 1) || a === "--hotfix" || (hfIdx >= 0 && i === hfIdx + 1)));
const [basePath, blockPath, outPath] = pos;
const html = fs.readFileSync(basePath, "utf8");
const block = fs.readFileSync(blockPath, "utf8");

// 找 inline script 块（跳过 src=）；主 IIFE 在最后一个 inline 块里
const tagRe = /<script\b[^>]*>/gi;
const closeRe = /<\/script\s*>/gi;
const srcRe = /\bsrc\s*=/i;
let best = null;
let m;
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
  if (c && (c.type === "ArrowFunctionExpression" || c.type === "FunctionExpression")) return c;
  return null;
}
let iife = null;
for (const st of ast.body) {
  iife = isIifeCall(st);
  if (iife) break;
}
if (!iife) { console.error("main IIFE not found"); process.exit(2); }
if (iife.body.type !== "BlockStatement") { console.error("IIFE body not a block"); process.exit(2); }

const insertAt = best.start + iife.body.end - 1; // 位于 IIFE 的 `}` 之前
const EOL = html.includes("\r\n") ? "\r\n" : "\n";
const wrapped = [
  "",
  "      /* ==================== 余烬裂隙 PoE2 内容扩展包 移植块（自动生成，勿手改） ==================== */",
  "      (function () {",
  block.split("\n").map((l) => (l.trim() ? "        " + l : l)).join("\n"),
  exposePath && fs.existsSync(exposePath) ? fs.readFileSync(exposePath, "utf8") : "",
  "      })();",
  "",
].join(EOL);

let out = html.slice(0, insertAt) + wrapped + html.slice(insertAt);
if (useHotfixTag) {
  const tag = '<script src="hotfix-data.js"></script>';
  const mainTagPos = out.lastIndexOf("<script", best.start + (out.length - html.length));
  out = mainTagPos >= 0 ? out.slice(0, mainTagPos) + tag + "\n" + out.slice(mainTagPos) : tag + out;
  console.log("hotfix script tag inserted (external hotfix-data.js)");
} else if (hotfixPath && fs.existsSync(hotfixPath)) {
  const hf = fs.readFileSync(hotfixPath, "utf8");
  const tag = "<script>\n/* 热修数据（由 hotfix.json 内联） */\nwindow.HOTFIX = " + hf + ";\n</script>\n";
  // 插在主脚本之前
  const mainTagPos = out.lastIndexOf("<script", best.start + (out.length - html.length));
  out = mainTagPos >= 0 ? out.slice(0, mainTagPos) + tag + out.slice(mainTagPos) : tag + out;
  console.log("hotfix inlined:", hf.length, "chars");
}
if (cssPath && fs.existsSync(cssPath)) {
  const css = fs.readFileSync(cssPath, "utf8");
  const cssTag = "<style>\n/* 移植块样式（来自 v1.04 新增 CSS） */\n" + css + "</style>";
  const headEnd = out.search(/<\/head>/i);
  if (headEnd >= 0) out = out.slice(0, headEnd) + cssTag + "\n" + out.slice(headEnd);
  else out = cssTag + "\n" + out;
  console.log("css injected:", css.split("\n").length, "lines");
}
fs.writeFileSync(outPath, out, "utf8");
console.log("base:", basePath);
console.log("block lines:", block.split("\n").length);
console.log("inserted at html offset", insertAt, "(IIFE body end), out bytes", Buffer.byteLength(out, "utf8"));
