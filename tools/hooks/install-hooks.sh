#!/usr/bin/env bash
# 安装仓库级 Git 钩子（不做全局污染，不依赖 husky）
set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel)"
HOOKS_DIR="$REPO_ROOT/.git/hooks"
SRC_DIR="$REPO_ROOT/tools/hooks"

mkdir -p "$HOOKS_DIR"

install_hook () {
  local name="$1"
  cp "$SRC_DIR/$name" "$HOOKS_DIR/$name"
  chmod +x "$HOOKS_DIR/$name"
  echo "✅ 已安装 $name → .git/hooks/$name"
}

install_hook commit-msg

echo
echo "钩子已生效。规范见 docs/jira-delivery.md"
echo "自检：在当前分支执行一次不合规的提交信息，应被拦截。"
echo "绕过（不推荐）：git commit --no-verify"
