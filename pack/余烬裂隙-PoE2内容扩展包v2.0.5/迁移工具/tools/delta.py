import io, sys, hashlib, os

OLD = r"D:\xyx\余烬裂隙-PoE2内容扩展包v1.0.4\基础版本\旧魔改基础版\【魔改】基于憨憨问号魔改的魔改，低卡，技能特效音效重置，提供地图强度设置，无尽模式.html"
CUR = r"D:\xyx\余烬裂隙-PoE2内容扩展包v1.0.4\余烬裂隙-异界内容扩展.html"
NEW = r"D:\xyx\余烬裂隙-PoE2内容扩展包v1.0.4\基础版本\憨憨问号v0.4-18.0.1\[改版]余烬裂隙 憨憨问号 v0.4更好的体验18.0.1.html"
OUTDIR = r"D:\xyx\.dsh-work\port\out"
os.makedirs(OUTDIR, exist_ok=True)


def readl(p):
    with io.open(p, 'r', encoding='utf-8', errors='replace') as f:
        return f.read().split('\n')


def anchor_blocks(a, b, K=8):
    def h(s):
        return hashlib.md5(s.encode('utf-8', 'replace')).hexdigest()
    bidx = {}
    for j in range(0, len(b) - K + 1):
        bidx.setdefault(h('\n'.join(b[j:j + K])), []).append(j)
    matched = []
    used_b = set()
    i = 0
    while i < len(a) - K + 1:
        cands = [j for j in bidx.get(h('\n'.join(a[i:i + K])), []) if j not in used_b]
        if not cands:
            i += 1
            continue
        j = cands[0]
        L = K
        while i + L < len(a) and j + L < len(b) and a[i + L] == b[j + L]:
            L += 1
        matched.append((i, j, L))
        for t in range(j, min(j + L, len(b) - K + 1)):
            used_b.add(t)
        i += L
    return matched


def gaps_of(a, b, blocks):
    gaps = []
    prev_a = prev_b = 0
    for (ai, bj, L) in blocks:
        if ai > prev_a or bj > prev_b:
            gaps.append((prev_a, ai, prev_b, bj))
        prev_a, prev_b = ai + L, bj + L
    gaps.append((prev_a, len(a), prev_b, len(b)))
    return gaps


a, b = readl(OLD), readl(CUR)
blocks = anchor_blocks(a, b, 8)
gaps = gaps_of(a, b, blocks)
rem = sum(g[1] - g[0] for g in gaps)
add = sum(g[3] - g[2] for g in gaps)
print('OLD lines %d  CUR lines %d' % (len(a), len(b)))
print('identical blocks %d ; removed lines %d ; added lines %d ; gap count %d' % (len(blocks), rem, add, len(gaps)))

with io.open(os.path.join(OUTDIR, 'delta_OLD_CUR.md'), 'w', encoding='utf-8') as w:
    w.write('# OLD(base) -> CUR(v1.04) delta\n\n')
    w.write('OLD lines %d, CUR lines %d, gap count %d, removed %d, added %d\n\n' % (len(a), len(b), len(gaps), rem, add))
    for n, (a0, a1, b0, b1) in enumerate(gaps):
        na, nb = a1 - a0, b1 - b0
        if na <= 1 and nb <= 1:
            continue
        w.write('\n## GAP %d  OLD[%d:%d](%d) -> CUR[%d:%d](%d)\n' % (n + 1, a0 + 1, a1, na, b0 + 1, b1, nb))
        w.write('```diff\n')
        lim = 30
        for l in a[a0:a1] if na <= lim else a[a0:a0 + lim]:
            w.write('- ' + l[:400] + '\n')
        if na > lim:
            w.write('- ...[%d more removed lines]\n' % (na - lim))
        for l in b[b0:b1] if nb <= lim else b[b0:b0 + lim]:
            w.write('+ ' + l[:400] + '\n')
        if nb > lim:
            w.write('+ ...[%d more added lines]\n' % (nb - lim))
        w.write('```\n')

# also write raw gap ranges as json for tooling
import json
with io.open(os.path.join(OUTDIR, 'delta_OLD_CUR.json'), 'w', encoding='utf-8') as w:
    json.dump({'gaps': gaps, 'blocks': blocks}, w)
print('wrote', OUTDIR)
