'use client';
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-xl font-semibold text-sm transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 w-full',
  {
    variants: {
      variant: {
        default:     'bg-slate-900 text-white hover:bg-slate-800',
        destructive: 'bg-red-600 text-white hover:bg-red-700',
        outline:     'border border-slate-200 text-slate-700 bg-white hover:bg-slate-50',
        secondary:   'bg-slate-100 text-slate-900 hover:bg-slate-200',
        ghost:       'text-slate-700 hover:bg-slate-100',
        success:     'bg-green-600 text-white hover:bg-green-700',
        warning:     'bg-amber-500 text-white hover:bg-amber-600',
      },
      size: {
        default: 'h-10 px-4',
        sm:      'h-8 px-3 text-xs',
        lg:      'h-12 px-6',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
);

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

export function Button({ className, variant, size, loading, disabled, children, ...props }: Props) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
