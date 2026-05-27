'use client';
import { WeatherProvider } from '../context/WeatherContext';
import { BottomNav } from '../components/BottomNav';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WeatherProvider>
      <div className="relative min-h-screen max-w-lg mx-auto bg-slate-50">
        <main className="pb-16">{children}</main>
        <BottomNav />
      </div>
    </WeatherProvider>
  );
}
