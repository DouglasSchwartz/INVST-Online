import { Card, OptionButton } from '../ui';
import { RiskTolerance } from '../../types';

interface RiskToleranceScreenProps {
  value: RiskTolerance;
  onSelect: (tolerance: RiskTolerance) => void;
}

const TOLERANCE_OPTIONS: { value: NonNullable<RiskTolerance>; label: string; subtitle: string; icon: string }[] = [
  { 
    value: 'conservative', 
    label: 'Conservative', 
    subtitle: 'I prefer stability over growth. Okay with lower returns for less risk.',
    icon: '🛡️' 
  },
  { 
    value: 'moderate', 
    label: 'Moderate', 
    subtitle: 'I want a balance of growth and stability.',
    icon: '⚖️' 
  },
  { 
    value: 'aggressive', 
    label: 'Aggressive', 
    subtitle: 'I\'m okay with big swings for potentially bigger returns.',
    icon: '🚀' 
  },
];

export function RiskToleranceScreen({ value, onSelect }: RiskToleranceScreenProps) {
  return (
    <div className="flex-1 flex flex-col">
      <Card className="flex-1 flex flex-col">
        <div className="mb-6">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-800 leading-tight">
            How do you feel about risk?
          </h1>
          <p className="mt-3 text-slate-500 text-lg">
            Higher risk can mean higher returns, but also bigger losses.
          </p>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <div className="space-y-4">
            {TOLERANCE_OPTIONS.map((option) => (
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
        
        <p className="mt-4 text-sm text-slate-400 text-center">
          💡 Your actual risk tolerance is also influenced by your earlier answers.
        </p>
      </Card>
    </div>
  );
}
