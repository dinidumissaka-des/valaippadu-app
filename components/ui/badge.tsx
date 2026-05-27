import React from 'react';
import { View, Text } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'flex-row items-center rounded-full px-2.5 py-1',
  {
    variants: {
      variant: {
        default:     'bg-slate-900',
        secondary:   'bg-slate-100',
        outline:     'border border-slate-200 bg-transparent',
        destructive: 'bg-red-100',
        success:     'bg-green-100',
        warning:     'bg-amber-100',
        live:        'bg-green-50 border border-green-200',
        simulated:   'bg-slate-100 border border-slate-200',
      },
    },
    defaultVariants: { variant: 'secondary' },
  }
);

const textVariants = cva('text-xs font-semibold', {
  variants: {
    variant: {
      default:     'text-white',
      secondary:   'text-slate-700',
      outline:     'text-slate-700',
      destructive: 'text-red-700',
      success:     'text-green-700',
      warning:     'text-amber-700',
      live:        'text-green-700',
      simulated:   'text-slate-500',
    },
  },
  defaultVariants: { variant: 'secondary' },
});

interface BadgeProps extends VariantProps<typeof badgeVariants> {
  className?: string;
  children: React.ReactNode;
}

export function Badge({ variant, className, children }: BadgeProps) {
  return (
    <View className={cn(badgeVariants({ variant }), className)}>
      {typeof children === 'string'
        ? <Text className={textVariants({ variant })}>{children}</Text>
        : children}
    </View>
  );
}
