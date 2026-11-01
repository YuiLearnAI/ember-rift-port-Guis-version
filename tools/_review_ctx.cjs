#!/usr/bin/env node
/* 在单行压缩的底包里打印 pattern 附近上下文 */
const fs = require('fs');
const file = process.argv[2];
const pat = process.argv[3];
const before = Number(process.argv[4] || 300);
const after = Number(process.argv[5] || 300);
const max = Number(process.argv[6] || 5);
const src = fs.readFileSync(file, 'utf8');

let i = 0, n = 0;
while (n < max) {
  const k = src.indexOf(pat, i);
  if (k === -1) break;
  n++;
  console.log(`\n########## hit #${n} @${k} ##########`);
  console.log(src.slice(Math.max(0, k - before), k + pat.length + after));
  i = k + pat.length;
}
if (!n) console.log(`没有找到 "${pat}"`);
