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
const REL = path.join(W, "build", "余烬裂隙-异界内容扩展-v2.2.0-v19.html");
const TEST = path.join(W, "build", "test-v19.html");
const BASE = path.join(W, "base", "v19-online.html");
const WIKI = path.join(W, "build", "wiki-异界版-v2.2.0.html");

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
    return send(res, 404, "404 — 文件不存在：" + path.relative(W, file), "text/plain; charset=utf-8");
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
