/**
 * fetch-assets.mjs —— 取回不进版本库的大文件资产
 *
 * 背景：base/*.html、build/*.html 等 4MB 级文件已从 Git 历史移出（EMB-106），
 * 改由 GitHub Release 承载。干净克隆后需要先跑一次本脚本，构建才能开始。
 *
 * 清单：tools/assets.json（路径 / 资产名 / sha256）
 *
 * 用法：
 *   node tools/fetch-assets.mjs            取回缺失的资产
 *   node tools/fetch-assets.mjs --check    只体检，不下载（缺文件时退出码 1）
 *   node tools/fetch-assets.mjs --force    哈希不符时强制覆盖（本地改动会被丢弃）
 *   node tools/fetch-assets.mjs --only wiki  只处理路径含 "wiki" 的条目
 *
 * 设计取舍：构建脚本不会自动联网。缺文件时直接失败并提示跑本脚本，
 * 避免 `npm run build` 在不经意间产生网络请求。
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { fileURLToPath } from "node:url";

const W = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MANIFEST = path.join(W, "tools", "assets.json");

const argv = process.argv.slice(2);
const CHECK_ONLY = argv.includes("--check");
const FORCE = argv.includes("--force");
const onlyIdx = argv.indexOf("--only");
const ONLY = onlyIdx > -1 ? argv[onlyIdx + 1] : null;

function die(msg) {
  console.error("\n[assets] 失败：" + msg);
  process.exit(1);
}

function sha256(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function human(bytes) {
  return (bytes / 1048576).toFixed(1) + " MB";
}

async function download(url, dest) {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText} — ${url}`);
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  const tmp = dest + ".part";
  await pipeline(Readable.fromWeb(res.body), fs.createWriteStream(tmp));
  fs.renameSync(tmp, dest);
}

const manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
const entries = manifest.assets.filter((a) => !ONLY || a.path.includes(ONLY));

if (entries.length === 0) die(`没有匹配 --only ${ONLY} 的条目`);

const base = `https://github.com/${manifest.repo}/releases/download/${manifest.tag}`;

let downloaded = 0;
let skipped = 0;
const problems = [];

for (const a of entries) {
  const abs = path.join(W, a.path);
  const exists = fs.existsSync(abs);

  if (exists) {
    const got = sha256(abs);
    if (got === a.sha256) {
      console.log(`  OK      ${a.path}`);
      skipped++;
      continue;
    }
    if (!FORCE) {
      problems.push(`${a.path} 哈希不符（本地 ${got.slice(0, 12)}… ≠ 清单 ${a.sha256.slice(0, 12)}…）`);
      console.log(`  MISMATCH ${a.path}`);
      continue;
    }
    console.log(`  覆盖    ${a.path}（--force）`);
  } else {
    console.log(`  MISSING ${a.path}`);
  }

  if (CHECK_ONLY) {
    problems.push(`${a.path} 需要取回（--check 模式不下载）`);
    continue;
  }

  const url = `${base}/${a.asset}`;
  try {
    process.stdout.write(`          下载 ${a.asset} … `);
    await download(url, abs);
    const got = sha256(abs);
    if (got !== a.sha256) {
      fs.rmSync(abs, { force: true });
      throw new Error(`下载后哈希不符：${a.asset}`);
    }
    console.log(`完成（${human(fs.statSync(abs).size)}）`);
    downloaded++;
  } catch (e) {
    problems.push(`${a.path} 下载失败：${e.message}`);
    console.log("失败");
  }
}

console.log(
  `\n[assets] 共 ${entries.length} 项：已就位 ${skipped}，新取回 ${downloaded}，问题 ${problems.length}`
);

if (problems.length) {
  console.error("\n未解决的问题：");
  for (const p of problems) console.error("  - " + p);
  console.error(
    "\n排查建议：\n" +
      "  · Release 是否已被删除或改名？核对 tools/assets.json 的 tag\n" +
      "  · 本地文件被改动过？确认无价值后加 --force 覆盖\n" +
      "  · 网络不通？这些文件也可以从 Release 页面手动下载后放到对应路径\n"
  );
  process.exit(1);
}

console.log("[assets] 全部就位");
