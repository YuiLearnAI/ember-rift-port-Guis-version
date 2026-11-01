#!/usr/bin/env python3
# build.py —— 把 patch modules 应用到新基础 HTML 上，生成迁移产物
#
#   python build.py --base <NEW.html> --patches <patches目录> --out <产物.html>
#                  [--only 01_xxx,05_yyy]  [--check]   # --check 只校验锚点，不写文件
#
# patch module 格式见 port/README.md §5。锚点默认必须唯一，否则报错并列出命中位置。

import argparse
import io
import json
import os
import sys

EOL = '\r\n'


def load_text(p):
    with io.open(p, 'r', encoding='utf-8', newline='') as f:
        return f.read()


def detect_eol(s):
    crlf = s.count('\r\n')
    lf = s.count('\n') - crlf
    return '\r\n' if crlf >= lf else '\n'


def norm(s, eol):
    return s.replace('\r\n', '\n').replace('\n', eol)


def find_all(hay, needle):
    out = []
    i = hay.find(needle)
    while i >= 0:
        out.append(i)
        i = hay.find(needle, i + 1)
    return out


def line_of(text, pos):
    return text.count('\n', 0, pos) + 1


def apply_op(html, op, iife_end, opdesc):
    typ = op['type']
    text = op.get('text', '')
    if typ == 'append_iife_end':
        if iife_end < 0:
            raise SystemExit('[%s] IIFE end marker "})();" not found' % opdesc)
        return html[:iife_end] + text + EOL + html[iife_end:]

    anchor = op.get('anchor')
    if not anchor:
        raise SystemExit('[%s] missing anchor' % opdesc)
    occ_need = op.get('occ', 1)
    hits = find_all(html, anchor)
    if not hits:
        raise SystemExit('[%s] ANCHOR NOT FOUND\n--- anchor ---\n%s' % (opdesc, anchor[:600]))
    if len(hits) < occ_need:
        raise SystemExit('[%s] anchor found %d times, need at least %d' % (opdesc, len(hits), occ_need))
    if occ_need == 1 and len(hits) > 1:
        lines = ', '.join(str(line_of(html, h)) for h in hits[:10])
        raise SystemExit('[%s] ANCHOR NOT UNIQUE (%d matches at lines %s)\n--- anchor ---\n%s' % (
            opdesc, len(hits), lines, anchor[:600]))
    if typ == 'insert_after':
        pos = hits[occ_need - 1] + len(anchor)
        return html[:pos] + EOL + text + html[pos:]
    if typ == 'insert_before':
        pos = hits[occ_need - 1]
        return html[:pos] + text + EOL + html[pos:]
    if typ == 'replace':
        pos = hits[occ_need - 1]
        return html[:pos] + text + html[pos + len(anchor):]
    raise SystemExit('[%s] unknown op type %r' % (opdesc, typ))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--base', required=True)
    ap.add_argument('--patches', required=True)
    ap.add_argument('--out')
    ap.add_argument('--only', default='')
    ap.add_argument('--check', action='store_true')
    args = ap.parse_args()

    base = load_text(args.base)
    eol = detect_eol(base)
    html = base.replace('\r\n', '\n')

    files = sorted(f for f in os.listdir(args.patches) if f.endswith('.json'))
    if args.only:
        want = set(x.strip() for x in args.only.split(',') if x.strip())
        files = [f for f in files if f[:-5] in want or f.startswith(tuple(want))]
    if not files:
        print('no patch files')
        return 1

    plan = []
    for f in files:
        path = os.path.join(args.patches, f)
        mod = json.load(io.open(path, encoding='utf-8'))
        plan.append((f, mod))

    nops = 0
    for f, mod in plan:
        print('=== %s  (%s)  %d ops' % (f, mod.get('feature', '-'), len(mod.get('ops', []))))
        for k, op in enumerate(mod.get('ops', [])):
            opdesc = '%s#%d' % (f, k)
            text = norm(op.get('text', ''), '\n')
            anchor = norm(op.get('anchor', ''), '\n') if op.get('anchor') else None
            op2 = dict(op)
            op2['text'] = text
            if anchor is not None:
                op2['anchor'] = anchor
            iife_end = html.rfind('})();')
            before = len(html)
            html = apply_op(html, op2, iife_end, opdesc)
            nops += 1
            print('   ok %-14s +%d bytes' % (op['type'], len(html) - before))
    print('\napplied %d ops from %d modules; output %d bytes' % (nops, len(plan), len(html)))

    if args.check:
        print('check mode: not writing output')
        return 0
    if not args.out:
        raise SystemExit('--out required unless --check')
    html = html.replace('\n', eol)
    os.makedirs(os.path.dirname(os.path.abspath(args.out)), exist_ok=True)
    with io.open(args.out, 'w', encoding='utf-8', newline='') as w:
        w.write(html)
    print('wrote %s' % args.out)
    return 0


if __name__ == '__main__':
    sys.exit(main())
