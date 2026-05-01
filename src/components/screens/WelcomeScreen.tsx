import { Card, Button } from '../ui';

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="flex-1 flex flex-col justify-center items-center text-center">
      {/* Animated Logo */}
      <div className="mb-8 animate-float">
        <div className="w-24 h-24 bg-gradient-to-br from-primary-400 via-primary-500 to-primary-600 rounded-3xl flex items-center justify-center shadow-xl">
          <span className="text-white font-display font-bold text-4xl">I</span>
        </div>
      </div>

      <Card className="w-full">
        {/* Title */}
        <h1 className="font-display text-4xl font-bold text-slate-800 mb-4">
          INVST
        </h1>
        
        <p className="text-xl text-slate-600 mb-2">
          Budget smarter. Invest better.
        </p>
        
        <p className="text-slate-500 mb-8">
          Answer a few quick questions and we'll create a personalized budget and investment plan for you.
        </p>

        {/* Features */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">📊</span>
            </div>
            <div>
              <p className="font-semibold text-slate-800">Smart Budget</p>
              <p className="text-sm text-slate-500">Personalized spending plan in minutes</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">📈</span>
            </div>
            <div>
              <p className="font-semibold text-slate-800">Investment Allocation</p>
              <p className="text-sm text-slate-500">Simple portfolio recommendations</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">⚡</span>
            </div>
            <div>
              <p className="font-semibold text-slate-800">Under 2 Minutes</p>
              <p className="text-sm text-slate-500">Quick questions, instant results</p>
            </div>
          </div>
        </div>

        <Button onClick={onStart} fullWidth size="lg">
          Get Started
        </Button>

        <p className="mt-4 text-xs text-slate-400">
          Your data stays on your device. No account required.
        </p>
      </Card>
    </div>
  );
}











