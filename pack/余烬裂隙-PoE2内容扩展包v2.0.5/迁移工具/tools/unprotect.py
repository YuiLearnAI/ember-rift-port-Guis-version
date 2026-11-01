import io, re, sys
p = sys.argv[1]
s = io.open(p, encoding='utf-8').read()
n = len(re.findall(r'__RG_', s))
s = re.sub(r'__RG_([A-Za-z_$][\w$]*)', r'\1', s)
io.open(p, 'w', encoding='utf-8', newline='').write(s)
print('unprotect: restored', n, 'tokens')
