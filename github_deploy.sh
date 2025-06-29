#!/bin/bash

# GitHub 部署脚本
# HK-Stablecoin Watch 项目

echo "🚀 开始部署 HK-Stablecoin Watch 到 GitHub..."

# 检查项目是否已构建
if [ ! -d "build" ]; then
    echo "📦 构建项目..."
    npm run build
fi

# 显示当前状态
echo "📋 当前 Git 状态:"
git status

# 检查远程仓库
echo "🔗 当前远程仓库:"
git remote -v

echo ""
echo "⚠️  如果推送失败，请确保您的 GitHub 个人访问令牌有以下权限:"
echo "   - repo (完整仓库访问权限)"
echo "   - workflow (如果使用 GitHub Actions)"
echo ""
echo "🔑 GitHub 令牌权限检查:"
echo "   请访问: https://github.com/settings/tokens"
echo "   确保令牌包含 'repo' 权限范围"
echo ""

# 尝试推送
echo "📤 尝试推送到 GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo "✅ 成功推送到 GitHub!"
    echo "🌐 您的项目现在可以在以下地址访问:"
    echo "   https://github.com/Svanik-yan/hk-stablecoin-watch"
    echo ""
    echo "🚀 建议接下来的步骤:"
    echo "   1. 在 GitHub 上启用 GitHub Pages"
    echo "   2. 或者部署到 Vercel: vercel --prod"
    echo "   3. 设置域名（如果需要）"
else
    echo "❌ 推送失败。可能的解决方案:"
    echo ""
    echo "1. 使用 SSH 方式："
    echo "   git remote set-url origin git@github.com:Svanik-yan/hk-stablecoin-watch.git"
    echo "   git push -u origin main"
    echo ""
    echo "2. 重新生成 GitHub 令牌："
    echo "   - 访问 https://github.com/settings/tokens"
    echo "   - 生成新的 classic token"
    echo "   - 确保选择 'repo' 权限"
    echo "   - 使用新令牌更新远程URL"
    echo ""
    echo "3. 使用 GitHub CLI："
    echo "   gh auth login"
    echo "   git push -u origin main"
    echo ""
    echo "4. 手动上传："
    echo "   - 在 GitHub 网页界面直接上传文件"
    echo "   - 或使用 GitHub Desktop 应用"
fi

echo ""
echo "📊 项目统计:"
echo "   - 构建大小: $(du -sh build 2>/dev/null | cut -f1 || echo "未构建")"
echo "   - 源代码行数: $(find src -name "*.js" -o -name "*.tsx" -o -name "*.css" | xargs wc -l 2>/dev/null | tail -1 | awk '{print $1}' || echo "未知")"
echo "   - 依赖包数量: $(npm list --depth=0 2>/dev/null | grep -c "├── \|└──" || echo "未知")" 