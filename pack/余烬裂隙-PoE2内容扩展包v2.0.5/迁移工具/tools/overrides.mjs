// overrides.mjs —— 分析移植块（b_patch.js）里对基础符号的"覆盖/劫持"点
// 输出：被赋值/被 Object.assign/被 push 扩展的 OLD 顶层名清单，以及每处的形式
import fs from "node:fs";
import * as acorn from "./jstools/node_modules/acorn/dist/acorn.mjs";

const blockPath = process.argv[2];
const oldTopPath = process.argv[3];
const outPath = process.argv[4];

const oldTop = new Set(JSON.parse(fs.readFileSync(oldTopPath, "utf8")).decls.map((d) => d.name));
const code = fs.readFileSync(blockPath, "utf8");
const wrapped = "(() => {\n" + code + "\n})();\n";
const ast = acorn.parse(wrapped, { ecmaVersion: "latest", sourceType: "script", locations: true });
const iife = ast.body[0].expression.callee;
const body = iife.body.body;

const found = [];
function note(name, form, line, detail) {
  found.push({ name, form, line, detail });
}
for (const st of body) {
  let expr = null;
  if (st.type === "ExpressionStatement") expr = st.expression;
  if (expr && expr.type === "AssignmentExpression" && expr.left.type === "Identifier" && oldTop.has(expr.left.name)) {
    note(expr.left.name, "assign", st.loc.start.line, expr.right.type);
  }
  if (expr && expr.type === "CallExpression" && expr.callee.type === "MemberExpression" &&
      expr.callee.object.type === "Identifier" && oldTop.has(expr.callee.object.name)) {
    const meth = expr.callee.property.name;
    note(expr.callee.object.name, "call:" + meth, st.loc.start.line, "");
  }
  if (st.type === "VariableDeclaration") {
    for (const d of st.declarations) {
      if (d.init && d.init.type === "CallExpression" && d.init.callee.type === "MemberExpression" &&
          d.init.callee.object.type === "Identifier" && oldTop.has(d.init.callee.object.name)) {
        note(d.init.callee.object.name, "var-call:" + d.init.callee.property.name, st.loc.start.line, "");
      }
    }
  }
}
// 也扫描嵌套层里对 oldTop 名的赋值（function 体内的 hook）
function walk(node) {
  if (!node || typeof node.type !== "string") return;
  if (node.type === "AssignmentExpression" && node.left.type === "Identifier" && oldTop.has(node.left.name)) {
    note(node.left.name, "assign(nested)", node.loc ? node.loc.start.line : -1, node.right.type);
  }
  for (const k of Object.keys(node)) {
    if (k === "loc" || k === "start" || k === "end" || k === "type") continue;
    const v = node[k];
    if (Array.isArray(v)) for (const c of v) walk(c);
    else if (v && typeof v.type === "string") walk(v);
  }
}
walk(iife.body);
const byName = {};
for (const f of found) {
  byName[f.name] = byName[f.name] || [];
  byName[f.name].push(f);
}
fs.writeFileSync(outPath, JSON.stringify({ total: found.length, byName: Object.fromEntries(
  Object.entries(byName).map(([k, v]) => [k, v.map((x) => x.form + "@" + x.line)]) ) }, null, 1), "utf8");
console.log("override sites:", found.length, "distinct base names:", Object.keys(byName).length);
console.log(Object.keys(byName).sort().join(" "));
