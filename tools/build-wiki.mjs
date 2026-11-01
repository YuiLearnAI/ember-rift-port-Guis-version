/**
 * build-wiki.mjs —— 以官方 Wiki 快照为基底，构建「异界扩展版」Wiki
 *
 * 输入：
 *   base/wiki-online.html                     官方 Wiki 快照（勿改，回滚基线）
 *   pack/…/mods/*.js                          扩展包内容表（技能/辅助/通货/符文之语/星图/珠宝）
 *   pack/…/迁移工具/hotfix/hotfix.json        热修元信息
 *   build/block_v19.js                        扩展暗金定义（唯一来源）
 *   tools/wiki-exp-plugin.js                  浏览器端插件（并入数据 + 新增页面）
 *
 * 输出：
 *   build/wiki-异界版-v2.3.6.html             单文件 Wiki（离线可跑）
 *   reports/wiki-build-report.json            构建报告（补丁命中数 / 内容统计）
 *
 * 用法：node tools/build-wiki.mjs [--out <path>]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const W = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BASE = path.join(W, "base", "wiki-online.html");
const PACK = path.join(W, "pack", "余烬裂隙-PoE2内容扩展包v2.0.5");
const MODS = path.join(PACK, "mods");
const HOTFIX = path.join(PACK, "迁移工具", "hotfix", "hotfix.json");
const BLOCK = path.join(W, "build", "block_v19.js");
const PLUGIN = path.join(W, "tools", "wiki-exp-plugin.js");

const VER = "2.3.6";

// 产物里的「构建时点」。默认写死为定版值，让 `npm run wiki` 不带任何环境变量
// 也能与 Release 归档逐字节一致；发版时连同 VER 一起更新这一行。
// 临时构建（不打算归档的那次）用 EMB_BUILD_AT=... 覆盖。
// 注意不要改成 base 快照的 mtime：git 不保存 mtime，不同克隆出来的时间不同。
const BUILT_AT = "2026-11-01T16:19:00.000Z";

const PLUGIN_TAG = "<!-- EMBER-EXP-PLUGIN -->";

const applied = [];
const failed = [];

function read(p) {
  if (!fs.existsSync(p)) throw new Error("缺少文件：" + p);
  return fs.readFileSync(p, "utf8");
}

/** 大文件资产不进版本库（EMB-106），缺失时给出可执行提示 */
function requireAsset(p) {
  if (fs.existsSync(p)) return;
  throw new Error(
    "缺少资产：" + path.relative(W, p) + "\n" +
    "该文件由 GitHub Release 承载，不在版本库里。先执行：\n" +
    "  npm run assets:pull\n" +
    "（详见 docs/jira-delivery.md 第十节「大文件资产」）"
  );
}

/* ---------- 1. 收集扩展数据（直接执行扩展包源文件，避免手抄） ---------- */
function loadMods() {
  const win = {};
  for (const f of ["skills.js", "supports.js", "currencies.js", "star_effects.js", "runewords.js", "jewels.js"]) {
    const p = path.join(MODS, f);
    if (!fs.existsSync(p)) { failed.push({ label: "mods/" + f, reason: "文件不存在" }); continue; }
    new Function("window", "globalThis", read(p))(win, win);
    applied.push({ label: "mods/" + f, hits: 1 });
  }
  const pick = (k) => (Array.isArray(win[k]) ? win[k].filter((x) => x && x.id && x.enabled !== false) : []);
  return {
    skills: pick("RIFT_EXTRA_SKILLS"),
    supports: pick("RIFT_EXTRA_SUPPORTS"),
    currencies: pick("RIFT_EXTRA_CURRENCIES"),
    runewords: pick("RIFT_RUNEWORDS"),
    stars: pick("RIFT_STAR_EFFECTS"),
    jewels: pick("RIFT_EXTRA_JEWELS"),
  };
}

/* ---------- 2. 从移植块里取出 5 件扩展暗金 ---------- */
function loadUniques() {
  const src = read(BLOCK);
  const startMark = "var _v3035 = [";
  const endMark = "var _v3036 = []";
  const s = src.indexOf(startMark);
  const e = src.indexOf(endMark, s);
  if (s < 0 || e < 0) throw new Error("在 block_v19.js 中找不到暗金数组（_v3035/_v3036）——移植块结构变了，请更新 build-wiki.mjs");
  const literal = src.slice(s + "var _v3035 = ".length, e).trim().replace(/;+\s*$/, "");
  const arr = new Function("return " + literal + ";")();
  if (!Array.isArray(arr) || !arr.length) throw new Error("暗金数组解析结果为空");
  const bad = arr.filter((u) => !u || !u.id || !u.n || !u.base);
  if (bad.length) throw new Error("暗金条目字段缺失：" + JSON.stringify(bad.map((b) => b && b.id)));
  applied.push({ label: "block_v19.js 暗金", hits: arr.length });
  return arr;
}

/* ---------- 2b. 从移植块里取出腐化词缀池（EMB-122 / EMB-125） ---------- */
function loadCorruptPool() {
  const src = read(BLOCK);
  const mark = "/* ===== EMB-122 · 腐化词缀扩池 =====";
  const segStart = src.indexOf(mark);
  if (segStart < 0) throw new Error("在 block_v19.js 中找不到 EMB-122 扩池段");

  // 通用池 POOL
  const pStart = src.indexOf("var POOL = [", segStart);
  if (pStart < 0) throw new Error("在 EMB-122 段中找不到 POOL 数组");
  const open = src.indexOf("[", pStart);
  let depth = 0, end = -1;
  for (let i = open; i < src.length; i++) {
    const c = src[i];
    if (c === "[") depth++;
    else if (c === "]") { depth--; if (depth === 0) { end = i; break; } }
  }
  if (end < 0) throw new Error("POOL 数组括号不匹配");
  const literal = src.slice(open, end + 1);
  const arr = new Function("return " + literal + ";")();
  if (!Array.isArray(arr) || !arr.length) throw new Error("POOL 解析为空");
  const total = arr.reduce((s, p) => s + (p.w || 0), 0);
  applied.push({ label: "block_v19.js 腐化词缀池", hits: arr.length });

  // 传奇专属池 UNIQUE_POOL（EMB-125）
  const uniques = loadUniqueCorruptPools(src, segStart);

  return { entries: arr, total, uniques };
}

/* 解析 UNIQUE_POOL：{ uniqId: { n, pool: [...], fallbackScale } } */
function loadUniqueCorruptPools(src, segStart) {
  const upStart = src.indexOf("var UNIQUE_POOL = {", segStart);
  if (upStart < 0) return {};
  const open = src.indexOf("{", upStart);
  let depth = 0, end = -1;
  for (let i = open; i < src.length; i++) {
    const c = src[i];
    if (c === "{") depth++;
    else if (c === "}") { depth--; if (depth === 0) { end = i; break; } }
  }
  if (end < 0) return {};
  const literal = src.slice(open, end + 1);
  try {
    const obj = new Function("return " + literal + ";")();
    const out = {};
    for (const id in obj) {
      const u = obj[id];
      out[id] = {
        n: u.n || id,
        fallbackScale: u.fallbackScale || 0.5,
        pool: (u.pool || []).map((p) => ({ k: p.k, a: p.a, b: p.b, w: p.w })),
      };
    }
    const cnt = Object.keys(out).length;
    if (cnt) applied.push({ label: "block_v19.js 传奇专属腐化池", hits: cnt });
    return out;
  } catch (e) {
    console.warn("[wiki] 解析 UNIQUE_POOL 失败：", e.message);
    return {};
  }
}

/* ---------- 3. 文本补丁（官方文案里被扩展改掉的数值） ---------- */
function patchHtml(html) {
  const patch = (needle, repl, label, expect) => {
    // 注意：正则带捕获组时 String.match 返回 [整体, g1, g2...]，长度不是命中次数。
    // 这里统一按「全局匹配」计数，避免捕获组把计数算错。
    const n =
      typeof needle === "string"
        ? html.split(needle).length - 1
        : (html.match(new RegExp(needle.source, needle.flags.includes("g") ? needle.flags : needle.flags + "g")) || []).length;
    if (n === 0) { failed.push({ label, reason: "锚点未命中" }); return html; }
    if (expect != null && n !== expect) { failed.push({ label, reason: `命中 ${n} 次，预期 ${expect} 次` }); }
    applied.push({ label, hits: n });
    return typeof needle === "string" ? html.split(needle).join(repl) : html.replace(needle, repl);
  };

  // 宝石等级上限 20 → 30（扩展包把 lvl<20 / lvl>=20 两处判定抬到 30）
  html = patch("最高 20 级", "最高 30 级", "text:gem-cap-30", 2);

  // 标题与描述标明这是改版
  html = patch("<title>余烬裂隙 Wiki</title>", "<title>余烬裂隙 Wiki · 异界扩展版</title>", "title", 1);
  // 官方每次升版都会改这行 description（v19.0.1 万象 → v19.2 踏麟 · 真言），
  // 所以锚点按「整行前缀」匹配，只把版本别名换成本改版标识，不去猜后面列了哪些页签。
  html = patch(
    /(<meta name="description" content="余烬裂隙玩家百科\()v[\d.]+ [^)]*(\): )/,
    '$1异界内容扩展 v' + VER + ' 改版 · 基底 v19.2 踏麟 · 真言$2',
    "meta:description",
    1
  );

  // 官方站的统计脚本不带到本仓库的副本里（避免把访问计到官方账号）
  const cfRe = /<!-- Cloudflare Pages Analytics --><script defer src='https:\/\/static\.cloudflareinsights\.com\/beacon\.min\.js'[^>]*><\/script><!-- Cloudflare Pages Analytics -->/;
  if (cfRe.test(html)) {
    html = html.replace(cfRe, "<!-- 已移除官方站统计脚本（本副本不向官方站点上报数据） -->");
    applied.push({ label: "strip:cf-beacon", hits: 1 });
  }

  return html;
}

/* ---------- 4. 组装 ---------- */
function main() {
  const outArg = process.argv.indexOf("--out");
  const OUT = outArg > -1 ? path.resolve(process.argv[outArg + 1]) : path.join(W, "build", `wiki-异界版-v${VER}.html`);

  const mods = loadMods();
  const uniques = loadUniques();
  const corruptPool = loadCorruptPool();
  const hotfix = JSON.parse(read(HOTFIX));

  const EXP = {
    ver: VER,
    baseVer: "v19.2 踏麟 · 真言",
    // 构建时点取自上面的 BUILT_AT 定版常量，默认构建即可字节复现；
    // 需要留一次「真实构建时间」时用 EMB_BUILD_AT=2026-11-01T09:20:00.000Z 覆盖。
    builtAt: process.env.EMB_BUILD_AT || BUILT_AT,
    mods,
    uniques,
    corruptPool,
    summary: {
      skills: mods.skills.length,
      supports: mods.supports.length,
      currencies: mods.currencies.length,
      runewords: mods.runewords.length,
      stars: mods.stars.length,
      jewels: mods.jewels.length,
      uniques: uniques.length,
    },
    drops: {
      headhunter: "地图内击杀稀有怪（rar=3）时 0.3%",
      kaoms_heart: "地图内击杀稀有怪时 2%",
      temporalis: "地图内击杀稀有怪时 1.2%",
      rathpith_globe: "地图内击杀稀有怪时 0.6%",
      mageblood: "惊悸迷雾终点首领 1.5%（另有 1.5% 特殊事件挂钩）",
    },
    patches: [
      { n: "玩家抗性上限", from: "75%", to: "85%", d: "服务端结算、UI 数值、徽章阈值四处同步提升" },
      { n: "技能宝石等级上限", from: "20 级", to: "30 级", d: "升级判定与界面文案同步提升" },
      { n: "符文阶梯", from: "6 种符文通货", to: "40 级阶梯", d: "新增 rune_01–rune_40、合成与定向配方、词缀倍率" },
      { n: "暗金掉落", from: "—", to: "5 件", d: "独立概率表，只在高稀有度击杀时额外结算，不挤占原有掉落池" },
      { n: "腐化词缀池（瓦尔宝珠 · 祭坛双瓦）", from: "10 条等概率", to: "23 条带权重", d: "两套系统共用池，新增 13 条（数值/代价/机制），并修 3 处缺陷（详见本页「腐化词缀扩池」节）" },
    ],
    guards: [
      { n: "抗性上限 75% → 85%", d: "四处锚点同时改，避免显示与实际不一致", applied: true },
      { n: "宝石等级上限 20 → 30", d: "升级判定与显示同步", applied: true },
      { n: "地面绘制钩子容错", d: "扩展包的自定义地面绘制抛错时不中断整帧", applied: true },
      { n: "掉落图标兜底", d: "未知通货 / 未知底材查表失败时退回默认图标，而不是让整帧崩溃", applied: true },
      { n: "怪物贴图兜底", d: "未知 spr 跳过该怪物，避免整帧中断（吞字、贴图消失的根因）", applied: true },
      { n: "逐对象 / 逐掉落 / 逐实体循环级 try-catch", d: "v19 渲染循环已重构，原锚点语义不存在，强行包裹风险高于收益；v19 自身已有逐项判定", applied: false },
    ],
    hotfixNotes: hotfix.notes || "",
    hotfixVersion: hotfix.version || "",
  };

  requireAsset(BASE);
  let html = read(BASE);

  // 数据 + 插件：插在 </body> 之前（此时官方 app 脚本已执行完毕）
  const payload =
    "\n<!-- ===== 异界扩展数据（由 tools/build-wiki.mjs 生成，勿手改） ===== -->\n" +
    "<script>window.__EMBER_EXP = " + JSON.stringify(EXP) + ";</script>\n" +
    PLUGIN_TAG + "\n<script>\n" + read(PLUGIN) + "\n</script>\n";

  const bodyEnd = html.lastIndexOf("</body>");
  if (bodyEnd < 0) throw new Error("base wiki 缺少 </body>");
  html = html.slice(0, bodyEnd) + payload + html.slice(bodyEnd);

  html = patchHtml(html);

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, html, "utf8");

  const report = {
    version: VER,
    builtAt: EXP.builtAt,
    out: path.relative(W, OUT),
    bytes: Buffer.byteLength(html, "utf8"),
    counts: EXP.summary,
    applied,
    failed,
  };
  fs.mkdirSync(path.join(W, "reports"), { recursive: true });
  fs.writeFileSync(path.join(W, "reports", "wiki-build-report.json"), JSON.stringify(report, null, 2), "utf8");

  console.log(`[wiki] 输出 ${report.out} · ${(report.bytes / 1024 / 1024).toFixed(2)} MB`);
  console.log(`[wiki] 内容：暗金 ${EXP.summary.uniques} · 技能 ${EXP.summary.skills} · 辅助 ${EXP.summary.supports} · 通货 ${EXP.summary.currencies} · 符文之语 ${EXP.summary.runewords} · 珠宝 ${EXP.summary.jewels} · 星图 ${EXP.summary.stars}`);
  console.log(`[wiki] 补丁命中 ${applied.length} 项`);
  if (failed.length) {
    console.error("[wiki] 未命中：");
    for (const f of failed) console.error(`  ✗ ${f.label} — ${f.reason}`);
    process.exit(1);
  }
}

main();
