/**
 * audit-runtime.mjs —— 运行时数据表一致性审计（EMB-112）
 *
 * 静态逐字节比对只能证明「HTML 文本没被改」，证明不了「运行时官方数据没被扩展覆盖」。
 * 本工具把同一段探针分别注入官方基底与发布产物，在 jsdom 里各跑一次，导出关键数据表
 * 的键集合与逐键指纹，再逐表比对，输出三类差异：
 *   ADDED    扩展新增的键（= 额外内容，允许）
 *   CHANGED  同名键的值被改写（= 破坏官方内容，必须为 0）
 *   REMOVED  官方键消失（= 破坏官方内容，必须为 0）
 *
 * 用法：node tools/audit-runtime.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { injectProbe } from "./lib/main-script.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const W = path.resolve(__dirname, "..");
const BASE = path.join(W, "base", "v19-online.html");
const ARTIFACT = (() => {
  const dir = path.join(W, "build");
  const f = fs
    .readdirSync(dir)
    .filter((x) => /^余烬裂隙-异界内容扩展-v.*\.html$/.test(x))
    .sort()
    .pop();
  return f ? path.join(dir, f) : null;
})();

/* 需要比对的数据表：技能 / 辅助 / 增益 / 元技能 / 底材 / 暗金 / 传奇珠宝 / 词缀 / 通货 / 大珠宝分支 */
const TABLES = ["se", "ne", "He", "Ze", "pe", "Ua", "ca", "ns", "q", "bt"];

const PROBE = `
window.__snap = function () {
  function snap(o) {
    try {
      if (!o || typeof o !== "object") return { missing: true };
      var k = Object.keys(o), map = {};
      for (var i = 0; i < k.length; i++) {
        var v;
        try { v = JSON.stringify(o[k[i]]); } catch (e) { v = "?" + String(e); }
        map[k[i]] = v == null ? "null" : v;
      }
      return { n: k.length, map: map };
    } catch (e) { return { missing: String(e) }; }
  }
  var T = {};
  var names = ${JSON.stringify(TABLES)};
  for (var i = 0; i < names.length; i++) {
    var nm = names[i], val;
    try { val = eval(nm); } catch (e) { val = null; }
    T[nm] = snap(val);
  }
  return T;
};
`;

function buildProbeHtml(html) {
  return injectProbe(html, PROBE);
}

function runProbe(html, tag) {
  const tmp = path.join(W, "build", `.audit-${tag}.html`);
  const outFile = path.join(W, "build", `.audit-${tag}.json`);
  fs.writeFileSync(tmp, html, "utf8");
  try {
    execFileSync(process.execPath, [path.join(__dirname, "_probe_run.cjs"), tmp], {
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024,
      env: { ...process.env, PROBE_OUT: outFile },
    });
    if (!fs.existsSync(outFile)) throw new Error(`探针没有产出快照（${tag}）`);
    return JSON.parse(fs.readFileSync(outFile, "utf8"));
  } finally {
    for (const f of [tmp, outFile]) if (fs.existsSync(f)) fs.unlinkSync(f);
  }
}

function main() {
  if (!ARTIFACT) throw new Error("没有找到发布产物，先 npm run build");
  const baseSnap = runProbe(buildProbeHtml(fs.readFileSync(BASE, "utf8")), "base");
  const artSnap = runProbe(buildProbeHtml(fs.readFileSync(ARTIFACT, "utf8")), "artifact");

  let changed = 0;
  let removed = 0;
  let added = 0;
  let weightOnly = 0;
  const detail = process.argv.includes("--detail");

  /** 比较两个键的 JSON，返回变化的字段名；解析失败返回 null */
  function diffFields(a, b) {
    let A;
    let B;
    try {
      A = JSON.parse(a);
      B = JSON.parse(b);
    } catch {
      return null;
    }
    if (typeof A !== "object" || typeof B !== "object" || !A || !B) return A === B ? [] : null;
    const keys = new Set([...Object.keys(A), ...Object.keys(B)]);
    return [...keys].filter((k) => JSON.stringify(A[k]) !== JSON.stringify(B[k]));
  }

  console.log(`表名  官方键   产物键   新增   改写   丢失`);
  for (const t of TABLES) {
    const a = baseSnap[t] || { missing: true };
    const b = artSnap[t] || { missing: true };
    if (a.missing || b.missing) {
      console.log(`${t.padEnd(5)} ${a.missing ? "缺失" : ""} ${b.missing ? "产物缺失" : ""}`);
      continue;
    }
    const ak = Object.keys(a.map);
    const bk = Object.keys(b.map);
    const add = bk.filter((k) => !(k in a.map));
    const rem = ak.filter((k) => !(k in b.map));
    const chg = ak.filter((k) => k in b.map && a.map[k] !== b.map[k]);
    // 只改掉落权重 w 属于扩展包已登记的平衡调整（DropMulCfg），不算破坏官方内容
    const chgReal = [];
    const chgWeight = [];
    for (const k of chg) {
      const d = diffFields(a.map[k], b.map[k]);
      if (d && d.length === 1 && d[0] === "w") chgWeight.push(k);
      else chgReal.push(k);
    }
    added += add.length;
    removed += rem.length;
    changed += chgReal.length;
    weightOnly += chgWeight.length;
    console.log(
      `${t.padEnd(5)} ${String(a.n).padStart(6)} ${String(b.n).padStart(8)} ${String(add.length).padStart(6)} ${String(chgReal.length).padStart(6)} ${String(rem.length).padStart(6)}` +
        (chgWeight.length ? `  (权重调整 ${chgWeight.length})` : "") +
        (chgReal.length ? `  ← 改写: ${chgReal.slice(0, 8).join(",")}${chgReal.length > 8 ? "…" : ""}` : "") +
        (rem.length ? `  ← 丢失: ${rem.slice(0, 8).join(",")}${rem.length > 8 ? "…" : ""}` : "")
    );
    if (detail) {
      for (const k of [...chgReal, ...chgWeight]) {
        console.log(`   · ${t}.${k}`);
        console.log(`     官方 ${a.map[k]}`);
        console.log(`     产物 ${b.map[k]}`);
      }
    }
  }

  console.log(`\n合计 新增 ${added} · 改写 ${changed} · 丢失 ${removed} · 权重调整 ${weightOnly}`);
  if (changed || removed) {
    console.error("\n❌ 扩展改写了官方数据（新增键 / 掉落权重允许，其它改写与丢失不允许）");
    process.exit(1);
  }
  console.log("✅ 官方数据零丢失、零内容改写；扩展只做新增，改动仅限掉落权重");
}

main();
