import { useState, useEffect } from 'react';
import { QuestionLayout } from '../layout';

interface DebtAmountScreenProps {
  debtType: 'credit-card' | 'student-loans' | 'hospital-bills';
  value: number | null;
  onChange: (amount: number) => void;
  onContinue: () => void;
}

const DEBT_CONFIG = {
  'credit-card': {
    question: 'What do you pay toward credit cards each month?',
    subtitle: 'Enter the amount you actually pay monthly — not your total balance.',
    icon: '💳',
    quickAmounts: [50, 100, 200, 300, 500, 750],
    note: 'Tip: This is your monthly payment, not the total you owe.',
  },
  'student-loans': {
    question: 'What\'s your monthly student loan payment?',
    subtitle: 'The amount automatically debited each month.',
    icon: '🎓',
    quickAmounts: [100, 200, 300, 400, 500, 750],
    note: null,
  },
  'hospital-bills': {
    question: 'What do you pay toward medical bills each month?',
    subtitle: 'Your monthly payment plan amount.',
    icon: '🏥',
    quickAmounts: [50, 100, 150, 200, 300, 500],
    note: null,
  },
};

export function DebtAmountScreen({
  debtType,
  value,
  onChange,
  onContinue,
}: DebtAmountScreenProps) {
  const [inputValue, setInputValue] = useState(value?.toString() || '');
  const config = DEBT_CONFIG[debtType];

  useEffect(() => {
    setInputValue(value?.toString() || '');
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setInputValue(raw);
    if (raw) {
      onChange(parseInt(raw, 10));
    }
  };

  const formattedValue = inputValue
    ? parseInt(inputValue, 10).toLocaleString()
    : '';

  return (
    <QuestionLayout
      question={config.question}
      subtitle={config.subtitle}
      onContinue={onContinue}
      canContinue={!!value && value > 0}
    >
      <div className="text-center mb-6">
        <span className="text-5xl">{config.icon}</span>
      </div>

      <div className="relative">
        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl text-slate-400 font-semibold">
          $
        </span>
        <input
          type="text"
          inputMode="numeric"
          value={formattedValue}
          onChange={handleChange}
          placeholder="0"
          className="
            w-full pl-10 pr-5 py-5
            text-3xl font-bold text-slate-800 text-center
            bg-slate-50 border-2 border-slate-200
            rounded-2xl
            placeholder:text-slate-300
            focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-100
            transition-all duration-200
          "
        />
        <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
          /month
        </span>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {config.quickAmounts.map((amount) => (
          <button
            key={amount}
            onClick={() => {
              setInputValue(amount.toString());
              onChange(amount);
            }}
            className={`
              px-3 py-2 text-sm font-medium rounded-full transition-colors
              ${value === amount 
                ? 'bg-primary-500 text-white' 
                : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
              }
            `}
          >
            ${amount}
          </button>
        ))}
      </div>

      {config.note && (
        <p className="mt-4 text-center text-sm text-amber-600 bg-amber-50 px-4 py-2 rounded-xl">
          💡 {config.note}
        </p>
      )}
    </QuestionLayout>
  );
}
