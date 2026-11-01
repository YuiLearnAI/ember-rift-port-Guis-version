import io, json, os, hashlib, sys, re

OUT = r"D:\xyx\.dsh-work\port\out"
old = io.open(os.path.join(OUT, 'old.js'), encoding='utf-8', errors='replace').read().split('\n')
new = io.open(os.path.join(OUT, 'new.js'), encoding='utf-8', errors='replace').read().split('\n')
dec_old = {d['name']: d for d in json.load(io.open(os.path.join(OUT, 'decls_old.json'), encoding='utf-8'))['decls']}
dec_new = json.load(io.open(os.path.join(OUT, 'decls_new.json'), encoding='utf-8'))['decls']


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


blocks = anchor_blocks(old, new, 8)
o2n = {}
for (ai, bj, L) in blocks:
    for t in range(L):
        o2n[ai + t] = bj + t

# NEW declarations indexed by line
new_by_line = sorted([(d['line'], d['endLine'], d['name'], d.get('kind')) for d in dec_new])

for name in sys.argv[1:]:
    d = dec_old.get(name)
    print('=' * 70)
    if not d:
        print(name, ': not an OLD top-level decl')
        continue
    a0, a1 = d['line'] - 1, d['endLine']
    print('OLD %s  lines %d-%d  kind=%s' % (name, a0 + 1, a1, d.get('kind')))
    print('OLD src head: ' + d['src'][:300].replace('\n', ' '))
    mapped = sorted((a, n) for a, n in o2n.items() if a0 <= a < a1)
    if not mapped:
        print('  no anchors')
        continue
    n0 = mapped[0][1] - (mapped[0][0] - a0)
    n1 = mapped[-1][1] + (a1 - mapped[-1][0])
    print('  -> NEW lines ~%d-%d (anchored %d/%d lines)' % (max(0, n0) + 1, min(len(new), n1), len(mapped), a1 - a0))
    # which new decls fall in that range
    for (l0, l1, nm, kd) in new_by_line:
        if l0 >= max(0, n0) - 3 and l0 <= min(len(new), n1) + 3:
            print('     NEW decl near: %s (kind=%s) lines %d-%d' % (nm, kd, l0, l1))
    print('  NEW region head:')
    for i in range(max(0, n0), min(len(new), max(0, n0) + 8)):
        print('    %6d| %s' % (i + 1, new[i][:180]))
