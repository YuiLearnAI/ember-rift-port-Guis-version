// gen_expose.mjs —— 生成移植构建的 __erTest 暴露块（给回归测试用）
// 用法: node gen_expose.mjs <block.js> <symbol_map.json> <out_expose.js>
// 规则：原 harness 暴露名单里的名字 → 若在符号表里用 NEW 名；否则若移植块自己声明了该名则原样；
//       都没有就跳过（并打印）。属性名仍用 OLD 名，这样旧测试代码不用改。
import fs from "node:fs";
import * as acorn from "./jstools/node_modules/acorn/dist/acorn.mjs";

const [, , blockPath, mapPath, outPath] = process.argv;
const blockSrc = fs.readFileSync(blockPath, "utf8");
const map = JSON.parse(fs.readFileSync(mapPath, "utf8")).globals || {};

// 移植块自己声明的顶层名
const ast = acorn.parse("(() => {\n" + blockSrc + "\n})();\n", { ecmaVersion: "latest", sourceType: "script" });
const body = ast.body[0].expression.callee.body.body;
const own = new Set();
for (const st of body) {
  if (st.type === "FunctionDeclaration" && st.id) own.add(st.id.name);
  if (st.type === "VariableDeclaration") for (const d of st.declarations) if (d.id.type === "Identifier") own.add(d.id.name);
}

// 原 harness 的暴露名单（保持属性名 = OLD 名）
const EXPOSE = `u o P lt Qv Es Ue Zt mt Mt le Vt Oe aa pt Zo Ct Ur OmToggle OmTake OmHas OmActive OmDrop OmHint OmWhittle OmBenchRow Cc Mn Pe fe Ks _s el Br x1 Sa Bt Vs Oi Ro Kn Ul ji Ib nt Ee ro Tt ui Rm Jb Ko Gi sy br ExCalc ExAll qh AbyssMake AbyssUpdate AbyssOnKill AbyssOpenPit AbyssSeal AbyssMods AbyssModRoll ABMODS AbyssOmenDrop tt ct hn ih DsDesecrate DsOptions DsReveal DsReroll DsWell DsMapChaos DsBoneDrop _i DelDRMul DelDRPct SimDmgMul DelRarityBonus DelDepthNow mp Na Ts tn te UniqueResCap SimulacrumInteract SimulacrumEnter SimEnterLayer SimBossKilled SimulacrumUpdate SimulacrumNext SimulacrumFinish mr ty zn Dm Ra qa gl DeliriumStart DeliriumUpdate DeliriumEnd DelEnterLayer DelHpBonus RitualMake RitTribute RitAddTribute RitSpendTribute RitualStart RitualUpdate RitualShop RitualInteract RitualOffers RitualBuy RitualWave`
  .split(/\s+/).filter(Boolean);

const seen = new Set();
const props = [];
const skipped = [];
const usingNew = [];
for (const n of EXPOSE) {
  if (n === "u" || n === "o") continue;   // 已用 getter/setter 暴露
  if (seen.has(n)) continue;
  seen.add(n);
  const m = map[n];
  if (m && m.new) {
    if (own.has(m.new)) { skipped.push(n + "(NEW名与移植块自身声明重名:" + m.new + ")"); continue; }
    props.push(`        ${n}: ${m.new}`);
    usingNew.push(n + "->" + m.new);
  } else if (own.has(n)) {
    props.push(`        ${n}`);
  } else {
    skipped.push(n);
  }
}
const code = `      /* __erTest 暴露（迁移构建专用，供回归测试） */
      window.__erTest = {
        get u() { return ${map.u ? map.u.new : "u"}; },
        set u(v) { ${map.u ? map.u.new : "u"} = v; },
        get o() { return ${map.o ? map.o.new : "o"}; },
${props.join(",\n")}
      };
`;
fs.writeFileSync(outPath, code, "utf8");
console.log("expose props:", props.length, "mapped-to-NEW:", usingNew.length, "skipped:", skipped.length);
if (skipped.length) console.log("skipped:", skipped.join(", "));
