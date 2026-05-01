import { ButtonHTMLAttributes } from 'react';

interface OptionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  selected?: boolean;
  icon?: string;
  description?: string;
  subtitle?: string; // Alias for description
}

export function OptionButton({
  children,
  selected = false,
  icon,
  description,
  subtitle,
  className = '',
  ...props
}: OptionButtonProps) {
  // Use subtitle as alias for description
  const desc = description || subtitle;
  return (
    <button
      className={`
        w-full px-6 py-4 
        rounded-2xl border-2
        font-semibold text-lg
        transition-all duration-200
        active:scale-[0.98]
        ${selected
          ? 'bg-gradient-to-r from-primary-500 to-primary-600 border-primary-500 text-white shadow-button'
          : 'bg-white border-slate-200 text-slate-700 hover:border-primary-400 hover:bg-primary-50'
        }
        ${className}
      `}
      {...props}
    >
      <div className="flex items-center justify-center gap-3">
        {icon && <span className="text-2xl">{icon}</span>}
        <div className="text-center">
          <div>{children}</div>
          {desc && (
            <div className={`text-sm font-normal mt-1 ${selected ? 'text-primary-100' : 'text-slate-500'}`}>
              {desc}
            </div>
          )}
        </div>
      </div>
    </button>
  );
}




