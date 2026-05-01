import { Card, OptionButton } from '../ui';
import { MarketDropReaction } from '../../types';

interface MarketReactionScreenProps {
  value: MarketDropReaction;
  onSelect: (reaction: MarketDropReaction) => void;
}

const REACTION_OPTIONS: { value: MarketDropReaction; label: string; subtitle: string; icon: string }[] = [
  { 
    value: 'sell', 
    label: 'Sell to Avoid More Losses', 
    subtitle: 'I\'d want to protect what I have left',
    icon: '😰' 
  },
  { 
    value: 'hold', 
    label: 'Hold and Wait It Out', 
    subtitle: 'I\'d stay the course and not panic',
    icon: '😐' 
  },
  { 
    value: 'buy_more', 
    label: 'Buy More at Lower Prices', 
    subtitle: 'I\'d see it as a buying opportunity',
    icon: '😎' 
  },
];

export function MarketReactionScreen({ value, onSelect }: MarketReactionScreenProps) {
  return (
    <div className="flex-1 flex flex-col">
      <Card className="flex-1 flex flex-col">
        <div className="mb-6">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-800 leading-tight">
            If your investments dropped 20%, what would you do?
          </h1>
          <p className="mt-3 text-slate-500 text-lg">
            Be honest — this helps us gauge your true risk tolerance.
          </p>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <div className="space-y-4">
            {REACTION_OPTIONS.map((option) => (
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
          💡 Markets fluctuate. A 20% drop has happened many times in history.
        </p>
      </Card>
    </div>
  );
}








