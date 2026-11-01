import io, json, os, sys
OUT = r"D:\xyx\.dsh-work\port\out"
base = json.load(io.open(os.path.join(OUT, 'symbol_map_high.json'), encoding='utf-8'))
final = {'version': 1, 'globals': dict(base['globals']), 'unresolved': base.get('unresolved', []), 'sources': ['symbol_map_high.json']}
for name in ('cluster_map.json', 'symbol_patch_lead.json', 'symbol_patch.json'):
    p = os.path.join(OUT, name)
    if not os.path.exists(p):
        continue
    d = json.load(io.open(p, encoding='utf-8'))
    for k, v in (d.get('resolved') or {}).items():
        prev = final['globals'].get(k)
        if prev and prev.get('confidence') == 'high' and name == 'cluster_map.json':
            continue          # 已有高置信映射不覆盖
        final['globals'][k] = {'new': v['new'], 'kind': v.get('kind', 'unknown'),
                               'evidence': v.get('evidence', ''), 'confidence': v.get('confidence', 'high'),
                               'method': 'patch:' + name.replace('.json', '')}
    final['sources'].append(name)
    if d.get('missing_in_new'):
        final.setdefault('missing_in_new', {}).update(d['missing_in_new'])
# 可用的置信度：high 全部采用；medium 里"被 patch 覆盖"的按 patch 为准
sel = {k: v for k, v in final['globals'].items() if v.get('confidence') == 'high'}
io.open(os.path.join(OUT, 'symbol_map_final.json'), 'w', encoding='utf-8').write(json.dumps({'version': 1, 'globals': sel, 'sources': final['sources']}, ensure_ascii=False, indent=1))
print('final map globals:', len(sel), 'sources:', final['sources'])
