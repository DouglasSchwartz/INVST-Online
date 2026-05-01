// User profile and inputs
export type MaritalStatus = 'single' | 'married' | null;
export type IncomeType = 'before_tax' | 'after_tax' | null;
export type HealthcarePayer = 'self' | 'employer' | 'none' | null;

// Investment-related types
export type TimeHorizon = '0-5' | '5-15' | '15-30' | '30+' | null;
export type RiskTolerance = 'conservative' | 'moderate' | 'aggressive' | null;
export type InvestmentGoal = 'retirement' | 'home' | 'education' | 'wealth' | 'emergency' | null;
export type InvestmentExperience = 'beginner' | 'some' | 'experienced' | null;
export type MarketDropReaction = 'sell' | 'hold' | 'buy_more' | null;
export type AgeRange = '18-25' | '26-35' | '36-45' | '46-55' | '56-65' | '65+' | null;
export type EmergencyFund = 'none' | 'partial' | 'full' | null;

export interface UserProfile {
  maritalStatus: MaritalStatus;
  monthlyIncome: number | null;
  incomeType: IncomeType;
  location: string;
  healthcarePayer: HealthcarePayer;
  healthcareCost: number | null;
}

export interface Debts {
  hasCreditCardDebt: boolean | null;
  creditCardPayment: number | null;
  hasStudentLoans: boolean | null;
  studentLoanPayment: number | null;
  hasHospitalBills: boolean | null;
  hospitalBillPayment: number | null;
}

export interface InvestorProfile {
  age: AgeRange;
  investmentGoal: InvestmentGoal;
  experience: InvestmentExperience;
  marketDropReaction: MarketDropReaction;
  emergencyFund: EmergencyFund;
  timeHorizon: TimeHorizon;
  riskTolerance: RiskTolerance;
}

export interface BudgetCategory {
  id: string;
  name: string;
  percentage: number;
  amount: number;
  isCustom: boolean;
  isDebt: boolean;
  isFixed?: boolean;
  icon?: string;
}

export interface Budget {
  categories: BudgetCategory[];
  totalIncome: number;
  afterTaxIncome: number;
  totalDebtPayments: number;      // Capped amount in budget
  actualDebtPayments?: number;    // What user actually pays (may exceed cap)
  isAutoMode: boolean;
  hasExcessiveDebt?: boolean;
}

// Detailed asset class allocation
export interface AssetAllocation {
  name: string;
  percentage: number;
  amount: number;
  category: 'stocks' | 'bonds' | 'alternatives' | 'cash';
  taxEfficiency: 'high' | 'medium' | 'low';  // High = tax-efficient, hold anywhere
  description: string;
  icon: string;
}

export interface PortfolioAllocation {
  // Inputs
  investorProfile: InvestorProfile;
  monthlyInvestment: number;
  
  // High-level allocation (for visual summary)
  totalStocks: number;      // Total equity percentage
  totalBonds: number;       // Total fixed income percentage  
  totalAlternatives: number; // REITs, commodities, etc.
  totalCash: number;        // Cash/money market
  
  // Detailed breakdown by asset class
  allocations: AssetAllocation[];
  
  // Risk score (1-10)
  riskScore: number;
  
  // Recommendation notes
  notes: string[];
  
  // Tax placement tips
  taxTips: string[];
}

// App state
export type AppScreen = 
  | 'welcome'
  | 'marital-status'
  | 'income'
  | 'tax-status'
  | 'location'
  | 'credit-card-debt'
  | 'credit-card-amount'
  | 'student-loans'
  | 'student-loan-amount'
  | 'hospital-bills'
  | 'hospital-bill-amount'
  | 'healthcare'
  | 'healthcare-amount'
  | 'budget-result'
  // Investment screens
  | 'investor-age'
  | 'investment-goal'
  | 'investment-experience'
  | 'market-reaction'
  | 'emergency-fund'
  | 'time-horizon'
  | 'risk-tolerance'
  | 'portfolio-result';

export interface AppState {
  currentScreen: AppScreen;
  userProfile: UserProfile;
  debts: Debts;
  investorProfile: InvestorProfile;
  budget: Budget | null;
  portfolio: PortfolioAllocation | null;
}
