import { Card, OptionButton } from '../ui';
import { InvestmentGoal } from '../../types';

interface InvestmentGoalScreenProps {
  value: InvestmentGoal;
  onSelect: (goal: InvestmentGoal) => void;
}

const GOAL_OPTIONS: { value: InvestmentGoal; label: string; subtitle: string; icon: string }[] = [
  { 
    value: 'retirement', 
    label: 'Retirement', 
    subtitle: 'Building long-term wealth for retirement',
    icon: '🏖️' 
  },
  { 
    value: 'home', 
    label: 'Buy a Home', 
    subtitle: 'Saving for a down payment',
    icon: '🏡' 
  },
  { 
    value: 'education', 
    label: 'Education', 
    subtitle: 'Paying for school or training',
    icon: '📚' 
  },
  { 
    value: 'wealth', 
    label: 'Build Wealth', 
    subtitle: 'General investing and growth',
    icon: '📈' 
  },
  { 
    value: 'emergency', 
    label: 'Emergency Fund', 
    subtitle: 'Creating a financial safety net',
    icon: '🛡️' 
  },
];

export function InvestmentGoalScreen({ value, onSelect }: InvestmentGoalScreenProps) {
  return (
    <div className="flex-1 flex flex-col">
      <Card className="flex-1 flex flex-col">
        <div className="mb-6">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-800 leading-tight">
            What's your main investment goal?
          </h1>
          <p className="mt-3 text-slate-500 text-lg">
            This helps us tailor recommendations to your needs.
          </p>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <div className="space-y-3">
            {GOAL_OPTIONS.map((option) => (
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








