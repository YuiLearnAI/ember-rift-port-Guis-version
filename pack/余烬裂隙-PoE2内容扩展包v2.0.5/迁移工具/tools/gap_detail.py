import io, json, os, re, collections

OUT = r"D:\xyx\.dsh-work\port\out"
PKG = r"D:\xyx\余烬裂隙-PoE2内容扩展包v1.0.4"
OLD = os.path.join(PKG, r'基础版本\旧魔改基础版\【魔改】基于憨憨问号魔改的魔改，低卡，技能特效音效重置，提供地图强度设置，无尽模式.html')
CUR = os.path.join(PKG, r'余烬裂隙-异界内容扩展.html')

old = io.open(OLD, encoding='utf-8', errors='replace').read().split('\n')
cur = io.open(CUR, encoding='utf-8', errors='replace').read().split('\n')
d = json.load(io.open(os.path.join(OUT, 'delta_OLD_CUR.json'), encoding='utf-8'))
gaps = d['gaps']

# feature signatures: (name, regex on added+removed text, weight)
SIG = [
    ('abyss', r'Abyss|abyss|abyss_|abysswalker|abysslich|巨坑|裂隙魔|巫妖血脉|ABMODS'),
    ('desecration', r'\bDs[A-Z]\w|dsec|渎灵|遗存骨|bone_|灵魂之井|\bds_'),
    ('omen', r'\bOm[A-Z]\w|\bomen|预兆|OmTake|OmHas|omen_'),
    ('exchange', r'\bEx[A-Z]\w|\bqh\b|兑换|exGo|exAmt|ExCalc'),
    ('delirium', r'\bDel[A-Z]\w|Delirium|迷雾|裂片|Simulacrum|\bSim[A-Z]\w|拟像'),
    ('ritual', r'\bRit\w|Ritual|祭坛|驱灵|贡品|恩典'),
    ('atlas', r'Atlas|图谱|atlas'),
    ('unique', r'Oe\[|\bOe\.play|headhunter|mageblood|kaoms|temporalis|rathpith|时空之肌|暗金|UniqueResCap'),
    ('vfx', r'\bw\("|\bR\(|fx|sfx|vfx|particle|特效|音效'),
    ('i18n', r'p1\s*=|Object\.assign\(p1|翻译'),
    ('css', r'^\s*[.#][\w\-\.\s,:>]+\{'),
    ('ui', r'ovbox|panel|curbar|#cur|sidebar|hud|HUD|背包|通货|悬浮|tooltip'),
    ('hotfix', r'HOTFIX|hotfix'),
    ('item/mods', r'ue\(|Ct\[|zn\.push|dsec|affix|词缀'),
    ('mapgen', r'o\.Z\.M|rooms|Tt\(|mapIntensity|地图强度'),
    ('combat', r'crit|noCrit|dmg|伤害|leech|偷取'),
]

rows = []
for n, (a0, a1, b0, b1) in enumerate(gaps):
    if a0 == a1 and b0 == b1:
        continue
    added = cur[b0:b1]
    removed = old[a0:a1]
    txt = '\n'.join(added) + '\n' + '\n'.join(removed)
    scores = []
    for name, pat in SIG:
        c = len(re.findall(pat, txt))
        if c:
            scores.append((c, name))
    scores.sort(reverse=True)
    rows.append({'gap': n, 'old': [a0, a1], 'cur': [b0, b1], 'removed': a1 - a0, 'added': b1 - b0,
                 'scores': scores[:4],
                 'first_added': next((l.rstrip()[:150] for l in added if l.strip()), ''),
                 'last_added': next((l.rstrip()[:150] for l in reversed(added) if l.strip()), ''),
                 'old_ctx3': [l.rstrip()[:130] for l in old[max(0, a0 - 3):a0]]})

rows.sort(key=lambda r: r['old'][0])
with io.open(os.path.join(OUT, 'gap_detail.md'), 'w', encoding='utf-8') as w:
    w.write('# gap 明细（按 OLD 行号排序）\n\n')
    for r in rows:
        w.write('\n### gap %d  OLD %d..%d  CUR %d..%d  (-%d +%d)\n' % (
            r['gap'], r['old'][0] + 1, r['old'][1], r['cur'][0] + 1, r['cur'][1], r['removed'], r['added']))
        w.write('scores: %s\n' % ', '.join('%s:%d' % (n, c) for c, n in r['scores']))
        for l in r['old_ctx3']:
            w.write('  ctx| ' + l + '\n')
        w.write('  + ' + r['first_added'] + '\n')
        if r['added'] > 1:
            w.write('  ...\n  + ' + r['last_added'] + '\n')

# feature coverage totals
feat = collections.Counter()
featlines = collections.Counter()
for r in rows:
    top = r['scores'][0][1] if r['scores'] else 'other'
    feat[top] += 1
    featlines[top] += r['added']
print('%-16s %5s %8s' % ('feature', 'gaps', 'added-lines'))
for k, v in featlines.most_common():
    print('%-16s %5d %8d' % (k, feat[k], v))
print()
print('gaps with no feature score:', sum(1 for r in rows if not r['scores']))
