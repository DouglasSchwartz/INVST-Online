import { useState, useEffect } from 'react';
import { QuestionLayout } from '../layout';

interface HealthcareAmountScreenProps {
  value: number | null;
  onChange: (amount: number) => void;
  onContinue: () => void;
}

export function HealthcareAmountScreen({
  value,
  onChange,
  onContinue,
}: HealthcareAmountScreenProps) {
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

  const formattedValue = inputValue
    ? parseInt(inputValue, 10).toLocaleString()
    : '';

  return (
    <QuestionLayout
      question="How much do you pay per month?"
      subtitle="Your monthly health insurance premium."
      onContinue={onContinue}
      canContinue={!!value && value > 0}
    >
      <div className="text-center mb-6">
        <span className="text-5xl">🏥</span>
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

      <div className="mt-6 flex justify-center gap-2">
        {[200, 400, 600, 800].map((amount) => (
          <button
            key={amount}
            onClick={() => {
              setInputValue(amount.toString());
              onChange(amount);
            }}
            className="px-3 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
          >
            ${amount}
          </button>
        ))}
      </div>
    </QuestionLayout>
  );
}











