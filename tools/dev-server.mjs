/**
 * dev-server.mjs —— 本地预览服务器（零依赖）
 *
 * 用法：node tools/dev-server.mjs [--port 8787]
 *   /            发布版（含 mods + 热修）
 *   /test        测试版（含 __erTest 钩子，供回归用）
 *   /base        官方 v19 原始底包（对照用）
 *   /<相对路径>  仓库内任意文件
 *
 * 说明：发布版是单文件，直接双击也能玩；这里只是给个固定地址，方便刷新和真机对比。
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const W = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/**
 * 产物路径按「模式取最新」解析，不写死版本号——
 * 每次官方升版都会换产物文件名，写死就得跟着改，改了忘改就 404。
 */
function newest(prefix, fallback) {
  const dir = path.join(W, "build");
  if (!fs.existsSync(dir)) return fallback;
  const cands = fs
    .readdirSync(dir)
    .filter((f) => f.startsWith(prefix) && f.endsWith(".html"))
    .map((f) => ({ f, t: fs.statSync(path.join(dir, f)).mtimeMs }))
    .sort((a, b) => b.t - a.t);
  return cands.length ? path.join(dir, cands[0].f) : fallback;
}

const REL = newest("余烬裂隙-异界内容扩展-", path.join(W, "build", "余烬裂隙-异界内容扩展-v19.html"));
const TEST = path.join(W, "build", "test-v19.html");
const BASE = path.join(W, "base", "v19-online.html");
const WIKI = newest("wiki-异界版-", path.join(W, "build", "wiki-异界版.html"));

const portArg = process.argv.indexOf("--port");
const PORT = Number(portArg > -1 ? process.argv[portArg + 1] : process.env.PORT || 8787);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".md": "text/plain; charset=utf-8",
};

function send(res, code, body, type = "text/html; charset=utf-8") {
  res.writeHead(code, { "Content-Type": type, "Cache-Control": "no-store" });
  res.end(body);
}

function sendFile(res, file) {
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
    const rel = path.relative(W, file);
    // 大文件资产不进版本库（EMB-106），404 时直接给出可执行提示
    const isAsset = /^(base[\\/]|build[\\/].*\.html$|cheat[\\/]cheat[\\/]wiki\.html$)/.test(rel);
    const hint = isAsset ? "\n\n该文件由 GitHub Release 承载，先执行：npm run assets:pull" : "";
    return send(res, 404, "404 — 文件不存在：" + rel + hint, "text/plain; charset=utf-8");
  }
  send(res, 200, fs.readFileSync(file), MIME[path.extname(file).toLowerCase()] || "application/octet-stream");
}

const server = http.createServer((req, res) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  } catch {
    return send(res, 400, "400 — URL 无法解析", "text/plain; charset=utf-8");
  }

  if (pathname === "/" || pathname === "/release") return sendFile(res, REL);
  if (pathname === "/test") return sendFile(res, TEST);
  if (pathname === "/base") return sendFile(res, BASE);
  if (pathname === "/wiki") return sendFile(res, WIKI);

  // 静态回退：限制在仓库内，防目录穿越
  const target = path.resolve(W, "." + pathname);
  if (!target.startsWith(W + path.sep)) return send(res, 403, "403 — 越界访问", "text/plain; charset=utf-8");
  sendFile(res, target);
});

server.on("error", (e) => {
  if (e.code === "EADDRINUSE") {
    console.error(`[dev] 端口 ${PORT} 被占用，换一个：node tools/dev-server.mjs --port 8788`);
    process.exit(1);
  }
  throw e;
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`[dev] 发布版   http://127.0.0.1:${PORT}/`);
  console.log(`[dev] 测试版   http://127.0.0.1:${PORT}/test`);
  console.log(`[dev] 官方底包 http://127.0.0.1:${PORT}/base`);
  console.log(`[dev] 改版Wiki http://127.0.0.1:${PORT}/wiki`);
  console.log(`[dev] 根目录   ${W}`);
  console.log(`[dev] Ctrl+C 退出`);
});
