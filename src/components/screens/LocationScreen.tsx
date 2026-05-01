import { useState, useEffect } from 'react';
import { QuestionLayout } from '../layout';

interface LocationScreenProps {
  value: string;
  onChange: (location: string) => void;
  onContinue: () => void;
}

// Popular US cities by region
const CITY_OPTIONS = [
  // Northeast
  'New York, NY',
  'Boston, MA',
  'Philadelphia, PA',
  // Southeast
  'Miami, FL',
  'Atlanta, GA',
  'Charlotte, NC',
  // Midwest
  'Chicago, IL',
  'Detroit, MI',
  'Minneapolis, MN',
  // Southwest
  'Dallas, TX',
  'Houston, TX',
  'Austin, TX',
  'Phoenix, AZ',
  // West Coast
  'Los Angeles, CA',
  'San Francisco, CA',
  'San Diego, CA',
  'Seattle, WA',
  'Denver, CO',
  'Portland, OR',
  'Las Vegas, NV',
];

export function LocationScreen({
  value,
  onChange,
  onContinue,
}: LocationScreenProps) {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onChange(e.target.value);
  };

  return (
    <QuestionLayout
      question="Where do you live?"
      subtitle="This helps us understand cost of living in your area."
      onContinue={onContinue}
      canContinue={inputValue.trim().length > 0}
    >
      <div>
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          placeholder="City, State or ZIP code"
          className="
            w-full px-5 py-5
            text-xl font-medium text-slate-800 text-center
            bg-slate-50 border-2 border-slate-200
            rounded-2xl
            placeholder:text-slate-400
            focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-100
            transition-all duration-200
          "
        />

        <div className="mt-6 flex flex-wrap justify-center gap-2 max-h-48 overflow-y-auto">
          {CITY_OPTIONS.map((city) => (
            <button
              key={city}
              onClick={() => {
                setInputValue(city);
                onChange(city);
              }}
              className={`
                px-3 py-2 text-sm font-medium rounded-full transition-colors
                ${value === city 
                  ? 'bg-primary-500 text-white' 
                  : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
                }
              `}
            >
              {city}
            </button>
          ))}
        </div>
        
        <p className="mt-4 text-center text-xs text-slate-400">
          Don't see your city? Just type it above!
        </p>
      </div>
    </QuestionLayout>
  );
}
