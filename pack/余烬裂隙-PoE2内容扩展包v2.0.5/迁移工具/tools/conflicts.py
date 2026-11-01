import io, json, os, hashlib, re, difflib, sys

OUT = r"D:\xyx\.dsh-work\port\out"
old = io.open(os.path.join(OUT, 'old.js'), encoding='utf-8', errors='replace').read().split('\n')
new = io.open(os.path.join(OUT, 'new.js'), encoding='utf-8', errors='replace').read().split('\n')
dec_old = {d['name']: d for d in json.load(io.open(os.path.join(OUT, 'decls_old.json'), encoding='utf-8'))['decls']}
diff = json.load(io.open(os.path.join(OUT, 'decl_diff.json'), encoding='utf-8'))


def anchor_blocks(a, b, K=8):
    def h(s):
        return hashlib.md5(s.encode('utf-8', 'replace')).hexdigest()
    bidx = {}
    for j in range(0, len(b) - K + 1):
        bidx.setdefault(h('\n'.join(b[j:j + K])), []).append(j)
    matched, used_b, i = [], set(), 0
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
mp = json.load(io.open(os.path.join(OUT, 'symbol_map.json'), encoding='utf-8'))['globals']


def mapped_range(a0, a1):
    mapped = sorted((a, n) for a, n in o2n.items() if a0 <= a < a1)
    if not mapped:
        return None
    n0 = mapped[0][1] - (mapped[0][0] - a0)
    n1 = mapped[-1][1] + (a1 - mapped[-1][0])
    return max(0, n0), min(len(new), n1), len(mapped) / float(max(1, a1 - a0))


def norm(s):
    return re.sub(r'\s+', ' ', s).strip()


rows = []
for kind, names in (('func', diff['changedFuncs']), ('var', diff['changedVars'])):
    for n in names:
        d = dec_old.get(n)
        if not d:
            rows.append(dict(kind=kind, name=n, status='NO-OLD-DECL', new=mp.get(n, {}).get('new')))
            continue
        a0, a1 = d['line'] - 1, d['endLine']
        mr = mapped_range(a0, a1)
        if not mr:
            rows.append(dict(kind=kind, name=n, status='UNMAPPED', new=mp.get(n, {}).get('new'), old=[a0 + 1, a1]))
            continue
        n0, n1, ratio = mr
        old_text = norm('\n'.join(old[a0:a1]))
        new_text = norm('\n'.join(new[n0:n1]))
        sim = difflib.SequenceMatcher(None, old_text, new_text).ratio()
        status = 'SAME' if sim > 0.995 and ratio > 0.5 else ('CHANGED' if ratio > 0.35 else 'WEAK')
        rows.append(dict(kind=kind, name=n, new=mp.get(n, {}).get('new'), old=[a0 + 1, a1],
                         newrange=[n0 + 1, n1], ratio=round(ratio, 2), sim=round(sim, 3), status=status,
                         oldlen=len(old_text), newlen=len(new_text)))

order = {'CHANGED': 0, 'WEAK': 1, 'UNMAPPED': 2, 'NO-OLD-DECL': 3, 'SAME': 4}
rows.sort(key=lambda r: (order.get(r['status'], 9), r['name']))
with io.open(os.path.join(OUT, 'conflicts.md'), 'w', encoding='utf-8') as w:
    w.write('# 我们覆盖的基础符号：新基础是否也改过\n\n')
    w.write('CHANGED = 新基础这段也变了（必须按语义合并，不能直接用我们的版本覆盖）\n')
    w.write('WEAK = 锚点不足/无法判定，需人工定位\nSAME = 新基础未变，覆盖安全\n\n')
    w.write('| 类型 | OLD名 | NEW名 | OLD行 | NEW行 | 锚点 | 相似度 | 判定 |\n|---|---|---|---|---|---|--:|---|\n')
    for r in rows:
        w.write('| %s | `%s` | `%s` | %s | %s | %s | %s | %s |\n' % (
            r['kind'], r['name'], r.get('new') or '?',
            '-'.join(map(str, r['old'])) if r.get('old') else '-',
            '-'.join(map(str, r['newrange'])) if r.get('newrange') else '-',
            ('%.0f%%' % (r['ratio'] * 100)) if 'ratio' in r else '-',
            r.get('sim', '-'), r['status']))
    cnt = {}
    for r in rows:
        cnt[r['status']] = cnt.get(r['status'], 0) + 1
    w.write('\n统计：' + ', '.join('%s=%d' % (k, v) for k, v in sorted(cnt.items())) + '\n')
for r in rows:
    if r['status'] in ('CHANGED', 'WEAK', 'UNMAPPED'):
        print('%-9s %-10s -> %-8s sim=%s ratio=%s' % (r['status'], r['name'], r.get('new'), r.get('sim'), r.get('ratio')))
print()
cnt = {}
for r in rows:
    cnt[r['status']] = cnt.get(r['status'], 0) + 1
print(cnt)
