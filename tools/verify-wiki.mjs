/**
 * verify-wiki.mjs —— 构建产物的运行时验收（jsdom 真渲染）
 *
 * 不只查字符串，而是把 Wiki 真的跑起来：执行官方 app 脚本 → 触发路由 →
 * 检查扩展数据是否真的并进官方页签、新页面是否真的能渲染、有没有运行时报错。
 *
 * 用法：node tools/verify-wiki.mjs [html 路径]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { JSDOM, VirtualConsole } from "./node_modules/jsdom/lib/api.js";

const W = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
/**
 * 默认验收对象 = 最近一次 wiki:build 的产物。
 * 直接读 reports/wiki-build-report.json 的 out 字段，避免每次升版都要改这里；
 * 两者都没有时退回到 build/ 下最新的 wiki-异界版-*.html。
 */
function defaultArtifact() {
  const rep = path.join(W, "reports", "wiki-build-report.json");
  if (fs.existsSync(rep)) {
    try {
      const out = JSON.parse(fs.readFileSync(rep, "utf8")).out;
      if (out && fs.existsSync(path.join(W, out))) return path.join(W, out);
    } catch { /* 报告损坏则走兜底 */ }
  }
  const dir = path.join(W, "build");
  const cands = fs.existsSync(dir)
    ? fs.readdirSync(dir).filter((f) => /^wiki-异界版-.*\.html$/.test(f))
        .map((f) => ({ f, t: fs.statSync(path.join(dir, f)).mtimeMs }))
        .sort((a, b) => b.t - a.t)
    : [];
  if (!cands.length) return path.join(dir, "wiki-异界版.html");
  return path.join(dir, cands[0].f);
}

const file = process.argv[2] ? path.resolve(process.argv[2]) : defaultArtifact();

if (!fs.existsSync(file)) {
  console.error("找不到产物：" + file);
  process.exit(1);
}

const html = fs.readFileSync(file, "utf8");
const fails = [];
const ok = (name, cond, extra) => {
  if (cond) console.log("  PASS " + name);
  else { console.log("  FAIL " + name + (extra ? " :: " + extra : "")); fails.push(name); }
};

const errs = [];
const vc = new VirtualConsole();
vc.on("jsdomError", (e) => errs.push(String(e && e.message)));
vc.on("error", (...a) => errs.push(a.join(" ")));

const dom = new JSDOM(html, {
  runScripts: "dangerously",
  pretendToBeVisual: true,
  url: "https://ember-rift.pages.dev/wiki/",
  virtualConsole: vc,
  beforeParse(win) {
    // 官方 wiki 用 canvas 画天赋树，jsdom 没有 canvas 实现 → 给个最小桩
    const ctxStub = () => new Proxy({}, {
      get: (t, p) => {
        if (p === 'canvas') return {};
        if (p === 'measureText') return () => ({ width: 10 });
        if (p === 'getImageData') return (x, y, w, h) => ({ data: new Uint8ClampedArray(Math.max(4, (w | 0) * (h | 0) * 4)), width: w | 0, height: h | 0 });
        if (p === 'createLinearGradient' || p === 'createRadialGradient') return () => ({ addColorStop() {} });
        return () => {};
      },
      set: () => true,
    });
    win.HTMLCanvasElement.prototype.getContext = function () { return ctxStub(); };
    win.HTMLCanvasElement.prototype.toDataURL = () => "data:image/png;base64,";
    win.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 0);
    // jsdom 未实现的浏览器 API：占位，避免把「环境缺失」误判成产品缺陷
    win.scrollTo = () => {};
    win.Element.prototype.scrollIntoView = function () {};
    win.addEventListener("error", (e) => errs.push("window.onerror: " + (e.error && e.error.stack || e.message)));
  },
});

const win = dom.window;

try {
  const E = win.__EMBER_EXP;
  const R = win.RIFT;

  console.log("\n[1] 数据注入");
  ok("注入 __EMBER_EXP", !!E);
  ok("插件执行标记", win.__EMBER_WIKI_READY === true);
  ok("官方数据可用 (RIFT)", !!R && !!R.SK);

  console.log("\n[2] 扩展数据并入官方页签");
  ok("技能页签能取到「闪现」", !!(R && R.SK && R.SK.mods_blink), R && R.SK ? Object.keys(R.SK).length + " 条" : "n/a");
  ok("辅助页签能取到「阿图鲁伊的放血术」", !!(R && R.SUP && R.SUP.mods_atu_bloodletting));
  ok("通货页签能取到「符文师的工匠石」", !!(R && R.CUR && R.CUR.mods_runesmith_artificer) && R.CUR_ORDER.includes("mods_runesmith_artificer"));
  const extraIds = (E ? E.uniques : []).map((u) => u.id);
  ok("传奇页签能取到 5 件扩展暗金", !!(R && extraIds.length === 5 && extraIds.every((id) => R.UNIQ.some((u) => u.id === id))), extraIds.join(","));
  ok("扩展暗金来源标记为 extra", !!(R && R.UNIQ.filter((u) => extraIds.includes(u.id)).every((u) => u.src === "extra")));

  console.log("\n[3] 路由与页面");
  const pages = win.eval("Object.keys(PAGES).join(',')");
  ok("注册了 #exp 页面", pages.includes("exp"), pages);
  const navKeys = win.eval("NAV.map(x=>x[0]).join(',')");
  ok("左侧导航含 exp", navKeys.includes("exp"), navKeys);
  ok("侧栏 DOM 里插入了「异界扩展」入口", !!win.document.querySelector('#nav a[data-p="exp"]'));

  win.location.hash = "#exp";
  win.dispatchEvent(new win.Event("hashchange"));
  const main = win.document.getElementById("main").innerHTML;
  ok("#exp 渲染出内容", main.length > 2000, "长度 " + main.length);
  for (const [label, needle] of [
    ["内容清单", "内容清单"],
    ["数值与机制改动", "数值与机制改动"],
    ["新增暗金", "新增暗金"],
    ["符文之语", "符文之语"],
    ["天赋树珠宝", "星图联动效果"],
    ["新技能闪现", "闪现"],
    ["新通货工匠石", "符文师的工匠石"],
    ["加固说明", "防崩加固"],
    ["免责声明", "免责声明"],
  ]) {
    ok("页面包含：" + label, main.includes(needle));
  }
  ok("文档标题随路由更新", win.document.title.includes("异界扩展"), win.document.title);
  ok("页面无 undefined / NaN / [object Object] 残留", !/undefined|NaN|\[object Object\]/.test(main));

  console.log("\n[4] 官方页签回归（扩展不应破坏原页面）");
  for (const [hash, needle, label] of [
    ["#db-skill", "火球术", "技能"],
    ["#db-cur", "混沌石", "通货"],
    ["#db-uniq", "贪婪者之冠", "传奇"],
    ["#db-jewel", "天赋珠宝", "天赋珠宝"],
    ["#home", "余烬裂隙", "首页"],
  ]) {
    win.location.hash = hash;
    win.dispatchEvent(new win.Event("hashchange"));
    const h = win.document.getElementById("main").innerHTML;
    ok(`${label}页仍正常`, h.includes(needle), "长度 " + h.length);
  }
  // 扩展条目也要出现在官方页签里
  win.location.hash = "#db-skill";
  win.dispatchEvent(new win.Event("hashchange"));
  ok("技能页签含「闪现」卡片", win.document.getElementById("main").innerHTML.includes("mods_blink"));
  win.location.hash = "#db-uniq";
  win.dispatchEvent(new win.Event("hashchange"));
  ok("传奇页签含扩展暗金", win.document.getElementById("main").innerHTML.includes("exp-uniq") || win.document.getElementById("main").innerHTML.includes("猎首"));

  console.log("\n[5] 搜索");
  const idx = win.eval("buildIndex().filter(x=>x.page==='exp').length");
  ok("搜索索引含扩展条目", idx > 10, idx + " 条");

  console.log("\n[6] 运行时错误");
  ok("无未捕获异常", errs.length === 0, errs.slice(0, 3).join(" | "));
} catch (e) {
  fails.push("脚本异常：" + e.message);
  console.error("  FAIL 脚本异常：", e.stack);
} finally {
  dom.window.close();
}

console.log("");
console.log(fails.length ? `RESULT: FAIL (${fails.length}) ${fails.join(", ")}` : "RESULT: ALL PASS");
process.exit(fails.length ? 1 : 0);
