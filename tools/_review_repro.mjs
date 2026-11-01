#!/usr/bin/env node
/* review-runtime: 在内存里复现 build-v19.mjs 的注入流程（不写盘），
 * 检查 hotfix / mods 的落点，判定产物是否可由当前脚本复现。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as acorn from "./jstools/node_modules/acorn/dist/acorn.mjs";

const W = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BASE = path.join(W, "base", "v19-online.html");
const BLOCK = path.join(W, "build", "block_v19.js");
const EXPOSE = path.join(W, "build", "expose_v19.js");
const MODS_DIR = path.join(W, "pack", "余烬裂隙-PoE2内容扩展包v2.0.5", "mods");
const HOTFIX_DIR = path.join(W, "pack", "余烬裂隙-PoE2内容扩展包v2.0.5", "迁移工具", "hotfix");
const MOD_FILES = ["skills.js", "supports.js", "currencies.js", "star_effects.js", "runewords.js", "jewels.js"];

function findInsertPoint(html) {
  const tagRe = /<script\b[^>]*>/gi;
  let best = null, m;
  while ((m = tagRe.exec(html))) {
    if (/\bsrc\s*=/i.test(m[0])) continue;
    const closeRe = /<\/script\s*>/gi;
    closeRe.lastIndex = m.index + m[0].length;
    const c = closeRe.exec(html);
    if (!c) break;
    best = { start: m.index + m[0].length, end: c.index };
    tagRe.lastIndex = c.index + c[0].length;
  }
  const code = html.slice(best.start, best.end);
  const ast = acorn.parse(code, { ecmaVersion: "latest", sourceType: "script" });
  let iife = null;
  for (const st of ast.body) {
    if (st.type === "ExpressionStatement" && st.expression.type === "CallExpression") {
      const c = st.expression.callee;
      if (c && (c.type === "ArrowFunctionExpression" || c.type === "FunctionExpression")) { iife = c; break; }
    }
  }
  return { best, insertAt: best.start + iife.body.end - 1 };
}

function tryPatch(html, needle, replacement) {
  const n = typeof needle === "string" ? html.split(needle).length - 1 : (html.match(needle) || []).length;
  if (!n) return html;
  return typeof needle === "string" ? html.split(needle).join(replacement) : html.replace(needle, replacement);
}

let base = fs.readFileSync(BASE, "utf8");
base = tryPatch(base, "Math.min(75,(n.S.res[t]||0)-(o.playerRes||0))/100", "Math.min(85,(n.S.res[t]||0)-(o.playerRes||0))/100");
base = tryPatch(base, /Math\.min\(75,l\)/g, "Math.min(85,l)");
base = tryPatch(base, /l>=75\?/g, "l>=85?");
base = tryPatch(base, /l>75\?/g, "l>85?");
base = tryPatch(base, /lvl\s*<\s*20\b/g, "lvl<30");
base = tryPatch(base, /lvl\s*>=\s*20\b/g, "lvl>=30");
base = tryPatch(base, "d.drawImage(n.Z.img,k,g,v,w,k,g,v,w);let M=(y,R,j)=>", "d.drawImage(n.Z.img,k,g,v,w,k,g,v,w);try{window.__portDrawGroundCustom&&window.__portDrawGroundCustom()}catch(e){}let M=(y,R,j)=>");
base = tryPatch(base, 'let j=R.kind==="cur"?ci[R.cur]:', 'let j=R.kind==="cur"?(ci[R.cur]||ci.trans||ci.aug||null):');
base = tryPatch(base, ':Ga[pe[R.it.base].icon];d.drawImage(j,', ':(pe[R.it.base]?Ga[pe[R.it.base].icon]:null);j&&d.drawImage(j,');
base = tryPatch(base, "let t=Jt[e.spr],a=e.face<0,s=a?t.flip:t.img", "let t=Jt[e.spr]||Jt.zombie;if(!t)return;let a=e.face<0,s=a?t.flip:t.img");

const block = fs.readFileSync(BLOCK, "utf8").replace(/\r\n/g, "\n");
const expose = fs.readFileSync(EXPOSE, "utf8");
const modsInline = MOD_FILES.map((f) => fs.readFileSync(path.join(MODS_DIR, f), "utf8")).join("\r\n");
const hotfixJson = fs.readFileSync(path.join(HOTFIX_DIR, "hotfix.json"), "utf8");
const hotfixAdv = fs.readFileSync(path.join(HOTFIX_DIR, "hotfix-advanced.js"), "utf8");
const hotfixData = "window.HOTFIX = " + hotfixJson.replace(/"version"\s*:\s*"[^"]*"/, '"version": "2.2.0"') + ";" + "\r\n" + hotfixAdv;

function buildHtml({ withExpose, withHotfix }) {
  const { insertAt } = findInsertPoint(base);
  const EOL = base.includes("\r\n") ? "\r\n" : "\n";
  const wrapped = ["", "      /* ===== 移植块 v19 ===== */", "      (function () {",
    block.split("\n").map((l) => (l.trim() ? "        " + l : l)).join("\n"),
    withExpose ? expose : "", "      })();", ""].join(EOL);
  let out = base.slice(0, insertAt) + wrapped + base.slice(insertAt);

  const mainTag = out.lastIndexOf("<script", insertAt + (out.length - base.length));
  const modsBlock = "<script>\r\n" + modsInline + "\r\n</script>\r\n";
  if (mainTag >= 0) out = out.slice(0, mainTag) + modsBlock + out.slice(mainTag);

  let hotfixPos = -1;
  if (withHotfix) {
    const pos = out.lastIndexOf("<script");
    hotfixPos = pos;
    const tag = "<!-- HOTFIX-BEGIN -->\r\n<script>\r\n" + hotfixData + "\r\n</script>\r\n<!-- HOTFIX-END -->\r\n";
    out = out.slice(0, pos) + tag + out.slice(pos);
  }
  return { out, mainTag, hotfixPos, insertAt };
}

const rel = buildHtml({ withExpose: false, withHotfix: true });
console.log("=== 复现结果（内存）===");
console.log("insertAt(主 IIFE 尾)      =", rel.insertAt);
console.log("mods 插入点 mainTag       =", rel.mainTag);
console.log("hotfix 插入点             =", rel.hotfixPos);
console.log("→ hotfix 落在主脚本之前?  ", rel.hotfixPos < rel.mainTag);
console.log("");
// 找出 all <script positions
const out = rel.out;
const positions = [];
let i = 0;
while (true) {
  const s = out.indexOf("<script", i);
  if (s === -1) break;
  const gt = out.indexOf(">", s);
  const ce = out.indexOf("</script", gt);
  positions.push({ at: s, len: ce - gt - 1, head: out.slice(gt + 1, gt + 60).replace(/\s+/g, " ") });
  i = ce + 8;
}
positions.forEach((p, k) => console.log(`  script#${k + 1} @${p.at} len=${p.len} :: ${p.head.slice(0, 50)}`));

console.log("\n=== 与磁盘上的发布版比对 ===");
const disk = fs.readFileSync(path.join(W, "build", "余烬裂隙-异界内容扩展-v2.2.0-v19.html"), "utf8");
console.log("内存产物长度:", out.length, " 磁盘产物长度:", disk.length, " 差值:", disk.length - out.length);
// 结构比对：hotfix 相对主脚本位置
const diskMain = disk.indexOf("(()=>{var eA=Object.defineProperty");
const diskHot = disk.indexOf('window.HOTFIX = {"version"');
console.log(`磁盘: hotfix@${diskHot} main@${diskMain} → hotfix在main之前? ${diskHot < diskMain}`);
const memMain = out.indexOf("(()=>{var eA=Object.defineProperty");
const memHot = out.indexOf('window.HOTFIX = {"version"');
console.log(`内存: hotfix@${memHot} main@${memMain} → hotfix在main之前? ${memHot < memMain}`);
