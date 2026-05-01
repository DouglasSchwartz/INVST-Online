import { Card, OptionButton } from '../ui';
import { IncomeType } from '../../types';

interface TaxStatusScreenProps {
  value: IncomeType;
  onSelect: (type: IncomeType) => void;
}

export function TaxStatusScreen({
  value,
  onSelect,
}: TaxStatusScreenProps) {
  return (
    <div className="flex-1 flex flex-col">
      <Card className="flex-1 flex flex-col">
        {/* Question */}
        <div className="mb-8">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-800 leading-tight">
            Are these earnings before taxes or after taxes?
          </h1>
          <p className="mt-3 text-slate-500 text-lg">
            We'll estimate your take-home pay if you entered pre-tax income.
          </p>
        </div>

        {/* Options */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="space-y-4">
            <OptionButton
              selected={value === 'before_tax'}
              onClick={() => onSelect('before_tax')}
              icon="📄"
              description="Gross income, before deductions"
            >
              Before Taxes
            </OptionButton>

            <OptionButton
              selected={value === 'after_tax'}
              onClick={() => onSelect('after_tax')}
              icon="💵"
              description="Take-home pay, what hits your bank"
            >
              After Taxes
            </OptionButton>
          </div>

          {value === 'before_tax' && (
            <div className="mt-6 p-4 bg-primary-50 rounded-xl">
              <p className="text-sm text-primary-700">
                <span className="font-semibold">ℹ️ Note:</span> We'll estimate ~22% for taxes. Your actual rate may vary based on location and deductions.
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
