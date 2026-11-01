#!/usr/bin/env node
/* review-runtime: 与浏览器一致的 HTML script/style 结构扫描（不用正则回溯，按 indexOf 顺序推进）
 * 浏览器规则：遇到 <script ...> 后，第一个 </script 结束该脚本（即使出现在 JS 字符串里）。
 */
const fs = require('fs');
const path = require('path');

function scan(file) {
  const src = fs.readFileSync(file, 'utf8');
  const items = [];
  let i = 0;
  while (i < src.length) {
    const s = src.indexOf('<script', i);
    const st = src.indexOf('<style', i);
    let next = -1, kind = null;
    if (s !== -1 && (st === -1 || s < st)) { next = s; kind = 'script'; }
    else if (st !== -1) { next = st; kind = 'style'; }
    if (next === -1) break;
    const gt = src.indexOf('>', next);
    if (gt === -1) break;
    const closeTag = '</' + kind;
    const close = src.indexOf(closeTag, gt + 1);
    if (close === -1) break;
    const attrs = src.slice(next + kind.length + 1, gt).trim();
    const body = src.slice(gt + 1, close);
    items.push({
      kind,
      attrs,
      external: /\bsrc\s*=/.test(attrs),
      bodyLen: body.length,
      offset: next,
      bodyOffset: gt + 1,
      line: src.slice(0, next).split('\n').length,
      head: body.trim().slice(0, 90).replace(/\s+/g, ' '),
      innerScriptClose: body.indexOf('</script'),
      innerHtmlComment: body.indexOf('<!--'),
      endsWithSlashScript: /<\/script\s*>/i.test(body),
    });
    i = close + closeTag.length;
  }

  const out = { file, chars: src.length, items };
  // 相对位置标注
  const idxHead = src.search(/<\/head>/i);
  const idxBody = src.search(/<body\b/i);
  out.idxHeadClose = idxHead;
  out.idxBodyOpen = idxBody;
  for (const it of items) {
    if (it.offset < idxHead) it.zone = 'HEAD (before </head>)';
    else if (it.offset < idxBody) it.zone = 'between </head> and <body>';
    else it.zone = 'BODY';
  }
  // body 内顺序 rank
  let n = 0;
  for (const it of items) if (it.zone === 'BODY' || it.zone === 'HEAD (before </head>)') it.order = ++n;
  return out;
}

for (const f of process.argv.slice(2)) {
  const r = scan(f);
  console.log('='.repeat(100));
  console.log(`FILE ${path.basename(f)}  ${(r.chars / 1048576).toFixed(2)} MiB`);
  console.log(`</head> @${r.idxHeadClose}   <body @${r.idxBodyOpen}`);
  for (const it of r.items) {
    console.log(
      `${it.kind.toUpperCase().padEnd(6)} @${String(it.offset).padStart(8)} line=${String(it.line).padStart(6)} len=${String(it.bodyLen).padStart(9)} ext=${it.external ? 'Y' : 'N'} zone=${it.zone}`
    );
    console.log(`       attrs="${it.attrs.slice(0, 80)}"`);
    console.log(`       head="${it.head}"`);
    if (it.innerScriptClose !== -1) console.log(`       !! 体内含 </script at +${it.innerScriptClose}（浏览器会在此截断）`);
    if (it.innerHtmlComment !== -1 && it.kind === 'script') console.log(`       !! 体内含 <!-- at +${it.innerHtmlComment}`);
  }
  // 按 body 顺序列出"可执行块"顺序
  console.log('--- 实际执行顺序（浏览器视角）---');
  const exec = r.items.filter((x) => x.kind === 'script');
  exec.forEach((x, k) => console.log(`  ${k + 1}. at ${x.offset} (line ${x.line}) len=${x.bodyLen} ${x.external ? '[external]' : '[inline]'} :: ${x.head.slice(0, 60)}`));
}
