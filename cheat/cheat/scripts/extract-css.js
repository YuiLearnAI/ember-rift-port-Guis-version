#!/usr/bin/env node
/**
 * 把用户脚本里的面板样式抽成 docs/design/panel.css，作为预览页 / 教程 / Impeccable 检测的单一真源。
 * 用法: node scripts/extract-css.js
 * 若 --check 则只比对是否同步（不同步时非零退出），便于 CI。
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'ember-rift-gui.user.js');
const OUT = path.join(ROOT, 'docs', 'design', 'panel.css');

const src = fs.readFileSync(SRC, 'utf8').replace(/\r\n?/g, '\n');
const start = src.indexOf('    const css = `');
if (start < 0) { console.error('[extract-css] 找不到 css 常量，锚点可能已变更'); process.exit(2); }
const from = start + '    const css = `'.length;
const end = src.indexOf('`;', from);
if (end < 0) { console.error('[extract-css] css 常量未闭合'); process.exit(2); }

const css = src.slice(from, end).trim();
const banner = [
  '/* ============================================================',
  ' * 此文件由 scripts/extract-css.js 从 ember-rift-gui.user.js 生成，请勿手改。',
  ' * 设计依据: docs/design/apple-DESIGN.md',
  ' * ============================================================ */',
  '',
].join('\n');

if (process.argv.includes('--check')) {
  if (!fs.existsSync(OUT) || fs.readFileSync(OUT, 'utf8') !== banner + css + '\n') {
    console.error('[extract-css] panel.css 与脚本不同步，请运行: node scripts/extract-css.js');
    process.exit(1);
  }
  console.log('[extract-css] panel.css 与脚本同步');
  process.exit(0);
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, banner + css + '\n');
console.log('[extract-css] 已写出 ' + path.relative(ROOT, OUT) + ' (' + css.length + ' 字节)');
