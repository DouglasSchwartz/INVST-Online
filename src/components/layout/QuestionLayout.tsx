import { ReactNode } from 'react';
import { Card, Button } from '../ui';

interface QuestionLayoutProps {
  question: string;
  subtitle?: string;
  children: ReactNode;
  onContinue?: () => void;
  canContinue?: boolean;
  continueText?: string;
  showContinue?: boolean;
}

export function QuestionLayout({
  question,
  subtitle,
  children,
  onContinue,
  canContinue = true,
  continueText = 'Continue',
  showContinue = true,
}: QuestionLayoutProps) {
  return (
    <div className="flex-1 flex flex-col">
      <Card className="flex-1 flex flex-col">
        {/* Question */}
        <div className="mb-8">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-800 leading-tight">
            {question}
          </h1>
          {subtitle && (
            <p className="mt-3 text-slate-500 text-lg">
              {subtitle}
            </p>
          )}
        </div>

        {/* Options/Input */}
        <div className="flex-1 flex flex-col justify-center">
          {children}
        </div>

        {/* Continue Button */}
        {showContinue && onContinue && (
          <div className="mt-8 pt-6 border-t border-slate-100">
            <Button
              onClick={onContinue}
              disabled={!canContinue}
              fullWidth
              size="lg"
            >
              {continueText}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}











