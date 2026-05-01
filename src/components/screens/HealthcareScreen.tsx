import { Card, OptionButton } from '../ui';
import { HealthcarePayer } from '../../types';

interface HealthcareScreenProps {
  value: HealthcarePayer;
  onSelect: (payer: HealthcarePayer) => void;
}

export function HealthcareScreen({
  value,
  onSelect,
}: HealthcareScreenProps) {
  return (
    <div className="flex-1 flex flex-col">
      <Card className="flex-1 flex flex-col">
        {/* Question */}
        <div className="mb-8">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-800 leading-tight">
            Who pays for your healthcare?
          </h1>
          <p className="mt-3 text-slate-500 text-lg">
            If you pay for your own insurance, we'll factor it into your budget.
          </p>
        </div>

        {/* Options */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="space-y-4">
            <OptionButton
              selected={value === 'self'}
              onClick={() => onSelect('self')}
              icon="🏥"
              description="I pay my own premiums"
            >
              Me
            </OptionButton>

            <OptionButton
              selected={value === 'employer'}
              onClick={() => onSelect('employer')}
              icon="🏢"
              description="Covered through work"
            >
              My Company
            </OptionButton>

            <OptionButton
              selected={value === 'none'}
              onClick={() => onSelect('none')}
              icon="🚫"
              description="I don't have health insurance"
            >
              No Insurance
            </OptionButton>
          </div>
        </div>
      </Card>
    </div>
  );
}
