import { useAppState } from './hooks/useAppState';
import { ScreenLayout } from './components/layout';
import {
  WelcomeScreen,
  MaritalStatusScreen,
  IncomeScreen,
  TaxStatusScreen,
  LocationScreen,
  DebtQuestionScreen,
  DebtAmountScreen,
  HealthcareScreen,
  HealthcareAmountScreen,
  BudgetResultScreen,
  InvestorAgeScreen,
  InvestmentGoalScreen,
  InvestmentExperienceScreen,
  MarketReactionScreen,
  EmergencyFundScreen,
  TimeHorizonScreen,
  RiskToleranceScreen,
  PortfolioResultScreen,
} from './components/screens';
import { 
  MaritalStatus, 
  IncomeType, 
  HealthcarePayer, 
  AgeRange,
  InvestmentGoal,
  InvestmentExperience,
  MarketDropReaction,
  EmergencyFund,
  TimeHorizon, 
  RiskTolerance 
} from './types';

function App() {
  const {
    state,
    goToScreen,
    goToNextScreen,
    goToPreviousScreen,
    startInvestmentFlow,
    getProgress,
    getInvestmentProgress,
    setMaritalStatus,
    setMonthlyIncome,
    setIncomeType,
    setLocation,
    setHealthcarePayer,
    setHealthcareCost,
    setCreditCardDebt,
    setCreditCardPayment,
    setStudentLoans,
    setStudentLoanPayment,
    setHospitalBills,
    setHospitalBillPayment,
    setBudgetMode,
    updateCategoryPercentage,
    addCategory,
    removeCategory,
    updateBudgetIncome,
    setInvestorAge,
    setInvestmentGoal,
    setInvestmentExperience,
    setMarketDropReaction,
    setEmergencyFund,
    setTimeHorizon,
    setRiskTolerance,
    resetAll,
  } = useAppState();

  // Auto-advance handlers for budget flow
  const handleMaritalStatusSelect = (status: MaritalStatus) => {
    setMaritalStatus(status);
    setTimeout(() => goToNextScreen(), 200);
  };

  const handleTaxStatusSelect = (type: IncomeType) => {
    setIncomeType(type);
    setTimeout(() => goToNextScreen(), 200);
  };

  const handleCreditCardDebtSelect = (hasDebt: boolean) => {
    setCreditCardDebt(hasDebt);
    setTimeout(() => goToNextScreen(), 200);
  };

  const handleStudentLoansSelect = (hasLoans: boolean) => {
    setStudentLoans(hasLoans);
    setTimeout(() => goToNextScreen(), 200);
  };

  const handleHospitalBillsSelect = (hasBills: boolean) => {
    setHospitalBills(hasBills);
    setTimeout(() => goToNextScreen(), 200);
  };

  const handleHealthcarePayerSelect = (payer: HealthcarePayer) => {
    setHealthcarePayer(payer);
    setTimeout(() => goToNextScreen(), 200);
  };

  // Auto-advance handlers for investment flow
  const handleAgeSelect = (age: AgeRange) => {
    setInvestorAge(age);
    setTimeout(() => goToNextScreen(), 200);
  };

  const handleGoalSelect = (goal: InvestmentGoal) => {
    setInvestmentGoal(goal);
    setTimeout(() => goToNextScreen(), 200);
  };

  const handleExperienceSelect = (experience: InvestmentExperience) => {
    setInvestmentExperience(experience);
    setTimeout(() => goToNextScreen(), 200);
  };

  const handleMarketReactionSelect = (reaction: MarketDropReaction) => {
    setMarketDropReaction(reaction);
    setTimeout(() => goToNextScreen(), 200);
  };

  const handleEmergencyFundSelect = (fund: EmergencyFund) => {
    setEmergencyFund(fund);
    setTimeout(() => goToNextScreen(), 200);
  };

  const handleTimeHorizonSelect = (horizon: TimeHorizon) => {
    setTimeHorizon(horizon);
    setTimeout(() => goToNextScreen(), 200);
  };

  const handleRiskToleranceSelect = (tolerance: RiskTolerance) => {
    setRiskTolerance(tolerance);
    setTimeout(() => goToNextScreen(), 200);
  };

  const renderScreen = () => {
    switch (state.currentScreen) {
      case 'welcome':
        return <WelcomeScreen onStart={goToNextScreen} />;

      case 'marital-status':
        return (
          <MaritalStatusScreen
            value={state.userProfile.maritalStatus}
            onSelect={handleMaritalStatusSelect}
          />
        );

      case 'income':
        return (
          <IncomeScreen
            maritalStatus={state.userProfile.maritalStatus}
            value={state.userProfile.monthlyIncome}
            onChange={setMonthlyIncome}
            onContinue={goToNextScreen}
          />
        );

      case 'tax-status':
        return (
          <TaxStatusScreen
            value={state.userProfile.incomeType}
            onSelect={handleTaxStatusSelect}
          />
        );

      case 'location':
        return (
          <LocationScreen
            value={state.userProfile.location}
            onChange={setLocation}
            onContinue={goToNextScreen}
          />
        );

      case 'credit-card-debt':
        return (
          <DebtQuestionScreen
            debtType="credit-card"
            value={state.debts.hasCreditCardDebt}
            onSelect={handleCreditCardDebtSelect}
          />
        );

      case 'credit-card-amount':
        return (
          <DebtAmountScreen
            debtType="credit-card"
            value={state.debts.creditCardPayment}
            onChange={setCreditCardPayment}
            onContinue={goToNextScreen}
          />
        );

      case 'student-loans':
        return (
          <DebtQuestionScreen
            debtType="student-loans"
            value={state.debts.hasStudentLoans}
            onSelect={handleStudentLoansSelect}
          />
        );

      case 'student-loan-amount':
        return (
          <DebtAmountScreen
            debtType="student-loans"
            value={state.debts.studentLoanPayment}
            onChange={setStudentLoanPayment}
            onContinue={goToNextScreen}
          />
        );

      case 'hospital-bills':
        return (
          <DebtQuestionScreen
            debtType="hospital-bills"
            value={state.debts.hasHospitalBills}
            onSelect={handleHospitalBillsSelect}
          />
        );

      case 'hospital-bill-amount':
        return (
          <DebtAmountScreen
            debtType="hospital-bills"
            value={state.debts.hospitalBillPayment}
            onChange={setHospitalBillPayment}
            onContinue={goToNextScreen}
          />
        );

      case 'healthcare':
        return (
          <HealthcareScreen
            value={state.userProfile.healthcarePayer}
            onSelect={handleHealthcarePayerSelect}
          />
        );

      case 'healthcare-amount':
        return (
          <HealthcareAmountScreen
            value={state.userProfile.healthcareCost}
            onChange={setHealthcareCost}
            onContinue={goToNextScreen}
          />
        );

      case 'budget-result':
        if (!state.budget) return null;
        return (
          <BudgetResultScreen
            budget={state.budget}
            onToggleMode={setBudgetMode}
            onUpdatePercentage={updateCategoryPercentage}
            onUpdateIncome={updateBudgetIncome}
            onAddCategory={addCategory}
            onRemoveCategory={removeCategory}
            onContinueToPortfolio={startInvestmentFlow}
            onReset={resetAll}
          />
        );

      // Investment flow screens
      case 'investor-age':
        return (
          <InvestorAgeScreen
            value={state.investorProfile.age}
            onSelect={handleAgeSelect}
          />
        );

      case 'investment-goal':
        return (
          <InvestmentGoalScreen
            value={state.investorProfile.investmentGoal}
            onSelect={handleGoalSelect}
          />
        );

      case 'investment-experience':
        return (
          <InvestmentExperienceScreen
            value={state.investorProfile.experience}
            onSelect={handleExperienceSelect}
          />
        );

      case 'market-reaction':
        return (
          <MarketReactionScreen
            value={state.investorProfile.marketDropReaction}
            onSelect={handleMarketReactionSelect}
          />
        );

      case 'emergency-fund':
        return (
          <EmergencyFundScreen
            value={state.investorProfile.emergencyFund}
            onSelect={handleEmergencyFundSelect}
          />
        );

      case 'time-horizon':
        return (
          <TimeHorizonScreen
            value={state.investorProfile.timeHorizon}
            onSelect={handleTimeHorizonSelect}
          />
        );

      case 'risk-tolerance':
        return (
          <RiskToleranceScreen
            value={state.investorProfile.riskTolerance}
            onSelect={handleRiskToleranceSelect}
          />
        );

      case 'portfolio-result':
        if (!state.portfolio || !state.budget) return null;
        return (
          <PortfolioResultScreen
            portfolio={state.portfolio}
            budget={state.budget}
            onReset={resetAll}
            onBackToBudget={() => goToScreen('budget-result')}
          />
        );

      default:
        return null;
    }
  };

  // Determine navigation state
  const showNavigation = state.currentScreen !== 'welcome';
  const isResultScreen = ['budget-result', 'portfolio-result'].includes(state.currentScreen);
  
  // Investment flow screens
  const investmentScreens = [
    'investor-age', 'investment-goal', 'investment-experience', 
    'market-reaction', 'emergency-fund', 'time-horizon', 
    'risk-tolerance', 'portfolio-result'
  ];
  const isInvestmentFlow = investmentScreens.includes(state.currentScreen);

  // Calculate which progress to show
  const progress = isInvestmentFlow ? getInvestmentProgress() : getProgress();

  return (
    <ScreenLayout
      progress={progress}
      showProgress={showNavigation && !isResultScreen}
      showBack={showNavigation && !isResultScreen}
      onBack={goToPreviousScreen}
    >
      {renderScreen()}
    </ScreenLayout>
  );
}

export default App;
