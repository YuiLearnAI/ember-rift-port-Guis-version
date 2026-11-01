import io, os, re, sys

OUT = r"D:\xyx\.dsh-work\port\out"
PKG = r"D:\xyx\余烬裂隙-PoE2内容扩展包v1.0.4"
FILES = {
    'old': os.path.join(PKG, r'基础版本\旧魔改基础版\【魔改】基于憨憨问号魔改的魔改，低卡，技能特效音效重置，提供地图强度设置，无尽模式.html'),
    'cur': os.path.join(PKG, r'余烬裂隙-异界内容扩展.html'),
    'new': os.path.join(PKG, r'基础版本\憨憨问号v0.4-18.0.1\[改版]余烬裂隙 憨憨问号 v0.4更好的体验18.0.1.html'),
}
os.makedirs(OUT, exist_ok=True)

tagre = re.compile(r'<script\b[^>]*>', re.I)
closere = re.compile(r'</script\s*>', re.I)
srcre = re.compile(r'\bsrc\s*=', re.I)

for key, path in FILES.items():
    s = io.open(path, encoding='utf-8', errors='replace').read()
    blocks = []
    pos = 0
    while True:
        m = tagre.search(s, pos)
        if not m:
            break
        c = closere.search(s, m.end())
        if not c:
            break
        open_tag = m.group(0)
        code = s[m.end():c.start()]
        blocks.append({'inline': not srcre.search(open_tag), 'len': len(code), 'start_line': s.count('\n', 0, m.end()) + 1, 'code': code})
        pos = c.end()
    inline = [b for b in blocks if b['inline']]
    print('%s: %d script blocks, %d inline' % (key, len(blocks), len(inline)))
    for i, b in enumerate(inline):
        print('   inline[%d] %8d chars  starts html line %d' % (i, b['len'], b['start_line']))
    # write the largest inline block as the main script
    if inline:
        main = max(inline, key=lambda b: b['len'])
        p = os.path.join(OUT, key + '.js')
        io.open(p, 'w', encoding='utf-8').write(main['code'])
        print('   -> wrote %s (%d chars, %d lines)' % (p, main['len'], main['code'].count('\n') + 1))
