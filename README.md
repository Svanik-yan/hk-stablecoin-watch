# 香港稳定币独立观察站 | HK-Stablecoin Watch

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/hk-stablecoin-watch)
[![Live Demo](https://img.shields.io/badge/Live-Demo-blue?style=for-the-badge)](https://hk-stablecoin-watch.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> **"不信任，去验证"** - 多稳定币储备透明度监控平台  
> **"Don't Trust, Verify"** - Multi-Stablecoin Reserve Transparency Monitoring Platform

## 🎯 项目简介

香港稳定币独立观察站是一个完全独立的第三方Web应用，致力于为公众、投资者和监管机构提供简单直接的工具，用以**验证**稳定币发行人关于其储备金的公开声明。

### 核心价值主张
- 🔍 **透明验证** - 基于"不信任，去验证"原则
- ⚡ **实时监控** - 多稳定币储备状况实时追踪  
- 🚨 **智能警报** - 可配置的抵押率预警系统
- 📊 **数据可视化** - 历史趋势分析和图表展示
- 🌐 **多语言** - 支持中文和英文界面

## 🚀 功能特性

### 📈 多稳定币监控
- **TUSD** (TrueUSD) - 集成Chainlink Proof of Reserve
- **USDC** (USD Coin) - Circle透明度报告监控
- **USDP** (Pax Dollar) - Paxos储备证明追踪

### 🔔 智能警报系统
- 可配置抵押率阈值（95%-100%）
- 实时监控和自动检测
- 浏览器推送通知
- 警报历史记录和严重程度分级

### 📊 数据分析
- 30天历史抵押率趋势
- 实时供应量和储备金对比
- 智能合约健康状况检查
- 管理员权限地址透明度

### 🎨 现代化界面
- 玻璃拟态设计风格 (Glassmorphism)
- 响应式布局，适配各种设备
- 流畅的交互动画和视觉反馈
- 无障碍性设计支持

## 🛠️ 技术栈

### 前端技术
- **React 18** - 现代化前端框架
- **Tailwind CSS** - 原子化CSS框架
- **Lucide React** - 现代图标库
- **Recharts** - 数据可视化图表库

### 区块链集成
- **Ethereum Mainnet** - 主要数据来源
- **Chainlink Oracle Network** - 储备证明数据
- **Etherscan API** - 合约数据获取
- **Web3 Integration** - 钱包连接支持

### 部署和运维
- **Vercel** - 静态网站托管
- **GitHub Actions** - CI/CD自动化
- **Vercel Analytics** - 性能监控

## 🚀 快速开始

### 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装和运行

```bash
# 克隆项目
git clone https://github.com/YOUR_USERNAME/hk-stablecoin-watch.git
cd hk-stablecoin-watch

# 安装依赖
npm install

# 启动开发服务器
npm start

# 构建生产版本
npm run build

# 运行测试
npm test
```

### 环境变量配置（可选）

创建 `.env.local` 文件：

```bash
REACT_APP_ETHERSCAN_API_KEY=your_etherscan_api_key
REACT_APP_INFURA_PROJECT_ID=your_infura_project_id
REACT_APP_ALCHEMY_API_KEY=your_alchemy_api_key
REACT_APP_ENV=development
```

## 📦 部署指南

### Vercel 一键部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/hk-stablecoin-watch)

### 手动部署到 Vercel

1. Fork 此仓库到你的 GitHub 账号
2. 在 [Vercel](https://vercel.com) 上连接你的 GitHub 账号
3. 导入项目并配置以下设置：
   ```
   Framework Preset: Create React App
   Build Command: npm run build
   Output Directory: build
   Install Command: npm install
   ```
4. 部署完成！

### 自定义域名

在 Vercel 控制台配置自定义域名：
1. 进入项目设置 → Domains
2. 添加你的域名
3. 配置 DNS 记录指向 Vercel

## 🤝 贡献指南

我们欢迎所有形式的贡献！

### 如何贡献

1. **Fork** 这个仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 **Pull Request**

### 开发规范

- 遵循现有的代码风格
- 为新功能添加适当的测试
- 更新相关文档
- 确保所有测试通过

## 📊 项目结构

```
hk-stablecoin-watch/
├── public/                 # 静态资源
│   ├── index.html         # HTML模板
│   ├── manifest.json      # PWA配置
│   └── favicon.ico        # 网站图标
├── src/                   # 源代码
│   ├── App.js            # 主应用组件
│   ├── index.js          # 应用入口
│   ├── index.css         # 全局样式
│   └── reportWebVitals.js # 性能监控
├── package.json          # 项目配置
├── vercel.json           # Vercel部署配置
└── README.md             # 项目文档
```

## 🔒 数据来源和安全性

### 数据透明度
- **链上数据** - 直接从公共区块链读取
- **储备证明** - 基于Chainlink等去中心化预言机
- **审计报告** - 来自第三方独立审计机构
- **开源验证** - 所有数据源可公开验证

### 安全措施
- 所有数据来源于公开API
- 不收集或存储用户个人数据
- 实施内容安全策略(CSP)
- 定期安全依赖更新

## 📈 路线图

### 近期计划 (Q1 2025)
- [ ] 添加更多稳定币支持 (DAI, FRAX, etc.)
- [ ] 集成实时Chainlink Price Feeds
- [ ] 增加移动端PWA功能
- [ ] 添加数据导出功能

### 中期计划 (Q2-Q3 2025)
- [ ] 支持多链稳定币监控
- [ ] 添加DeFi协议集成
- [ ] 实现高级图表分析
- [ ] 社区治理功能

### 长期愿景 (Q4 2025+)
- [ ] 成为行业标准透明度工具
- [ ] 支持监管合规报告
- [ ] 建立开放API生态
- [ ] 多语言国际化支持

## 📄 许可证

本项目基于 [MIT License](https://opensource.org/licenses/MIT) 开源协议。

## 🙏 致谢

- [Chainlink](https://chain.link/) - 提供去中心化预言机基础设施
- [Etherscan](https://etherscan.io/) - 以太坊区块链数据API
- [React](https://reactjs.org/) - 前端框架
- [Tailwind CSS](https://tailwindcss.com/) - CSS框架
- [Vercel](https://vercel.com/) - 托管和部署平台

## 📞 联系我们

- **项目主页**: https://hk-stablecoin-watch.vercel.app
- **GitHub Issues**: [提交问题](https://github.com/YOUR_USERNAME/hk-stablecoin-watch/issues)
- **讨论区**: [GitHub Discussions](https://github.com/YOUR_USERNAME/hk-stablecoin-watch/discussions)

---

**免责声明**: 本平台为独立第三方工具，所有数据来源于公开区块链和预言机网络。投资有风险，请谨慎决策。