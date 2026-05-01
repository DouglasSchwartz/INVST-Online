import { DEFAULT_TAX_RATE, DEFAULT_BUDGET_CATEGORIES } from '../data/defaults';
import { 
  UserProfile, 
  Debts, 
  Budget, 
  BudgetCategory, 
  PortfolioAllocation,
  InvestorProfile,
  AssetAllocation,
} from '../types';

/**
 * Calculate after-tax income from gross income
 */
export function calculateAfterTaxIncome(grossIncome: number, taxRate: number = DEFAULT_TAX_RATE): number {
  return Math.round(grossIncome * (1 - taxRate));
}

/**
 * Calculate total monthly debt payments (fixed obligations)
 */
export function calculateTotalDebtPayments(debts: Debts): number {
  let total = 0;
  if (debts.hasCreditCardDebt && debts.creditCardPayment) {
    total += debts.creditCardPayment;
  }
  if (debts.hasStudentLoans && debts.studentLoanPayment) {
    total += debts.studentLoanPayment;
  }
  if (debts.hasHospitalBills && debts.hospitalBillPayment) {
    total += debts.hospitalBillPayment;
  }
  return total;
}

/**
 * Generate initial budget from user profile and debts
 * GUARANTEES: Total percentages will ALWAYS equal exactly 100%
 */
export function generateBudget(userProfile: UserProfile, debts: Debts): Budget {
  if (!userProfile.monthlyIncome) {
    throw new Error('Monthly income is required to generate budget');
  }

  // Calculate after-tax income
  const afterTaxIncome = userProfile.incomeType === 'before_tax'
    ? calculateAfterTaxIncome(userProfile.monthlyIncome)
    : userProfile.monthlyIncome;

  // Calculate actual debt payments (what user reports paying)
  const actualDebtPayments = calculateTotalDebtPayments(debts);

  // Cap debt at 5% per type
  const MAX_DEBT_PERCENT = 5;
  const maxDebtAmount = Math.round((MAX_DEBT_PERCENT / 100) * afterTaxIncome);

  let hasDebtWarning = false;
  let usedPercentage = 0;
  const categories: BudgetCategory[] = [];

  // Helper to add a fixed category
  const addFixedCategory = (id: string, name: string, amount: number, isDebt: boolean, icon: string) => {
    const pct = Math.round((amount / afterTaxIncome) * 100);
    usedPercentage += pct;
    categories.push({
      id, name, percentage: pct, amount, isCustom: false, isDebt, isFixed: true, icon
    });
    return pct;
  };

  // Add debt categories (capped at 5% each)
  if (debts.hasCreditCardDebt && debts.creditCardPayment) {
    const actual = debts.creditCardPayment;
    const capped = Math.min(actual, maxDebtAmount);
    if (actual > capped) hasDebtWarning = true;
    addFixedCategory('credit-card-debt', 'Credit Card Payment', capped, true, '💳');
  }

  if (debts.hasStudentLoans && debts.studentLoanPayment) {
    const actual = debts.studentLoanPayment;
    const capped = Math.min(actual, maxDebtAmount);
    if (actual > capped) hasDebtWarning = true;
    addFixedCategory('student-loans', 'Student Loans', capped, true, '🎓');
  }

  if (debts.hasHospitalBills && debts.hospitalBillPayment) {
    const actual = debts.hospitalBillPayment;
    const capped = Math.min(actual, maxDebtAmount);
    if (actual > capped) hasDebtWarning = true;
    addFixedCategory('hospital-bills', 'Hospital Bills', capped, true, '🏥');
  }

  // Healthcare (not capped - it's a real expense)
  if (userProfile.healthcarePayer === 'self' && userProfile.healthcareCost) {
    addFixedCategory('healthcare', 'Healthcare Premium', userProfile.healthcareCost, false, '🏥');
  }

  // Calculate remaining percentage for flexible spending
  const remainingPct = 100 - usedPercentage;

  if (remainingPct <= 0) {
    // No room - set all flexible to 0
    DEFAULT_BUDGET_CATEGORIES.forEach(cat => {
      categories.push({
        ...cat, percentage: 0, amount: 0, isFixed: false
      });
    });
  } else {
    // Distribute remaining percentage across default categories proportionally
    const defaultTotal = DEFAULT_BUDGET_CATEGORIES.reduce((s, c) => s + c.percentage, 0);
    
    // Calculate scaled percentages
    const scaled = DEFAULT_BUDGET_CATEGORIES.map(cat => ({
      ...cat,
      scaledPct: (cat.percentage / defaultTotal) * remainingPct
    }));
    
    // Use largest remainder method for exact distribution
    const floored = scaled.map(cat => ({
      ...cat,
      floorPct: Math.floor(cat.scaledPct),
      remainder: cat.scaledPct - Math.floor(cat.scaledPct)
    }));
    
    let totalFloored = floored.reduce((s, c) => s + c.floorPct, 0);
    let toDistribute = remainingPct - totalFloored;
    
    // Sort by remainder descending to distribute extra points
    const byRemainder = [...floored].sort((a, b) => b.remainder - a.remainder);
    
    for (let i = 0; toDistribute > 0 && i < byRemainder.length; i++) {
      byRemainder[i].floorPct += 1;
      toDistribute--;
    }
    
    // Add flexible categories
    floored.forEach(cat => {
      categories.push({
        id: cat.id,
        name: cat.name,
        percentage: cat.floorPct,
        amount: Math.round((cat.floorPct / 100) * afterTaxIncome),
        isCustom: cat.isCustom,
        isDebt: cat.isDebt,
        isFixed: false,
        icon: cat.icon,
      });
    });
  }

  // FINAL CHECK: Ensure exactly 100%
  const total = categories.reduce((s, c) => s + c.percentage, 0);
  if (total !== 100) {
    // Adjust the largest flexible category
    const flexible = categories.filter(c => !c.isFixed && c.percentage > 0);
    if (flexible.length > 0) {
      // Find by index in original array to modify it
      const largestId = flexible.reduce((max, c) => c.percentage > max.percentage ? c : max).id;
      const idx = categories.findIndex(c => c.id === largestId);
      if (idx >= 0) {
        categories[idx].percentage += (100 - total);
        categories[idx].amount = Math.round((categories[idx].percentage / 100) * afterTaxIncome);
      }
    }
  }

  const cappedDebtPayments = categories.filter(c => c.isDebt).reduce((s, c) => s + c.amount, 0);

  return {
    categories,
    totalIncome: userProfile.monthlyIncome,
    afterTaxIncome,
    totalDebtPayments: cappedDebtPayments,
    actualDebtPayments,
    isAutoMode: true,
    hasExcessiveDebt: hasDebtWarning || actualDebtPayments > (afterTaxIncome * 0.15),
  };
}

/**
 * Recalculate budget amounts when percentages change
 * Note: Fixed amounts (debts, healthcare) don't change - only their percentage representation
 */
export function recalculateBudgetAmounts(budget: Budget): Budget {
  const updatedCategories = budget.categories.map(cat => {
    // Fixed categories keep their fixed amount, just update percentage display
    if (cat.isFixed) {
      return {
        ...cat,
        percentage: Math.round((cat.amount / budget.afterTaxIncome) * 100),
      };
    }
    // Non-fixed categories: calculate amount from percentage
    return {
      ...cat,
      amount: Math.round((cat.percentage / 100) * budget.afterTaxIncome),
    };
  });

  return {
    ...budget,
    categories: updatedCategories,
  };
}

/**
 * Validate that budget percentages sum to 100%
 */
export function validateBudgetPercentages(budget: Budget): { 
  isValid: boolean; 
  total: number;
  hasExcessiveDebt: boolean;
} {
  const total = budget.categories.reduce((sum, cat) => sum + cat.percentage, 0);
  const fixedTotal = budget.categories
    .filter(cat => cat.isFixed)
    .reduce((sum, cat) => sum + cat.percentage, 0);
  
  return {
    isValid: total === 100 || (fixedTotal >= 100), // Valid if 100% OR if debt alone exceeds 100%
    total,
    hasExcessiveDebt: fixedTotal >= 100,
  };
}

/**
 * Calculate a comprehensive portfolio allocation based on full investor profile
 * 
 * INSTITUTIONAL ALLOCATION PRINCIPLES:
 * 1. Age/Time Horizon are PRIMARY drivers - they determine the equity allocation RANGE
 * 2. Risk Tolerance determines WHERE within that range the investor falls
 * 3. Behavioral factors (market reaction, experience) can REDUCE but not increase beyond bounds
 * 4. The best allocation is one the investor can actually stick with
 * 
 * Age-Based Equity Ranges (institutional standard):
 * - 18-25: 80-100% (maximize long-term growth)
 * - 26-35: 70-95% (growth with some stability)
 * - 36-45: 60-85% (balance growth and stability)
 * - 46-55: 50-70% (risk moderation begins)
 * - 56-65: 40-60% (sequence-of-returns protection)
 * - 65+:   10-40% (preservation mode)
 */
export function calculatePortfolioAllocation(
  investorProfile: InvestorProfile,
  monthlySavings: number
): PortfolioAllocation | null {
  const { age, investmentGoal, experience, marketDropReaction, emergencyFund, timeHorizon, riskTolerance } = investorProfile;
  
  // Need minimum inputs to calculate
  if (!timeHorizon || !riskTolerance) {
    return null;
  }

  const notes: string[] = [];
  const taxTips: string[] = [];

  // =================================================================
  // STEP 1: Determine age-based equity allocation RANGE
  // This is the institutional foundation - age determines the bounds
  // =================================================================
  
  interface AllocationRange {
    minEquity: number;
    maxEquity: number;
    lifeStage: string;
    objective: string;
  }
  
  const getAgeBasedRange = (ageRange: typeof age): AllocationRange => {
    switch (ageRange) {
      case '18-25':
        return { 
          minEquity: 80, maxEquity: 100, 
          lifeStage: 'Early Career',
          objective: 'Maximize long-term real growth'
        };
      case '26-35':
        return { 
          minEquity: 70, maxEquity: 95, 
          lifeStage: 'Growth Phase',
          objective: 'Aggressive growth with emerging stability'
        };
      case '36-45':
        return { 
          minEquity: 60, maxEquity: 85, 
          lifeStage: 'Peak Earning Years',
          objective: 'Balance growth with drawdown control'
        };
      case '46-55':
        return { 
          minEquity: 50, maxEquity: 70, 
          lifeStage: 'Pre-Retirement',
          objective: 'Risk moderation, protecting accumulated wealth'
        };
      case '56-65':
        return { 
          minEquity: 40, maxEquity: 60, 
          lifeStage: 'Near Retirement',
          objective: 'Capital preservation + sustainable withdrawals'
        };
      case '65+':
        return { 
          minEquity: 10, maxEquity: 40, 
          lifeStage: 'Retirement',
          objective: 'Income stability and capital preservation'
        };
      default:
        // If no age provided, use moderate assumptions (35-45 range)
        return { 
          minEquity: 60, maxEquity: 85, 
          lifeStage: 'Moderate',
          objective: 'Balanced growth and stability'
        };
    }
  };
  
  const ageRange = getAgeBasedRange(age);
  
  // =================================================================
  // STEP 2: Time Horizon adjusts position WITHIN the age range
  // Longer horizons push toward max, shorter toward min
  // =================================================================
  
  let horizonMultiplier = 0.5; // Default to middle of range
  switch (timeHorizon) {
    case '30+':
      horizonMultiplier = 1.0;   // Maximum of range
      notes.push('With 30+ years to invest, you can fully capture long-term equity returns through market cycles.');
      break;
    case '15-30':
      horizonMultiplier = 0.75;  // Upper-middle of range
      notes.push('A 15-30 year horizon allows for meaningful equity exposure while moderating sequence risk.');
      break;
    case '5-15':
      horizonMultiplier = 0.4;   // Lower-middle of range
      notes.push('With 5-15 years, volatility management becomes more important than maximum growth.');
      break;
    case '0-5':
      horizonMultiplier = 0.0;   // Minimum of range
      notes.push('Short-term goals require capital preservation - bonds and cash protect against untimely drawdowns.');
      break;
  }
  
  // Calculate base equity from age range and time horizon
  const rangeSpread = ageRange.maxEquity - ageRange.minEquity;
  let baseEquity = Math.round(ageRange.minEquity + (rangeSpread * horizonMultiplier));
  
  // =================================================================
  // STEP 3: Risk Tolerance fine-tunes within a narrower band (+/- 10%)
  // This respects the investor's comfort level without overriding fundamentals
  // =================================================================
  
  let toleranceAdjustment = 0;
  switch (riskTolerance) {
    case 'aggressive':
      toleranceAdjustment = 10;
      break;
    case 'moderate':
      toleranceAdjustment = 0;
      break;
    case 'conservative':
      toleranceAdjustment = -10;
      break;
  }
  
  baseEquity = Math.round(baseEquity + toleranceAdjustment);
  
  // Enforce the age-appropriate bounds
  baseEquity = Math.max(ageRange.minEquity, Math.min(ageRange.maxEquity, baseEquity));
  
  // =================================================================
  // STEP 4: Behavioral factors - can REDUCE equity, never increase beyond bounds
  // These are safety valves based on realistic investor behavior
  // =================================================================
  
  let behavioralReduction = 0;
  
  // Market reaction is a strong behavioral signal
  if (marketDropReaction === 'sell') {
    behavioralReduction += 10;
    notes.push('Your reaction to market drops suggests a more conservative allocation will help you stay invested through volatility.');
  } else if (marketDropReaction === 'buy_more') {
    notes.push('Your willingness to buy during downturns is a valuable behavioral advantage.');
  }
  
  // Experience affects ability to stay the course
  if (experience === 'beginner') {
    behavioralReduction += 5;
    notes.push('As a newer investor, starting with a slightly conservative allocation helps build conviction. Consider a simple 3-fund approach.');
  } else if (experience === 'experienced') {
    notes.push('Your investment experience should help you navigate market volatility without panic selling.');
  }
  
  // Emergency fund is crucial - without it, you may be forced to sell at bad times
  if (emergencyFund === 'none') {
    behavioralReduction += 10;
    notes.push('⚠️ PRIORITY: Build 3-6 months of expenses in savings before investing. Forced selling during emergencies locks in losses.');
  } else if (emergencyFund === 'partial') {
    behavioralReduction += 5;
    notes.push('Continue building your emergency fund to 3-6 months of expenses while investing.');
  }
  
  // Apply behavioral reduction
  baseEquity = Math.max(ageRange.minEquity, baseEquity - behavioralReduction);
  
  // =================================================================
  // STEP 5: Investment goal overrides for special cases
  // =================================================================
  
  if (investmentGoal === 'emergency') {
    baseEquity = 0;
    notes.length = 0; // Clear previous notes
    notes.push('Emergency funds should stay in high-yield savings or money market funds - NOT invested in stocks.');
  } else if (investmentGoal === 'home' && timeHorizon === '0-5') {
    baseEquity = Math.min(baseEquity, 30);
    notes.push('For a near-term home down payment, we cap equity exposure to protect your capital.');
  } else if (investmentGoal === 'retirement') {
    notes.push('Maximize tax-advantaged accounts (401k, IRA) before taxable investing.');
  }
  
  // =================================================================
  // STEP 6: Calculate final allocation percentages
  // =================================================================
  
  // Round to nearest 5% for cleanliness
  let targetStocks = Math.round(baseEquity / 5) * 5;
  
  // Cash allocation based on circumstances
  let targetCash = 0;
  if (timeHorizon === '0-5') {
    targetCash = 10; // Short-term needs liquidity
  } else if (emergencyFund !== 'full' && investmentGoal !== 'emergency') {
    targetCash = 5;  // Build a buffer while investing
  }
  
  // Alternatives (REITs for real asset exposure) - only for longer horizons and moderate+ allocation
  let targetAlternatives = 0;
  if (targetStocks >= 50 && timeHorizon !== '0-5') {
    targetAlternatives = 5;
    if (targetStocks >= 70) {
      targetAlternatives = 10;
    }
  }
  
  // Bonds get the remainder - ensures 100% total
  let targetBonds = 100 - targetStocks - targetAlternatives - targetCash;
  
  // Safety: if bonds go negative, reduce alternatives then stocks
  if (targetBonds < 0) {
    if (targetAlternatives > 0) {
      const reduction = Math.min(targetAlternatives, -targetBonds);
      targetAlternatives -= reduction;
      targetBonds += reduction;
    }
    if (targetBonds < 0) {
      targetStocks += targetBonds;
      targetBonds = 0;
    }
  }
  
  // Final rounding safety check
  const categoryTotal = targetStocks + targetBonds + targetAlternatives + targetCash;
  if (categoryTotal !== 100) {
    targetBonds += (100 - categoryTotal);
  }
  
  // Calculate risk score (1-10) for display - derived from final equity %
  // Maps 0% equity → 1, 100% equity → 10
  const riskScore = Math.round(1 + (targetStocks / 100) * 9);

  // Build detailed asset allocations - each category's sub-allocations must sum to category total
  const allocations: AssetAllocation[] = [];

  // === STOCKS BREAKDOWN (must sum to targetStocks) ===
  // Younger investors get more growth tilt (small cap, emerging)
  // Older investors get more defensive tilt (large cap focus, less emerging)
  if (targetStocks > 0) {
    // Determine growth vs defensive tilt based on age and risk
    const isGrowthTilted = (age === '18-25' || age === '26-35') && riskTolerance !== 'conservative';
    const isDefensiveTilted = (age === '56-65' || age === '65+') || riskTolerance === 'conservative';
    const includeEmerging = !isDefensiveTilted && targetStocks >= 40;
    const includeSmallCap = targetStocks >= 30;
    
    // Calculate sub-allocation percentages based on tilt
    let usLargeCapPct: number;
    let usSmallMidPct: number;
    let intlDevelopedPct: number;
    let emergingPct: number;
    
    if (isGrowthTilted) {
      // Growth tilt: more small cap and emerging markets
      usLargeCapPct = 0.45;
      usSmallMidPct = 0.20;
      intlDevelopedPct = 0.25;
      emergingPct = includeEmerging ? 0.10 : 0;
    } else if (isDefensiveTilted) {
      // Defensive tilt: focus on large cap stability
      usLargeCapPct = 0.60;
      usSmallMidPct = includeSmallCap ? 0.10 : 0;
      intlDevelopedPct = 0.25;
      emergingPct = 0;
    } else {
      // Balanced: standard diversified allocation
      usLargeCapPct = 0.50;
      usSmallMidPct = includeSmallCap ? 0.15 : 0;
      intlDevelopedPct = 0.25;
      emergingPct = includeEmerging ? 0.10 : 0;
    }
    
    // If not including small cap, redistribute to large cap
    if (!includeSmallCap) {
      usLargeCapPct += usSmallMidPct;
      usSmallMidPct = 0;
    }
    
    // If not including emerging, redistribute to international developed
    if (!includeEmerging) {
      intlDevelopedPct += emergingPct;
      emergingPct = 0;
    }
    
    // Calculate actual percentages
    let usLargeCap = Math.round(targetStocks * usLargeCapPct);
    let usSmallMid = Math.round(targetStocks * usSmallMidPct);
    let intlDeveloped = Math.round(targetStocks * intlDevelopedPct);
    let emerging = Math.round(targetStocks * emergingPct);
    
    // Adjust to ensure stock sub-allocations sum to targetStocks exactly
    const stockSubTotal = usLargeCap + usSmallMid + intlDeveloped + emerging;
    if (stockSubTotal !== targetStocks) {
      usLargeCap += (targetStocks - stockSubTotal); // Add/subtract difference to largest
    }
    
    if (usLargeCap > 0) {
      allocations.push({
        name: 'US Large Cap Stocks',
        percentage: usLargeCap,
        amount: Math.round((usLargeCap / 100) * monthlySavings),
        category: 'stocks',
        taxEfficiency: 'high',
        description: 'Core US stock market - large established companies',
        icon: '🇺🇸',
      });
    }
    if (usSmallMid > 0) {
      allocations.push({
        name: 'US Small & Mid Cap',
        percentage: usSmallMid,
        amount: Math.round((usSmallMid / 100) * monthlySavings),
        category: 'stocks',
        taxEfficiency: 'medium',
        description: 'Smaller US companies with higher growth potential',
        icon: '📈',
      });
    }
    if (intlDeveloped > 0) {
      allocations.push({
        name: 'International Developed',
        percentage: intlDeveloped,
        amount: Math.round((intlDeveloped / 100) * monthlySavings),
        category: 'stocks',
        taxEfficiency: 'medium',
        description: 'Europe, Japan, Australia - global diversification',
        icon: '🌍',
      });
    }
    if (emerging > 0) {
      allocations.push({
        name: 'Emerging Markets',
        percentage: emerging,
        amount: Math.round((emerging / 100) * monthlySavings),
        category: 'stocks',
        taxEfficiency: 'low',
        description: 'China, India, Brazil - higher growth potential',
        icon: '🌏',
      });
    }
  }

  // === BONDS BREAKDOWN (must sum to targetBonds) ===
  if (targetBonds > 0) {
    const includeTips = timeHorizon !== '0-5' && targetBonds >= 10;
    
    let usBonds = Math.round(targetBonds * 0.60);
    let tips = includeTips ? Math.round(targetBonds * 0.20) : 0;
    let intlBonds = Math.round(targetBonds * 0.20);
    
    // If no TIPS, redistribute to US bonds
    if (!includeTips) {
      usBonds = Math.round(targetBonds * 0.75);
      intlBonds = targetBonds - usBonds;
    } else {
      // Adjust to ensure bond sub-allocations sum to targetBonds exactly
      const bondSubTotal = usBonds + tips + intlBonds;
      if (bondSubTotal !== targetBonds) {
        usBonds += (targetBonds - bondSubTotal);
      }
    }
    
    if (usBonds > 0) {
      allocations.push({
        name: 'US Total Bond Market',
        percentage: usBonds,
        amount: Math.round((usBonds / 100) * monthlySavings),
        category: 'bonds',
        taxEfficiency: 'low',
        description: 'Government and corporate bonds - stability and income',
        icon: '🏛️',
      });
    }
    if (tips > 0) {
      allocations.push({
        name: 'TIPS (Inflation Protected)',
        percentage: tips,
        amount: Math.round((tips / 100) * monthlySavings),
        category: 'bonds',
        taxEfficiency: 'low',
        description: 'Treasury bonds that adjust for inflation',
        icon: '🛡️',
      });
    }
    if (intlBonds > 0) {
      allocations.push({
        name: 'International Bonds',
        percentage: intlBonds,
        amount: Math.round((intlBonds / 100) * monthlySavings),
        category: 'bonds',
        taxEfficiency: 'low',
        description: 'Global bond diversification',
        icon: '🌐',
      });
    }
  }

  // === ALTERNATIVES (must sum to targetAlternatives) ===
  if (targetAlternatives > 0) {
    const includeCommodities = riskScore >= 7;
    
    let reits: number;
    let commodities: number;
    
    if (includeCommodities) {
      reits = Math.round(targetAlternatives * 0.60);
      commodities = targetAlternatives - reits; // Remainder goes to commodities
    } else {
      reits = targetAlternatives; // All to REITs
      commodities = 0;
    }
    
    if (reits > 0) {
      allocations.push({
        name: 'REITs (Real Estate)',
        percentage: reits,
        amount: Math.round((reits / 100) * monthlySavings),
        category: 'alternatives',
        taxEfficiency: 'low',
        description: 'Real estate exposure without owning property',
        icon: '🏢',
      });
    }
    if (commodities > 0) {
      allocations.push({
        name: 'Commodities & Gold',
        percentage: commodities,
        amount: Math.round((commodities / 100) * monthlySavings),
        category: 'alternatives',
        taxEfficiency: 'low',
        description: 'Inflation hedge and portfolio diversifier',
        icon: '🥇',
      });
    }
  }

  // === CASH ===
  if (targetCash > 0) {
    allocations.push({
      name: 'Cash / Money Market',
      percentage: targetCash,
      amount: Math.round((targetCash / 100) * monthlySavings),
      category: 'cash',
      taxEfficiency: 'medium',
      description: 'Liquidity and stability - high-yield savings or money market',
      icon: '💵',
    });
  }

  // Final verification - recalculate totals from actual allocations
  const finalTotalStocks = allocations.filter(a => a.category === 'stocks').reduce((sum, a) => sum + a.percentage, 0);
  const finalTotalBonds = allocations.filter(a => a.category === 'bonds').reduce((sum, a) => sum + a.percentage, 0);
  const finalTotalAlternatives = allocations.filter(a => a.category === 'alternatives').reduce((sum, a) => sum + a.percentage, 0);
  const finalTotalCash = allocations.filter(a => a.category === 'cash').reduce((sum, a) => sum + a.percentage, 0);
  
  // Final sanity check - if still not 100%, adjust the largest allocation
  const grandTotal = finalTotalStocks + finalTotalBonds + finalTotalAlternatives + finalTotalCash;
  if (grandTotal !== 100 && allocations.length > 0) {
    const diff = 100 - grandTotal;
    // Find the largest allocation and adjust it
    let largestIdx = 0;
    let largestPct = 0;
    allocations.forEach((a, idx) => {
      if (a.percentage > largestPct) {
        largestPct = a.percentage;
        largestIdx = idx;
      }
    });
    allocations[largestIdx].percentage += diff;
    allocations[largestIdx].amount = Math.round((allocations[largestIdx].percentage / 100) * monthlySavings);
  }
  
  // Recalculate final totals after adjustment
  const verifiedTotalStocks = allocations.filter(a => a.category === 'stocks').reduce((sum, a) => sum + a.percentage, 0);
  const verifiedTotalBonds = allocations.filter(a => a.category === 'bonds').reduce((sum, a) => sum + a.percentage, 0);
  const verifiedTotalAlternatives = allocations.filter(a => a.category === 'alternatives').reduce((sum, a) => sum + a.percentage, 0);
  const verifiedTotalCash = allocations.filter(a => a.category === 'cash').reduce((sum, a) => sum + a.percentage, 0);

  // =================================================================
  // Generate contextual notes and tax tips
  // =================================================================
  
  // Add life stage context at the beginning
  notes.unshift(`📊 ${ageRange.lifeStage}: ${ageRange.objective}`);
  
  // Generate tax placement tips
  const lowTaxEfficiency = allocations.filter(a => a.taxEfficiency === 'low');
  const highTaxEfficiency = allocations.filter(a => a.taxEfficiency === 'high');

  if (lowTaxEfficiency.length > 0) {
    taxTips.push(`Hold tax-inefficient assets (${lowTaxEfficiency.map(a => a.name).join(', ')}) in tax-advantaged accounts like 401(k) or IRA.`);
  }
  if (highTaxEfficiency.length > 0) {
    taxTips.push(`Tax-efficient assets (${highTaxEfficiency.map(a => a.name).join(', ')}) can be held in taxable brokerage accounts.`);
  }
  if (verifiedTotalBonds >= 20) {
    taxTips.push('Bond interest is taxed as ordinary income - prioritize bonds in tax-deferred accounts.');
  }
  if (allocations.some(a => a.name.includes('REIT'))) {
    taxTips.push('REIT dividends are taxed as ordinary income - hold in tax-advantaged accounts if possible.');
  }
  
  // Asset location priority
  if (verifiedTotalStocks > 0 && verifiedTotalBonds > 0) {
    taxTips.push('Asset location tip: Fill tax-advantaged accounts with bonds first, then stocks in taxable accounts for lower tax drag.');
  }

  // Add allocation-level notes
  if (verifiedTotalStocks >= 80) {
    notes.push('This growth-focused allocation leverages your long time horizon. Expect volatility but stay the course.');
  } else if (verifiedTotalStocks >= 60) {
    notes.push('This balanced allocation provides growth potential while moderating volatility through diversification.');
  } else if (verifiedTotalStocks >= 40) {
    notes.push('This moderate allocation balances growth with capital preservation as your needs shift.');
  } else if (verifiedTotalStocks > 0) {
    notes.push('This conservative allocation prioritizes stability. Some equity exposure still combats inflation risk.');
  }
  
  // Important institutional principle
  if (verifiedTotalBonds > 0) {
    notes.push('Bonds serve as both volatility dampener and rebalancing fuel during equity selloffs.');
  }
  
  // Behavioral reminder
  notes.push('💡 The best allocation is one you can stick with through market cycles. Adjust if needed to stay invested.');

  return {
    investorProfile,
    monthlyInvestment: monthlySavings,
    totalStocks: verifiedTotalStocks,
    totalBonds: verifiedTotalBonds,
    totalAlternatives: verifiedTotalAlternatives,
    totalCash: verifiedTotalCash,
    allocations,
    riskScore: Math.round(riskScore),
    notes,
    taxTips,
  };
}

/**
 * Get monthly savings amount from budget
 */
export function getMonthlySavings(budget: Budget): number {
  const savingsCategory = budget.categories.find(cat => cat.id === 'saving');
  return savingsCategory?.amount || 0;
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format percentage for display
 */
export function formatPercentage(value: number): string {
  return `${value}%`;
}

/**
 * Generate a unique ID for custom categories
 */
export function generateCategoryId(): string {
  return `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
