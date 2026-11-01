/**
 * main-script.mjs —— 定位产物里「主脚本」的位置（构建与审计工具共用）
 *
 * 页面里有多个 inline <script>：热修、扩展 mods、主脚本、统计。主脚本是最后一个
 * 不带 src 的 inline script，扩展块插在它内部 IIFE 的尾部。
 */
import * as acorn from "../jstools/node_modules/acorn/dist/acorn.mjs";

export function findMainScript(html) {
  const tagRe = /<script\b[^>]*>/gi;
  let best = null;
  let m;
  while ((m = tagRe.exec(html))) {
    if (/\bsrc\s*=/i.test(m[0])) continue;
    const closeRe = /<\/script\s*>/gi;
    closeRe.lastIndex = m.index + m[0].length;
    const c = closeRe.exec(html);
    if (!c) break;
    best = { start: m.index + m[0].length, end: c.index, tagStart: m.index };
    tagRe.lastIndex = c.index + c[0].length;
  }
  if (!best) throw new Error("no inline script");
  const code = html.slice(best.start, best.end);
  return { ...best, code };
}

/** 主脚本 IIFE 的尾部（`}` 之前）插入位置 */
export function findIifeTail(html) {
  const ms = findMainScript(html);
  const ast = acorn.parse(ms.code, { ecmaVersion: "latest", sourceType: "script" });
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
  if (!iife || iife.body.type !== "BlockStatement") throw new Error("main IIFE not found");
  return { insertAt: ms.start + iife.body.end - 1, main: ms };
}

/** 在 IIFE 尾部插入一段探针代码，返回新 HTML */
export function injectProbe(html, code) {
  const { insertAt } = findIifeTail(html);
  return html.slice(0, insertAt) + "\n" + code + "\n" + html.slice(insertAt);
}
