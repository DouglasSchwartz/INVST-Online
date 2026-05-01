import { Card } from '../ui';
import { OptionButton } from '../ui';
import { MaritalStatus } from '../../types';

interface MaritalStatusScreenProps {
  value: MaritalStatus;
  onSelect: (status: MaritalStatus) => void;
}

export function MaritalStatusScreen({
  value,
  onSelect,
}: MaritalStatusScreenProps) {
  return (
    <div className="flex-1 flex flex-col">
      <Card className="flex-1 flex flex-col">
        {/* Question */}
        <div className="mb-8">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-800 leading-tight">
            Are you single or married?
          </h1>
          <p className="mt-3 text-slate-500 text-lg">
            This helps us personalize your budget questions.
          </p>
        </div>

        {/* Options */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="space-y-4">
            <OptionButton
              selected={value === 'single'}
              onClick={() => onSelect('single')}
              icon="👤"
            >
              Single
            </OptionButton>

            <OptionButton
              selected={value === 'married'}
              onClick={() => onSelect('married')}
              icon="👫"
            >
              Married
            </OptionButton>
          </div>
        </div>
      </Card>
    </div>
  );
}
