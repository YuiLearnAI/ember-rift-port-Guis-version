// 构建脚本：从 迁移工具/build/block_new.js 重建开发版 / 测试版 / 发布版
//
// 用法：node 迁移工具/build/build.mjs
//
// 产物：
//   1. 余烬裂隙-异界内容扩展.html                 开发版（外挂 hotfix-data.js）
//   2. 迁移工具/test-build.html                   回归测试专用（内嵌 __erTest 钩子，不发布）
//   3. 余烬裂隙-异界内容扩展-v<version>.html      发布版（热修内嵌，单文件）
//
// 说明：
//   - base 用包内「基础版本/憨憨问号v0.4-18.0.1/[改版]余烬裂隙...html」
//     （SHA256 与迁移工作区 base/new.html 一致，已验证）。
//   - 本脚本等价于迁移工作区的 assemble.mjs + bake-hotfix.ps1，但全部在包内完成，不依赖 D:\xyx\.dsh-work。
//   - block_new.js 是唯一手改源；dev/test/release 都由它生成。改完跑本脚本 + 发布前检查.bat。
//   - 开发版若被浏览器占用（EPERM），会写到 _build/dev_pending.html 并给出提示，不阻断发布版/测试版构建。
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as acorn from "./jstools/node_modules/acorn/dist/acorn.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..");
const SRC = __dirname;

const BASE_CFG = path.join(SRC, "base_path.txt");
const BASE = fs.existsSync(BASE_CFG) ? fs.readFileSync(BASE_CFG, "utf8").trim() : path.join(ROOT, "..", "余烬裂隙-归档资料", "基础版本", "憨憨问号v0.4-18.0.3", "[改版]余烬裂隙 憨憨问号 v0.4更好的体验18.0.3.html");
const BLOCK = path.join(SRC, "block_new.js");
const CSS = path.join(SRC, "port_css.css");
const EXPOSE = path.join(SRC, "expose_port.js");
const DEV_OUT = path.join(SRC, "_dev", "余烬裂隙-异界内容扩展.html");
const DEV_PENDING = path.join(ROOT, "_build", "dev_pending.html");
const TEST_OUT = path.join(ROOT, "迁移工具", "test-build.html");
const HOTFIX_JSON = path.join(ROOT, "迁移工具", "hotfix", "hotfix.json");
const HOTFIX_ADV = path.join(ROOT, "迁移工具", "hotfix", "hotfix-advanced.js");
const VERSION_FILE = path.join(ROOT, "version.json");
const HOTFIX_DATA = path.join(ROOT, "迁移工具", "hotfix", "hotfix-data.js");
const MODS_DIR = path.join(ROOT, "mods");
const MODS_SKILLS = path.join(MODS_DIR, "skills.js");
const MODS_SUPPORTS = path.join(MODS_DIR, "supports.js");
const MODS_CURRENCIES = path.join(MODS_DIR, "currencies.js");
const MODS_STAR = path.join(MODS_DIR, "star_effects.js");
const MODS_WORDS = path.join(MODS_DIR, "runewords.js");
const MODS_JEWELS = path.join(MODS_DIR, "jewels.js");

function fail(msg) {
  console.error("[build] " + msg);
  process.exit(1);
}

function read(p) {
  if (!fs.existsSync(p)) fail("找不到 " + p);
  return fs.readFileSync(p, "utf8");
}

function tryWrite(p, content, label) {
  try {
    fs.writeFileSync(p, content, "utf8");
    console.log("[build] " + label + "  " + p + "  (" + content.length + " chars)");
    return true;
  } catch (e) {
    console.warn("[build] " + label + " 写入失败(" + e.code + ")，可能被浏览器占用: " + p);
    return false;
  }
}

// ---- 提取主 IIFE 的插入点（与迁移工作区 assemble.mjs 完全同逻辑） ----
function findInsertPoint(html) {
  const tagRe = /<script\b[^>]*>/gi;
  const closeRe = /<\/script\s*>/gi;
  const srcRe = /\bsrc\s*=/i;
  let best = null;
  let m;
  while ((m = tagRe.exec(html))) {
    closeRe.lastIndex = m.index + m[0].length;
    const c = closeRe.exec(html);
    if (!c) break;
    if (!srcRe.test(m[0])) best = { start: m.index + m[0].length, end: c.index };
    tagRe.lastIndex = c.index + c[0].length;
  }
  if (!best) fail("no inline script found");
  const code = html.slice(best.start, best.end);
  const ast = acorn.parse(code, { ecmaVersion: "latest", sourceType: "script", locations: true });
  function isIifeCall(st) {
    if (!st || st.type !== "ExpressionStatement") return null;
    const e = st.expression;
    if (!e || e.type !== "CallExpression") return null;
    const c = e.callee;
    if (c && (c.type === "ArrowFunctionExpression" || c.type === "FunctionExpression")) return c;
    return null;
  }
  let iife = null;
  for (const st of ast.body) {
    iife = isIifeCall(st);
    if (iife) break;
  }
  if (!iife) fail("main IIFE not found");
  if (iife.body.type !== "BlockStatement") fail("IIFE body not a block");
  return { best, insertAt: best.start + iife.body.end - 1 };
}

// ---- 生成一个网页：移植块 + 可选 expose + 可选热修 ----
function buildHtml({ baseHtml, block, css, expose, hotfixTag, hotfixInline, modsTag, modsInline }) {
  const { best, insertAt } = findInsertPoint(baseHtml);
  const EOL = baseHtml.includes("\r\n") ? "\r\n" : "\n";
  const wrapped = [
    "",
    "      /* ==================== 余烬裂隙 PoE2 内容扩展包 移植块（自动生成，勿手改） ==================== */",
    "      (function () {",
    block.split("\n").map((l) => (l.trim() ? "        " + l : l)).join("\n"),
    expose || "",
    "      })();",
    "",
  ].join(EOL);

  let out = baseHtml.slice(0, insertAt) + wrapped + baseHtml.slice(insertAt);

  // mods/ 数据驱动宝石脚本：必须放在游戏主脚本之前
  if (modsTag) {
    const mainTagPos = out.lastIndexOf("<script", best.start + (out.length - baseHtml.length));
    out = mainTagPos >= 0 ? out.slice(0, mainTagPos) + modsTag + "\n" + out.slice(mainTagPos) : modsTag + out;
  } else if (modsInline != null) {
    // 回归 harness 只 eval 主脚本内容，所以测试版把 mods 直接注入主脚本开头
    const mainTagPos = out.lastIndexOf("<script", best.start + (out.length - baseHtml.length));
    if (mainTagPos >= 0) {
      const gt = out.indexOf(">", mainTagPos) + 1;
      out = out.slice(0, gt) + "\r\n" + modsInline + "\r\n" + out.slice(gt);
    } else {
      out = modsInline + out;
    }
  }

  if (hotfixTag) {
    const tag = '<script src="hotfix-data.js"></script>';
    const mainTagPos = out.lastIndexOf("<script", best.start + (out.length - baseHtml.length));
    out = mainTagPos >= 0 ? out.slice(0, mainTagPos) + tag + "\n" + out.slice(mainTagPos) : tag + out;
  } else if (hotfixInline != null) {
    const tag = "<script>\r\n" + hotfixInline + "\r\n</script>\r\n";
    const mainTagPos = out.lastIndexOf("<script", best.start + (out.length - baseHtml.length));
    out = mainTagPos >= 0 ? out.slice(0, mainTagPos) + tag + out.slice(mainTagPos) : tag + out;
  }
  if (css) {
    const cssTag = "<style>\n/* 移植块样式（来自 v1.04 新增 CSS） */\n" + css + "</style>";
    const headEnd = out.search(/<\/head>/i);
    if (headEnd >= 0) out = out.slice(0, headEnd) + cssTag + "\n" + out.slice(headEnd);
    else out = cssTag + "\n" + out;
  }
  return out;
}

function main() {
  let base = read(BASE);
  const _bgHook = 'drawImage(o.Z.img,k,g,v,S,k,g,v,S);let T=';
  if (!base.includes(_bgHook)) fail("背景绘制注入点缺失");
  base = base.replace(_bgHook, 'drawImage(o.Z.img,k,g,v,S,k,g,v,S);try{window.__portDrawGroundCustom&&window.__portDrawGroundCustom()}catch(e){}let T=');
  // 掉落图标守卫：未知通货/未知底材时不能抛错（一抛整帧中断 → 吞字/贴图消失）
  const _lootIcon = 'let E=C.kind==="cur"?hr[C.cur]:C.it.kind==="map"?Ya.map:C.it.kind==="gem"||C.it.kind==="sup"?Ya.gem:C.it.kind==="buff"?Ya.buff:C.it.kind==="meta"?Ya.meta:C.it.kind==="soul"?Ya["soul_"+C.it.beast]:Ya[he[C.it.base].icon];f.drawImage(E,';
  if (!base.includes(_lootIcon)) fail("掉落图标守卫注入点缺失");
  base = base.replace(_lootIcon, 'let E=C.kind==="cur"?(hr[C.cur]||hr.trans||hr.aug):C.it.kind==="map"?Ya.map:C.it.kind==="gem"||C.it.kind==="sup"?Ya.gem:C.it.kind==="buff"?Ya.buff:C.it.kind==="meta"?Ya.meta:C.it.kind==="soul"?Ya["soul_"+C.it.beast]:(he[C.it.base]?Ya[he[C.it.base].icon]:null);E&&f.drawImage(E,');
  // 怪物贴图守卫：未知 spr 不能抛错（一抛整帧中断 → 技能贴图/文字全消失）
  const _monSpr = 'function F3(e){if(e.hidden)return;if(ir.mode===2)return wv(e);let t=zt[e.spr],a=e.face<0,s=a?t.flip:t.img';
  if (!base.includes(_monSpr)) fail("怪物贴图守卫注入点缺失");
  base = base.replace(_monSpr, 'function F3(e){if(e.hidden)return;if(ir.mode===2)return wv(e);let t=zt[e.spr]||zt.zombie;if(!t)return;let a=e.face<0,s=a?t.flip:t.img');
  // 逐对象/逐掉落/逐实体守卫：单个坏对象不能让整帧中断（否则后面的特效/文字/小地图全部消失 = 吞字）
  const _objStart = 'for(let b of o.objs){if(b.kind==="rift"&&b.st!=="done"&&T(b.x,b.y,200)){';
  if (!base.includes(_objStart)) fail("对象循环守卫注入点缺失");
  base = base.replace(_objStart, 'for(let b of o.objs){try{if(b.kind==="rift"&&b.st!=="done"&&T(b.x,b.y,200)){');
  const _objEnd = 'b.kind==="stele"&&uv(f,b)}let w=()=>{';
  if (!base.includes(_objEnd)) fail("对象循环结束锚点缺失");
  base = base.replace(_objEnd, 'b.kind==="stele"&&uv(f,b)}catch(__obErr){try{window.__riftErrors&&window.__riftErrors.push("obj "+(b&&b.kind)+": "+((__obErr&&__obErr.stack)||__obErr))}catch(x){}}}let w=()=>{');
  const _lootStart = 'for(let C of o.loots){if(!T(C.x,C.y,30)||C.hid&&!b)continue;';
  if (!base.includes(_lootStart)) fail("掉落循环守卫注入点缺失");
  base = base.replace(_lootStart, 'for(let C of o.loots){try{if(!T(C.x,C.y,30)||C.hid&&!b)continue;');
  const _lootEnd = 'f.drawImage(E,Math.round(C.x-E.width/2),Math.round(C.y-C.z-E.height)),f.globalAlpha=1}};';
  if (!base.includes(_lootEnd)) fail("掉落循环结束锚点缺失");
  base = base.replace(_lootEnd, 'f.drawImage(E,Math.round(C.x-E.width/2),Math.round(C.y-C.z-E.height)),f.globalAlpha=1}catch(__ltErr){try{window.__riftErrors&&window.__riftErrors.push("loot "+((C&&C.kind)||"?")+": "+((__ltErr&&__ltErr.stack)||__ltErr))}catch(x){}}}};');
  const _entStart = 'for(let b of $)y&&b.kind==="fire"||(b===o.pl?O3():b.kind==="pet"?r1(f,b,y):b.comp?t2(f,b,y):o.minions.includes(b)?q3(b):o.bells.includes(b)?G3(b):b.kind==="shrine"?W3(b):b.kind==="box"?U3(b):b.kind==="fire"?kv(b):b.spr&&b.rot!=null?H3(b):F3(b));';
  if (!base.includes(_entStart)) fail("实体循环守卫注入点缺失");
  base = base.replace(_entStart, 'for(let b of $){try{y&&b.kind==="fire"||(b===o.pl?O3():b.kind==="pet"?r1(f,b,y):b.comp?t2(f,b,y):o.minions.includes(b)?q3(b):o.bells.includes(b)?G3(b):b.kind==="shrine"?W3(b):b.kind==="box"?U3(b):b.kind==="fire"?kv(b):b.spr&&b.rot!=null?H3(b):F3(b))}catch(__entErr){try{window.__riftErrors&&window.__riftErrors.push("ent "+(b&&b.kind)+": "+((__entErr&&__entErr.stack)||__entErr))}catch(x){}}}');
  const _capA = (base.match(/h\.level\s*>=\s*60/g) || []).length, _capB = (base.match(/h\.level\s*<\s*60/g) || []).length;
  if (_capA < 1 || _capB < 1) fail("等级上限补丁匹配异常 " + _capA + "/" + _capB);
  base = base.replace(/h\.level\s*>=\s*60/g, "h.level>=100").replace(/h\.level\s*<\s*60/g, "h.level<100");
  // 技能宝石等级上限解除（原版 20 级）
  const _gemCap = (base.match(/lvl\s*<\s*20\b/g) || []).length;
  if (_gemCap < 1) fail("技能宝石等级上限补丁匹配异常");
  base = base.replace(/lvl\s*<\s*20\b/g, "lvl<30")
    .replace(/lvl\s*>=\s*20\b/g, "lvl>=30");
  // 玩家抗性上限 85%（原版 75%）
  base = base.replace("Math.min(75,(o.S.res[t]||0)-(n.playerRes||0))/100", "Math.min(85,(o.S.res[t]||0)-(n.playerRes||0))/100");
  base = base.replace("l>=75?\"var(--up)\":l<0?\"var(--down)\":\"inherit\">${Math.min(75,l)}%${l>75?\" (\"+l+\")\":\"\"}", "l>=85?\"var(--up)\":l<0?\"var(--down)\":\"inherit\">${Math.min(85,l)}%${l>85?\" (\"+l+\")\":\"\"}");
  base = base.replace(/Math\.min\(75,l\)/g, "Math.min(85,l)").replace(/l>=75\?/g, "l>=85?").replace(/l>75\?/g, "l>85?");
  // MIN75UI
  // RES_CAP_85

  const block = read(BLOCK).replace(/\r\n/g, "\n");
  const css = read(CSS);
  const expose = read(EXPOSE);
  const modsSkills = fs.existsSync(MODS_SKILLS) ? fs.readFileSync(MODS_SKILLS, "utf8") : "";
  const modsSupports = fs.existsSync(MODS_SUPPORTS) ? fs.readFileSync(MODS_SUPPORTS, "utf8") : "";
  const modsCurrencies = fs.existsSync(MODS_CURRENCIES) ? fs.readFileSync(MODS_CURRENCIES, "utf8") : "";
  const modsStar = fs.existsSync(MODS_STAR) ? fs.readFileSync(MODS_STAR, "utf8") : "";
  const modsWords = fs.existsSync(MODS_WORDS) ? fs.readFileSync(MODS_WORDS, "utf8") : "";
  const modsJewels = fs.existsSync(MODS_JEWELS) ? fs.readFileSync(MODS_JEWELS, "utf8") : "";
  const modsInline = modsSkills + "\r\n" + modsSupports + "\r\n" + modsCurrencies + "\r\n" + modsStar + "\r\n" + modsWords + "\r\n" + modsJewels;
  const modsTag = '<script src="mods/skills.js"></script>\r\n<script src="mods/supports.js"></script>\r\n<script src="mods/currencies.js"></script>\r\n<script src="mods/star_effects.js"></script>\r\n<script src="mods/runewords.js"></script>\r\n<script src="mods/jewels.js"></script>';
  const version = JSON.parse(read(VERSION_FILE)).version;

  // 热修数据（开发版外挂 / 发布版内嵌共用），等价 bake-hotfix.ps1 的 js 拼装
  const hotfixJsonRaw0 = read(HOTFIX_JSON);
  JSON.parse(hotfixJsonRaw0); // 合法性校验
  // 版本号以 version.json 为准（hotfix.json 可能被游戏页占用来不及改，构建时在内存里同步）
  const hotfixJsonRaw = hotfixJsonRaw0.replace(/"version"\s*:\s*"[^"]*"/, '"version": "' + version + '"');
  const hotfixData = "window.HOTFIX = " + hotfixJsonRaw + ";" + "\r\n" + read(HOTFIX_ADV);

  // 1) 开发版（放在迁移工具/_dev，根目录只留发布版）
  const dev = buildHtml({ baseHtml: base, block, css, expose: null, hotfixTag: true, modsTag });
  fs.mkdirSync(path.dirname(DEV_OUT), { recursive: true });
  const devWritten = tryWrite(DEV_OUT, dev, "开发版");
  if (!devWritten) {
    fs.mkdirSync(path.dirname(DEV_PENDING), { recursive: true });
    fs.writeFileSync(DEV_PENDING, dev, "utf8");
    console.warn("[build] 已改写到: " + DEV_PENDING + "（关闭占用开发版的游戏页后可手动替换）");
  }
  tryWrite(HOTFIX_DATA, hotfixData, "热修数据");

  // 2) 发布版：开发版内容 + 热修内嵌（等价 bake-hotfix.ps1）
  if (dev.indexOf('<script src="hotfix-data.js"></script>') < 0) fail("开发版找不到 hotfix-data.js 标签");
  const baked = dev.replace(
    '<script src="hotfix-data.js"></script>',
    "<!-- HOTFIX-BEGIN -->\r\n<script>\r\n" + hotfixData + "\r\n</script>\r\n<!-- HOTFIX-END -->",
  ).replace(modsTag, "<script>\r\n" + modsInline + "\r\n</script>");
  const relOut = path.join(ROOT, "余烬裂隙-异界内容扩展-v" + version + ".html");
  tryWrite(relOut, baked, "发布版 (v" + version + ")");

  // 3) 回归测试版：无热修 + expose 钩子（保持与历史 test-build 相同形态）
  const test = buildHtml({ baseHtml: base, block, css, expose, hotfixTag: false, hotfixInline: null, modsInline });
  tryWrite(TEST_OUT, test, "测试版");
}

main();
