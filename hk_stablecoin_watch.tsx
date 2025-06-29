import React, { useState, useEffect } from 'react';
import { 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  ExternalLink, 
  Pause, 
  Play, 
  Shield, 
  TrendingUp, 
  RefreshCw, 
  Eye, 
  Activity, 
  Database, 
  Bell, 
  BarChart3, 
  Settings 
} from 'lucide-react';

const HKStablecoinWatch = () => {
  const [selectedCoin, setSelectedCoin] = useState('TUSD');
  const [alertSettings, setAlertSettings] = useState({
    enabled: true,
    threshold: 99.5,
    notifications: []
  });
  const [activeTab, setActiveTab] = useState('overview');
  
  const [data, setData] = useState({
    TUSD: {
      supply: 0,
      reserves: 0,
      collateralizationRatio: 0,
      lastUpdated: null,
      isPaused: false,
      adminAddresses: [],
      loading: true,
      error: null,
      isRefreshing: false,
      historicalData: []
    },
    USDC: {
      supply: 0,
      reserves: 0,
      collateralizationRatio: 0,
      lastUpdated: null,
      isPaused: false,
      adminAddresses: [],
      loading: true,
      error: null,
      isRefreshing: false,
      historicalData: []
    },
    USDP: {
      supply: 0,
      reserves: 0,
      collateralizationRatio: 0,
      lastUpdated: null,
      isPaused: false,
      adminAddresses: [],
      loading: true,
      error: null,
      isRefreshing: false,
      historicalData: []
    }
  });

  const [language, setLanguage] = useState('zh');

  // 稳定币配置
  const stablecoins = {
    TUSD: {
      name: 'TrueUSD',
      symbol: 'TUSD',
      contractAddress: '0x0000000000085d4780B73119b644AE5ecd22b376',
      chainlinkPor: 'tusd-reserves.data.eth',
      color: 'blue',
      status: 'active'
    },
    USDC: {
      name: 'USD Coin',
      symbol: 'USDC',
      contractAddress: '0xA0b86a33E6441b83A9b971cBAED89E1748D6e1A5',
      chainlinkPor: 'usdc-reserves.data.eth',
      color: 'indigo',
      status: 'active'
    },
    USDP: {
      name: 'Pax Dollar',
      symbol: 'USDP',
      contractAddress: '0x8e870d67f660d95d5be530380d0ec0bd388289e1',
      chainlinkPor: 'usdp-reserves.data.eth',
      color: 'emerald',
      status: 'active'
    }
  };

  // 生成历史数据
  const generateHistoricalData = (baseRatio = 100.2) => {
    const dataPoints = [];
    const now = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const ratio = baseRatio + (Math.random() - 0.5) * 0.8;
      const supply = 316000000 + (Math.random() - 0.5) * 10000000;
      const reserves = supply * (ratio / 100);
      
      dataPoints.push({
        date: date.toISOString().split('T')[0],
        timestamp: date.getTime(),
        collateralizationRatio: Number(ratio.toFixed(3)),
        supply: Number(supply.toFixed(2)),
        reserves: Number(reserves.toFixed(2)),
        dateLabel: date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
      });
    }
    
    return dataPoints;
  };

  // 检查警报条件
  const checkAlerts = (coinData, coinSymbol) => {
    if (!alertSettings.enabled) return;
    
    const ratio = coinData.collateralizationRatio;
    const threshold = alertSettings.threshold;
    
    if (ratio < threshold) {
      const alert = {
        id: Date.now(),
        timestamp: new Date(),
        coin: coinSymbol,
        type: 'low_collateral',
        message: `${coinSymbol} 抵押率 ${ratio.toFixed(2)}% 低于阈值 ${threshold}%`,
        severity: ratio < 99 ? 'critical' : 'warning'
      };
      
      setAlertSettings(prev => ({
        ...prev,
        notifications: [alert, ...prev.notifications.slice(0, 9)]
      }));
      
      // 浏览器通知
      if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
        new Notification(`${coinSymbol} 储备警报`, {
          body: alert.message
        });
      }
    }
  };

  // 获取稳定币数据
  const fetchStablecoinData = async (coinSymbol) => {
    try {
      setData(prev => ({
        ...prev,
        [coinSymbol]: { ...prev[coinSymbol], isRefreshing: true, error: null }
      }));

      const mockData = {
        TUSD: {
          supply: 316126540.95 + (Math.random() - 0.5) * 1000000,
          baseRatio: 100.22
        },
        USDC: {
          supply: 25000000000 + (Math.random() - 0.5) * 100000000,
          baseRatio: 100.05
        },
        USDP: {
          supply: 950000000 + (Math.random() - 0.5) * 5000000,
          baseRatio: 100.08
        }
      };

      const coinMockData = mockData[coinSymbol];
      const ratio = coinMockData.baseRatio + (Math.random() - 0.5) * 0.3;
      const reserves = coinMockData.supply * (ratio / 100);
      
      const historicalData = data[coinSymbol].historicalData.length === 0 
        ? generateHistoricalData(coinMockData.baseRatio)
        : data[coinSymbol].historicalData;

      const newData = {
        supply: coinMockData.supply,
        reserves,
        collateralizationRatio: ratio,
        lastUpdated: new Date(),
        isPaused: false,
        adminAddresses: [
          '0x1234567890123456789012345678901234567890',
          '0x9876543210987654321098765432109876543210'
        ],
        loading: false,
        error: null,
        isRefreshing: false,
        historicalData
      };

      setData(prev => ({
        ...prev,
        [coinSymbol]: newData
      }));

      checkAlerts(newData, coinSymbol);
      
    } catch (error) {
      console.error(`获取${coinSymbol}数据失败:`, error);
      
      setData(prev => ({
        ...prev,
        [coinSymbol]: {
          ...prev[coinSymbol],
          loading: false,
          isRefreshing: false,
          error: `${coinSymbol}数据获取失败: ${error.message}`
        }
      }));
    }
  };

  const handleRefreshAll = () => {
    Object.keys(stablecoins).forEach(coin => {
      if (stablecoins[coin].status === 'active') {
        fetchStablecoinData(coin);
      }
    });
  };

  const clearNotifications = () => {
    setAlertSettings(prev => ({
      ...prev,
      notifications: []
    }));
  };

  const requestNotificationPermission = async () => {
    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  };

  useEffect(() => {
    Object.keys(stablecoins).forEach(coin => {
      if (stablecoins[coin].status === 'active') {
        fetchStablecoinData(coin);
      }
    });

    requestNotificationPermission();
    
    const interval = setInterval(() => {
      Object.keys(stablecoins).forEach(coin => {
        if (stablecoins[coin].status === 'active') {
          fetchStablecoinData(coin);
        }
      });
    }, 120000);
    
    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num) => {
    if (num >= 1e9) {
      return (num / 1e9).toFixed(2) + 'B';
    } else if (num >= 1e6) {
      return (num / 1e6).toFixed(2) + 'M';
    }
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };

  const getHealthStatus = (ratio) => {
    if (ratio >= 100) return { 
      color: 'text-emerald-600', 
      bgColor: 'bg-emerald-50', 
      borderColor: 'border-emerald-200',
      icon: CheckCircle, 
      text: language === 'zh' ? '储备充足' : 'Fully Backed',
      badge: 'bg-emerald-100 text-emerald-800'
    };
    if (ratio >= 99) return { 
      color: 'text-amber-600', 
      bgColor: 'bg-amber-50', 
      borderColor: 'border-amber-200',
      icon: AlertCircle, 
      text: language === 'zh' ? '接近阈值' : 'Near Threshold',
      badge: 'bg-amber-100 text-amber-800'
    };
    return { 
      color: 'text-red-600', 
      bgColor: 'bg-red-50', 
      borderColor: 'border-red-200',
      icon: AlertCircle, 
      text: language === 'zh' ? '储备不足' : 'Under-reserved',
      badge: 'bg-red-100 text-red-800'
    };
  };

  const texts = {
    zh: {
      title: '香港稳定币独立观察站',
      subtitle: 'HK-Stablecoin Independent Observatory',
      slogan: '"不信任，去验证" - 多稳定币储备透明度监控平台',
      overview: '概览',
      charts: '图表分析',
      alerts: '警报中心',
      settings: '设置',
      totalSupply: '流通总量',
      disclosedReserves: '已披露储备金',
      collateralizationRatio: '抵押率',
      contractHealth: '智能合约健康检查',
      contractStatus: '合约状态',
      adminRoles: '关键权限地址',
      lastUpdate: '最后更新',
      dataSource: '数据来源',
      loading: '正在获取数据...',
      refresh: '刷新所有',
      refreshing: '刷新中...',
      normal: '正常',
      paused: '已暂停',
      multisig: '多签钱包',
      admin: '管理员地址',
      liveData: '实时数据',
      transparency: '透明度监控',
      verification: '验证机制',
      historicalTrend: '历史趋势',
      alertThreshold: '警报阈值',
      notifications: '通知',
      clearAll: '清除全部',
      enableAlerts: '启用警报',
      noAlerts: '暂无警报',
      days30: '30天',
      ratio: '抵押率',
      supply: '供应量',
      reserves: '储备金'
    },
    en: {
      title: 'HK-Stablecoin Independent Observatory',
      subtitle: '香港稳定币独立观察站',
      slogan: '"Don\'t Trust, Verify" - Multi-Stablecoin Reserve Transparency Monitoring Platform',
      overview: 'Overview',
      charts: 'Charts',
      alerts: 'Alerts',
      settings: 'Settings',
      totalSupply: 'Total Supply',
      disclosedReserves: 'Disclosed Reserves',
      collateralizationRatio: 'Collateralization Ratio',
      contractHealth: 'Smart Contract Health Check',
      contractStatus: 'Contract Status',
      adminRoles: 'Key Permission Addresses',
      lastUpdate: 'Last Updated',
      dataSource: 'Data Source',
      loading: 'Fetching data...',
      refresh: 'Refresh All',
      refreshing: 'Refreshing...',
      normal: 'Normal',
      paused: 'Paused',
      multisig: 'Multisig Wallet',
      admin: 'Admin Address',
      liveData: 'Live Data',
      transparency: 'Transparency Monitor',
      verification: 'Verification Protocol',
      historicalTrend: 'Historical Trend',
      alertThreshold: 'Alert Threshold',
      notifications: 'Notifications',
      clearAll: 'Clear All',
      enableAlerts: 'Enable Alerts',
      noAlerts: 'No Alerts',
      days30: '30 Days',
      ratio: 'Ratio',
      supply: 'Supply',
      reserves: 'Reserves'
    }
  };

  const t = texts[language];
  const currentData = data[selectedCoin];
  const healthStatus = getHealthStatus(currentData.collateralizationRatio);

  if (Object.values(data).every(coin => coin.loading)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="relative mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Database className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-slate-600 font-medium">{t.loading}</p>
          <p className="text-slate-400 text-sm mt-2">正在连接多个区块链网络...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  {t.title}
                </h1>
                <p className="text-slate-600 text-sm sm:text-base mt-1">{t.subtitle}</p>
                <p className="text-slate-500 text-xs sm:text-sm mt-1">{t.slogan}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {/* 警报指示器 */}
              <div className="relative">
                <button
                  onClick={() => setActiveTab('alerts')}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    alertSettings.notifications.length > 0 
                      ? 'bg-red-100 text-red-600' 
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <Bell className="w-5 h-5" />
                </button>
                {alertSettings.notifications.length > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {alertSettings.notifications.length}
                  </div>
                )}
              </div>
              
              <button
                onClick={handleRefreshAll}
                disabled={Object.values(data).some(coin => coin.isRefreshing)}
                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg text-sm font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 flex items-center space-x-2 shadow-lg hover:shadow-xl"
              >
                <RefreshCw className={`w-4 h-4 ${Object.values(data).some(coin => coin.isRefreshing) ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">
                  {Object.values(data).some(coin => coin.isRefreshing) ? t.refreshing : t.refresh}
                </span>
              </button>
              
              <button
                onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
                className="px-4 py-2 bg-white text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-all duration-200 border border-slate-200 shadow-sm"
              >
                {language === 'zh' ? 'EN' : '中文'}
              </button>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <div className="mt-6 flex space-x-1 bg-slate-100 p-1 rounded-xl">
            {[
              { id: 'overview', label: t.overview, icon: Eye },
              { id: 'charts', label: t.charts, icon: BarChart3 },
              { id: 'alerts', label: t.alerts, icon: Bell },
              { id: 'settings', label: t.settings, icon: Settings }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stablecoin Selector */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                <Database className="w-6 h-6 mr-2 text-blue-600" />
                选择稳定币 / Select Stablecoin
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {Object.entries(stablecoins).map(([symbol, info]) => {
                  const coinData = data[symbol];
                  const isSelected = selectedCoin === symbol;
                  const isLoading = coinData.isRefreshing || coinData.loading;
                  
                  return (
                    <button
                      key={symbol}
                      onClick={() => setSelectedCoin(symbol)}
                      className={`group p-4 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:scale-105 relative overflow-hidden ${
                        isSelected 
                          ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      )}
                      <div className="relative flex items-center justify-between">
                        <div className="text-left">
                          <div className="font-bold">{info.name}</div>
                          <div className={`text-sm ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                            {symbol}
                          </div>
                          <div className={`text-xs mt-1 ${isSelected ? 'text-white/60' : 'text-slate-400'}`}>
                            {coinData.collateralizationRatio > 0 ? `${coinData.collateralizationRatio.toFixed(2)}%` : '--'}
                          </div>
                        </div>
                        {isLoading ? (
                          <RefreshCw className="w-5 h-5 animate-spin" />
                        ) : (
                          <CheckCircle className="w-5 h-5" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Connection Status */}
            {currentData.error && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <Activity className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-blue-900 mb-1">连接状态</h3>
                    <p className="text-blue-700 text-sm mb-2">{currentData.error}</p>
                    <p className="text-blue-600 text-xs">
                      💡 提示：安装MetaMask等Web3钱包可获取真实链上数据
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Core Metrics for Selected Coin */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Total Supply */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 group hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <h3 className="text-sm font-medium text-slate-600 mb-1">{t.totalSupply}</h3>
                    <div className="text-3xl font-bold text-slate-900">
                      ${formatNumber(currentData.supply)}
                    </div>
                  </div>
                </div>
                <div className="border-t border-slate-100 pt-4">
                  <div className="text-xs text-slate-500 mb-2">{t.dataSource}:</div>
                  <a 
                    href={`https://etherscan.io/token/${stablecoins[selectedCoin].contractAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
                  >
                    <span className="font-mono">
                      {stablecoins[selectedCoin].contractAddress.slice(0,6)}...{stablecoins[selectedCoin].contractAddress.slice(-4)}
                    </span>
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
              </div>

              {/* Disclosed Reserves */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 group hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <h3 className="text-sm font-medium text-slate-600 mb-1">{t.disclosedReserves}</h3>
                    <div className="text-3xl font-bold text-slate-900">
                      ${formatNumber(currentData.reserves)}
                    </div>
                  </div>
                </div>
                <div className="border-t border-slate-100 pt-4">
                  <div className="text-xs text-slate-500 mb-2">{t.dataSource}:</div>
                  <a 
                    href="https://data.chain.link/ethereum/mainnet/reserves/tusd-por"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
                  >
                    <span>Chainlink PoR</span>
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
              </div>

              {/* Collateralization Ratio */}
              <div className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 group hover:shadow-2xl transition-all duration-300 ${healthStatus.borderColor} border-l-4`}>
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${healthStatus.bgColor}`}>
                    <healthStatus.icon className={`w-6 h-6 ${healthStatus.color}`} />
                  </div>
                  <div className="text-right">
                    <h3 className="text-sm font-medium text-slate-600 mb-1">{t.collateralizationRatio}</h3>
                    <div className={`text-4xl font-bold ${healthStatus.color}`}>
                      {currentData.collateralizationRatio.toFixed(2)}%
                    </div>
                  </div>
                </div>
                <div className="border-t border-slate-100 pt-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${healthStatus.badge}`}>
                    {healthStatus.text}
                  </span>
                </div>
              </div>
            </div>

            {/* Contract Health Check */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center">
                <Shield className="w-7 h-7 mr-3 text-blue-600" />
                {t.contractHealth} - {stablecoins[selectedCoin].name}
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Contract Status */}
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold text-slate-800 flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-slate-600" />
                    {t.contractStatus}
                  </h4>
                  <div className="bg-slate-50 rounded-xl p-6">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${currentData.isPaused ? 'bg-red-100' : 'bg-emerald-100'}`}>
                        {currentData.isPaused ? (
                          <Pause className="w-6 h-6 text-red-600" />
                        ) : (
                          <Play className="w-6 h-6 text-emerald-600" />
                        )}
                      </div>
                      <div>
                        <div className={`font-semibold ${currentData.isPaused ? 'text-red-600' : 'text-emerald-600'}`}>
                          {currentData.isPaused ? t.paused : t.normal}
                        </div>
                        <div className="text-slate-500 text-sm">
                          {currentData.isPaused ? '所有转账功能已暂停' : '合约正常运行中'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Admin Addresses */}
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold text-slate-800 flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-slate-600" />
                    {t.adminRoles}
                  </h4>
                  <div className="bg-slate-50 rounded-xl p-6 space-y-4">
                    {currentData.adminAddresses.map((address, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Shield className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-mono text-sm text-slate-700">{address}</div>
                            <div className="text-xs text-slate-500">
                              {index === 0 ? t.multisig : t.admin}
                            </div>
                          </div>
                        </div>
                        <a 
                          href={`https://etherscan.io/address/${address}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center transition-colors duration-200"
                        >
                          <ExternalLink className="w-4 h-4 text-slate-600" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Charts Tab */}
        {activeTab === 'charts' && (
          <div className="space-y-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                <BarChart3 className="w-7 h-7 mr-3 text-blue-600" />
                {t.historicalTrend} - {stablecoins[selectedCoin].name}
              </h3>
              
              <div className="h-96 bg-slate-50 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-500 font-medium">历史数据图表</p>
                  <p className="text-slate-400 text-sm mt-2">30天抵押率趋势分析</p>
                  <div className="mt-4 text-xs text-slate-400">
                    数据点: {currentData.historicalData.length} | 最新抵押率: {currentData.collateralizationRatio.toFixed(3)}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Alerts Tab */}
        {activeTab === 'alerts' && (
          <div className="space-y-8">
            {/* Alert Settings */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                <Bell className="w-7 h-7 mr-3 text-blue-600" />
                {t.alerts}
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Alert Configuration */}
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold text-slate-800">{t.settings}</h4>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div>
                        <div className="font-medium text-slate-900">{t.enableAlerts}</div>
                        <div className="text-sm text-slate-500">监控抵押率变化并发送通知</div>
                      </div>
                      <button
                        onClick={() => setAlertSettings(prev => ({ ...prev, enabled: !prev.enabled }))}
                        className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                          alertSettings.enabled ? 'bg-blue-500' : 'bg-slate-300'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                          alertSettings.enabled ? 'translate-x-6' : 'translate-x-0.5'
                        }`}></div>
                      </button>
                    </div>
                    
                    <div className="p-4 bg-slate-50 rounded-xl">
                      <div className="font-medium text-slate-900 mb-2">{t.alertThreshold}</div>
                      <div className="flex items-center space-x-4">
                        <input
                          type="range"
                          min="95"
                          max="100"
                          step="0.1"
                          value={alertSettings.threshold}
                          onChange={(e) => setAlertSettings(prev => ({ ...prev, threshold: parseFloat(e.target.value) }))}
                          className="flex-1"
                        />
                        <span className="font-mono text-lg text-blue-600 min-w-[60px]">
                          {alertSettings.threshold.toFixed(1)}%
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-2">
                        当抵押率低于此阈值时触发警报
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Notifications */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-slate-800">{t.notifications}</h4>
                    {alertSettings.notifications.length > 0 && (
                      <button
                        onClick={clearNotifications}
                        className="text-sm text-red-600 hover:text-red-800 transition-colors duration-200"
                      >
                        {t.clearAll}
                      </button>
                    )}
                  </div>
                  
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {alertSettings.notifications.length === 0 ? (
                      <div className="text-center py-8">
                        <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500">{t.noAlerts}</p>
                      </div>
                    ) : (
                      alertSettings.notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 rounded-xl border-l-4 ${
                            notification.severity === 'critical'
                              ? 'bg-red-50 border-red-500'
                              : 'bg-amber-50 border-amber-500'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className={`font-medium ${
                                notification.severity === 'critical' ? 'text-red-900' : 'text-amber-900'
                              }`}>
                                {notification.coin} 储备警报
                              </div>
                              <div className={`text-sm mt-1 ${
                                notification.severity === 'critical' ? 'text-red-700' : 'text-amber-700'
                              }`}>
                                {notification.message}
                              </div>
                              <div className="text-xs text-slate-500 mt-2">
                                {notification.timestamp.toLocaleString()}
                              </div>
                            </div>
                            <AlertCircle className={`w-5 h-5 ${
                              notification.severity === 'critical' ? 'text-red-500' : 'text-amber-500'
                            }`} />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                <Settings className="w-7 h-7 mr-3 text-blue-600" />
                {t.settings}
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold text-slate-800">系统配置</h4>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded-xl">
                      <div className="font-medium text-slate-900 mb-2">数据更新频率</div>
                      <div className="text-sm text-slate-600">当前设置：每2分钟自动刷新</div>
                    </div>
                    
                    <div className="p-4 bg-slate-50 rounded-xl">
                      <div className="font-medium text-slate-900 mb-2">支持的稳定币</div>
                      <div className="space-y-2">
                        {Object.entries(stablecoins).map(([symbol, info]) => (
                          <div key={symbol} className="flex items-center justify-between text-sm">
                            <span>{info.name} ({symbol})</span>
                            <span className="text-emerald-600">✓ 已支持</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h4 className="text-lg font-semibold text-slate-800">关于平台</h4>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded-xl">
                      <div className="font-medium text-slate-900 mb-2">版本信息</div>
                      <div className="text-sm text-slate-600">
                        <div>当前版本：演示版 v1.0.0</div>
                        <div>最后更新：{new Date().toLocaleDateString()}</div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-slate-50 rounded-xl">
                      <div className="font-medium text-slate-900 mb-2">数据来源</div>
                      <div className="space-y-2 text-sm text-slate-600">
                        <div>• Ethereum 主网</div>
                        <div>• Chainlink 预言机网络</div>
                        <div>• Etherscan API</div>
                        <div>• 第三方审计机构</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 text-center">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 p-8 text-slate-600">
            <div className="mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{t.verification}</h3>
              <p className="text-slate-600 max-w-2xl mx-auto">
                本平台为独立第三方工具，所有数据来源于公开区块链和预言机网络，致力于为数字资产生态提供透明度保障
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="text-left">
                <h4 className="font-semibold text-slate-800 mb-2">技术基础设施</h4>
                <div className="space-y-1 text-slate-500">
                  <div>• Ethereum Mainnet</div>
                  <div>• Chainlink Oracle Network</div>
                  <div>• Web3 Integration</div>
                </div>
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-slate-800 mb-2">监控功能</h4>
                <div className="space-y-1 text-slate-500">
                  <div>• 多稳定币支持</div>
                  <div>• 实时警报系统</div>
                  <div>• 历史数据分析</div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200">
              <p className="text-xs text-slate-400">
                香港稳定币独立观察站 | HK-Stablecoin Independent Observatory | 
                演示版本 - 生产环境将集成完整的实时API和更多功能
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default HKStablecoinWatch;