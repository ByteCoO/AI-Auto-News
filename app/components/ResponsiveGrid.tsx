'use client';

import React from 'react';

interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

export default function ResponsiveGrid({ 
  children, 
  className = '', 
  cols = { default: 1, md: 2, lg: 3 } 
}: ResponsiveGridProps) {
  const gridClasses = [
    'dashboard-grid',
    cols.default === 1 ? 'grid-cols-1' : cols.default === 2 ? 'grid-cols-2' : 'grid-cols-3',
    cols.sm ? `sm:grid-cols-${cols.sm}` : '',
    cols.md ? `md:grid-cols-${cols.md}` : '',
    cols.lg ? `lg:grid-cols-${cols.lg}` : '',
    cols.xl ? `xl:grid-cols-${cols.xl}` : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={gridClasses}>
      {children}
    </div>
  );
}

// Premium Card Component
export function PremiumCard({ 
  children, 
  className = '', 
  hover = true,
  animate = true 
}: { 
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  animate?: boolean;
}) {
  const cardClasses = [
    'card',
    hover ? 'micro-bounce' : '',
    animate ? 'reveal-on-scroll' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses}>
      {children}
    </div>
  );
}

// Premium Button Component
export function PremiumButton({ 
  children, 
  variant = 'primary',
  size = 'md',
  className = '',
  ...props 
}: { 
  children: React.ReactNode;
  variant?: 'primary' | 'accent' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const baseClasses = 'micro-bounce';
  const variantClasses = {
    primary: 'btn-primary',
    accent: 'btn-accent',
    secondary: 'btn-primary opacity-80'
  };
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base'
  };

  const buttonClasses = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className
  ].join(' ');

  return (
    <button className={buttonClasses} {...props}>
      {children}
    </button>
  );
}