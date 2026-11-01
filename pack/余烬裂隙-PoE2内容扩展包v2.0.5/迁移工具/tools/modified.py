import io, json, os

OUT = r"D:\xyx\.dsh-work\port\out"
old = io.open(os.path.join(OUT, 'old.js'), encoding='utf-8', errors='replace').read().split('\n')
cur = io.open(os.path.join(OUT, 'cur.js'), encoding='utf-8', errors='replace').read().split('\n')

import hashlib

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

blocks = anchor_blocks(old, cur, 8)
gaps = []
prev_a = prev_b = 0
for (ai, bj, L) in blocks:
    if ai > prev_a or bj > prev_b:
        gaps.append((prev_a, ai, prev_b, bj))
    prev_a, prev_b = ai + L, bj + L
gaps.append((prev_a, len(old), prev_b, len(cur)))

with io.open(os.path.join(OUT, 'modified_base.md'), 'w', encoding='utf-8') as w:
    w.write('# 我们"改动了基础代码"的位置（删除的 200 行）\n')
    w.write('这些位置不是纯插入，需要判断在新基础里怎么等价实现（多数可用包装代替）。\n\n')
    cnt = 0
    for i, (a0, a1, b0, b1) in enumerate(gaps):
        na = a1 - a0
        if na == 0:
            continue
        cnt += 1
        w.write('\n## M%d  gap%d  old.js %d..%d  (-%d +%d)\n' % (cnt, i, a0 + 1, a1, na, b1 - b0))
        w.write('```js\n')
        w.write('/* 上下文前 6 行 */\n')
        for l in old[max(0, a0 - 6):a0]:
            w.write('   ' + l[:200] + '\n')
        w.write('/* --- 我们删掉/替换的 --- */\n')
        for l in old[a0:a1]:
            w.write('-  ' + l[:200] + '\n')
        w.write('/* --- 我们改成 --- */\n')
        for l in cur[b0:min(b1, b0 + 40)]:
            w.write('+  ' + l[:200] + '\n')
        if b1 - b0 > 40:
            w.write('+  ...(%d more lines)\n' % (b1 - b0 - 40))
        w.write('/* 上下文后 3 行 */\n')
        for l in old[a1:a1 + 3]:
            w.write('   ' + l[:200] + '\n')
        w.write('```\n')
    print('modified gaps:', cnt, 'total removed lines:', sum(g[1] - g[0] for g in gaps))
print('wrote modified_base.md')
