'use client';
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-pill font-semibold text-sm transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40 w-full',
  {
    variants: {
      variant: {
        default:     'bg-dark text-white hover:bg-medium active:scale-[0.98]',
        destructive: 'bg-rausch text-white hover:opacity-90 active:scale-[0.98]',
        outline:     'border border-divider text-dark bg-white hover:bg-bg active:scale-[0.98]',
        secondary:   'bg-bg text-dark hover:bg-divider active:scale-[0.98]',
        ghost:       'text-dark hover:bg-bg active:scale-[0.98]',
        success:     'bg-go text-white hover:opacity-90 active:scale-[0.98]',
        warning:     'bg-caution text-white hover:opacity-90 active:scale-[0.98]',
      },
      size: {
        default: 'h-12 px-6 text-sm',
        sm:      'h-9 px-4 text-xs',
        lg:      'h-14 px-8 text-base',
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
