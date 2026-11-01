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

/* ---------- 1. 池表自检 ---------- */
console.log("\n[1] 池表 / 权重 / 文案");
const sb = makeSandbox();
vm.runInNewContext(srcPool, sb);
const P = sb.window.__CORRUPT_POOL;
ok(!!P, "扩展块挂上了 __CORRUPT_POOL");
if (!P) { report(); }

const aud = P.audit();
eq(aud.count, 23, "池内共 23 条（10 官版 + 10 新增数值 + 3 机制）");
eq(aud.dupKey.length, 0, "池内无重复 key");
eq(aud.missingText.length, 0, "每条词缀都能渲染出中文", aud.missingText.join(","));
ok(!!sb.JS.skillLvl, "官版缺失的 skillLvl 文案已补上", sb.JS.skillLvl);
ok(!officialKeys.includes("skillLvl"), "顺带确认：官版文案表原本确实没有 skillLvl（这就是裸 key 的来源）");

// 权重展开：Xu 长度应等于权重之和，且原有 10 条 key 全部保留
eq(aud.xuLen, P.weight, "Xu 展开长度 == 权重总和");
const weightSum = P.pool.reduce((s, p) => s + p.w, 0);
eq(P.weight, weightSum, "权重总和与各条权重之和一致");

const legacy = ["skillLvl", "lifeInc", "critInc", "leech", "resAll", "moveInc", "atkSpd", "castSpd", "spirit", "rarity"];
const poolKeys = P.pool.map((p) => p.k);
eq(legacy.filter((k) => !poolKeys.includes(k)).length, 0, "官版 10 条全部保留，一条没丢");

// 珠宝池：只应缺 skillLvl
const jewelKeys = aud.jewelKeys;
eq(jewelKeys.length, 23 - 1, "珠宝池排除 skillLvl 后剩 22 条");
ok(!jewelKeys.includes("skillLvl"), "珠宝抽不到 skillLvl（沿用官版 cp 规则）");

/* ---------- 2. 权重真的生效 ---------- */
console.log("\n[2] 加权抽取（走官版真实路径 cp + oe，抽 60000 次）");
const N = 60000;
const hit = {};
for (let n = 0; n < N; n++) {
  const r = P.rollOnce(false);
  hit[r.k] = (hit[r.k] || 0) + 1;
}
eq(Object.keys(hit).length, 23, "23 条全部能抽到，没有死角");
let worst = null;
for (const p of P.pool) {
  const exp = N * p.w / P.weight;
  const got = hit[p.k] || 0;
  const dev = Math.abs(got - exp) / exp;
  if (!worst || dev > worst.dev) worst = { k: p.k, dev, exp, got };
}
ok(worst.dev < 0.15, "每条实测频率与权重偏差 < 15%", "最大偏差 " + worst.k + " " + (worst.dev * 100).toFixed(1) + "%（期望 " + worst.exp.toFixed(0) + "，实得 " + worst.got + "）");

const legacyShare = P.pool.filter((p) => legacy.includes(p.k)).reduce((s, p) => s + p.w, 0) / P.weight;
ok(legacyShare > 0.42 && legacyShare < 0.55, "官版词缀占比落在预期区间", (legacyShare * 100).toFixed(1) + "%");

const projRate = (hit.projAdd || 0) / N;
ok(projRate < 0.02, "极稀有词缀（额外投射物）出场率 < 2%", (projRate * 100).toFixed(2) + "%");

/* ---------- 3. 机制型事件挂载 ---------- */
console.log("\n[3] 机制型事件挂载");
const evNames = sb.__events.map((e) => e.ev);
for (const want of ["stats:pre", "stats:post", "kill", "hit:mods", "hit:ailment"]) {
  ok(evNames.includes(want), "已注册 " + want);
}
ok(sb.__events.length === 5, "只注册 5 个监听，没有多余副作用");

/* ---------- 4. 带代价词缀：收益与代价都到位 ---------- */
console.log("\n[4] 带代价词缀的属性展开");
const pre = sb.__events.find((e) => e.ev === "stats:pre").fn;
const post = sb.__events.find((e) => e.ev === "stats:post").fn;
const added = {};
pre({ a: { corruptCruel: 20, corruptGluttony: 10, corruptEmberBlood: 4 }, add: (k, v) => { added[k] = v; } });
eq(added.critMulti, 20, "暴虐：暴击伤害收益转成标准属性");
eq(added.quant, 10, "暴食：物品数量收益转成标准属性");
eq(added.regen, 4, "烬血：每秒回复收益转成标准属性");

const S = { maxLife: 1000, maxES: 500, rarity: 100 };
post({ S, g: (k) => ({ corruptCruel: 20, corruptGluttony: 10, corruptEmberBlood: 4 }[k] || 0) });
eq(Math.round(S.maxLife), 940, "暴虐：最大生命总降 6%");
eq(Math.round(S.maxES), 450, "烬血：最大能量护盾总降 10%");
eq(Math.round(S.rarity), 80, "暴食：物品稀有度总降 20%");

const S2 = { maxLife: 1000, maxES: 500, rarity: 100 };
post({ S: S2, g: () => 0 });
eq(S2.maxLife, 1000, "没有代价词缀时不误伤属性");

/* ---------- 5. 机制型：多来源只生效一次 ---------- */
console.log("\n[5] 机制型不叠加（取上限）");
pre({ a: { corruptBone: 12, corruptResonance: 18, corruptScorch: 30 }, add: () => {} });
const killFn = sb.__events.find((e) => e.ev === "kill").fn;
const modsFn = sb.__events.find((e) => e.ev === "hit:mods").fn;
const ailFn = sb.__events.find((e) => e.ev === "hit:ailment").fn;

// 烬骨：概率封顶 4%，不应变成 12%
let ashGain = 0;
const oldCur = sb.u.cur;
for (let n = 0; n < 20000; n++) { oldCur.ash = 0; killFn({ m: {} }); ashGain += oldCur.ash; }
const boneRate = ashGain / 20000 * 100;
ok(boneRate < 6, "烬骨三件叠加后仍封顶在 4% 附近", boneRate.toFixed(2) + "%");

// 烬灼：概率封顶 10%
let scorch = 0;
for (let n = 0; n < 20000; n++) { const p = {}; ailFn(p); if (p.forceIgn) scorch++; }
const scorchRate = scorch / 20000 * 100;
ok(scorchRate < 13, "烬灼三件叠加后仍封顶在 10% 附近", scorchRate.toFixed(2) + "%");

// 腐化共鸣：每腐化词缀 +6%，不因多件叠加翻倍
sb.u.equip = { w1: { cimpl: { k: "a", v: 1 }, cimpl2: { k: "b", v: 1 } } };
const pk = { k: 100, fixed: false };
modsFn(pk);
eq(Math.round(pk.k), 112, "腐化共鸣：2 条腐化词缀 → 伤害 ×1.12");
const pkFixed = { k: 100, fixed: true };
modsFn(pkFixed);
eq(pkFixed.k, 100, "腐化共鸣不作用于环境/爆炸类固定伤害");

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

// 专属池抽取：献祭之心应能抽到专属词缀，且专属词缀占主导
const uhits = {};
const NU = 30000;
for (let n = 0; n < NU; n++) {
  const r = P.rollUnique("rathpith_globe", false);
  uhits[r.k] = (uhits[r.k] || 0) + 1;
}
const uAll = uniqKeys.filter((k) => uhits[k]);
eq(uAll.length, 4, "献祭之心能抽出全部 4 条专属词缀", "命中 " + uAll.join(","));
const uShare = uniqKeys.reduce((s, k) => s + (uhits[k] || 0), 0) / NU;
ok(uShare > 0.2 && uShare < 0.35, "专属词缀占主导（约 27% 权重区间）", (uShare * 100).toFixed(1) + "%");
ok(uhits.skillLvl > 0, "通用词缀仍可作兜底抽出", "skillLvl 抽到 " + uhits.skillLvl + " 次");

// 非传奇装备零泄漏
const nhits = {};
for (let n = 0; n < 8000; n++) {
  const r = P.rollOnce(false);
  nhits[r.k] = (nhits[r.k] || 0) + 1;
}
eq(uniqKeys.filter((k) => nhits[k]).length, 0, "普通装备抽不到专属词缀（零泄漏）");

// 珠宝也不能抽到专属词缀（传奇珠宝另说，本作珠宝无 uniq 专属池）
const jhits = {};
for (let n = 0; n < 8000; n++) {
  const r = P.rollOnce(true);
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
