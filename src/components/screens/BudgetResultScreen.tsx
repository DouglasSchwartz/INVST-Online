import { useState } from 'react';
import { Card, Button, Toggle } from '../ui';
import { Budget } from '../../types';
import { formatCurrency, validateBudgetPercentages } from '../../utils/calculations';

interface BudgetResultScreenProps {
  budget: Budget;
  onToggleMode: (isAuto: boolean) => void;
  onUpdatePercentage: (categoryId: string, percentage: number) => void;
  onUpdateIncome: (income: number) => void;
  onAddCategory: (name: string, percentage: number) => void;
  onRemoveCategory: (categoryId: string) => void;
  onContinueToPortfolio: () => void;
  onReset: () => void;
}

export function BudgetResultScreen({
  budget,
  onToggleMode,
  onUpdatePercentage,
  onUpdateIncome,
  onAddCategory,
  onRemoveCategory,
  onContinueToPortfolio,
  onReset,
}: BudgetResultScreenProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryPercentage, setNewCategoryPercentage] = useState('5');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isEditingIncome, setIsEditingIncome] = useState(false);
  const [incomeInput, setIncomeInput] = useState(budget.afterTaxIncome.toString());

  const validation = validateBudgetPercentages(budget);

  // Separate fixed and flexible categories
  const fixedCategories = budget.categories.filter(cat => cat.isFixed);
  const flexibleCategories = budget.categories.filter(cat => !cat.isFixed);

  // Calculate fixed obligations percentage
  const fixedPercentage = fixedCategories.reduce((sum, cat) => sum + cat.percentage, 0);
  const hasDebtProblem = fixedPercentage >= 100;
  
  // Check if actual debt payments exceed what we budgeted (caps applied)
  const actualDebt = budget.actualDebtPayments || 0;
  const budgetedDebt = budget.totalDebtPayments;
  const debtExceedsBudget = actualDebt > budgetedDebt && actualDebt > 0;

  const handleAddCategory = () => {
    if (newCategoryName && newCategoryPercentage) {
      onAddCategory(newCategoryName, parseInt(newCategoryPercentage, 10));
      setNewCategoryName('');
      setNewCategoryPercentage('5');
      setShowAddModal(false);
    }
  };

  const handlePercentageChange = (categoryId: string, value: string) => {
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 0 && num <= 100) {
      onUpdatePercentage(categoryId, num);
    }
  };

  const handleIncomeChange = (value: string) => {
    // Remove non-numeric characters except for digits
    const cleanValue = value.replace(/[^0-9]/g, '');
    setIncomeInput(cleanValue);
  };

  const handleIncomeBlur = () => {
    const num = parseInt(incomeInput, 10);
    if (!isNaN(num) && num > 0) {
      onUpdateIncome(num);
    } else {
      // Reset to current budget income if invalid
      setIncomeInput(budget.afterTaxIncome.toString());
    }
    setIsEditingIncome(false);
  };

  const handleIncomeKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleIncomeBlur();
    }
    if (e.key === 'Escape') {
      setIncomeInput(budget.afterTaxIncome.toString());
      setIsEditingIncome(false);
    }
  };

  // Format number with commas for display
  const formatIncomeDisplay = (value: string) => {
    const num = parseInt(value, 10);
    if (isNaN(num)) return value;
    return num.toLocaleString();
  };

  // Categories that benefit from daily/weekly breakdown
  const showDailyWeekly = (categoryId: string) => {
    const dailyWeeklyCategories = ['food', 'spendable', 'transport', 'travel'];
    return dailyWeeklyCategories.includes(categoryId);
  };

  // Calculate daily and weekly amounts
  const getDailyAmount = (monthlyAmount: number) => Math.round(monthlyAmount / 30);
  const getWeeklyAmount = (monthlyAmount: number) => Math.round((monthlyAmount * 12) / 52);

  return (
    <div className="flex-1 flex flex-col gap-4">
      {/* Header Card */}
      <Card className="text-center" padding="md">
        {hasDebtProblem ? (
          <>
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="text-2xl">⚠️</span>
              <span className="font-display text-lg font-semibold text-amber-700">Heads Up!</span>
            </div>
            <h1 className="font-display text-2xl font-bold text-slate-800 mb-1">
              Your Debt Exceeds Your Income
            </h1>
            <p className="text-slate-500 text-sm">
              Your monthly debt payments are more than your take-home pay. Let's work on this.
            </p>
          </>
        ) : (
          <>
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="text-2xl">🎉</span>
              <span className="font-display text-lg font-semibold text-slate-700">Sweet!</span>
            </div>
            <h1 className="font-display text-2xl font-bold text-slate-800 mb-1">
              Here's Your Budget
            </h1>
            <p className="text-slate-500 text-sm">
              Feel free to adjust. Just press reset to start over!
            </p>
          </>
        )}
      </Card>

      {/* Debt Warning - Severe (payments > income) */}
      {hasDebtProblem && (
        <Card padding="md" className="bg-gradient-to-br from-red-50 to-amber-50 border-2 border-red-200">
          <h3 className="font-semibold text-red-800 mb-2">🚨 Debt Emergency</h3>
          <p className="text-sm text-red-700 mb-3">
            Your monthly debt payments ({formatCurrency(actualDebt)}) exceed your income ({formatCurrency(budget.afterTaxIncome)}).
          </p>
          <p className="text-sm text-red-700 mb-3">
            <strong>Recommended next steps:</strong>
          </p>
          <ul className="space-y-1 text-sm text-red-700">
            <li>• Contact creditors to negotiate lower payments</li>
            <li>• Consider debt consolidation or balance transfers</li>
            <li>• Look into debt counseling services</li>
            <li>• Focus on increasing income if possible</li>
          </ul>
        </Card>
      )}

      {/* Debt Warning - Moderate (payments exceed budget recommendation) */}
      {!hasDebtProblem && debtExceedsBudget && (
        <Card padding="md" className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200">
          <h3 className="font-semibold text-amber-800 mb-2">💡 Debt Strategy Tip</h3>
          <p className="text-sm text-amber-700 mb-3">
            You're paying <strong>{formatCurrency(actualDebt)}/month</strong> toward debt, 
            but we recommend budgeting around <strong>{formatCurrency(budgetedDebt)}/month</strong> (5% per debt type).
          </p>
          <p className="text-sm text-amber-700 mb-2">
            <strong>Here's the deal:</strong> Paying more than the minimum is great for getting out of debt faster, 
            but it shouldn't squeeze out savings and essential spending.
          </p>
          <p className="text-sm text-amber-700">
            <strong>Consider:</strong> The debt avalanche (highest interest first) or snowball (smallest balance first) method. 
            Balance debt payoff with building an emergency fund!
          </p>
        </Card>
      )}

      {/* Budget Header */}
      <Card padding="md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-slate-500 uppercase tracking-wide font-medium">
              Monthly Income
            </p>
            {!budget.isAutoMode && isEditingIncome ? (
              <div className="flex items-center gap-1">
                <span className="text-3xl font-bold text-primary-600">$</span>
                <input
                  type="text"
                  value={formatIncomeDisplay(incomeInput)}
                  onChange={(e) => handleIncomeChange(e.target.value)}
                  onBlur={handleIncomeBlur}
                  onKeyDown={handleIncomeKeyDown}
                  autoFocus
                  className="text-3xl font-bold text-primary-600 bg-primary-50 border-2 border-primary-300 rounded-lg px-2 py-1 w-40 focus:ring-2 focus:ring-primary-200 focus:outline-none"
                />
              </div>
            ) : (
              <button
                onClick={() => {
                  if (!budget.isAutoMode) {
                    setIncomeInput(budget.afterTaxIncome.toString());
                    setIsEditingIncome(true);
                  }
                }}
                disabled={budget.isAutoMode}
                className={`text-3xl font-bold text-primary-600 ${
                  !budget.isAutoMode 
                    ? 'hover:bg-primary-50 px-2 py-1 -mx-2 -my-1 rounded-lg cursor-pointer transition-colors' 
                    : ''
                }`}
              >
                {formatCurrency(budget.afterTaxIncome)}
              </button>
            )}
            {!budget.isAutoMode && !isEditingIncome && (
              <p className="text-xs text-primary-500 mt-1">Click to edit</p>
            )}
          </div>
          {!hasDebtProblem && (
            <Toggle
              options={['Manual', 'Auto']}
              value={budget.isAutoMode ? 'Auto' : 'Manual'}
              onChange={(val) => onToggleMode(val === 'Auto')}
            />
          )}
        </div>

        {/* Validation Status */}
        {hasDebtProblem ? (
          <div className="p-3 rounded-xl text-sm font-medium bg-red-100 text-red-700">
            ⚠️ Debt payments: {fixedPercentage}% of income — {fixedPercentage - 100}% over!
          </div>
        ) : !validation.isValid ? (
          <div className={`p-3 rounded-xl text-sm font-medium ${
            validation.total > 100 
              ? 'bg-red-50 text-red-700' 
              : 'bg-amber-50 text-amber-700'
          }`}>
            {validation.total > 100 
              ? `⚠️ Total is ${validation.total}% — ${validation.total - 100}% over budget!`
              : `ℹ️ Total is ${validation.total}% — ${100 - validation.total}% unallocated`
            }
          </div>
        ) : (
          <div className="p-3 rounded-xl text-sm font-medium bg-green-50 text-green-700">
            ✓ Perfect! All income allocated (100%)
          </div>
        )}
      </Card>

      {/* Fixed Obligations (if any) */}
      {fixedCategories.length > 0 && (
        <Card padding="none" className="overflow-hidden">
          <div className={`px-4 py-2 border-b ${hasDebtProblem ? 'bg-red-100 border-red-200' : 'bg-slate-100 border-slate-200'}`}>
            <p className={`text-xs font-semibold uppercase tracking-wide ${hasDebtProblem ? 'text-red-700' : 'text-slate-600'}`}>
              Fixed Monthly Obligations {hasDebtProblem && `(${fixedPercentage}% of income)`}
            </p>
          </div>
          <div className="divide-y divide-slate-100">
            {fixedCategories.map((category) => (
              <div
                key={category.id}
                className={`flex items-center gap-3 px-4 py-3 ${
                  hasDebtProblem ? 'bg-red-50/50' : 'bg-amber-50/50'
                }`}
              >
                {/* Icon */}
                <span className="text-2xl w-10 text-center">{category.icon || '📦'}</span>

                {/* Name & Amount */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 truncate">{category.name}</p>
                  <p className="text-sm text-slate-500">{formatCurrency(category.amount)}/month</p>
                </div>

                {/* Fixed badge */}
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  hasDebtProblem ? 'text-red-600 bg-red-200' : 'text-slate-500 bg-slate-200'
                }`}>
                  Fixed
                </span>

                {/* Percentage (display only) */}
                <span className={`px-3 py-1 rounded-full font-bold text-lg ${
                  category.percentage > 50 
                    ? 'text-red-600 bg-red-100' 
                    : 'text-slate-500 bg-slate-100'
                }`}>
                  {category.percentage}%
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Flexible Budget Categories */}
      {!hasDebtProblem && (
        <Card padding="none" className="overflow-hidden">
          {fixedCategories.length > 0 && (
            <div className="px-4 py-2 bg-primary-50 border-b border-primary-100">
              <p className="text-xs font-semibold text-primary-700 uppercase tracking-wide">
                Flexible Spending ({100 - fixedPercentage}% remaining)
              </p>
            </div>
          )}
          <div className="divide-y divide-slate-100">
            {flexibleCategories.map((category) => (
              <div
                key={category.id}
                className="flex items-center gap-3 px-4 py-3"
              >
                {/* Icon */}
                <span className="text-2xl w-10 text-center">{category.icon || '📦'}</span>

                {/* Name & Amount */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 truncate">{category.name}</p>
                  <p className="text-sm text-slate-500">{formatCurrency(category.amount)}/mo</p>
                  {/* Daily/Weekly breakdown for relevant categories */}
                  {showDailyWeekly(category.id) && category.amount > 0 && (
                    <div className="flex gap-3 mt-1">
                      <span className="text-xs text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
                        {formatCurrency(getDailyAmount(category.amount))}/day
                      </span>
                      <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        {formatCurrency(getWeeklyAmount(category.amount))}/wk
                      </span>
                    </div>
                  )}
                </div>

                {/* Percentage */}
                {!budget.isAutoMode && editingId === category.id ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={category.percentage}
                      onChange={(e) => handlePercentageChange(category.id, e.target.value)}
                      onBlur={() => setEditingId(null)}
                      autoFocus
                      className="w-16 px-2 py-1 text-right font-bold text-primary-600 border-2 border-primary-300 rounded-lg focus:ring-2 focus:ring-primary-200"
                    />
                    <span className="text-primary-600 font-bold">%</span>
                  </div>
                ) : (
                  <button
                    onClick={() => !budget.isAutoMode && setEditingId(category.id)}
                    disabled={budget.isAutoMode}
                    className={`
                      px-3 py-1 rounded-full font-bold text-lg
                      ${budget.isAutoMode 
                        ? 'text-slate-600 bg-slate-100' 
                        : 'text-primary-600 bg-primary-50 hover:bg-primary-100 cursor-pointer'
                      }
                    `}
                  >
                    {category.percentage}%
                  </button>
                )}

                {/* Remove button (only for custom categories in manual mode) */}
                {!budget.isAutoMode && category.isCustom && (
                  <button
                    onClick={() => onRemoveCategory(category.id)}
                    className="p-1 text-red-400 hover:text-red-600 transition-colors"
                    aria-label="Remove category"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}

            {/* Add Category Button */}
            {!budget.isAutoMode && (
              <button
                onClick={() => setShowAddModal(true)}
                className="w-full flex items-center gap-3 px-4 py-3 text-primary-600 hover:bg-primary-50 transition-colors"
              >
                <span className="w-10 h-10 flex items-center justify-center bg-primary-100 rounded-full">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </span>
                <span className="font-semibold">Add another expense</span>
              </button>
            )}
          </div>
        </Card>
      )}

      {/* Tips */}
      <Card padding="md" className={`bg-gradient-to-br ${hasDebtProblem ? 'from-amber-50 to-orange-50' : 'from-primary-50 to-blue-50'}`}>
        <h3 className={`font-semibold mb-2 ${hasDebtProblem ? 'text-amber-800' : 'text-primary-800'}`}>
          💡 {hasDebtProblem ? 'Debt Payoff Tips' : 'Budget Tips'}
        </h3>
        {hasDebtProblem ? (
          <ul className="space-y-1 text-sm text-amber-700">
            <li>• List debts smallest to largest (debt snowball method)</li>
            <li>• Pay minimums on all debts except the smallest</li>
            <li>• Attack the smallest debt with everything extra</li>
            <li>• Once paid off, roll that payment to the next debt</li>
            <li>• Consider a side hustle to accelerate payoff</li>
          </ul>
        ) : (
          <ul className="space-y-1 text-sm text-primary-700">
            <li>• Try not to spend more than 35% on rent & utilities</li>
            <li>• 10% savings is healthy, but aim higher when possible!</li>
            <li>• Pay off high-interest debt before investing heavily</li>
            <li>• Build a 3-6 month emergency fund in savings</li>
          </ul>
        )}
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <Button variant="outline" onClick={onReset} className="flex-1">
          Reset
        </Button>
        {!hasDebtProblem && (
          <Button onClick={onContinueToPortfolio} className="flex-1">
            <span className="inline-flex items-center gap-2 whitespace-nowrap">
              Continue to Investments
              <span>→</span>
            </span>
          </Button>
        )}
      </div>

      {/* Add Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-sm animate-slide-up">
            <h2 className="font-display text-xl font-bold text-slate-800 mb-4">
              Add Category
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="e.g., Entertainment"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  Percentage
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={newCategoryPercentage}
                  onChange={(e) => setNewCategoryPercentage(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button variant="outline" onClick={() => setShowAddModal(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleAddCategory} disabled={!newCategoryName} className="flex-1">
                Add
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
