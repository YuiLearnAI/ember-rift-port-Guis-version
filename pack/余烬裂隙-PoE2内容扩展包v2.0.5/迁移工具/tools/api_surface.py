import io, json, os, subprocess, sys, collections, tempfile

OUT = r"D:\xyx\.dsh-work\port\out"
SCRATCH = r"D:\xyx\.dsh-work\port\scratch"
NODE = r"C:\Users\33266\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\node\bin\node.exe"
TOOLS = r"D:\xyx\.dsh-work\port\tools"

old = io.open(os.path.join(OUT, 'old.js'), encoding='utf-8', errors='replace').read().split('\n')
cur = io.open(os.path.join(OUT, 'cur.js'), encoding='utf-8', errors='replace').read().split('\n')
# NOTE: out/old.js is the extracted main script; delta gaps were computed on the HTML files.
# Recompute gaps against the JS files: use the html-based gaps and map via html->js offsets is messy.
# Instead recompute gaps JS-vs-JS here.
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

print('js-level gaps: %d  added %d lines, removed %d lines' % (
    len(gaps), sum(g[3] - g[2] for g in gaps), sum(g[1] - g[0] for g in gaps)))

names = collections.Counter()
fails = []
tmp = os.path.join(SCRATCH, 'gap')
os.makedirs(tmp, exist_ok=True)
for i, (a0, a1, b0, b1) in enumerate(gaps):
    if b1 - b0 == 0:
        continue
    snippet = '\n'.join(cur[b0:b1])
    sp = os.path.join(tmp, 'in.js')
    op = os.path.join(tmp, 'out.js')
    rp = os.path.join(tmp, 'rep.json')
    io.open(sp, 'w', encoding='utf-8').write(snippet)
    r = subprocess.run([NODE, os.path.join(TOOLS, 'rewrite.mjs'), '--map', os.path.join(tmp, 'empty.json'),
                        '--in', sp, '--out', op, '--report', rp],
                       capture_output=True, text=True, encoding='utf-8', errors='replace')
    if not os.path.exists(rp):
        fails.append((i, r.stderr.strip().splitlines()[-1] if r.stderr.strip() else '?'))
        continue
    rep = json.load(io.open(rp, encoding='utf-8'))
    for n in rep['unmapped']:
        names[n] += 1

print('\nfree identifiers in our added code: %d distinct' % len(names))
print('parse failures: %d gaps' % len(fails))
for i, e in fails[:10]:
    print('   gap %d: %s' % (i, e[:150]))
tops = names.most_common()
with io.open(os.path.join(OUT, 'api_surface.txt'), 'w', encoding='utf-8') as w:
    w.write('# identifiers our added code references but does not declare (needs symbol mapping)\n')
    for n, c in tops:
        w.write('%-28s %4d\n' % (n, c))
print('\ntop 60:')
for n, c in tops[:60]:
    print('  %-24s %d' % (n, c))
