import { useState, useCallback } from 'react';
import { 
  AppState, 
  AppScreen, 
  UserProfile, 
  Debts, 
  Budget,
  InvestorProfile,
  PortfolioAllocation,
  MaritalStatus,
  IncomeType,
  HealthcarePayer,
  AgeRange,
  InvestmentGoal,
  InvestmentExperience,
  MarketDropReaction,
  EmergencyFund,
  TimeHorizon,
  RiskTolerance,
  BudgetCategory
} from '../types';
import { 
  generateBudget, 
  recalculateBudgetAmounts, 
  calculatePortfolioAllocation,
  getMonthlySavings,
  generateCategoryId
} from '../utils/calculations';

const initialUserProfile: UserProfile = {
  maritalStatus: null,
  monthlyIncome: null,
  incomeType: null,
  location: '',
  healthcarePayer: null,
  healthcareCost: null,
};

const initialDebts: Debts = {
  hasCreditCardDebt: null,
  creditCardPayment: null,
  hasStudentLoans: null,
  studentLoanPayment: null,
  hasHospitalBills: null,
  hospitalBillPayment: null,
};

const initialInvestorProfile: InvestorProfile = {
  age: null,
  investmentGoal: null,
  experience: null,
  marketDropReaction: null,
  emergencyFund: null,
  timeHorizon: null,
  riskTolerance: null,
};

const initialState: AppState = {
  currentScreen: 'welcome',
  userProfile: initialUserProfile,
  debts: initialDebts,
  investorProfile: initialInvestorProfile,
  budget: null,
  portfolio: null,
};

// Screen flow order for budget onboarding
const BUDGET_SCREEN_FLOW: AppScreen[] = [
  'welcome',
  'marital-status',
  'income',
  'tax-status',
  'location',
  'credit-card-debt',
  'student-loans',
  'hospital-bills',
  'healthcare',
  'budget-result',
];

// Screen flow for investment onboarding
const INVESTMENT_SCREEN_FLOW: AppScreen[] = [
  'investor-age',
  'investment-goal',
  'investment-experience',
  'market-reaction',
  'emergency-fund',
  'time-horizon',
  'risk-tolerance',
  'portfolio-result',
];

export function useAppState() {
  const [state, setState] = useState<AppState>(initialState);

  // Navigation
  const goToScreen = useCallback((screen: AppScreen) => {
    setState(prev => ({ ...prev, currentScreen: screen }));
  }, []);

  const goToNextScreen = useCallback(() => {
    setState(prev => {
      const currentIndex = BUDGET_SCREEN_FLOW.indexOf(prev.currentScreen);
      const investmentIndex = INVESTMENT_SCREEN_FLOW.indexOf(prev.currentScreen);
      
      // Handle conditional screens for budget flow
      if (prev.currentScreen === 'credit-card-debt') {
        if (prev.debts.hasCreditCardDebt) {
          return { ...prev, currentScreen: 'credit-card-amount' };
        }
      }
      if (prev.currentScreen === 'student-loans') {
        if (prev.debts.hasStudentLoans) {
          return { ...prev, currentScreen: 'student-loan-amount' };
        }
      }
      if (prev.currentScreen === 'hospital-bills') {
        if (prev.debts.hasHospitalBills) {
          return { ...prev, currentScreen: 'hospital-bill-amount' };
        }
      }
      if (prev.currentScreen === 'healthcare') {
        if (prev.userProfile.healthcarePayer === 'self') {
          return { ...prev, currentScreen: 'healthcare-amount' };
        }
      }

      // Handle amount screens - go to next main screen
      if (prev.currentScreen === 'credit-card-amount') {
        return { ...prev, currentScreen: 'student-loans' };
      }
      if (prev.currentScreen === 'student-loan-amount') {
        return { ...prev, currentScreen: 'hospital-bills' };
      }
      if (prev.currentScreen === 'hospital-bill-amount') {
        return { ...prev, currentScreen: 'healthcare' };
      }
      if (prev.currentScreen === 'healthcare-amount') {
        const budget = generateBudget(prev.userProfile, prev.debts);
        return { ...prev, currentScreen: 'budget-result', budget };
      }

      // Special case: healthcare without self-pay goes to budget result
      if (prev.currentScreen === 'healthcare' && (prev.userProfile.healthcarePayer === 'employer' || prev.userProfile.healthcarePayer === 'none')) {
        const budget = generateBudget(prev.userProfile, prev.debts);
        return { ...prev, currentScreen: 'budget-result', budget };
      }

      // Handle budget flow
      if (currentIndex >= 0 && currentIndex < BUDGET_SCREEN_FLOW.length - 1) {
        const nextScreen = BUDGET_SCREEN_FLOW[currentIndex + 1];
        
        if (nextScreen === 'budget-result') {
          const budget = generateBudget(prev.userProfile, prev.debts);
          return { ...prev, currentScreen: nextScreen, budget };
        }
        
        return { ...prev, currentScreen: nextScreen };
      }

      // Handle investment flow
      if (investmentIndex >= 0 && investmentIndex < INVESTMENT_SCREEN_FLOW.length - 1) {
        const nextScreen = INVESTMENT_SCREEN_FLOW[investmentIndex + 1];
        
        // If going to portfolio result, calculate the portfolio
        if (nextScreen === 'portfolio-result') {
          const monthlySavings = prev.budget ? getMonthlySavings(prev.budget) : 0;
          const portfolio = calculatePortfolioAllocation(prev.investorProfile, monthlySavings);
          return { ...prev, currentScreen: nextScreen, portfolio };
        }
        
        return { ...prev, currentScreen: nextScreen };
      }

      return prev;
    });
  }, []);

  const goToPreviousScreen = useCallback(() => {
    setState(prev => {
      // Handle going back from amount screens
      if (prev.currentScreen === 'credit-card-amount') {
        return { ...prev, currentScreen: 'credit-card-debt' };
      }
      if (prev.currentScreen === 'student-loan-amount') {
        return { ...prev, currentScreen: 'student-loans' };
      }
      if (prev.currentScreen === 'hospital-bill-amount') {
        return { ...prev, currentScreen: 'hospital-bills' };
      }
      if (prev.currentScreen === 'healthcare-amount') {
        return { ...prev, currentScreen: 'healthcare' };
      }

      // Handle going back to amount screens if they were filled
      if (prev.currentScreen === 'student-loans' && prev.debts.hasCreditCardDebt && prev.debts.creditCardPayment) {
        return { ...prev, currentScreen: 'credit-card-amount' };
      }
      if (prev.currentScreen === 'hospital-bills' && prev.debts.hasStudentLoans && prev.debts.studentLoanPayment) {
        return { ...prev, currentScreen: 'student-loan-amount' };
      }
      if (prev.currentScreen === 'healthcare' && prev.debts.hasHospitalBills && prev.debts.hospitalBillPayment) {
        return { ...prev, currentScreen: 'hospital-bill-amount' };
      }

      // Handle budget flow back navigation
      const currentIndex = BUDGET_SCREEN_FLOW.indexOf(prev.currentScreen);
      if (currentIndex > 0) {
        return { ...prev, currentScreen: BUDGET_SCREEN_FLOW[currentIndex - 1] };
      }

      // Handle investment flow back navigation
      const investmentIndex = INVESTMENT_SCREEN_FLOW.indexOf(prev.currentScreen);
      if (investmentIndex > 0) {
        return { ...prev, currentScreen: INVESTMENT_SCREEN_FLOW[investmentIndex - 1] };
      }
      if (investmentIndex === 0) {
        // Go back to budget result from first investment screen
        return { ...prev, currentScreen: 'budget-result' };
      }

      return prev;
    });
  }, []);

  // Start investment flow from budget result
  const startInvestmentFlow = useCallback(() => {
    setState(prev => ({ ...prev, currentScreen: 'investor-age' }));
  }, []);

  // User Profile updates
  const setMaritalStatus = useCallback((status: MaritalStatus) => {
    setState(prev => ({
      ...prev,
      userProfile: { ...prev.userProfile, maritalStatus: status },
    }));
  }, []);

  const setMonthlyIncome = useCallback((income: number) => {
    setState(prev => ({
      ...prev,
      userProfile: { ...prev.userProfile, monthlyIncome: income },
    }));
  }, []);

  const setIncomeType = useCallback((type: IncomeType) => {
    setState(prev => ({
      ...prev,
      userProfile: { ...prev.userProfile, incomeType: type },
    }));
  }, []);

  const setLocation = useCallback((location: string) => {
    setState(prev => ({
      ...prev,
      userProfile: { ...prev.userProfile, location },
    }));
  }, []);

  const setHealthcarePayer = useCallback((payer: HealthcarePayer) => {
    setState(prev => ({
      ...prev,
      userProfile: { ...prev.userProfile, healthcarePayer: payer },
    }));
  }, []);

  const setHealthcareCost = useCallback((cost: number) => {
    setState(prev => ({
      ...prev,
      userProfile: { ...prev.userProfile, healthcareCost: cost },
    }));
  }, []);

  // Debt updates
  const setCreditCardDebt = useCallback((hasDebt: boolean) => {
    setState(prev => ({
      ...prev,
      debts: { 
        ...prev.debts, 
        hasCreditCardDebt: hasDebt,
        creditCardPayment: hasDebt ? prev.debts.creditCardPayment : null,
      },
    }));
  }, []);

  const setCreditCardPayment = useCallback((payment: number) => {
    setState(prev => ({
      ...prev,
      debts: { ...prev.debts, creditCardPayment: payment },
    }));
  }, []);

  const setStudentLoans = useCallback((hasLoans: boolean) => {
    setState(prev => ({
      ...prev,
      debts: { 
        ...prev.debts, 
        hasStudentLoans: hasLoans,
        studentLoanPayment: hasLoans ? prev.debts.studentLoanPayment : null,
      },
    }));
  }, []);

  const setStudentLoanPayment = useCallback((payment: number) => {
    setState(prev => ({
      ...prev,
      debts: { ...prev.debts, studentLoanPayment: payment },
    }));
  }, []);

  const setHospitalBills = useCallback((hasBills: boolean) => {
    setState(prev => ({
      ...prev,
      debts: { 
        ...prev.debts, 
        hasHospitalBills: hasBills,
        hospitalBillPayment: hasBills ? prev.debts.hospitalBillPayment : null,
      },
    }));
  }, []);

  const setHospitalBillPayment = useCallback((payment: number) => {
    setState(prev => ({
      ...prev,
      debts: { ...prev.debts, hospitalBillPayment: payment },
    }));
  }, []);

  // Budget updates
  const setBudgetMode = useCallback((isAuto: boolean) => {
    setState(prev => {
      if (!prev.budget) return prev;
      
      if (isAuto) {
        const budget = generateBudget(prev.userProfile, prev.debts);
        return { ...prev, budget };
      }
      
      return {
        ...prev,
        budget: { ...prev.budget, isAutoMode: isAuto },
      };
    });
  }, []);

  const updateCategoryPercentage = useCallback((categoryId: string, percentage: number) => {
    setState(prev => {
      if (!prev.budget) return prev;
      
      const updatedCategories = prev.budget.categories.map(cat =>
        cat.id === categoryId ? { ...cat, percentage } : cat
      );
      
      const updatedBudget = recalculateBudgetAmounts({
        ...prev.budget,
        categories: updatedCategories,
        isAutoMode: false,
      });
      
      return { ...prev, budget: updatedBudget };
    });
  }, []);

  const updateCategoryName = useCallback((categoryId: string, name: string) => {
    setState(prev => {
      if (!prev.budget) return prev;
      
      const updatedCategories = prev.budget.categories.map(cat =>
        cat.id === categoryId ? { ...cat, name } : cat
      );
      
      return {
        ...prev,
        budget: { ...prev.budget, categories: updatedCategories },
      };
    });
  }, []);

  const addCategory = useCallback((name: string, percentage: number) => {
    setState(prev => {
      if (!prev.budget) return prev;
      
      const newCategory: BudgetCategory = {
        id: generateCategoryId(),
        name,
        percentage,
        amount: Math.round((percentage / 100) * prev.budget.afterTaxIncome),
        isCustom: true,
        isDebt: false,
        icon: '📦',
      };
      
      return {
        ...prev,
        budget: {
          ...prev.budget,
          categories: [...prev.budget.categories, newCategory],
          isAutoMode: false,
        },
      };
    });
  }, []);

  const removeCategory = useCallback((categoryId: string) => {
    setState(prev => {
      if (!prev.budget) return prev;
      
      const updatedCategories = prev.budget.categories.filter(cat => cat.id !== categoryId);
      
      return {
        ...prev,
        budget: {
          ...prev.budget,
          categories: updatedCategories,
          isAutoMode: false,
        },
      };
    });
  }, []);

  // Update budget income and recalculate all amounts based on percentages
  const updateBudgetIncome = useCallback((newIncome: number) => {
    setState(prev => {
      if (!prev.budget || newIncome <= 0) return prev;
      
      // Recalculate all category amounts based on new income
      const updatedCategories = prev.budget.categories.map(cat => ({
        ...cat,
        amount: Math.round((cat.percentage / 100) * newIncome),
      }));
      
      // Also update the userProfile income for consistency
      const updatedUserProfile = {
        ...prev.userProfile,
        monthlyIncome: newIncome,
        incomeType: 'after' as IncomeType, // If manually set, assume after-tax
      };
      
      return {
        ...prev,
        userProfile: updatedUserProfile,
        budget: {
          ...prev.budget,
          afterTaxIncome: newIncome,
          categories: updatedCategories,
          isAutoMode: false,
        },
      };
    });
  }, []);

  // Investor Profile updates
  const setInvestorAge = useCallback((age: AgeRange) => {
    setState(prev => ({
      ...prev,
      investorProfile: { ...prev.investorProfile, age },
    }));
  }, []);

  const setInvestmentGoal = useCallback((goal: InvestmentGoal) => {
    setState(prev => ({
      ...prev,
      investorProfile: { ...prev.investorProfile, investmentGoal: goal },
    }));
  }, []);

  const setInvestmentExperience = useCallback((experience: InvestmentExperience) => {
    setState(prev => ({
      ...prev,
      investorProfile: { ...prev.investorProfile, experience },
    }));
  }, []);

  const setMarketDropReaction = useCallback((reaction: MarketDropReaction) => {
    setState(prev => ({
      ...prev,
      investorProfile: { ...prev.investorProfile, marketDropReaction: reaction },
    }));
  }, []);

  const setEmergencyFund = useCallback((fund: EmergencyFund) => {
    setState(prev => ({
      ...prev,
      investorProfile: { ...prev.investorProfile, emergencyFund: fund },
    }));
  }, []);

  const setTimeHorizon = useCallback((horizon: TimeHorizon) => {
    setState(prev => ({
      ...prev,
      investorProfile: { ...prev.investorProfile, timeHorizon: horizon },
    }));
  }, []);

  const setRiskTolerance = useCallback((tolerance: RiskTolerance) => {
    setState(prev => ({
      ...prev,
      investorProfile: { ...prev.investorProfile, riskTolerance: tolerance },
    }));
  }, []);

  // Reset
  const resetAll = useCallback(() => {
    setState(initialState);
  }, []);

  // Calculate progress
  const getProgress = useCallback(() => {
    const totalSteps = BUDGET_SCREEN_FLOW.length - 1;
    const currentIndex = BUDGET_SCREEN_FLOW.indexOf(state.currentScreen);
    
    if (currentIndex <= 0) return 0;
    if (state.currentScreen === 'budget-result') return 100;
    
    let adjustedIndex = currentIndex;
    if (state.currentScreen.includes('amount')) {
      adjustedIndex = BUDGET_SCREEN_FLOW.indexOf(state.currentScreen.replace('-amount', '')) + 0.5;
    }
    
    return Math.round((adjustedIndex / totalSteps) * 100);
  }, [state.currentScreen]);

  // Calculate investment progress
  const getInvestmentProgress = useCallback(() => {
    const totalSteps = INVESTMENT_SCREEN_FLOW.length;
    const currentIndex = INVESTMENT_SCREEN_FLOW.indexOf(state.currentScreen);
    
    if (currentIndex < 0) return 0;
    if (state.currentScreen === 'portfolio-result') return 100;
    
    return Math.round(((currentIndex + 1) / totalSteps) * 100);
  }, [state.currentScreen]);

  return {
    state,
    // Navigation
    goToScreen,
    goToNextScreen,
    goToPreviousScreen,
    startInvestmentFlow,
    getProgress,
    getInvestmentProgress,
    // User Profile
    setMaritalStatus,
    setMonthlyIncome,
    setIncomeType,
    setLocation,
    setHealthcarePayer,
    setHealthcareCost,
    // Debts
    setCreditCardDebt,
    setCreditCardPayment,
    setStudentLoans,
    setStudentLoanPayment,
    setHospitalBills,
    setHospitalBillPayment,
    // Budget
    setBudgetMode,
    updateCategoryPercentage,
    updateCategoryName,
    addCategory,
    removeCategory,
    updateBudgetIncome,
    // Investor Profile
    setInvestorAge,
    setInvestmentGoal,
    setInvestmentExperience,
    setMarketDropReaction,
    setEmergencyFund,
    setTimeHorizon,
    setRiskTolerance,
    // Reset
    resetAll,
  };
}
