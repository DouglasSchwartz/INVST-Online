import { ReactNode } from 'react';
import { ProgressBar } from '../ui';

interface ScreenLayoutProps {
  children: ReactNode;
  progress?: number;
  showProgress?: boolean;
  showBack?: boolean;
  onBack?: () => void;
}

export function ScreenLayout({
  children,
  progress = 0,
  showProgress = true,
  showBack = false,
  onBack,
}: ScreenLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-100">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {showBack && onBack ? (
              <button
                onClick={onBack}
                className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors"
                aria-label="Go back"
              >
                <svg
                  className="w-6 h-6 text-slate-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            ) : (
              <div className="w-10" />
            )}
            
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">I</span>
              </div>
              <span className="font-display font-bold text-xl text-slate-800">
                INVST
              </span>
            </div>
            
            <div className="w-10" />
          </div>
          
          {showProgress && progress > 0 && (
            <div className="mt-3">
              <ProgressBar progress={progress} />
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex flex-col">
        <div className="max-w-lg mx-auto w-full px-4 py-6 flex-1 flex flex-col">
          {children}
        </div>
      </main>
    </div>
  );
}











