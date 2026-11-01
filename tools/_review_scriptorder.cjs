// 诊断：两种正则抽 script 的差异
const fs = require('fs');
const f = process.argv[2];
const html = fs.readFileSync(f, 'utf8');
console.log('file', f, 'len', html.length);

const reA = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
let m, a = [];
while ((m = reA.exec(html))) a.push({ i: m.index, tag: m[1].slice(0, 60), len: m[2].length, head: m[2].trim().slice(0, 50) });
console.log('--- regexA (structure tool) ---');
a.forEach((x, k) => console.log(`[${k}] idx=${x.i} len=${x.len} tag="${x.tag}" head="${x.head.replace(/\s+/g, ' ')}"`));

const reB = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi;
let b = [];
while ((m = reB.exec(html))) b.push({ i: m.index, len: m[1].length, head: m[1].trim().slice(0, 50) });
console.log('--- regexB (probe) ---');
b.forEach((x, k) => console.log(`[${k}] idx=${x.i} len=${x.len} head="${x.head.replace(/\s+/g, ' ')}"`));

// 直接找 HOTFIX-BEGIN / </script> 位置
console.log('--- literal anchors ---');
for (const t of ['<!-- HOTFIX-BEGIN -->', '<!-- HOTFIX-END -->', '<!-- Cloudflare Pages Analytics -->']) {
  console.log(`  ${t} @ ${html.indexOf(t)}`);
}
