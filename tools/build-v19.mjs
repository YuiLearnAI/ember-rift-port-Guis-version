/**
 * build-v19.mjs —— 以线上 v19 底包为基底，构建扩展包（测试版 / 发布版）
 *
 * 与旧 build.mjs 的差别：
 *  - 底包换成 v19（符号全部重命名，旧的字面量加固注入点全部失效）；
 *  - 注入点改为「可选」：命中才注入，未命中记录为 skipped，不阻断构建；
 *  - 只保留在 v19 里仍然成立的数值补丁（抗性上限、宝石等级上限）。
 *
 * 用法：node build-v19.mjs [--mode test|release|both]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as acorn from "./jstools/node_modules/acorn/dist/acorn.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const W = path.resolve(__dirname, "..");
const BASE = path.join(W, "base", "v19-online.html");
const BLOCK = path.join(W, "build", "block_v19.js");
const EXPOSE = path.join(W, "build", "expose_v19.js");
const CSSF = path.join(W, "pack", "余烬裂隙-PoE2内容扩展包v2.0.5", "迁移工具", "build", "port_css.css");
const MODS_DIR = path.join(W, "pack", "余烬裂隙-PoE2内容扩展包v2.0.5", "mods");
const HOTFIX_DIR = path.join(W, "pack", "余烬裂隙-PoE2内容扩展包v2.0.5", "迁移工具", "hotfix");
const VERSION = "2.3.8";
const REPORT = path.join(W, "reports", "build-v19-report.json");

const MOD_FILES = ["skills.js", "supports.js", "currencies.js", "star_effects.js", "runewords.js", "jewels.js"];

const skipped = [];
const applied = [];

function read(p) {
  if (!fs.existsSync(p)) throw new Error("missing " + p);
  return fs.readFileSync(p, "utf8");
}

/**
 * 大文件资产不进版本库（EMB-106），缺失时给出可执行提示，不要去猜路径。
 * 清单见 tools/assets.json。
 */
function requireAsset(p) {
  if (fs.existsSync(p)) return;
  throw new Error(
    "缺少资产：" + path.relative(W, p) + "\n" +
    "该文件由 GitHub Release 承载，不在版本库里。先执行：\n" +
    "  npm run assets:pull\n" +
    "（详见 docs/jira-delivery.md 第十节「大文件资产」）"
  );
}

/* ---------- 在主脚本 IIFE 尾部找插入点 ---------- */
function findInsertPoint(html) {
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
  const code = html.slice(best.start, best.end);
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
  if (iife.body.type !== "BlockStatement") throw new Error("IIFE body not a block");
  return { best, insertAt: best.start + iife.body.end - 1 };
}

/* ---------- 可选注入 ---------- */
function tryPatch(html, needle, replacement, label) {
  const n = html.split(needle).length - 1;
  if (n === 0) {
    skipped.push({ label, reason: "anchor not found in v19" });
    return html;
  }
  applied.push({ label, hits: n });
  return html.split(needle).join(replacement);
}

function main() {
  const mode = (process.argv.includes("--mode") && process.argv[process.argv.indexOf("--mode") + 1]) || "both";

  requireAsset(BASE);
  let base = read(BASE);
  const baseLen0 = base.length;

  /* --- 数值补丁：v19 仍成立的字面量 --- */
  // 玩家抗性上限 75% → 85%（v19 里全局对象与局部参数名互换：n.S.res / o.playerRes）
  base = tryPatch(
    base,
    "Math.min(75,(n.S.res[t]||0)-(o.playerRes||0))/100",
    "Math.min(85,(n.S.res[t]||0)-(o.playerRes||0))/100",
    "res-cap-server"
  );
  base = tryPatch(base, /Math\.min\(75,l\)/g, "Math.min(85,l)", "res-cap-ui");
  base = tryPatch(base, /l>=75\?/g, "l>=85?", "res-cap-badge");
  base = tryPatch(base, /l>75\?/g, "l>85?", "res-cap-badge2");

  // 技能宝石等级上限 20 → 30
  base = tryPatch(base, /lvl\s*<\s*20\b/g, "lvl<30", "gem-cap-lt");
  base = tryPatch(base, /lvl\s*>=\s*20\b/g, "lvl>=30", "gem-cap-gte");

  /* --- 防崩加固（v19.2 又换了一批压缩名，锚点按 v19.2 实际代码重建） ---
   * v19.1 → v19.2 的锚点变化：
   *   bg-draw       局部变量重排（k,g,v,w → v,g,k,x），drawImage 目标表达式不变
   *   loot-icon-cur 通货图标表 ci → Si（v19.2 里 Si 是按需生成的图标缓存）
   *   loot-icon-base 底材图标表 Ga → Ha
   *   mon-sprite    贴图表 Jt → Xt
   * 判断依据见 reports/MIGRATION-REPORT.md 与 out/symbol_map_19to192.json。
   */
  // 1) 背景绘制后挂自定义地面绘制钩子（扩展包移植块依赖）
  base = tryPatch(
    base,
    "d.drawImage(n.Z.img,v,g,k,x,v,g,k,x);let M=(y,R,j)=>",
    "d.drawImage(n.Z.img,v,g,k,x,v,g,k,x);try{window.__portDrawGroundCustom&&window.__portDrawGroundCustom()}catch(e){}let M=(y,R,j)=>",
    "guard:bg-draw"
  );
  // 2) 掉落图标：未知通货 / 未知底材时不能抛错（一抛整帧中断 → 吞字、贴图消失）
  //    v19.2 的 Si 是按需生成的缓存，未必有 trans/aug 键，取到 undefined 也无妨——
  //    真正的兜底是下面 loot-icon-base 里的 `j&&` 判空。
  base = tryPatch(
    base,
    'let j=R.kind==="cur"?Si[R.cur]:',
    'let j=R.kind==="cur"?(Si[R.cur]||Si.trans||Si.aug||null):',
    "guard:loot-icon-cur"
  );
  base = tryPatch(
    base,
    ':Ha[pe[R.it.base].icon];d.drawImage(j,',
    ':(pe[R.it.base]?Ha[pe[R.it.base].icon]:null);j&&d.drawImage(j,',
    "guard:loot-icon-base"
  );
  // 3) 怪物贴图：未知 spr 直接跳过该怪物，不让整帧中断
  base = tryPatch(
    base,
    "let t=Xt[e.spr],a=e.face<0,s=a?t.flip:t.img",
    "let t=Xt[e.spr]||Xt.zombie;if(!t)return;let a=e.face<0,s=a?t.flip:t.img",
    "guard:mon-sprite"
  );

  // 逐对象/逐掉落/逐实体循环级 try/catch：v19 渲染管线已重构（视野判定改为 M()，
  // 循环体边界与 18.0.3 不同），原锚点语义消失。强行包裹需重写循环边界，风险高于收益，
  // 且 v19 自身已有 Zs()/zf() 等逐项判定，故此处不注入，记录在案。
  for (const label of ["obj-loop", "loot-loop", "ent-loop"]) {
    skipped.push({ label: "guard:" + label, reason: "v19 渲染循环已重构，原锚点语义不存在；逐项判定已由 v19 自身承担" });
  }

  const block = read(BLOCK).replace(/\r\n/g, "\n");
  const expose = read(EXPOSE);
  const css = fs.existsSync(CSSF) ? read(CSSF) : "";
  const modsInline = MOD_FILES.map((f) => {
    const p = path.join(MODS_DIR, f);
    return fs.existsSync(p) ? read(p) : "";
  }).join("\r\n");

  const hotfixJson = read(path.join(HOTFIX_DIR, "hotfix.json"));
  const hotfixAdv = read(path.join(HOTFIX_DIR, "hotfix-advanced.js"));
  const hotfixData =
    "window.HOTFIX = " + hotfixJson.replace(/"version"\s*:\s*"[^"]*"/, '"version": "' + VERSION + '"') + ";" + "\r\n" + hotfixAdv;

  function buildHtml({ withExpose, withHotfix, modsSeparate }) {
    const { best, insertAt } = findInsertPoint(base);
    const EOL = base.includes("\r\n") ? "\r\n" : "\n";
    const wrapped = [
      "",
      "      /* ==================== 余烬裂隙 PoE2 内容扩展包 移植块 v19（自动生成，勿手改） ==================== */",
      "      (function () {",
      block
        .split("\n")
        .map((l) => (l.trim() ? "        " + l : l))
        .join("\n"),
      withExpose ? expose : "",
      "      })();",
      "",
    ].join(EOL);

    let out = base.slice(0, insertAt) + wrapped + base.slice(insertAt);

    // 主脚本开头的稳定锚点：用它定位「主脚本自己的 <script 标签」，
    // 不能直接 lastIndexOf("<script")——页面底部还有 Cloudflare 统计脚本，
    // 会把热修插到主脚本之后，导致移植块读 window.HOTFIX 时它还没定义。
    const mainHead = base.slice(best.start, best.start + 60);
    const mainContentPos = out.indexOf(mainHead);
    const mainTagPos = mainContentPos >= 0 ? out.lastIndexOf("<script", mainContentPos) : -1;

    // mods 必须在主脚本之前求值
    const modsBlock = "<script>\r\n" + modsInline + "\r\n</script>\r\n";
    if (mainTagPos >= 0) out = out.slice(0, mainTagPos) + modsBlock + out.slice(mainTagPos);

    // 热修也必须落在主脚本之前（移植块在 IIFE 末尾读取 window.HOTFIX）
    if (withHotfix) {
      const pos = out.lastIndexOf("<script", out.indexOf(mainHead));
      const tag = "<!-- HOTFIX-BEGIN -->\r\n<script>\r\n" + hotfixData + "\r\n</script>\r\n<!-- HOTFIX-END -->\r\n";
      out = pos >= 0 ? out.slice(0, pos) + tag + out.slice(pos) : tag + out;
    }

    if (css) {
      const headEnd = out.search(/<\/head>/i);
      const cssTag = "<style>\n/* 扩展包样式 */\n" + css + "</style>";
      out = headEnd >= 0 ? out.slice(0, headEnd) + cssTag + "\n" + out.slice(headEnd) : cssTag + out;
    }
    return out;
  }

  fs.mkdirSync(path.join(W, "reports"), { recursive: true });

  if (mode === "test" || mode === "both") {
    const test = buildHtml({ withExpose: true, withHotfix: false, modsSeparate: false });
    const p = path.join(W, "build", "test-v19.html");
    fs.writeFileSync(p, test, "utf8");
    console.log(`[build] test  ${p}  ${test.length} chars`);
  }
  if (mode === "release" || mode === "both") {
    const rel = buildHtml({ withExpose: false, withHotfix: true, modsSeparate: false });
    const p = path.join(W, "build", `余烬裂隙-异界内容扩展-v${VERSION}-v19.html`);
    fs.writeFileSync(p, rel, "utf8");
    console.log(`[build] release ${p}  ${rel.length} chars`);
  }

  fs.writeFileSync(REPORT, JSON.stringify({ version: VERSION, baseBytes: baseLen0, applied, skipped }, null, 2), "utf8");
  console.log(`[build] applied ${applied.length} patches, skipped ${skipped.length}`);
  for (const s of skipped) console.log(`  skip: ${s.label} — ${s.reason}`);
}

main();
