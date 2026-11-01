# 热修数据体检：hotfix.json / hotfix-data.js / version.json 一致性
import io, json, os, re, sys
root = sys.argv[1] if len(sys.argv) > 1 else os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
root = os.path.abspath(root)
fail = []
def rd(p, enc='utf-8'):
    return io.open(os.path.join(root, p), encoding=enc).read()
try:
    hj = json.loads(rd('hotfix.json'))
except Exception as e:
    print('HOTFIX JSON 解析失败:', e); sys.exit(1)
ver = json.loads(rd('version.json')).get('version')
if hj.get('version') != ver: fail.append('hotfix.json 版本 %r != version.json %r' % (hj.get('version'), ver))
if not isinstance(hj.get('bal'), dict): fail.append('缺少 bal 节点')
else:
    def walk(o, path='bal'):
        if isinstance(o, dict):
            for k, v in o.items(): walk(v, path + '.' + str(k))
        elif isinstance(o, list):
            for i, v in enumerate(o): walk(v, '%s[%d]' % (path, i))
        elif isinstance(o, bool): pass
        elif isinstance(o, (int, float)):
            if o != o or o in (float('inf'), float('-inf')): fail.append('非法数值 %s=%r' % (path, o))
        else: fail.append('非法类型 %s=%r' % (path, o))
    walk(hj['bal'])
try:
    data = rd('hotfix-data.js')
    if 'window.HOTFIX' not in data: fail.append('hotfix-data.js 未包含 window.HOTFIX（先运行「应用热修.bat」）')
    elif ver not in data: fail.append('hotfix-data.js 版本未同步到 %s' % ver)
except FileNotFoundError:
    fail.append('缺少 hotfix-data.js')
print('version.json: %s' % ver)
print('hotfix.json: version=%s notes=%s' % (hj.get('version'), (hj.get('notes') or '')[:40]))
if fail:
    print('FAIL:'); [print('  - ' + f) for f in fail]; sys.exit(1)
print('RESULT: ALL PASS（热修数据一致）'); 
