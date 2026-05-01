import { Card, OptionButton } from '../ui';
import { TimeHorizon } from '../../types';

interface TimeHorizonScreenProps {
  value: TimeHorizon;
  onSelect: (horizon: TimeHorizon) => void;
}

const HORIZON_OPTIONS: { value: NonNullable<TimeHorizon>; label: string; subtitle: string; icon: string }[] = [
  { 
    value: '0-5', 
    label: 'Less than 5 years', 
    subtitle: 'Short-term goal like a vacation or wedding',
    icon: '⏰' 
  },
  { 
    value: '5-15', 
    label: '5-15 years', 
    subtitle: 'Medium-term goal like a house down payment',
    icon: '📅' 
  },
  { 
    value: '15-30', 
    label: '15-30 years', 
    subtitle: 'Long-term goal like early retirement',
    icon: '🎯' 
  },
  { 
    value: '30+', 
    label: '30+ years', 
    subtitle: 'Very long-term like traditional retirement',
    icon: '🏖️' 
  },
];

export function TimeHorizonScreen({ value, onSelect }: TimeHorizonScreenProps) {
  return (
    <div className="flex-1 flex flex-col">
      <Card className="flex-1 flex flex-col">
        <div className="mb-6">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-800 leading-tight">
            When do you need this money?
          </h1>
          <p className="mt-3 text-slate-500 text-lg">
            Longer time horizons can handle more market volatility.
          </p>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <div className="space-y-3">
            {HORIZON_OPTIONS.map((option) => (
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
