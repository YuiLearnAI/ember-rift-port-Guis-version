import io, json, os, sys, hashlib

OUT = r"D:\xyx\.dsh-work\port\out"
PKG = r"D:\xyx\余烬裂隙-PoE2内容扩展包v1.0.4"
OLD = os.path.join(PKG, r'基础版本\旧魔改基础版\【魔改】基于憨憨问号魔改的魔改，低卡，技能特效音效重置，提供地图强度设置，无尽模式.html')
CUR = os.path.join(PKG, r'余烬裂隙-异界内容扩展.html')
NEW = os.path.join(PKG, r'基础版本\憨憨问号v0.4-18.0.1\[改版]余烬裂隙 憨憨问号 v0.4更好的体验18.0.1.html')


def readl(p):
    return io.open(p, encoding='utf-8', errors='replace').read().split('\n')


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


old, cur, new = readl(OLD), readl(CUR), readl(NEW)
d = json.load(io.open(os.path.join(OUT, 'delta_OLD_CUR.json'), encoding='utf-8'))
gaps = [g for g in d['gaps']]
blocks_oc = anchor_blocks(old, cur, 8)
blocks_on = anchor_blocks(old, new, 8)

# map OLD line -> NEW line via blocks
o2n = {}
for (ai, bj, L) in blocks_on:
    for t in range(L):
        o2n[ai + t] = bj + t

# for each OLD line index, the next matched block start in NEW (to bound landing zones)
block_by_old_start = {ai: (ai, bj, L) for (ai, bj, L) in blocks_on}

def landing_for(a0, a1):
    """OLD gap [a0,a1) -> find NEW landing zone (nb_start, nb_end, kind)."""
    # preceding matched OLD line
    prev = None
    for (ai, bj, L) in blocks_on:
        if ai + L <= a0:
            if prev is None or ai > prev[0]:
                prev = (ai, bj, L)
    nxt = None
    for (ai, bj, L) in blocks_on:
        if ai >= a1:
            if nxt is None or ai < nxt[0]:
                nxt = (ai, bj, L)
    after = (prev[1] + prev[2]) if prev else 0            # NEW line right after preceding block
    before = nxt[1] if nxt else len(new)                  # NEW line where next block starts
    return after, before

rows = []
for n, (a0, a1, b0, b1) in enumerate(gaps):
    na, nb = a1 - a0, b1 - b0
    if na == 0 and nb == 0:
        continue
    n0, n1 = landing_for(a0, a1)
    zone = new[n0:n1]
    rows.append({
        'gap': n, 'old': [a0, a1], 'cur': [b0, b1], 'new_zone': [n0, n1],
        'removed': na, 'added': nb, 'zone_len': len(zone),
        'zone_sample': [l.strip()[:120] for l in zone[:6]],
        'old_ctx': [l.strip()[:120] for l in old[max(0, a0 - 3):a0]],
        'new_ctx_before': [l.strip()[:120] for l in new[max(0, n0 - 3):n0]],
    })

pure = [r for r in rows if r['removed'] == 0]
mod = [r for r in rows if r['removed'] > 0]
clean = [r for r in pure if r['zone_len'] == 0]

print('gaps total %d  | pure-insert %d (added %d lines)  | with-removal %d (removed %d lines)' % (
    len(rows), len(pure), sum(r['added'] for r in pure), len(mod), sum(r['removed'] for r in mod)))
print('pure-insert with EMPTY new landing zone (clean drop-in): %d  (added %d lines)' % (
    len(clean), sum(r['added'] for r in clean)))
print('pure-insert with NON-empty new zone (friend added code here): %d' % (len(pure) - len(clean)))
print()

with io.open(os.path.join(OUT, 'landing.json'), 'w', encoding='utf-8') as w:
    json.dump(rows, w, ensure_ascii=False, indent=1)

with io.open(os.path.join(OUT, 'landing.md'), 'w', encoding='utf-8') as w:
    w.write('# 每个 delta 段在新基础(NEW)里的落点\n\n')
    w.write('pure-insert %d 段；有删除的 %d 段；落点空白可直接插入 %d 段\n\n' % (len(pure), len(mod), len(clean)))
    w.write('| gap | OLD | -行 | +行 | NEW落点 | 落点占用 | 类型 |\n|--:|--:|--:|--:|--:|--:|---|\n')
    for r in rows:
        typ = '纯净插入' if r['removed'] == 0 else '改基础代码'
        w.write('| %d | %d-%d | %d | %d | %d-%d | %d | %s |\n' % (
            r['gap'], r['old'][0] + 1, r['old'][1], r['removed'], r['added'],
            r['new_zone'][0] + 1, r['new_zone'][1], r['zone_len'], typ))
    w.write('\n## 落点被新基础占用最多的 15 段（需要重点处理）\n\n')
    for r in sorted(rows, key=lambda x: -x['zone_len'])[:15]:
        w.write('- gap %d (OLD %d, +%d lines) -> NEW %d..%d 占用 %d 行；zone 开头：%s\n' % (
            r['gap'], r['old'][0] + 1, r['added'], r['new_zone'][0] + 1, r['new_zone'][1], r['zone_len'],
            ' / '.join(r['zone_sample'][:3])[:200]))
print('wrote landing.json / landing.md')
