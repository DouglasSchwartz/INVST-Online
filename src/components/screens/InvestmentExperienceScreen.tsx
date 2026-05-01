import { Card, OptionButton } from '../ui';
import { InvestmentExperience } from '../../types';

interface InvestmentExperienceScreenProps {
  value: InvestmentExperience;
  onSelect: (experience: InvestmentExperience) => void;
}

const EXPERIENCE_OPTIONS: { value: InvestmentExperience; label: string; subtitle: string; icon: string }[] = [
  { 
    value: 'beginner', 
    label: 'New to Investing', 
    subtitle: 'I\'ve never invested before',
    icon: '🌱' 
  },
  { 
    value: 'some', 
    label: 'Some Experience', 
    subtitle: 'I\'ve invested a little',
    icon: '📊' 
  },
  { 
    value: 'experienced', 
    label: 'Experienced', 
    subtitle: 'I\'ve been investing for years',
    icon: '🎯' 
  },
];

export function InvestmentExperienceScreen({ value, onSelect }: InvestmentExperienceScreenProps) {
  return (
    <div className="flex-1 flex flex-col">
      <Card className="flex-1 flex flex-col">
        <div className="mb-6">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-800 leading-tight">
            What's your investing experience?
          </h1>
          <p className="mt-3 text-slate-500 text-lg">
            No wrong answers — everyone starts somewhere!
          </p>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <div className="space-y-4">
            {EXPERIENCE_OPTIONS.map((option) => (
              <OptionButton
                key={option.value}
                selected={value === option.value}
                onClick={() => onSelect(option.value)}
                icon={option.icon}
                subtitle={option.subtitle}
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








