import { useState, useEffect } from 'react';
import { QuestionLayout } from '../layout';
import { MaritalStatus } from '../../types';

interface IncomeScreenProps {
  maritalStatus: MaritalStatus;
  value: number | null;
  onChange: (income: number) => void;
  onContinue: () => void;
}

export function IncomeScreen({
  maritalStatus,
  value,
  onChange,
  onContinue,
}: IncomeScreenProps) {
  const [inputValue, setInputValue] = useState(value?.toString() || '');

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

  const question = maritalStatus === 'married'
    ? "How much do you and your spouse make each month?"
    : "How much do you make each month?";

  const formattedValue = inputValue
    ? parseInt(inputValue, 10).toLocaleString()
    : '';

  // Income quick-select options
  const incomeOptions = [3000, 5000, 7500, 10000, 15000, 20000, 25000];

  return (
    <QuestionLayout
      question={question}
      subtitle="Enter your total monthly income before any deductions."
      onContinue={onContinue}
      canContinue={!!value && value > 0}
    >
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
        {incomeOptions.map((amount) => (
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
            ${amount >= 1000 ? `${amount / 1000}k` : amount}
          </button>
        ))}
      </div>
    </QuestionLayout>
  );
}
