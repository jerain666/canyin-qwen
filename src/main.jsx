import React, { useState, useMemo } from 'react';
import ReactDOM from 'react-dom/client';

const App = () => {
  // 建店成本状态
  const [costs, setCosts] = useState({
    transferFee: '',
    rentDeposit: '',
    techFee: '',
    decoration: '',
    ad: '',
    equipment: '',
    firstMaterials: '',
    threeMonthRent: '',
    salary: '',
    marketing: '',
    reserve: ''
  });

  // 毛利率输入
  const [marginInput, setMarginInput] = useState({
    price: '',
    foodCost: '',
    packaging: ''
  });

  // 盈亏平衡输入
  const [breakEven, setBreakEven] = useState({
    dailyRent: '',
    dailySalary: '',
    energy: '',
    other: ''
  });

  // 回本周期：月利润
  const [monthlyProfit, setMonthlyProfit] = useState('');

  // 工具函数：安全转数字
  const toNum = (val) => val === '' ? 0 : parseFloat(val) || 0;

  // 计算建店总成本
  const totalStartupCost = useMemo(() => {
    return Object.values(costs).reduce((sum, val) => sum + toNum(val), 0);
  }, [costs]);

  // 毛利率计算（0~1）
  const grossMargin = useMemo(() => {
    const { price, foodCost, packaging } = marginInput;
    const p = toNum(price);
    if (p <= 0) return 0;
    const cost = toNum(foodCost) + toNum(packaging);
    return Math.max(0, (p - cost) / p);
  }, [marginInput]);

  // 盈亏平衡点（日营业额）
  const breakEvenPoint = useMemo(() => {
    const ops = Object.values(breakEven).reduce((sum, val) => sum + toNum(val), 0);
    if (grossMargin <= 0) return 0;
    return ops / grossMargin;
  }, [breakEven, grossMargin]);

  // 回本周期计算（仅固定成本：技术+装修+广告+设备）
  const fixedCostForPayback = useMemo(() => {
    return toNum(costs.techFee) + toNum(costs.decoration) + toNum(costs.ad) + toNum(costs.equipment);
  }, [costs]);

  const paybackMonths = useMemo(() => {
    const profit = toNum(monthlyProfit);
    if (profit <= 0) return 0;
    return fixedCostForPayback / profit;
  }, [fixedCostForPayback, monthlyProfit]);

  // 格式化货币
  const fmt = (num) => num.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const fmt2 = (num) => num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-8">
      <header className="text-center py-6">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 text-transparent bg-clip-text">
          🏪 店铺投资计算器
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">快速评估开店成本、盈亏点与回本周期</p>
      </header>

      {/* 建店成本 */}
      <section className="bg-white dark:bg-card rounded-xl shadow-md p-5">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          💰 建店投入成本
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { key: 'transferFee', label: '转让费' },
            { key: 'rentDeposit', label: '房租押金' },
            { key: 'techFee', label: '技术学习费' },
            { key: 'decoration', label: '装修' },
            { key: 'ad', label: '广告' },
            { key: 'equipment', label: '设备' },
            { key: 'firstMaterials', label: '首批物料' },
            { key: 'threeMonthRent', label: '3个月店租' },
            { key: 'salary', label: '人工工资' },
            { key: 'marketing', label: '营销费用' },
            { key: 'reserve', label: '预备资金' }
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">{label} (¥)</label>
              <input
                type="number"
                value={costs[key]}
                onChange={(e) => setCosts({ ...costs, [key]: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-lg font-bold">总投入：<span className="text-primary">¥{fmt(totalStartupCost)}</span></p>
        </div>
      </section>

      {/* 毛利率 */}
      <section className="bg-white dark:bg-card rounded-xl shadow-md p-5">
        <h2 className="text-xl font-semibold mb-4">📊 单品毛利率</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm mb-1">小吃单价 (¥)</label>
            <input
              type="number"
              value={marginInput.price}
              onChange={(e) => setMarginInput({ ...marginInput, price: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">食材成本 (¥)</label>
            <input
              type="number"
              value={marginInput.foodCost}
              onChange={(e) => setMarginInput({ ...marginInput, foodCost: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">包装成本 (¥)</label>
            <input
              type="number"
              value={marginInput.packaging}
              onChange={(e) => setMarginInput({ ...marginInput, packaging: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
            />
          </div>
        </div>
        <div className="mt-4">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div
              className="bg-gradient-to-r from-green-400 to-emerald-600 h-2.5 rounded-full"
              style={{ width: `${Math.min(100, grossMargin * 100)}%` }}
            ></div>
          </div>
          <p className="mt-2 text-lg">
            毛利率：<span className={grossMargin >= 0.6 ? 'text-green-500' : grossMargin >= 0.5 ? 'text-yellow-500' : 'text-red-500'}>
              {(grossMargin * 100).toFixed(1)}%
            </span>
          </p>
        </div>
      </section>

      {/* 盈亏平衡 */}
      <section className="bg-white dark:bg-card rounded-xl shadow-md p-5">
        <h2 className="text-xl font-semibold mb-4">⚖️ 日盈亏平衡点</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { key: 'dailyRent', label: '房租/天' },
            { key: 'dailySalary', label: '人工/天' },
            { key: 'energy', label: '能源/天' },
            { key: 'other', label: '其他/天' }
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="block text-sm mb-1">{label} (¥)</label>
              <input
                type="number"
                value={breakEven[key]}
                onChange={(e) => setBreakEven({ ...breakEven, [key]: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
          ))}
        </div>
        <div className="mt-4">
          <p className="text-lg">
            每日需营业额 ≥ <span className="font-bold text-primary">¥{fmt2(breakEvenPoint)}</span> 才能保本
          </p>
        </div>
      </section>

      {/* 回本周期 */}
      <section className="bg-white dark:bg-card rounded-xl shadow-md p-5">
        <h2 className="text-xl font-semibold mb-4">⏳ 回本周期估算</h2>
        <p className="mb-2">固定成本（不含押金/房租）：¥{fmt(fixedCostForPayback)}</p>
        <div className="mb-4">
          <label className="block text-sm mb-1">预估月净利润 (¥)</label>
          <input
            type="number"
            value={monthlyProfit}
            onChange={(e) => setMonthlyProfit(e.target.value)}
            className="w-full max-w-xs px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
          />
        </div>
        {paybackMonths > 0 && (
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800 rounded-lg">
            <p className="text-xl font-bold">
              预计 <span className="text-primary">{paybackMonths.toFixed(1)}</span> 个月回本
            </p>
            {paybackMonths > 12 && (
              <p className="text-red-500 mt-1">⚠️ 回本周期较长，建议优化成本或提升毛利</p>
            )}
          </div>
        )}
      </section>

      {/* 总结卡片 */}
      <section className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl shadow-lg p-6 text-center">
        <h2 className="text-2xl font-bold mb-3">📈 投资概览</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p>总投入</p>
            <p className="text-xl font-bold">¥{fmt(totalStartupCost)}</p>
          </div>
          <div>
            <p>毛利率</p>
            <p className="text-xl font-bold">{(grossMargin * 100).toFixed(1)}%</p>
          </div>
          <div>
            <p>日盈亏点</p>
            <p className="text-xl font-bold">¥{fmt2(breakEvenPoint)}</p>
          </div>
          <div>
            <p>回本月数</p>
            <p className="text-xl font-bold">{paybackMonths > 0 ? paybackMonths.toFixed(1) : '—'}</p>
          </div>
        </div>
      </section>

      <footer className="text-center text-gray-500 dark:text-gray-400 text-sm py-6">
        © {new Date().getFullYear()} ShopInvest Calculator · 开源免费工具
      </footer>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
