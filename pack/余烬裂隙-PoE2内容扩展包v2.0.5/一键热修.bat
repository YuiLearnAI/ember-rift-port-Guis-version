@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ==========================================
echo    余烬裂隙 - 一键热修
echo ==========================================
echo 正在读取 迁移工具\hotfix\hotfix.json ...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0迁移工具\tools\apply_hotfix.ps1"
if errorlevel 1 (
  echo.
  echo [热修] 失败，请查看上面的错误信息。
  pause
  exit /b 1
)
echo.
echo [热修] 完成，已自动打开最新发布版。
timeout /t 2 >nul
exit /b 0
