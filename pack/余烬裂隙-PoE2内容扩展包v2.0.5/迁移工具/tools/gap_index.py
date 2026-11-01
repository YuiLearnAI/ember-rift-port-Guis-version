import io, json, re, collections, os

OUT = r"D:\xyx\.dsh-work\port\out"
d = json.load(io.open(os.path.join(OUT, 'delta_OLD_CUR.json'), encoding='utf-8'))
gaps = d['gaps']

OLD = r"D:\xyx\余烬裂隙-PoE2内容扩展包v1.0.4\基础版本\旧魔改基础版\【魔改】基于憨憨问号魔改的魔改，低卡，技能特效音效重置，提供地图强度设置，无尽模式.html"
CUR = r"D:\xyx\余烬裂隙-PoE2内容扩展包v1.0.4\余烬裂隙-异界内容扩展.html"
a = io.open(OLD, encoding='utf-8', errors='replace').read().split('\n')
b = io.open(CUR, encoding='utf-8', errors='replace').read().split('\n')

TAGS = [
    ('omen', r'Om|omen|预兆'),
    ('exchange', r'Ex[A-Z]|qh|兑换'),
    ('abyss', r'Abyss|abyss|深渊'),
    ('bones/desecration', r'Ds[A-Z]|dsec|渎灵|遗存骨|骨'),
    ('delirium/sim', r'Del|Sim|迷雾|拟像|裂片'),
    ('ritual', r'Rit|祭坛|驱灵'),
    ('atlas', r'Atlas|图谱'),
    ('unique', r'Oe\b|暗金|headhunter|mageblood|时空之肌|temporalis'),
    ('vfx/sfx', r'\bR\(|w\("|sfx|vfx|音效|特效'),
    ('i18n', r'p1|翻译|English'),
    ('hotfix', r'HOTFIX|hotfix'),
    ('css', r'^\s*[.#][\w-]+\s*\{|@media'),
    ('ui/panel', r'ovbox|panel|curbar|背包|通货'),
    ('player/stats', r'u\.cur|o\.S|caps|抗性|格挡'),
    ('map/gen', r'o\.Z\.M|rooms|Tt\(|地图'),
    ('kill/loot', r'hn\(|fe\(|loot|掉落'),
]

rows = []
for n, (a0, a1, b0, b1) in enumerate(gaps):
    na, nb = a1 - a0, b1 - b0
    if na == 0 and nb == 0:
        continue
    added = '\n'.join(b[b0:b1])
    removed = '\n'.join(a[a0:a1])
    tags = [t for t, pat in TAGS if re.search(pat, added + '\n' + removed, re.M)]
    first = next((l.strip()[:100] for l in b[b0:b1] if l.strip()), '')
    rows.append({'gap': n, 'old': [a0, a1], 'cur': [b0, b1], 'removed': na, 'added': nb,
                 'tags': tags, 'first': first,
                 'ctx_before': a[a0 - 1].strip()[:100] if a0 > 0 else '',
                 'ctx_after': a[a1].strip()[:100] if a1 < len(a) else ''})

rows.sort(key=lambda r: -r['added'])
with io.open(os.path.join(OUT, 'gap_index.md'), 'w', encoding='utf-8') as w:
    w.write('# 106 delta gaps: OLD(base) -> CUR(v1.04)\n\n')
    w.write('total removed %d, added %d\n\n' % (sum(r['removed'] for r in rows), sum(r['added'] for r in rows)))
    w.write('| # | OLD lines | CUR lines | - | + | tags | first added line |\n|--:|--:|--:|--:|--:|---|---|\n')
    for r in rows:
        w.write('| %d | %d-%d | %d-%d | %d | %d | %s | %s |\n' % (
            r['gap'], r['old'][0] + 1, r['old'][1], r['cur'][0] + 1, r['cur'][1],
            r['removed'], r['added'], ','.join(r['tags']), r['first'].replace('|', '\\|')[:90]))

tagcount = collections.Counter()
for r in rows:
    for t in r['tags']:
        tagcount[t] += r['added']
print('gaps %d ; removed %d ; added %d' % (len(rows), sum(r['removed'] for r in rows), sum(r['added'] for r in rows)))
for t, c in tagcount.most_common():
    print('  %-20s %5d added lines' % (t, c))
print()
print('top 12 gaps:')
for r in rows[:12]:
    print('  gap %3d  OLD %6d  +%-5d  %s' % (r['gap'], r['old'][0] + 1, r['added'], ','.join(r['tags'])[:40]))
