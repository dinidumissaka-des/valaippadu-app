import React from 'react';
import { View, Text } from 'react-native';
import { cn } from '../../lib/utils';

function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <View className={cn('bg-white rounded-xl border border-slate-200 shadow-sm', className)}>
      {children}
    </View>
  );
}

function CardHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  return <View className={cn('px-5 pt-5 pb-2', className)}>{children}</View>;
}

function CardTitle({ className, children }: { className?: string; children: React.ReactNode }) {
  return <Text className={cn('text-slate-900 font-bold text-base', className)}>{children}</Text>;
}

function CardDescription({ className, children }: { className?: string; children: React.ReactNode }) {
  return <Text className={cn('text-slate-500 text-sm mt-1', className)}>{children}</Text>;
}

function CardContent({ className, children }: { className?: string; children: React.ReactNode }) {
  return <View className={cn('px-5 py-4', className)}>{children}</View>;
}

function CardFooter({ className, children }: { className?: string; children: React.ReactNode }) {
  return <View className={cn('px-5 pb-5 pt-2 flex-row items-center', className)}>{children}</View>;
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
