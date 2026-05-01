import { Card, OptionButton } from '../ui';

interface DebtQuestionScreenProps {
  debtType: 'credit-card' | 'student-loans' | 'hospital-bills';
  value: boolean | null;
  onSelect: (hasDebt: boolean) => void;
}

const DEBT_CONFIG = {
  'credit-card': {
    question: 'Are you paying off credit card debt?',
    subtitle: 'We\'ll ask for your monthly payment amount (not total balance).',
    yesIcon: '💳',
    noIcon: '✨',
  },
  'student-loans': {
    question: 'Do you have student loan payments?',
    subtitle: 'A fixed monthly payment toward education loans.',
    yesIcon: '🎓',
    noIcon: '🎉',
  },
  'hospital-bills': {
    question: 'Are you on a medical payment plan?',
    subtitle: 'Monthly payments toward hospital or medical bills.',
    yesIcon: '🏥',
    noIcon: '💪',
  },
};

export function DebtQuestionScreen({
  debtType,
  value,
  onSelect,
}: DebtQuestionScreenProps) {
  const config = DEBT_CONFIG[debtType];

  return (
    <div className="flex-1 flex flex-col">
      <Card className="flex-1 flex flex-col">
        {/* Question */}
        <div className="mb-8">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-800 leading-tight">
            {config.question}
          </h1>
          <p className="mt-3 text-slate-500 text-lg">
            {config.subtitle}
          </p>
        </div>

        {/* Options */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="space-y-4">
            <OptionButton
              selected={value === true}
              onClick={() => onSelect(true)}
              icon={config.yesIcon}
            >
              Yes
            </OptionButton>

            <OptionButton
              selected={value === false}
              onClick={() => onSelect(false)}
              icon={config.noIcon}
            >
              No
            </OptionButton>
          </div>
        </div>
      </Card>
    </div>
  );
}
