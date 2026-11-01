chcp 65001 > $null
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
$ErrorActionPreference = 'Continue'
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$tools = Join-Path $root '迁移工具\tools'
$node = 'C:\Users\33266\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\node\bin\node.exe'
if (!(Test-Path $node)) { $node = 'node' }
$py = 'C:\\Users\\33266\\.dsh\\dsh-runtimes\\dsh-primary-runtime\\dependencies\\python\\python.exe'
if (!(Test-Path $py)) { $py = 'python' }
$ver = (Get-Content -LiteralPath (Join-Path $root 'version.json') -Raw -Encoding UTF8 | ConvertFrom-Json).version
$rel = Join-Path $root ('余烬裂隙-异界内容扩展-v' + $ver + '.html')
if (!(Test-Path -LiteralPath $rel)) { Write-Host ('[检查] 找不到发布版 ' + $rel); exit 1 }
$testBuild = Join-Path $root '迁移工具\test-build.html'
$reportDir = Join-Path $root '..\余烬裂隙-归档资料\发布检查'
if (!(Test-Path $reportDir)) { New-Item -ItemType Directory -Path $reportDir | Out-Null }
$report = Join-Path $reportDir ('v' + $ver + '-检查报告.md')
$script:lines = @('# v' + $ver + ' 发布前检查报告', '', ('生成时间: ' + (Get-Date -Format 'yyyy-MM-dd HH:mm:ss')), '', ('发布文件: ' + (Split-Path -Leaf $rel)), '')
function Step($name, $arglist, $exe) {
  if (-not $exe) { $exe = $node }
  Write-Host ('[检查] ' + $name + ' ...')
  $out = & $exe @arglist 2>&1 | Out-String
  $code = $LASTEXITCODE
  $script:lines += "## $name"; $script:lines += ''; $script:lines += '```'
  $script:lines += (($out.Trim() -split "`n" | Select-Object -Last 22) -join "`n")
  $script:lines += '```'
  $script:lines += ('结果: ' + $(if ($code -eq 0) { '通过' } else { '**失败**' })); $script:lines += ''
  return $code
}
$fail = 0
$fail += (Step -name '1. 主脚本语法编译' -exe $node -arglist @((Join-Path $tools 'syntax.mjs'), $rel))
$fail += (Step -name '2. jsdom 引导（标题→选角→藏身处→300帧）' -exe $node -arglist @((Join-Path $tools 'boot.cjs'), $rel))
$fail += (Step -name '3. UI 巡览（各面板 + 移动）' -exe $node -arglist @((Join-Path $tools 'ui_tour.cjs'), $rel))
if (Test-Path -LiteralPath $testBuild) { $fail += (Step -name '4. 玩法回归（全量断言）' -exe $node -arglist @((Join-Path $tools 'harness_port.cjs'), $testBuild)) }
else { $script:lines += "## 4. 玩法回归`n`n跳过：缺少 迁移工具\test-build.html`n" }
$script:lines += '---'; $script:lines += ''
$script:lines += ('总体: ' + $(if ($fail -eq 0) { '**全部通过**' } else { '**有 ' + $fail + ' 项失败**' }))
$script:lines | Out-File -LiteralPath $report -Encoding UTF8
Write-Host ('[检查] 报告: ' + $report)
exit $(if ($fail -eq 0) { 0 } else { 1 })
