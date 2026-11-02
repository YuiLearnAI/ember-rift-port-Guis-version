// EMB-122 门禁：腐化词缀扩池
// 不加载 jsdom（那要跑完整个游戏初始化），只把扩展块从源码里截出来，
// 在 vm 沙箱里注入官版同名符号后执行，断言池表 / 权重 / 文案 / 修补逻辑。
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const W = path.resolve(__dirname, "..");
const BASE = path.join(W, "base", "v19-online.html");
const BLOCK = path.join(W, "build", "block_v19.js");

const fails = [];
let pass = 0;
function ok(cond, label, detail) {
  if (cond) { pass++; console.log("  ✅ " + label); }
  else { fails.push(label + (detail ? " — " + detail : "")); console.log("  ❌ " + label + (detail ? " — " + detail : "")); }
}
function eq(a, b, label) { ok(a === b, label, "期望 " + JSON.stringify(b) + "，实际 " + JSON.stringify(a)); }

/* ---------- 从官方基底提取真实文案表的 key 集合 ---------- */
const html = fs.readFileSync(BASE, "utf8");
const jsStart = html.indexOf("JS={");
const jsEnd = html.indexOf("},_a=(e,t)=>", jsStart);
if (jsStart < 0 || jsEnd < 0) throw new Error("在基底里找不到 JS 文案表");
const jsSeg = html.slice(jsStart + 3, jsEnd + 1);
const officialKeys = [...jsSeg.matchAll(/(?:^|[,{])\s*"?([A-Za-z_$][\w$]*)"?\s*:/g)].map((m) => m[1]);

/* ---------- 截取两个扩展块 ---------- */
const block = fs.readFileSync(BLOCK, "utf8");

const MARK_POOL = "/* ===== EMB-122 · 腐化词缀扩池 =====";
const iPool = block.indexOf(MARK_POOL);
if (iPool < 0) throw new Error("找不到扩池段（" + MARK_POOL + "）");
const srcPool = block.slice(iPool);

const MARK_VAAL = "/* 瓦尔腐化随机化";
const iVaal = block.indexOf(MARK_VAAL);
if (iVaal < 0) throw new Error("找不到瓦尔腐化段");
const vaalEnd = block.indexOf("})();", iVaal);
const srcVaal = block.slice(iVaal, vaalEnd + 5);

/* ---------- 官版符号的最小复刻 ---------- */
function makeSandbox(overrides) {
  const JS = {};
  for (const k of officialKeys) JS[k] = "「" + k + "」 {v}";
  const events = [];
  const Xu = [
    ["skillLvl", [1, 1]], ["lifeInc", [8, 12]], ["critInc", [20, 30]], ["leech", [1, 2]],
    ["resAll", [8, 12]], ["moveInc", [5, 8]], ["atkSpd", [6, 10]], ["castSpd", [6, 10]],
    ["spirit", [10, 20]], ["rarity", [10, 15]],
  ];
  const ctx = {
    window: {},
    JS,
    Xu,
    pe: { "水晶法器": { slot: "X", wt: null }, "短弓": { slot: "W", wt: "bow" }, "皮革兜帽": { slot: "H", wt: null } },
    cp: (e) => (e && e.kind === "jewel" ? Xu.filter((t) => t[0] !== "skillLvl") : Xu),
    oe: (a) => a[Math.floor(Math.random() * a.length)],
    de: (a, b) => Math.floor(a + Math.random() * (b - a + 1)),
    I: () => Math.random(),
    A: (ev, fn) => { events.push({ ev, fn }); return () => {}; },
    u: { equip: {}, cur: { ash: 0, ember: 0 } },
    rs: 0,
    Fa: (i) => i,
    ay: () => [],
    _a: (k, v) => (ctx.JS[k] || k + " {v}").replace("{v}", v),
    l9: null,
    Dv: null,
  };
  Object.assign(ctx, overrides || {});
  ctx.__events = events;
  return ctx;
}

/* ---------- 1. 池表自检（EMB-128 分库） ---------- */
console.log("\n[1] 分库表 / 权重 / 文案");
const sb = makeSandbox();
vm.runInNewContext(srcPool, sb);
const P = sb.window.__CORRUPT_POOL;
ok(!!P, "扩展块挂上了 __CORRUPT_POOL");
if (!P) { report(); }

const aud = P.audit();
ok(aud.slotCount === 21, "分库共 21 个库（11 槽位 + 武器 9 类 + 珠宝）", "实际 " + aud.slotCount);
// 分库后同一 statKey 会跨库出现（如 armour 同时进头盔/胸甲/手套/鞋子），跨库重复是正常的；
// 但每个库内部 key 必须唯一。
let dupInSlot = [];
for (const sk in P.slots) {
  const seen = {};
  for (const p of P.slots[sk]) {
    if (seen[p.k]) dupInSlot.push(sk + ":" + p.k);
    seen[p.k] = 1;
  }
}
eq(dupInSlot.length, 0, "每个库内无重复 key", dupInSlot.join(","));
eq(aud.missingText.length, 0, "每条词缀都能渲染出中文", aud.missingText.join(","));
ok(!!sb.JS.skillLvl, "官版缺失的 skillLvl 文案已补上", sb.JS.skillLvl);
ok(!officialKeys.includes("skillLvl"), "顺带确认：官版文案表原本确实没有 skillLvl（这就是裸 key 的来源）");

// 权重展开：Xu 长度应等于权重之和
eq(aud.xuLen, P.weight, "Xu 展开长度 == 权重总和");
const weightSum = P.pool.reduce((s, p) => s + p.w, 0);
eq(P.weight, weightSum, "权重总和与各条权重之和一致");

// 分库结构：每个库都有词缀，且词缀 key 都合法
const slotKeys = Object.keys(P.slots);
ok(slotKeys.length === 21, "SLOT_POOLS 恰好 21 个库", JSON.stringify(slotKeys));
let allSlotsValid = true;
for (const sk of slotKeys) {
  if (!Array.isArray(P.slots[sk]) || !P.slots[sk].length) { allSlotsValid = false; break; }
}
ok(allSlotsValid, "每个库都非空");

// 武器库按 wt 细分
for (const wt of ["bow", "spear", "qstaff", "katana", "staff", "wand", "crossbow", "mace", "jian"]) {
  ok(!!P.slots["W:" + wt], "武器库已按 wt 细分：" + wt);
}

// 珠宝库：独立，且不出 skillLvl
const jewelKeys = aud.jewelKeys;
ok(jewelKeys.length > 0, "珠宝有独立库");
ok(!jewelKeys.includes("skillLvl"), "珠宝抽不到 skillLvl（沿用官版 cp 规则）");

// 旧的自定义词缀已彻底删除
const removed = ["corruptCruel", "corruptGluttony", "corruptEmberBlood", "corruptBone", "corruptResonance", "corruptScorch"];
eq(removed.filter((k) => P.pool.some((p) => p.k === k)).length, 0, "6 条旧自定义词缀已从池中删除");

/* ---------- 2. 分库抽取真的生效 ---------- */
console.log("\n[2] 分库抽取（每库走官版真实路径 cp + oe，各抽 20000 次）");
const N2 = 20000;
for (const sk of slotKeys) {
  const list = P.slots[sk];
  const totalW = list.reduce((s, p) => s + p.w, 0);
  const hit = {};
  for (let n = 0; n < N2; n++) {
    const r = P.rollOnce(sk);
    hit[r.k] = (hit[r.k] || 0) + 1;
  }
  // 库内每条都能抽到
  const allHit = list.every((p) => hit[p.k] > 0);
  ok(allHit, "库 " + sk + " 内每条词缀都能抽到，没有死角");
  // 权重偏差
  let worst = null;
  for (const p of list) {
    const exp = N2 * p.w / totalW;
    const got = hit[p.k] || 0;
    const dev = Math.abs(got - exp) / exp;
    if (!worst || dev > worst.dev) worst = { k: p.k, dev, exp, got };
  }
  ok(worst.dev < 0.3, "库 " + sk + " 实测频率与权重偏差 < 30%", "最大偏差 " + worst.k + " " + (worst.dev * 100).toFixed(1) + "%");
}

/* ---------- 3. 事件监听（EMB-128 精简后只剩 stats:pre） ---------- */
console.log("\n[3] 事件监听");
const evNames = sb.__events.map((e) => e.ev);
ok(evNames.includes("stats:pre"), "已注册 stats:pre");
ok(!evNames.includes("stats:post"), "stats:post（带代价）已移除");
ok(!evNames.includes("kill"), "kill（烬骨）已移除");
ok(!evNames.includes("hit:mods"), "hit:mods（共鸣）已移除");
ok(!evNames.includes("hit:ailment"), "hit:ailment（烬灼）已移除");
// 腐化扩池 IIFE 现在只注册 1 个 stats:pre；法师遗产 IIFE（EMB-127）额外注册 1 个 stats:pre
eq(sb.__events.length, 2, "腐化 1 + 法师遗产 1 = 2 个监听", "实际 " + sb.__events.length);

/* ---------- 6. 祭坛不再覆盖已有第二条 ---------- */
console.log("\n[6] 祭坛双瓦：已有第二条不被顶掉");
const sb2 = makeSandbox({
  Dv: function (item) {
    // 模拟官版：cimpl 存在时无条件写 cimpl2
    if (item.cimpl) item.cimpl2 = { k: "rarity", v: 12 };
    else item.cimpl = { k: "rarity", v: 12 };
    return { cls: "up", sub: "新增腐化: x", it: item };
  },
});
vm.runInNewContext(srcPool, sb2);
const item2 = { kind: "item", cimpl: { k: "lifeInc", v: 10 }, cimpl2: { k: "critMulti", v: 20 } };
const r2 = sb2.Dv(item2);
eq(r2.cls, "up", "祭坛判定结果仍是升华");
eq(item2.cimpl2.k, "critMulti", "第二条的 key 没有被 rarity 顶掉");
ok(item2.cimpl2.v >= 15 && item2.cimpl2.v <= 25, "第二条改为在原区间内重铸数值", "v=" + item2.cimpl2.v);
ok(/重铸双重腐化/.test(r2.sub), "面板文案同步改成「重铸双重腐化」", r2.sub);

const item3 = { kind: "item" };
sb2.Dv(item3);
eq(item3.cimpl && item3.cimpl.k, "rarity", "没有第二条时仍按官版逻辑写入 cimpl");

/* ---------- 7. 瓦尔双瓦不再锁死祭坛 ---------- */
console.log("\n[7] 瓦尔双瓦不再写 dc（解除祭坛锁死）");
function runVaalHook() {
  const ctx = makeSandbox({
    l9: function (it) { it.corrupted = true; it.cimpl = { k: "lifeInc", v: 10 }; return "impl"; },
  });
  vm.runInNewContext(srcVaal, ctx);
  return ctx;
}
const vsb = runVaalHook();
ok(typeof vsb.l9 === "function", "瓦尔函数已被包装");
let gotDc = 0, gotDc2 = 0, gotC2 = 0;
for (let n = 0; n < 3000; n++) {
  const it = { kind: "item", uid: "u" + n };
  vsb.l9(it);
  if (it.dc) gotDc++;
  if (it.dc2) gotDc2++;
  if (it.cimpl2) gotC2++;
}
eq(gotDc, 0, "3000 次腐化里没有一次写入 dc（祭坛锁死已解除）");
ok(gotDc2 > 600 && gotDc2 < 1100, "dc2 标记按约 28% 命中", gotDc2 + "/3000");
ok(gotC2 > 600 && gotC2 < 1100, "第二条实际产出与标记数一致", gotC2 + "/3000");

// 珠宝也应能出第二条，且拿不到 skillLvl
const jctx = runVaalHook();
let jewelC2 = 0, jewelSkill = 0;
for (let n = 0; n < 4000; n++) {
  const it = { kind: "jewel", uid: "j" + n };
  jctx.l9(it);
  if (it.cimpl2) { jewelC2++; if (it.cimpl2.k === "skillLvl") jewelSkill++; }
}
ok(jewelC2 > 800, "珠宝也能双瓦", jewelC2 + "/4000");
eq(jewelSkill, 0, "珠宝的第二条不会抽到 skillLvl");

/* ---------- 8. 传奇专属腐化词缀（EMB-125） ---------- */
console.log("\n[8] 传奇专属腐化词缀（献祭之心样板）");
const uniqKeys = ["rpgRathCastSpd", "rpgRathAilLife", "rpgRathCritMana", "rpgRathDmgMana"];
ok(!!P.unique && !!P.unique.rathpith_globe, "专属池已挂载（rathpith_globe）");
eq(aud.uniqueCount, 1, "当前只有 1 件传奇有专属池");
const rp = P.unique && P.unique.rathpith_globe;
if (rp) {
  eq(rp.pool.length, 4, "献祭之心专属池 4 条词缀");
  eq(rp.pool.filter((p) => uniqKeys.includes(p.k)).length, 4, "4 条专属词缀 key 齐全");
  eq(aud.missingText.filter((k) => uniqKeys.includes(k)).length, 0, "4 条专属词缀都有中文文案");
}

// 专属池抽取：献祭之心应能抽到专属词缀，且专属词缀占主导（走真实法器 X 库兜底）
const uhits = {};
const NU = 30000;
for (let n = 0; n < NU; n++) {
  const r = P.rollUnique("rathpith_globe", false, "水晶法器");
  uhits[r.k] = (uhits[r.k] || 0) + 1;
}
const uAll = uniqKeys.filter((k) => uhits[k]);
eq(uAll.length, 4, "献祭之心能抽出全部 4 条专属词缀", "命中 " + uAll.join(","));
const uShare = uniqKeys.reduce((s, k) => s + (uhits[k] || 0), 0) / NU;
ok(uShare > 0.55 && uShare < 0.8, "专属词缀占主导（分库后法器 X 库仅 4 条兜底，专属约 70%）", (uShare * 100).toFixed(1) + "%");
ok(uhits.spellInc > 0, "法器 X 库词缀（法术伤害）仍可作兜底抽出", "spellInc 抽到 " + uhits.spellInc + " 次");

// 非传奇装备零泄漏（走普通槽位库，如头盔 H）
const nhits = {};
for (let n = 0; n < 8000; n++) {
  const r = P.rollOnce("H");
  nhits[r.k] = (nhits[r.k] || 0) + 1;
}
eq(uniqKeys.filter((k) => nhits[k]).length, 0, "普通装备抽不到专属词缀（零泄漏）");

// 珠宝也不能抽到专属词缀（传奇珠宝另说，本作珠宝无 uniq 专属池）
const jhits = {};
for (let n = 0; n < 8000; n++) {
  const r = P.rollOnce("jewel");
  jhits[r.k] = (jhits[r.k] || 0) + 1;
}
eq(uniqKeys.filter((k) => jhits[k]).length, 0, "珠宝抽不到专属词缀");

// 跨属性折算（stats:pre）
const preFn = sb.__events.find((e) => e.ev === "stats:pre").fn;
const uadded = {};
preFn({
  a: { life: 500, lifeInc: 50, mana: 200, rpgRathCastSpd: 6, rpgRathAilLife: 3, rpgRathCritMana: 3, rpgRathDmgMana: 6 },
  add: (k, v) => { uadded[k] = v; },
  level: 60,
});
eq(uadded.castSpd, 6, "第 1 条：施法速度直接落地", "castSpd=" + uadded.castSpd);
eq(uadded.ailEff, 96, "第 2 条：每 50 生命 → 异常强度（1635/50=32 → ×3=96）", "ailEff=" + uadded.ailEff);
eq(uadded.critInc, 33, "第 3 条：每 50 魔力 → 法术暴击（560/50=11 → ×3=33）", "critInc=" + uadded.critInc);
eq(uadded.spellInc, 66, "第 4 条：每 50 魔力 → 法术伤害（560/50=11 → ×6=66）", "spellInc=" + uadded.spellInc);

// 没有专属词缀时不误伤
const uadded2 = {};
preFn({ a: { life: 500, lifeInc: 50, mana: 200 }, add: (k, v) => { uadded2[k] = v; }, level: 60 });
eq(Object.keys(uadded2).length, 0, "没有专属词缀时，stats:pre 不额外加任何属性");

/* ---------- 9. 传奇腐化「替换原生词缀」（EMB-126 修复） ---------- */
console.log("\n[9] 传奇腐化替换原生词缀（单瓦/双瓦都替换，st 与 mods 都纳入）");
ok(typeof P.replaceUnique === "function", "replaceUnique 已导出", typeof P.replaceUnique);

// 9.1 替换 st：移除一条固定词缀
const itSt = { st: ["词缀A", "词缀B", "词缀C"], mods: [] };
const rSt = P.replaceUnique(itSt);
ok(!!rSt && rSt.src === "st", "替换命中 st 通道", rSt && JSON.stringify(rSt));
eq(itSt.st.length, 2, "st 从 3 条减到 2 条");

// 9.2 替换 mods：移除一条随机词缀
const itMods = { st: [], mods: [{ id: "es", v: [80] }, { id: "life", v: [70] }] };
const rMods = P.replaceUnique(itMods);
ok(!!rMods && rMods.src === "mods", "替换命中 mods 通道", rMods && JSON.stringify(rMods));
eq(itMods.mods.length, 1, "mods 从 2 条减到 1 条");

// 9.3 无可替换词缀时返回 null，不抛错
const itEmpty = { st: [], mods: [] };
const rEmpty = P.replaceUnique(itEmpty);
eq(rEmpty, null, "无可替换词缀时返回 null");

// 9.4 双瓦 Dv up 分支：命中传奇时移除一条原生词缀
const sbDvR = makeSandbox({
  Dv: function (item) {
    // 模拟官版双瓦 up 分支：写 cimpl2
    if (item.cimpl) item.cimpl2 = { k: "rpgRathCastSpd", v: 6 };
    else item.cimpl = { k: "rpgRathCastSpd", v: 6 };
    return { cls: "up", sub: "新增腐化: x", it: item };
  },
});
vm.runInNewContext(srcPool, sbDvR);
const itemDvR = { kind: "item", uniq: "rathpith_globe", cimpl: { k: "lifeInc", v: 10 }, st: ["固定词缀1", "固定词缀2"], mods: [{ id: "es", v: [80] }] };
const rDvR = sbDvR.Dv(itemDvR);
eq(rDvR.cls, "up", "双瓦判定仍是升华");
eq(itemDvR.st.length + itemDvR.mods.length, 2, "双瓦替换后原生词缀总数 3 → 2（替换了一条）", "st=" + itemDvR.st.length + " mods=" + itemDvR.mods.length);
ok(/替换原生词缀/.test(rDvR.sub), "双瓦面板文案标注「替换原生词缀」", rDvR.sub);

// 9.5 非传奇装备不触发替换（零泄漏）
const sbDvPlain = makeSandbox({
  Dv: function (item) {
    if (item.cimpl) item.cimpl2 = { k: "rarity", v: 12 };
    else item.cimpl = { k: "rarity", v: 12 };
    return { cls: "up", sub: "新增腐化: x", it: item };
  },
});
vm.runInNewContext(srcPool, sbDvPlain);
const itemPlain = { kind: "item", mods: [{ id: "es", v: [80] }, { id: "life", v: [70] }] };
sbDvPlain.Dv(itemPlain);
eq(itemPlain.mods.length, 2, "普通装备双瓦不替换原生词缀（零泄漏）");

/* ---------- 10. 法师遗产（EMB-127 法师之血继承词缀） ---------- */
console.log("\n[10] 法师之血 · 法师遗产继承（固定 4 条 + 重复加成作用于全部）");
const ML = sb.window.__MAGES_LEGACY;
ok(!!ML, "法师遗产机制已挂上 __MAGES_LEGACY");

const mlAud = ML.audit();
eq(mlAud.totalCount, 14, "14 种法师遗产齐全");
eq(mlAud.activeCount, 10, "10 种可落地结算（跳过闪避/混沌抗/技能速度）");
eq(mlAud.missingText.length, 0, "所有 active 遗产的 statKey 都有中文文案", mlAud.missingText.join(","));
eq(mlAud.noDesc.length, 0, "所有遗产都有效果描述", mlAud.noDesc.join(","));

// 10.1 roll 4 条继承：缓存在 item.ml，且不重复 roll
const mlItem = { uniq: "mageblood" };
ML.rollLegacy(mlItem);
ok(Array.isArray(mlItem.ml) && mlItem.ml.length === 4, "法师之血 roll 出 4 条继承", JSON.stringify(mlItem.ml));
ok(typeof mlItem.mlMult === "number" && mlItem.mlMult >= 25 && mlItem.mlMult <= 50, "重复加成乘数落在 25–50", mlItem.mlMult);
const mlItemSnapshot = mlItem.ml.slice();
ML.rollLegacy(mlItem);
eq(JSON.stringify(mlItem.ml), JSON.stringify(mlItemSnapshot), "已 roll 过则不重复 roll（继承稳定）");

// 10.2 4 条继承都是合法的遗产 id
let mlAllValid = true;
for (const id of mlItem.ml) if (!ML.byId[id]) { mlAllValid = false; break; }
ok(mlAllValid, "4 条继承都是合法遗产 id");

// 10.3 结算：stats:pre 里按继承叠加效果（用独立的 stats:pre 监听）
const mlPre = sb.__events.filter((e) => e.ev === "stats:pre");
ok(mlPre.length === 2, "存在两个 stats:pre（腐化 + 法师遗产）", "实际 " + mlPre.length);
// 法师遗产的 stats:pre 是最后一个注册的
const mlPreFn = mlPre[mlPre.length - 1].fn;
// 穿戴法师之血，且 roll 了已知继承
const beltItem = { uniq: "mageblood", ml: ["diamond", "gold", "ruby", "diamond"], mlMult: 30 };
const sbML = makeSandbox({ u: { equip: { belt: beltItem }, cur: {} } });
vm.runInNewContext(srcPool, sbML);
const mlStatsPre = sbML.__events.filter((e) => e.ev === "stats:pre");
const mlAdded = {};
mlStatsPre[mlStatsPre.length - 1].fn({ add: (k, v) => { mlAdded[k] = (mlAdded[k] || 0) + v; } });
// diamond 出现 2 次（重复），触发重复加成：全部 active 遗产 ×(1+30/100)
// 继承：diamond(暴击75)、gold(稀有度45)、ruby(火抗60)、diamond(暴击75)
// 重复 → mult=1.3；每条按 Math.round(v*1.3)
eq(mlAdded.critInc, Math.round(75 * 1.3) + Math.round(75 * 1.3), "钻石遗产重复：两条暴击都按 1.3 加成", JSON.stringify(mlAdded.critInc));
eq(mlAdded.rarity, Math.round(45 * 1.3), "黄金遗产按 1.3 加成（重复加成作用于全部）", JSON.stringify(mlAdded.rarity));
eq(mlAdded.resF, Math.round(60 * 1.3), "红玉遗产按 1.3 加成", JSON.stringify(mlAdded.resF));

// 10.4 无重复时不加成（mult=1）
const beltNoDup = { uniq: "mageblood", ml: ["diamond", "gold", "ruby", "topaz"], mlMult: 30 };
const sbML2 = makeSandbox({ u: { equip: { belt: beltNoDup }, cur: {} } });
vm.runInNewContext(srcPool, sbML2);
const mlStatsPre2 = sbML2.__events.filter((e) => e.ev === "stats:pre");
const mlAdded2 = {};
mlStatsPre2[mlStatsPre2.length - 1].fn({ add: (k, v) => { mlAdded2[k] = (mlAdded2[k] || 0) + v; } });
eq(mlAdded2.critInc, 75, "无重复时钻石遗产不加成（原值 75）", JSON.stringify(mlAdded2.critInc));
eq(mlAdded2.resL, 60, "无重复时黄玉遗产不加成（原值 60）", JSON.stringify(mlAdded2.resL));

// 10.5 未穿戴法师之血 / 无 ml 时不结算（零泄漏）
const sbML3 = makeSandbox({ u: { equip: { belt: { uniq: "headhunter" } }, cur: {} } });
vm.runInNewContext(srcPool, sbML3);
const mlStatsPre3 = sbML3.__events.filter((e) => e.ev === "stats:pre");
const mlAdded3 = {};
mlStatsPre3[mlStatsPre3.length - 1].fn({ add: (k, v) => { mlAdded3[k] = (mlAdded3[k] || 0) + v; } });
eq(Object.keys(mlAdded3).length, 0, "未穿戴法师之血时不结算任何遗产（零泄漏）");

// 10.6 inactive 遗产（闪避/混沌抗/技能速度）不参与结算
eq(ML.byId.jade.active, false, "青玉遗产（闪避）标记 inactive");
eq(ML.byId.amethyst.active, false, "紫晶遗产（混沌抗）标记 inactive");
eq(ML.byId.silver.active, false, "白银遗产（技能速度）标记 inactive");
eq(ML.byId.stibnite.active, false, "黑锑遗产（闪避）标记 inactive");

/* ---------- 汇总 ---------- */
function report() {
  console.log("\n" + "=".repeat(52));
  if (fails.length) {
    console.log("❌ 腐化词缀 FAIL — " + fails.length + " 项未通过");
    fails.forEach((f) => console.log("   · " + f));
    process.exit(1);
  }
  console.log("✅ 腐化词缀 ALL PASS — " + pass + " 项断言全过");
}

report();
