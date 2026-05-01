import { BudgetCategory, TimeHorizon, RiskTolerance } from '../types';

// Default budget categories with recommended percentages
export const DEFAULT_BUDGET_CATEGORIES: Omit<BudgetCategory, 'amount'>[] = [
  { id: 'charity', name: 'Charity', percentage: 10, isCustom: false, isDebt: false, icon: '💝' },
  { id: 'saving', name: 'Saving', percentage: 10, isCustom: false, isDebt: false, icon: '🏦' },
  { id: 'rent', name: 'Rent / Utilities', percentage: 35, isCustom: false, isDebt: false, icon: '🏠' },
  { id: 'transport', name: 'Gas / Car', percentage: 10, isCustom: false, isDebt: false, icon: '🚗' },
  { id: 'food', name: 'Food / Supplies', percentage: 10, isCustom: false, isDebt: false, icon: '🛒' },
  { id: 'travel', name: 'Travel Fund', percentage: 10, isCustom: false, isDebt: false, icon: '✈️' },
  { id: 'spendable', name: 'Spendable', percentage: 15, isCustom: false, isDebt: false, icon: '💸' },
];

// Default tax rate estimate (22% effective rate for most middle-income earners)
export const DEFAULT_TAX_RATE = 0.22;

// Portfolio allocation matrix
// Maps [TimeHorizon][RiskTolerance] to equity percentage (fixed income = 100 - equity)
export const PORTFOLIO_MATRIX: Record<NonNullable<TimeHorizon>, Record<NonNullable<RiskTolerance>, number>> = {
  '0-5': {
    conservative: 10,
    moderate: 20,
    aggressive: 30,
  },
  '5-15': {
    conservative: 30,
    moderate: 45,
    aggressive: 60,
  },
  '15-30': {
    conservative: 50,
    moderate: 65,
    aggressive: 80,
  },
  '30+': {
    conservative: 65,
    moderate: 80,
    aggressive: 100,
  },
};

// Budget tips and guidance
export const BUDGET_TIPS = [
  {
    category: 'rent',
    message: "Try not to spend more than 35% on rent and utilities. 25-30% is ideal!",
    threshold: 35,
  },
  {
    category: 'saving',
    message: "10% savings is a healthy start, but try to push higher when you can!",
    threshold: 10,
  },
  {
    category: 'general',
    message: "A good budget allocates every dollar. Make sure your percentages add up to 100%.",
  },
];

// Emoji icons for different budget categories
export const CATEGORY_ICONS: Record<string, string> = {
  charity: '💝',
  saving: '🏦',
  rent: '🏠',
  transport: '🚗',
  food: '🛒',
  travel: '✈️',
  spendable: '💸',
  debt: '💳',
  healthcare: '🏥',
  education: '📚',
  entertainment: '🎬',
  fitness: '💪',
  pets: '🐕',
  clothing: '👕',
  gifts: '🎁',
  subscriptions: '📱',
};

// Time horizon display labels
export const TIME_HORIZON_LABELS: Record<NonNullable<TimeHorizon>, { label: string; description: string }> = {
  '0-5': {
    label: '0-5 Years',
    description: 'Short-term goals like emergency fund or upcoming purchase',
  },
  '5-15': {
    label: '5-15 Years',
    description: 'Medium-term goals like house down payment or starting a business',
  },
  '15-30': {
    label: '15-30 Years',
    description: 'Long-term goals like early retirement or children\'s education',
  },
  '30+': {
    label: '30+ Years',
    description: 'Very long-term like traditional retirement',
  },
};

// Risk tolerance display labels
export const RISK_TOLERANCE_LABELS: Record<NonNullable<RiskTolerance>, { label: string; description: string; reaction: string }> = {
  conservative: {
    label: 'Conservative',
    description: 'Prefer stability over growth',
    reaction: '"I\'d sell and move to safety"',
  },
  moderate: {
    label: 'Moderate',
    description: 'Balance between growth and stability',
    reaction: '"I\'d hold steady and wait it out"',
  },
  aggressive: {
    label: 'Aggressive',
    description: 'Maximize growth, accept volatility',
    reaction: '"I\'d buy more while it\'s cheap!"',
  },
};











