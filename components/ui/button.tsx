import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'flex-row items-center justify-center rounded-lg px-4 py-3 active:opacity-80',
  {
    variants: {
      variant: {
        default:     'bg-slate-900',
        destructive: 'bg-red-600',
        outline:     'border border-slate-200 bg-white',
        secondary:   'bg-slate-100',
        ghost:       'bg-transparent',
        success:     'bg-green-600',
        warning:     'bg-amber-500',
      },
      size: {
        default: 'h-12',
        sm:      'h-9 px-3',
        lg:      'h-14 px-6',
        icon:    'h-10 w-10 px-0',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
);

const textVariants = cva('font-semibold text-sm tracking-wide', {
  variants: {
    variant: {
      default:     'text-white',
      destructive: 'text-white',
      outline:     'text-slate-900',
      secondary:   'text-slate-900',
      ghost:       'text-slate-700',
      success:     'text-white',
      warning:     'text-white',
    },
  },
  defaultVariants: { variant: 'default' },
});

interface ButtonProps extends VariantProps<typeof buttonVariants> {
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  textClassName?: string;
  children: React.ReactNode;
}

export function Button({ variant, size, onPress, disabled, loading, className, textClassName, children }: ButtonProps) {
  return (
    <TouchableOpacity
      className={cn(buttonVariants({ variant, size }), (disabled || loading) && 'opacity-40', className)}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading && <ActivityIndicator size="small" color="white" className="mr-2" />}
      {typeof children === 'string'
        ? <Text className={cn(textVariants({ variant }), textClassName)}>{children}</Text>
        : children}
    </TouchableOpacity>
  );
}
