/**
 * verify-atlas.mjs —— 异界天赋树节点名排版回归（EMB-113）
 *
 * 背景：AtlasDraw 过去把节点名一律画在节点正上方（世界坐标、字号随缩放变化）。
 * 中心区节点间距只有 42 世界单位，中文节点名宽 40–60px，于是互相压字；
 * 画布左上那行「可用 / 已获得 / 已分配」HUD 也压在第一批名字上。
 *
 * 现在标签在屏幕坐标里排版并做避让，本测试把真实产物跑起来，对 5 组缩放/平移
 * 逐一检查：标签之间、标签与 HUD、标签与节点圆 都不重叠，且都在画布内。
 *
 * 用法：node tools/verify-atlas.mjs [产物路径]
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
    const p = path.join(W, "build", "test-v19.html");
    return fs.existsSync(p) ? p : null;
  })();

if (!ARTIFACT) {
  console.error("找不到测试版产物，先跑 npm run build");
  process.exit(2);
}

const CW = 900;
const CH = 540;

const PROBE = `
window.__probe = function () {
  var out = { ok: true, runs: [], nodes: [], err: null, cw: ${CW}, ch: ${CH} };
  try {
    var T = window.__erTest;
    if (!T || !T.atlasDraw) { out.ok = false; out.err = "测试版没有暴露 atlasDraw（是否拿了发布版产物？）"; return out; }
    out.nodes = T.atlasNodes();
    var wrap = document.createElement("div");
    wrap.id = "atlasWrap";
    document.body.appendChild(wrap);
    var cv = document.createElement("canvas");
    cv.id = "atlascv";
    cv.width = ${CW};
    cv.height = ${CH};
    wrap.appendChild(cv);
    // jsdom 的 canvas 桩固定返回 width:10，会让排版测试完全失真；
    // 这里换成按字数估宽（中文等宽 ≈ 10px/字），贴近真实渲染。
    var ctx = cv.getContext("2d");
    ctx.measureText = function (t) { return { width: String(t).length * 10, actualBoundingBoxAscent: 8, actualBoundingBoxDescent: 2 }; };
    var views = [
      { name: "默认 1.0", s: 1.0, x: 450, y: 270 },
      { name: "缩小 0.75", s: 0.75, x: 450, y: 270 },
      { name: "放大 1.6", s: 1.6, x: 300, y: 200 },
      { name: "最小 0.45", s: 0.45, x: 450, y: 270 },
      { name: "平移 0.9", s: 0.9, x: 620, y: 90 }
    ];
    for (var i = 0; i < views.length; i++) {
      T.atlasViewSet(views[i]);
      T.atlasDraw();
      out.runs.push({
        name: views[i].name, s: views[i].s, x: views[i].x, y: views[i].y,
        labels: T.atlasLabels(), hud: T.atlasHud()
      });
    }
  } catch (e) {
    out.ok = false;
    out.err = String(e && e.stack || e);
  }
  return out;
};
`;

function run() {
  const html = fs.readFileSync(ARTIFACT, "utf8");
  const tmp = path.join(W, "build", ".verify-atlas.html");
  const outFile = path.join(W, "build", ".verify-atlas.json");
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
const ok = (cond, label, extra) => checks.push({ cond: !!cond, label, extra });

function area(a, b) {
  const w = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
  const h = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
  return w > 0 && h > 0 ? Math.round(w * h) : 0;
}
const bx = (n) => `${n.x},${n.y} ${n.w}×${n.h}`;

const data = run();
if (!data.ok) {
  console.log("  ✗ 探针失败：" + data.err);
  process.exit(1);
}

ok(data.nodes.length > 20, `图谱节点已构建（${data.nodes.length} 个）`);
ok(data.runs.length === 5, `跑了 5 组缩放/平移（${data.runs.length}）`);

const NODE_R = { core: 16, keystone: 13, sig: 9, small: 6 };

for (const r of data.runs) {
  const tag = r.name;
  const labels = Array.isArray(r.labels) ? r.labels : [];
  ok(labels.length > 0, `${tag}：有标签被画出来（${labels.length} 条）`);

  // 画布内
  const outside = labels.filter((l) => l.x < 0 || l.y < 0 || l.x + l.w > CW + 0.5 || l.y + l.h > CH + 0.5);
  ok(outside.length === 0, `${tag}：标签都在画布内`, outside.map(bx).join(" | "));

  // 两两不重叠
  const dups = [];
  for (let i = 0; i < labels.length; i++) {
    for (let j = i + 1; j < labels.length; j++) {
      const a = area(labels[i], labels[j]);
      if (a > 0) dups.push(`${labels[i].t}×${labels[j].t}=${a}px²`);
    }
  }
  ok(dups.length === 0, `${tag}：标签两两不重叠`, dups.slice(0, 4).join(" | "));

  // 不压 HUD
  const hud = r.hud;
  ok(!!hud && hud.w > 0 && hud.h > 0, `${tag}：HUD 有记录`);
  if (hud) {
    const hit = labels.filter((l) => area(l, hud) > 0).map((l) => l.t);
    ok(hit.length === 0, `${tag}：标签不压 HUD`, hit.join(","));
  }

  // 不压节点圆（用节点外接方框近似；四周各收 1px，免得边界相切算成重叠）
  const hits = [];
  for (const l of labels) {
    for (const n of data.nodes) {
      const rad = (NODE_R[n.tier] || 6) * r.s;
      const box = { x: n.x * r.s + r.x - rad + 1, y: n.y * r.s + r.y - rad + 1, w: rad * 2 - 2, h: rad * 2 - 2 };
      if (area(l, box) > 0) hits.push(`${l.t}×${n.n}`);
    }
  }
  ok(hits.length === 0, `${tag}：标签不压节点圆`, hits.slice(0, 4).join(" | "));
}

const pass = checks.filter((c) => c.cond).length;
for (const c of checks) if (!c.cond) console.log(`  ✗ ${c.label}${c.extra ? " — " + c.extra : ""}`);
console.log(`\n天赋树标签排版 ${pass}/${checks.length} ${pass === checks.length ? "ALL PASS" : "FAILED"}`);
if (pass !== checks.length) process.exit(1);
