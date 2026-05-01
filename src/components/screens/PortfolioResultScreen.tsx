import { useState } from 'react';
import { Card, Button } from '../ui';
import { PortfolioAllocation, Budget } from '../../types';
import { formatCurrency } from '../../utils/calculations';

interface PortfolioResultScreenProps {
  portfolio: PortfolioAllocation;
  budget: Budget;
  onReset: () => void;
  onBackToBudget: () => void;
}

export function PortfolioResultScreen({
  portfolio,
  budget,
  onReset,
  onBackToBudget,
}: PortfolioResultScreenProps) {
  const [showDetails, setShowDetails] = useState(true);
  
  const { 
    totalStocks, 
    totalBonds, 
    totalAlternatives, 
    totalCash, 
    allocations, 
    riskScore, 
    notes, 
    taxTips,
    monthlyInvestment 
  } = portfolio;

  // Determine risk level label
  const getRiskLabel = (score: number): { label: string; color: string; bg: string } => {
    if (score <= 3) return { label: 'Conservative', color: 'text-emerald-600', bg: 'bg-emerald-500' };
    if (score <= 5) return { label: 'Moderate-Conservative', color: 'text-teal-600', bg: 'bg-teal-500' };
    if (score <= 7) return { label: 'Moderate', color: 'text-blue-600', bg: 'bg-blue-500' };
    if (score <= 8.5) return { label: 'Moderate-Aggressive', color: 'text-orange-600', bg: 'bg-orange-500' };
    return { label: 'Aggressive', color: 'text-red-600', bg: 'bg-red-500' };
  };

  const riskInfo = getRiskLabel(riskScore);

  // Category colors
  const categoryColors = {
    stocks: { bg: 'bg-blue-500', light: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
    bonds: { bg: 'bg-emerald-500', light: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
    alternatives: { bg: 'bg-purple-500', light: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
    cash: { bg: 'bg-amber-400', light: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
  };

  // Group allocations by category
  const stockAllocations = allocations.filter(a => a.category === 'stocks');
  const bondAllocations = allocations.filter(a => a.category === 'bonds');
  const altAllocations = allocations.filter(a => a.category === 'alternatives');
  const cashAllocations = allocations.filter(a => a.category === 'cash');

  return (
    <div className="flex-1 flex flex-col gap-4">
      {/* Header Card */}
      <Card className="text-center" padding="md">
        <div className="inline-flex items-center gap-2 mb-2">
          <span className="text-2xl">📊</span>
          <span className="font-display text-lg font-semibold text-slate-700">Your Portfolio</span>
        </div>
        <h1 className="font-display text-2xl font-bold text-slate-800 mb-1">
          Investment Allocation
        </h1>
        <p className="text-slate-500 text-sm">
          A diversified portfolio tailored to your profile
        </p>
      </Card>

      {/* Risk Score & Monthly Investment */}
      <Card padding="md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-slate-500 uppercase tracking-wide font-medium">
              Risk Profile
            </p>
            <p className={`text-xl font-bold ${riskInfo.color}`}>
              {riskInfo.label}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500">Monthly Investment</p>
            <p className="text-2xl font-bold text-slate-700">{formatCurrency(monthlyInvestment)}</p>
          </div>
        </div>
        
        {/* Risk score bar */}
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className={`h-full ${riskInfo.bg} transition-all duration-500`}
            style={{ width: `${riskScore * 10}%` }}
          />
        </div>
        <div className="mt-1 flex justify-between text-xs text-slate-400">
          <span>Conservative</span>
          <span>Risk Score: {riskScore}/10</span>
          <span>Aggressive</span>
        </div>
      </Card>

      {/* High-Level Allocation Bar */}
      <Card padding="md">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold text-slate-700">Asset Allocation</h2>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-sm text-primary-600 font-medium hover:underline"
          >
            {showDetails ? 'Hide Details' : 'Show Details'}
          </button>
        </div>
        
        {/* Visual allocation bar */}
        <div className="h-10 rounded-xl overflow-hidden flex mb-4">
          {totalStocks > 0 && (
            <div 
              className={`${categoryColors.stocks.bg} flex items-center justify-center transition-all duration-500`}
              style={{ width: `${totalStocks}%` }}
            >
              {totalStocks >= 12 && <span className="text-white font-bold text-sm">{totalStocks}%</span>}
            </div>
          )}
          {totalBonds > 0 && (
            <div 
              className={`${categoryColors.bonds.bg} flex items-center justify-center transition-all duration-500`}
              style={{ width: `${totalBonds}%` }}
            >
              {totalBonds >= 12 && <span className="text-white font-bold text-sm">{totalBonds}%</span>}
            </div>
          )}
          {totalAlternatives > 0 && (
            <div 
              className={`${categoryColors.alternatives.bg} flex items-center justify-center transition-all duration-500`}
              style={{ width: `${totalAlternatives}%` }}
            >
              {totalAlternatives >= 12 && <span className="text-white font-bold text-sm">{totalAlternatives}%</span>}
            </div>
          )}
          {totalCash > 0 && (
            <div 
              className={`${categoryColors.cash.bg} flex items-center justify-center transition-all duration-500`}
              style={{ width: `${totalCash}%` }}
            >
              {totalCash >= 12 && <span className="text-slate-800 font-bold text-sm">{totalCash}%</span>}
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          {totalStocks > 0 && (
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded ${categoryColors.stocks.bg}`}></div>
              <span className="text-slate-600">Stocks: {totalStocks}%</span>
            </div>
          )}
          {totalBonds > 0 && (
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded ${categoryColors.bonds.bg}`}></div>
              <span className="text-slate-600">Bonds: {totalBonds}%</span>
            </div>
          )}
          {totalAlternatives > 0 && (
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded ${categoryColors.alternatives.bg}`}></div>
              <span className="text-slate-600">Alternatives: {totalAlternatives}%</span>
            </div>
          )}
          {totalCash > 0 && (
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded ${categoryColors.cash.bg}`}></div>
              <span className="text-slate-600">Cash: {totalCash}%</span>
            </div>
          )}
        </div>
      </Card>

      {/* Detailed Breakdown */}
      {showDetails && (
        <>
          {/* Stocks */}
          {stockAllocations.length > 0 && (
            <Card padding="none" className="overflow-hidden">
              <div className={`px-4 py-2 ${categoryColors.stocks.light} border-b ${categoryColors.stocks.border}`}>
                <div className="flex justify-between items-center">
                  <p className={`text-sm font-semibold ${categoryColors.stocks.text} uppercase tracking-wide`}>
                    📈 Stocks ({totalStocks}%)
                  </p>
                  <p className="text-sm font-bold text-slate-600">
                    {formatCurrency(stockAllocations.reduce((sum, a) => sum + a.amount, 0))}/mo
                  </p>
                </div>
              </div>
              <div className="divide-y divide-slate-100">
                {stockAllocations.map((alloc, idx) => (
                  <div key={idx} className="flex items-center gap-3 px-4 py-3">
                    <span className="text-xl">{alloc.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-800 truncate">{alloc.name}</p>
                      <p className="text-xs text-slate-500">{alloc.description}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${categoryColors.stocks.text}`}>{alloc.percentage}%</p>
                      <p className="text-xs text-slate-500">{formatCurrency(alloc.amount)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Bonds */}
          {bondAllocations.length > 0 && (
            <Card padding="none" className="overflow-hidden">
              <div className={`px-4 py-2 ${categoryColors.bonds.light} border-b ${categoryColors.bonds.border}`}>
                <div className="flex justify-between items-center">
                  <p className={`text-sm font-semibold ${categoryColors.bonds.text} uppercase tracking-wide`}>
                    🏛️ Bonds ({totalBonds}%)
                  </p>
                  <p className="text-sm font-bold text-slate-600">
                    {formatCurrency(bondAllocations.reduce((sum, a) => sum + a.amount, 0))}/mo
                  </p>
                </div>
              </div>
              <div className="divide-y divide-slate-100">
                {bondAllocations.map((alloc, idx) => (
                  <div key={idx} className="flex items-center gap-3 px-4 py-3">
                    <span className="text-xl">{alloc.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-800 truncate">{alloc.name}</p>
                      <p className="text-xs text-slate-500">{alloc.description}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${categoryColors.bonds.text}`}>{alloc.percentage}%</p>
                      <p className="text-xs text-slate-500">{formatCurrency(alloc.amount)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Alternatives */}
          {altAllocations.length > 0 && (
            <Card padding="none" className="overflow-hidden">
              <div className={`px-4 py-2 ${categoryColors.alternatives.light} border-b ${categoryColors.alternatives.border}`}>
                <div className="flex justify-between items-center">
                  <p className={`text-sm font-semibold ${categoryColors.alternatives.text} uppercase tracking-wide`}>
                    🏢 Alternatives ({totalAlternatives}%)
                  </p>
                  <p className="text-sm font-bold text-slate-600">
                    {formatCurrency(altAllocations.reduce((sum, a) => sum + a.amount, 0))}/mo
                  </p>
                </div>
              </div>
              <div className="divide-y divide-slate-100">
                {altAllocations.map((alloc, idx) => (
                  <div key={idx} className="flex items-center gap-3 px-4 py-3">
                    <span className="text-xl">{alloc.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-800 truncate">{alloc.name}</p>
                      <p className="text-xs text-slate-500">{alloc.description}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${categoryColors.alternatives.text}`}>{alloc.percentage}%</p>
                      <p className="text-xs text-slate-500">{formatCurrency(alloc.amount)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Cash */}
          {cashAllocations.length > 0 && (
            <Card padding="none" className="overflow-hidden">
              <div className={`px-4 py-2 ${categoryColors.cash.light} border-b ${categoryColors.cash.border}`}>
                <div className="flex justify-between items-center">
                  <p className={`text-sm font-semibold ${categoryColors.cash.text} uppercase tracking-wide`}>
                    💵 Cash ({totalCash}%)
                  </p>
                  <p className="text-sm font-bold text-slate-600">
                    {formatCurrency(cashAllocations.reduce((sum, a) => sum + a.amount, 0))}/mo
                  </p>
                </div>
              </div>
              <div className="divide-y divide-slate-100">
                {cashAllocations.map((alloc, idx) => (
                  <div key={idx} className="flex items-center gap-3 px-4 py-3">
                    <span className="text-xl">{alloc.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-800 truncate">{alloc.name}</p>
                      <p className="text-xs text-slate-500">{alloc.description}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${categoryColors.cash.text}`}>{alloc.percentage}%</p>
                      <p className="text-xs text-slate-500">{formatCurrency(alloc.amount)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </>
      )}

      {/* Personalized Notes */}
      {notes.length > 0 && (
        <Card padding="md" className="bg-gradient-to-br from-primary-50 to-blue-50">
          <h3 className="font-semibold text-primary-800 mb-3">💡 Personalized Insights</h3>
          <ul className="space-y-2">
            {notes.map((note, index) => (
              <li key={index} className="text-sm text-primary-700 flex gap-2">
                <span className="text-primary-400">•</span>
                {note}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Tax Placement Tips */}
      {taxTips.length > 0 && (
        <Card padding="md" className="bg-gradient-to-br from-emerald-50 to-teal-50">
          <h3 className="font-semibold text-emerald-800 mb-3">🏦 Tax-Smart Placement</h3>
          <ul className="space-y-2">
            {taxTips.map((tip, index) => (
              <li key={index} className="text-sm text-emerald-700 flex gap-2">
                <span className="text-emerald-400">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Getting Started Tips */}
      <Card padding="md" className="bg-slate-50">
        <h3 className="font-semibold text-slate-700 mb-2">🚀 Getting Started</h3>
        <ul className="space-y-1 text-sm text-slate-600">
          <li>• Open accounts: 401(k), IRA, and/or taxable brokerage</li>
          <li>• Start with low-cost index funds or ETFs</li>
          <li>• Set up automatic monthly contributions</li>
          <li>• Rebalance once a year to maintain your target allocation</li>
          <li>• Stay the course - don't panic sell during market drops!</li>
        </ul>
      </Card>

      {/* Disclaimer */}
      <p className="text-xs text-slate-400 text-center px-4">
        This is educational information, not financial advice. Consider consulting a fiduciary financial advisor for personalized guidance.
      </p>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <Button variant="outline" onClick={onBackToBudget} className="flex-1">
          ← Back to Budget
        </Button>
        <Button variant="outline" onClick={onReset} className="flex-1">
          Start Over
        </Button>
      </div>
    </div>
  );
}
