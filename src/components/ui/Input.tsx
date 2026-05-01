import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  prefix?: string;
  suffix?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, prefix, suffix, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-slate-600 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {prefix && (
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium text-lg">
              {prefix}
            </span>
          )}
          <input
            ref={ref}
            className={`
              w-full px-4 py-4 
              ${prefix ? 'pl-8' : ''}
              ${suffix ? 'pr-12' : ''}
              text-lg font-medium text-slate-800
              bg-slate-50 border-2 border-slate-200
              rounded-2xl
              placeholder:text-slate-400
              focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-100
              transition-all duration-200
              ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : ''}
              ${className}
            `}
            {...props}
          />
          {suffix && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">
              {suffix}
            </span>
          )}
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';











