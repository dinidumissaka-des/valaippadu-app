import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-md px-1.5 py-0.5 text-xs font-medium',
  {
    variants: {
      variant: {
        default:     'bg-slate-100 text-slate-700',
        live:        'bg-green-100 text-green-700',
        simulated:   'bg-slate-100 text-slate-500',
        success:     'bg-green-100 text-green-700',
        warning:     'bg-amber-100 text-amber-700',
        destructive: 'bg-red-100 text-red-700',
      },
    },
    defaultVariants: { variant: 'default' },
  }
);

interface Props extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: Props) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
