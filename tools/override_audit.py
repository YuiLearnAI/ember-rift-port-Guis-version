import re,json,sys

online=open('/tmp/er/online.js',encoding='utf-8',errors='replace').read()
old=open('pack/余烬裂隙-PoE2内容扩展包v2.0.5/迁移工具/out/new.js',encoding='utf-8',errors='replace').read()
block=open('build/block_v19.js',encoding='utf-8',errors='replace').read()
smap=json.load(open('out/symbol_map_18to19.json',encoding='utf-8'))['globals']
rev={v['new']:k for k,v in smap.items() if v.get('new')}

def body_of(src,name):
    # function name(...){...}  or  name=function(...){...}
    for pat in [r'function\s+'+re.escape(name)+r'\s*\(', r'\b'+re.escape(name)+r'\s*=\s*function\s*\(']:
        m=re.search(pat,src)
        if not m: continue
        i=src.find('{',m.end())
        if i<0: continue
        d=0
        for j in range(i,len(src)):
            c=src[j]
            if c=='{': d+=1
            elif c=='}':
                d-=1
                if d==0: return src[m.start():j+1]
    return None

# 找出 block 里所有顶层覆盖
names=sorted(set(re.findall(r'^([A-Za-z_$][\w$]*)\s*=\s*function',block,re.M)))
print("overridden symbols:",len(names))
risky=[]
for n in names:
    ob=body_of(online,n)
    on=rev.get(n)
    nb=body_of(old,on) if on else None
    if ob is None: 
        risky.append((n,on,None,'v19 body not found',0,0)); continue
    L1=len(ob); L2=len(nb) if nb else 0
    # v19 比 18.0.3 版明显更长 → 官方加了逻辑，被覆盖会丢
    if nb and L1 > L2*1.12 and L1-L2>120:
        risky.append((n,on,L2,'v19 longer',L1,L2))
print("\n高风 suspicious overrides (v19 版明显更长):")
for r in risky: print("  ",r)
print("\ncount:",len(risky))
