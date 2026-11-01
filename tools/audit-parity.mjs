/**
 * audit-parity.mjs —— 基底一致性审计（EMB-112）
 *
 * 目的：证明发布产物 = 「官方基底 + 已登记的补丁 + 扩展注入」，除此以外一字节不改。
 * 做法：把产物里的四类注入剥掉，再对基底施加同样白名单补丁，两份字符串逐字节比对。
 * 不一致就打印首个差异点并 exit 1。
 *
 * 用法：node tools/audit-parity.mjs [产物路径]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const W = path.resolve(__dirname, "..");
const BASE = path.join(W, "base", "v19-online.html");
const ARTIFACT =
  process.argv[2] ||
  (() => {
    const dir = path.join(W, "build");
    const f = fs
      .readdirSync(dir)
      .filter((x) => /^余烬裂隙-异界内容扩展-v.*\.html$/.test(x))
      .sort()
      .pop();
    return f ? path.join(dir, f) : null;
  })();

/* ---- 与 build-v19.mjs 保持一致的白名单补丁（改一处两边都要改） ---- */
const PATCHES = [
  [
    "res-cap-server",
    "Math.min(75,(n.S.res[t]||0)-(o.playerRes||0))/100",
    "Math.min(85,(n.S.res[t]||0)-(o.playerRes||0))/100",
  ],
  ["res-cap-ui", /Math\.min\(75,l\)/g, "Math.min(85,l)"],
  ["res-cap-badge", /l>=75\?/g, "l>=85?"],
  ["res-cap-badge2", /l>75\?/g, "l>85?"],
  ["gem-cap-lt", /lvl\s*<\s*20\b/g, "lvl<30"],
  ["gem-cap-gte", /lvl\s*>=\s*20\b/g, "lvl>=30"],
  [
    "guard:bg-draw",
    "d.drawImage(n.Z.img,v,g,k,x,v,g,k,x);let M=(y,R,j)=>",
    "d.drawImage(n.Z.img,v,g,k,x,v,g,k,x);try{window.__portDrawGroundCustom&&window.__portDrawGroundCustom()}catch(e){}let M=(y,R,j)=>",
  ],
  [
    "guard:loot-icon-cur",
    'let j=R.kind==="cur"?Si[R.cur]:',
    'let j=R.kind==="cur"?(Si[R.cur]||Si.trans||Si.aug||null):',
  ],
  [
    "guard:loot-icon-base",
    ":Ha[pe[R.it.base].icon];d.drawImage(j,",
    ":(pe[R.it.base]?Ha[pe[R.it.base].icon]:null);j&&d.drawImage(j,",
  ],
  [
    "guard:mon-sprite",
    "let t=Xt[e.spr],a=e.face<0,s=a?t.flip:t.img",
    "let t=Xt[e.spr]||Xt.zombie;if(!t)return;let a=e.face<0,s=a?t.flip:t.img",
  ],
];

function applyPatches(html) {
  let out = html;
  const hits = [];
  for (const [label, needle, repl] of PATCHES) {
    const n = out.split(needle).length - 1;
    if (n === 0) throw new Error(`补丁锚点未命中：${label}`);
    out = out.split(needle).join(repl);
    hits.push({ label, hits: n });
  }
  return { out, hits };
}

/* ---- 从产物中剥掉扩展注入 ---- */
function mainScriptHead(html) {
  const tagRe = /<script\b[^>]*>/gi;
  let best = null;
  let m;
  while ((m = tagRe.exec(html))) {
    if (/\bsrc\s*=/i.test(m[0])) continue;
    const closeRe = /<\/script\s*>/gi;
    closeRe.lastIndex = m.index + m[0].length;
    const c = closeRe.exec(html);
    if (!c) break;
    best = m.index + m[0].length;
    tagRe.lastIndex = c.index + c[0].length;
  }
  return best == null ? "" : html.slice(best, best + 60);
}

function stripInjections(out, MAIN_HEAD) {
  const EOL = out.includes("\r\n") ? "\r\n" : "\n";
  const removed = [];
  let s = out;

  const cut = (start, end, label) => {
    if (start < 0 || end < 0 || end <= start) throw new Error(`找不到注入区段：${label}`);
    removed.push({ label, bytes: end - start });
    s = s.slice(0, start) + s.slice(end);
  };

  // 1) 移植块（IIFE 末尾，以 6 空格缩进的 })(); 收尾）
  const blockStart = s.indexOf("      /* ==================== 余烬裂隙 PoE2 内容扩展包 移植块 v19");
  if (blockStart < 0) throw new Error("找不到移植块");
  const closeRe = new RegExp("^ {6}\\" + "}\\)\\(\\);$", "m");
  closeRe.lastIndex = blockStart;
  const m = closeRe.exec(s);
  if (!m) throw new Error("找不到移植块结尾");
  const blockEnd = m.index + m[0].length;
  // 注入块以「空行 + 内容」包住插入点，前后各有一个换行，一并剥掉
  const tail = s.slice(blockEnd);
  const nl = tail.startsWith("\r\n") ? 2 : tail.startsWith("\n") ? 1 : 0;
  const head = s.slice(Math.max(0, blockStart - 2), blockStart);
  const nlBefore = head.endsWith("\r\n") ? 2 : head.endsWith("\n") ? 1 : 0;
  cut(blockStart - nlBefore, blockEnd + nl, "移植块");

  // 2) 热修块
  const hb = s.indexOf("<!-- HOTFIX-BEGIN -->");
  const he = s.indexOf("<!-- HOTFIX-END -->");
  if (hb >= 0) cut(hb, he + "<!-- HOTFIX-END -->".length + EOL.length, "HOTFIX");

  // 3) mods 脚本：紧贴主脚本之前的那个 <script>（内容含 window.RIFT_EXTRA_*）
  const mainContentPos = s.indexOf(MAIN_HEAD);
  if (mainContentPos < 0) throw new Error("找不到主脚本");
  const mainTagPos = s.lastIndexOf("<script", mainContentPos);
  const prevTagPos = s.lastIndexOf("<script", mainTagPos - 1);
  if (prevTagPos < 0) throw new Error("找不到 mods 脚本");
  if (!s.slice(prevTagPos, mainTagPos).includes("window.RIFT_EXTRA_JEWELS")) {
    throw new Error("主脚本前一个 script 不是扩展 mods，结构变了");
  }
  cut(prevTagPos, mainTagPos, "mods");

  // 4) 扩展包 CSS
  const cs = s.indexOf("<style>" + "\n" + "/* 扩展包样式 */");
  if (cs >= 0) {
    const ce = s.indexOf("</style>", cs);
    if (ce < 0) throw new Error("扩展包样式未闭合");
    cut(cs, ce + "</style>".length + "\n".length, "扩展包 CSS");
  }

  return { out: s, removed };
}

function firstDiff(a, b) {
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) if (a[i] !== b[i]) return i;
  return a.length === b.length ? -1 : n;
}

function main() {
  if (!ARTIFACT) throw new Error("没有找到发布产物，先 npm run build");
  const base = fs.readFileSync(BASE, "utf8");
  const art = fs.readFileSync(ARTIFACT, "utf8");

  const { out: stripped, removed } = stripInjections(art, mainScriptHead(base));
  const { out: expected, hits } = applyPatches(base);

  console.log(`基底      ${path.relative(W, BASE)}  ${base.length} 字符`);
  console.log(`产物      ${path.relative(W, ARTIFACT)}  ${art.length} 字符`);
  console.log(`剥离注入  ${removed.map((r) => r.label + "(" + r.bytes + "B)").join(" · ")}`);
  console.log(`白名单补丁 ${hits.map((h) => h.label + "×" + h.hits).join(" · ")}`);

  const d = firstDiff(stripped, expected);
  if (d >= 0) {
    console.error(`\n❌ 基底不一致，首个差异 @${d}`);
    console.error("  产物(剥离后) …" + JSON.stringify(stripped.slice(Math.max(0, d - 80), d + 80)));
    console.error("  基底(打补丁) …" + JSON.stringify(expected.slice(Math.max(0, d - 80), d + 80)));
    process.exit(1);
  }
  console.log(`\n✅ 剥离注入并施加白名单补丁后，与官方基底逐字节一致（${stripped.length} 字符）`);
}

main();
