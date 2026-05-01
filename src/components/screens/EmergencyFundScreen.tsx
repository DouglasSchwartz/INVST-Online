import { Card, OptionButton } from '../ui';
import { EmergencyFund } from '../../types';

interface EmergencyFundScreenProps {
  value: EmergencyFund;
  onSelect: (fund: EmergencyFund) => void;
}

const FUND_OPTIONS: { value: EmergencyFund; label: string; subtitle: string; icon: string }[] = [
  { 
    value: 'none', 
    label: 'Not Yet', 
    subtitle: 'I\'m still building one',
    icon: '🏗️' 
  },
  { 
    value: 'partial', 
    label: '1-3 Months Saved', 
    subtitle: 'I have some savings set aside',
    icon: '🌤️' 
  },
  { 
    value: 'full', 
    label: '3-6+ Months Saved', 
    subtitle: 'I\'m covered for emergencies',
    icon: '☀️' 
  },
];

export function EmergencyFundScreen({ value, onSelect }: EmergencyFundScreenProps) {
  return (
    <div className="flex-1 flex flex-col">
      <Card className="flex-1 flex flex-col">
        <div className="mb-6">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-800 leading-tight">
            Do you have an emergency fund?
          </h1>
          <p className="mt-3 text-slate-500 text-lg">
            Cash savings to cover 3-6 months of expenses if something unexpected happens.
          </p>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <div className="space-y-4">
            {FUND_OPTIONS.map((option) => (
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
          💡 An emergency fund protects your investments from forced selling.
        </p>
      </Card>
    </div>
  );
}








