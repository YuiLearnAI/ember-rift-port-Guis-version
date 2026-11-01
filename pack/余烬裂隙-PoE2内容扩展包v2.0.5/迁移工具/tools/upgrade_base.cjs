#!/usr/bin/env node
/**
 * 一键升级底包：把朋友发来的新 HTML 作为新底包，自动做符号映射 + 移植块翻译 + 构建 + 检查。
 *
 * 用法：
 *   node 迁移工具/tools/upgrade_base.cjs "D:\路径\新底包.html"
 *
 * 说明：
 * - 这是半自动工具：符号映射能覆盖大多数基础函数，但仍可能有个别未映射符号；
 *   出现未映射游戏符号时脚本会中止并输出清单，不会破坏当前版本。
 * - 成功后会：备份当前 block/expose → 安装翻译后的版本 → 写入 base_path.txt → 构建 → 跑四项检查。
 */
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..", "..");
const TOOLS = path.join(ROOT, "迁移工具", "tools");
const OUT = path.join(ROOT, "迁移工具", "out");
const NODE = process.execPath;
const args = process.argv.slice(2);
const newBase = args.find((a) => /\.html?$/i.test(a));
if (!newBase) {
  console.error("用法: node 迁移工具/tools/upgrade_base.cjs <新底包.html>");
  process.exit(2);
}
if (!fs.existsSync(newBase)) {
  console.error("找不到文件: " + newBase);
  process.exit(2);
}
fs.mkdirSync(OUT, { recursive: true });
const ts = new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 14);
const archBaseDir = path.join(ROOT, "..", "余烬裂隙-归档资料", "基础版本");
fs.mkdirSync(archBaseDir, { recursive: true });

const cfgPath = path.join(ROOT, "迁移工具", "base_path.txt");
const oldBase = fs.existsSync(cfgPath) ? fs.readFileSync(cfgPath, "utf8").trim() : "";
if (!oldBase || !fs.existsSync(oldBase)) {
  console.error("当前底包路径无效，请先检查 迁移工具/base_path.txt");
  process.exit(2);
}

function extract(p) {
  const s = fs.readFileSync(p, "utf8");
  const m = s.match(/<script(?![^>]*\bsrc\s*=)[^>]*>([\s\S]*?)<\/script\s*>/);
  if (!m) throw new Error("找不到 inline 主脚本: " + p);
  return m[1];
}
function run(cmd, argv) {
  const r = spawnSync(cmd, argv, { cwd: ROOT, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  return { ok: r.status === 0, out: (r.stdout || "") + (r.stderr || ""), status: r.status };
}

console.log("[升级] 当前底包:", oldBase);
console.log("[升级] 新底包:", newBase);

// 1) 复制新底包到归档
const newBaseCopy = path.join(archBaseDir, "新底包-" + ts + ".html");
fs.copyFileSync(newBase, newBaseCopy);

// 2) 提取脚本并运行符号映射
fs.writeFileSync(path.join(OUT, "old.js"), extract(oldBase), "utf8");
fs.writeFileSync(path.join(OUT, "new.js"), extract(newBase), "utf8");
fs.writeFileSync(path.join(OUT, "cur.js"), extract(oldBase), "utf8");
fs.writeFileSync(path.join(OUT, "delta_OLD_CUR.json"), JSON.stringify({ gaps: [] }), "utf8");
let r = run(NODE, [path.join(TOOLS, "symmap.mjs"), "run"]);
if (!r.ok) {
  console.error("[升级] 符号映射失败:\n" + r.out.slice(-4000));
  process.exit(1);
}
const mapPath = path.join(OUT, "symbol_map.json");
if (!fs.existsSync(mapPath)) {
  console.error("[升级] 未生成 symbol_map.json");
  process.exit(1);
}
const map = JSON.parse(fs.readFileSync(mapPath, "utf8"));
console.log("[升级] 符号映射完成，共 " + Object.keys(map.globals || {}).length + " 条");

// 3) 翻译移植块 + 测试钩子
const blockSrc = path.join(ROOT, "迁移工具", "build", "block_new.js");
const exposeSrc = path.join(ROOT, "迁移工具", "build", "expose_port.js");
const blockOut = path.join(OUT, "block_upgraded.js");
const exposeOut = path.join(OUT, "expose_upgraded.js");
for (const [src, dst, name] of [[blockSrc, blockOut, "block"], [exposeSrc, exposeOut, "expose"]]) {
  const rr = run(NODE, [path.join(TOOLS, "rewrite.mjs"), "--map", mapPath, "--in", src, "--out", dst, "--report", path.join(OUT, name + "_rewrite.json")]);
  if (!rr.ok) {
    console.error("[升级] " + name + " 翻译失败:\n" + rr.out.slice(-4000));
    process.exit(1);
  }
}
const brep = JSON.parse(fs.readFileSync(path.join(OUT, "block_rewrite.json"), "utf8"));
const builtin = new Set(["Array", "Date", "Int16Array", "Int32Array", "JSON", "Math", "Number", "Object", "Set", "String", "Uint8Array", "addEventListener", "arguments", "console", "document", "history", "innerHeight", "innerWidth", "isFinite", "localStorage", "matchMedia", "parseInt", "removeEventListener", "requestAnimationFrame", "setInterval", "setTimeout", "undefined", "window"]);
const gameUnmapped = (brep.unmapped || []).filter((n) => !builtin.has(n));
if (gameUnmapped.length) {
  fs.writeFileSync(path.join(OUT, "upgrade_unmapped.json"), JSON.stringify(gameUnmapped, null, 1), "utf8");
  console.error("[升级] 中止：有 " + gameUnmapped.length + " 个游戏符号没有映射，需人工补映射：");
  console.error(gameUnmapped.join(", "));
  console.error("[升级] 当前版本没有被修改。清单: 迁移工具/out/upgrade_unmapped.json");
  process.exit(1);
}

// 4) 备份当前 block/expose 后安装新翻译版本
const backup = path.join(ROOT, "_build", "upgrade-backup-" + ts);
fs.mkdirSync(backup, { recursive: true });
fs.copyFileSync(blockSrc, path.join(backup, "block_new.js"));
fs.copyFileSync(exposeSrc, path.join(backup, "expose_port.js"));
fs.copyFileSync(blockOut, blockSrc);
fs.copyFileSync(exposeOut, exposeSrc);
fs.writeFileSync(cfgPath, newBaseCopy, "utf8");

// 5) 构建 + 检查
r = run(NODE, [path.join(ROOT, "迁移工具", "build", "build.mjs")]);
if (!r.ok) {
  console.error("[升级] 构建失败，已回滚。\n" + r.out.slice(-4000));
  fs.copyFileSync(path.join(backup, "block_new.js"), blockSrc);
  fs.copyFileSync(path.join(backup, "expose_port.js"), exposeSrc);
  fs.writeFileSync(cfgPath, oldBase, "utf8");
  process.exit(1);
}
const check = spawnSync("powershell.exe", ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", path.join(ROOT, "迁移工具", "发布前检查.ps1")], { cwd: ROOT, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
const ok = check.status === 0;
const report = [
  "# 底包升级报告",
  "",
  "- 时间: " + new Date().toLocaleString("zh-CN"),
  "- 旧底包: `" + oldBase + "`",
  "- 新底包: `" + newBaseCopy + "`",
  "- 符号映射: " + Object.keys(map.globals || {}).length + " 条",
  "- 未映射游戏符号: " + gameUnmapped.length,
  "- 构建: " + (r.ok ? "成功" : "失败"),
  "- 发布前检查: " + (ok ? "ALL PASS" : "FAIL"),
  "",
  "## 备份",
  "",
  "`" + backup + "`",
  "",
].join("\n");
const reportPath = path.join(ROOT, "..", "余烬裂隙-归档资料", "发布检查", "底包升级-" + ts + ".md");
fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, report, "utf8");
if (!ok) {
  console.error("[升级] 构建成功但检查失败，请查看报告并人工修冲突: " + reportPath);
  console.error(check.stdout.slice(-3000));
  process.exit(1);
}
console.log("[升级] 完成: " + reportPath);
