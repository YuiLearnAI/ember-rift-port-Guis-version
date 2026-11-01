#!/usr/bin/env node
// review-runtime: 枚举迁移块里所有 window.__* / 自由 __* 钩子，判定「定义 vs 使用」
const fs = require('fs');

function scan(file) {
  const src = fs.readFileSync(file, 'utf8');
  const lines = src.split('\n');
  const map = new Map(); // name -> {def:[], use:[]}
  const re = /(?:window|globalThis|self)\.(__[A-Za-z0-9_$]+)/g;
  lines.forEach((line, i) => {
    let m;
    re.lastIndex = 0;
    while ((m = re.exec(line))) {
      const name = m[1];
      const rec = map.get(name) || { def: [], use: [] };
      // 判断是否是赋值左值: window.NAME =  /  window.NAME ||=  /  window.NAME ??=
      const after = line.slice(m.index + m[0].length);
      const isDef = /^\s*(=(?!=)|\|\|=|\?\?=|,)/.test(after);
      rec[isDef ? 'def' : 'use'].push({ line: i + 1, text: line.trim().slice(0, 200) });
      map.set(name, rec);
    }
  });
  return map;
}

const file = process.argv[2];
const map = scan(file);
const names = [...map.keys()].sort();
console.log(`FILE ${file}`);
console.log(`total distinct window.__* names: ${names.length}`);
console.log('');
for (const n of names) {
  const r = map.get(n);
  const kind = r.def.length && r.use.length ? 'DEF+USE' : r.def.length ? 'DEF' : 'USE';
  const other = r.def.length + r.use.length;
  console.log(`${kind.padEnd(8)} ${n}  (def=${r.def.length} use=${r.use.length})`);
  for (const d of r.def.slice(0, 3)) console.log(`    def  L${d.line}: ${d.text}`);
  for (const u of r.use.slice(0, 3)) console.log(`    use  L${u.line}: ${u.text}`);
  if (other > 6) console.log(`    ...`);
}
