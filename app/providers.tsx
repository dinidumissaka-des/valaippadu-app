'use client';
import { WeatherProvider } from '../context/WeatherContext';
import { BottomNav } from '../components/BottomNav';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WeatherProvider>
      <div style={{ minHeight: '100vh', maxWidth: '32rem', margin: '0 auto', backgroundColor: '#F7F7F7', position: 'relative' }}>
        <main style={{ paddingBottom: 80 }}>{children}</main>
        <BottomNav />
      </div>
    </WeatherProvider>
  );
}
