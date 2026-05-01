interface ToggleProps {
  options: [string, string];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function Toggle({ options, value, onChange, className = '' }: ToggleProps) {
  return (
    <div className={`inline-flex bg-slate-100 rounded-full p-1 ${className}`}>
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={`
            px-6 py-2 rounded-full font-semibold text-sm
            transition-all duration-200
            ${value === option
              ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-button'
              : 'text-slate-600 hover:text-slate-900'
            }
          `}
        >
          {option}
        </button>
      ))}
    </div>
  );
}











