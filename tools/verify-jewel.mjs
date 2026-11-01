/**
 * verify-jewel.mjs —— 珠宝渲染回归测试（EMB-112）
 *
 * 背景：扩展块用 `kind === "jewel"` 作为「这是我的珠宝」的判据接管了宿主的
 * 图标 / 背包格子 / tooltip 三个函数。官方 v19.2 新增的传奇珠宝 kind 同样是
 * "jewel"，于是被整类吃掉：背包里图标空白、稀有度边框丢失、悬浮只显示
 * 「天赋珠宝 · T1 · 可镶嵌在高级天赋树的珠宝栏位」——玩家看不到它到底是什么。
 *
 * 本测试对三件官方传奇珠宝（逆流之玉 / 招魂之玉 / 盈虚之玉）和一件扩展珠宝
 * 做端到端断言，防止判据再次放宽。
 *
 * 用法：node tools/verify-jewel.mjs [产物路径]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { injectProbe } from "./lib/main-script.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const W = path.resolve(__dirname, "..");

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

const PROBE = `
window.__probe = function () {
  var out = { official: [], ext: null, caKeys: [] };
  function plain(h) { return String(h || "").replace(/<[^>]*>/g, " ").replace(/\\s+/g, " ").trim(); }
  out.caKeys = Object.keys(ca);
  out.caKeys.forEach(function (id) {
    try {
      var it = ti(id, 82);
      var q = qs(it, "inv");
      out.official.push({
        id: id,
        name: it.name,
        tip: plain(q && q.h),
        cell: String(Mo(it, "x", "")),
        icon: String(Ym(it) || "").slice(0, 24),
        hasFlavor: plain(q && q.h).indexOf(String(ca[id].fl || "").slice(0, 6)) >= 0
      });
    } catch (e) {
      out.official.push({ id: id, error: String(e && e.message || e) });
    }
  });
  // 扩展块被包在内层 IIFE 里，JewelPool / JewelItem 探针拿不到；
  // 这里直接构造一个扩展珠宝（jid 存在于 mods/jewels.js），用来验证判据没有误伤。
  try {
    var ej = {
      uid: 990001, kind: "jewel", jid: "jewel_fire_1", n: "余烬珠宝", tier: 1,
      rarity: 0, ilvl: 60, impl: [], mods: [], stats: [["fireInc", 8], ["life", 15]],
      name: "余烬珠宝"
    };
    var q2 = qs(ej, "inv");
    out.ext = { id: ej.jid, tip: plain(q2 && q2.h), cell: String(Mo(ej, "x", "")) };
  } catch (e) { out.ext = { error: String(e && e.message || e) }; }
  return out;
};
`;

function run() {
  const html = fs.readFileSync(ARTIFACT, "utf8");
  const tmp = path.join(W, "build", ".verify-jewel.html");
  const outFile = path.join(W, "build", ".verify-jewel.json");
  fs.writeFileSync(tmp, injectProbe(html, PROBE), "utf8");
  try {
    execFileSync(process.execPath, [path.join(__dirname, "_probe_run.cjs"), tmp], {
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024,
      env: { ...process.env, PROBE_OUT: outFile },
    });
    if (!fs.existsSync(outFile)) throw new Error("探针没有产出结果");
    return JSON.parse(fs.readFileSync(outFile, "utf8"));
  } finally {
    for (const f of [tmp, outFile]) if (fs.existsSync(f)) fs.unlinkSync(f);
  }
}

const checks = [];
function ok(cond, label, extra) {
  checks.push({ cond: !!cond, label, extra });
}

const data = run();

ok(data.caKeys.length > 0, `官方传奇珠宝表非空（${data.caKeys.length} 件）`);
for (const it of data.official) {
  const tag = it.name || it.id;
  if (it.error) {
    ok(false, `${tag}：生成 / 渲染不抛错`, it.error);
    continue;
  }
  ok(it.tip.includes("传奇珠宝"), `${tag}：tooltip 标明「传奇珠宝」`);
  ok(it.tip.includes("物品等级"), `${tag}：tooltip 含物品等级`);
  ok(it.tip.includes("→"), `${tag}：tooltip 含天赋转换表`);
  ok(it.hasFlavor, `${tag}：tooltip 含风味文字`);
  ok(!it.tip.includes("可镶嵌在高级天赋树的「珠宝栏位」"), `${tag}：没有被扩展包的通用珠宝说明顶替`);
  ok(it.cell.includes("jwc"), `${tag}：背包格子带珠宝专属样式 jwc`);
  ok(/cell r3/.test(it.cell), `${tag}：背包格子保留传奇稀有度样式 r3`);
  ok(it.icon.startsWith("data:image"), `${tag}：图标有内容`);
}

if (data.ext && !data.ext.error) {
  ok(data.ext.tip.includes("天赋珠宝 · T"), "扩展珠宝：tooltip 走扩展实现");
  ok(data.ext.tip.includes("可镶嵌在高级天赋树的「珠宝栏位」"), "扩展珠宝：保留扩展说明");
  ok(data.ext.cell.includes("cell gm"), "扩展珠宝：格子仍用扩展样式");
} else {
  ok(false, "扩展珠宝：可生成并渲染", data.ext && data.ext.error);
}

const pass = checks.filter((c) => c.cond).length;
for (const c of checks) {
  if (!c.cond) console.log(`  ✗ ${c.label}${c.extra ? " — " + c.extra : ""}`);
}
console.log(`\n珠宝渲染 ${pass}/${checks.length} ${pass === checks.length ? "ALL PASS" : "FAILED"}`);
if (pass !== checks.length) process.exit(1);
