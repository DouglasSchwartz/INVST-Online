import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  animate?: boolean;
}

export function Card({
  children,
  className = '',
  variant = 'default',
  padding = 'lg',
  animate = true,
}: CardProps) {
  const variants = {
    default: 'bg-white shadow-card',
    elevated: 'bg-white shadow-card-hover',
    glass: 'glass shadow-card',
  };

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={`
        rounded-3xl
        ${variants[variant]}
        ${paddings[padding]}
        ${animate ? 'animate-slide-up' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}











