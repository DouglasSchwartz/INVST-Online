import { Card, OptionButton } from '../ui';
import { AgeRange } from '../../types';

interface InvestorAgeScreenProps {
  value: AgeRange;
  onSelect: (age: AgeRange) => void;
}

const AGE_OPTIONS: { value: AgeRange; label: string; icon: string }[] = [
  { value: '18-25', label: '18-25', icon: '🎓' },
  { value: '26-35', label: '26-35', icon: '🚀' },
  { value: '36-45', label: '36-45', icon: '💼' },
  { value: '46-55', label: '46-55', icon: '🏠' },
  { value: '56-65', label: '56-65', icon: '🎯' },
  { value: '65+', label: '65+', icon: '🌴' },
];

export function InvestorAgeScreen({ value, onSelect }: InvestorAgeScreenProps) {
  return (
    <div className="flex-1 flex flex-col">
      <Card className="flex-1 flex flex-col">
        <div className="mb-6">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-800 leading-tight">
            How old are you?
          </h1>
          <p className="mt-3 text-slate-500 text-lg">
            Age is a key factor in determining the right investment mix.
          </p>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <div className="grid grid-cols-2 gap-3">
            {AGE_OPTIONS.map((option) => (
              <OptionButton
                key={option.value}
                selected={value === option.value}
                onClick={() => onSelect(option.value)}
                icon={option.icon}
              >
                {option.label}
              </OptionButton>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}








