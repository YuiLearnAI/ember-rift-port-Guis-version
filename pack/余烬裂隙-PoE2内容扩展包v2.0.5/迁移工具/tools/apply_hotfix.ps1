$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
Set-Location $root

$hotfixDir = Join-Path $root "迁移工具\hotfix"
$jsonPath = Join-Path $hotfixDir "hotfix.json"
if (-not (Test-Path -LiteralPath $jsonPath)) { throw "找不到 hotfix.json" }

$backupDir = Join-Path $hotfixDir "hotfix-backup"
if (-not (Test-Path -LiteralPath $backupDir)) { New-Item -ItemType Directory -Path $backupDir | Out-Null }
$ts = Get-Date -Format "yyyyMMdd-HHmmss"

$json = Get-Content -LiteralPath $jsonPath -Raw -Encoding UTF8
$js = "window.HOTFIX = " + $json + ";"
$advPath = Join-Path $hotfixDir "hotfix-advanced.js"
if (Test-Path -LiteralPath $advPath) { $js += [Environment]::NewLine + (Get-Content -LiteralPath $advPath -Raw -Encoding UTF8) }
$dataPath = Join-Path $hotfixDir "hotfix-data.js"
if (Test-Path -LiteralPath $dataPath) { Copy-Item -LiteralPath $dataPath -Destination (Join-Path $backupDir ("hotfix-data-" + $ts + ".js")) -Force }
[IO.File]::WriteAllText($dataPath, $js, (New-Object Text.UTF8Encoding($false)))
Write-Host "[热修] 已生成 hotfix-data.js"

$rel = Get-ChildItem -LiteralPath $root -Filter "余烬裂隙-异界内容扩展-v*.html" | Sort-Object LastWriteTime -Descending | Select-Object -First 1
if (-not $rel) { throw "找不到发布版 HTML" }
$p = $rel.FullName
$bak = Join-Path $backupDir ($rel.BaseName + "-" + $ts + ".html")
Copy-Item -LiteralPath $p -Destination $bak -Force

$html = [IO.File]::ReadAllText($p, [Text.Encoding]::UTF8)
if ($html -notmatch "HOTFIX-BEGIN") { throw "这个发布版没有热修标记，请先运行一次 迁移工具\build\build.mjs 重新构建" }
$block = "<!-- HOTFIX-BEGIN -->" + [Environment]::NewLine + "<script>" + [Environment]::NewLine + $js + [Environment]::NewLine + "</script>" + [Environment]::NewLine + "<!-- HOTFIX-END -->"
$newHtml = [Text.RegularExpressions.Regex]::Replace($html, "(?s)<!-- HOTFIX-BEGIN -->.*?<!-- HOTFIX-END -->", $block)
[IO.File]::WriteAllText($p, $newHtml, (New-Object Text.UTF8Encoding($false)))
Write-Host "[热修] 已更新: $p"
Write-Host "[热修] 备份: $bak"

Start-Process -FilePath $p
Write-Host "[热修] 完成，已打开游戏"
