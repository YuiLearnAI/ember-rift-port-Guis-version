# 归档当前版本（热修补丁 + 旧发布版）
# 用法：双击根目录「归档版本.bat」，或
#   powershell -NoProfile -ExecutionPolicy Bypass -File "迁移工具\归档当前版本.ps1"
# 做两件事：
#   1. 把当前 version.json 对应版本的 hotfix.json / hotfix-advanced.js / 更新说明
#      快照到 热修补丁\v<版本>\
#   2. 把根目录里其它版本的发布 html 移到 旧版发布\
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $root

$ver = (Get-Content -LiteralPath 'version.json' -Raw -Encoding UTF8 | ConvertFrom-Json).version
if ([string]::IsNullOrWhiteSpace($ver)) { throw 'version.json 里没有 version' }

# 1) 热修快照
$dst = Join-Path $root ("热修补丁\v" + $ver)
New-Item -ItemType Directory -Force -Path $dst | Out-Null
Copy-Item -LiteralPath 'hotfix.json' -Destination (Join-Path $dst 'hotfix.json') -Force
Copy-Item -LiteralPath 'hotfix-advanced.js' -Destination (Join-Path $dst 'hotfix-advanced.js') -Force
$note = Join-Path $root ("更新公告\v" + $ver + "说明.md")
if (Test-Path -LiteralPath $note) {
  Copy-Item -LiteralPath $note -Destination (Join-Path $dst '说明.md') -Force
}
Write-Host ('[归档] 热修快照 -> 热修补丁\v' + $ver)

# 2) 旧发布 html -> 旧版发布
$oldDir = Join-Path $root '旧版发布'
New-Item -ItemType Directory -Force -Path $oldDir | Out-Null
$curName = '余烬裂隙-异界内容扩展-v' + $ver + '.html'
$moved = 0
Get-ChildItem -LiteralPath $root -Filter '余烬裂隙-异界内容扩展-v*.html' |
  Where-Object { $_.Name -ne $curName } |
  ForEach-Object {
    $target = Join-Path $oldDir $_.Name
    Move-Item -LiteralPath $_.FullName -Destination $target -Force
    Write-Host ('[归档] 旧发布 -> 旧版发布\' + $_.Name)
    $moved++
  }
if ($moved -eq 0) { Write-Host '[归档] 没有需要移动的旧发布 html' }
Write-Host ('[归档] 完成。当前版本：' + $ver)
