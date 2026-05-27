'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, BarChart2, Settings } from 'lucide-react';
import { useWeatherContext } from '../context/WeatherContext';
import { ZONE_COLORS } from '../constants/Colors';

const TABS = [
  { href: '/',            Icon: Home,      label: 'Home' },
  { href: '/forecast',    Icon: Calendar,  label: 'Forecast' },
  { href: '/parameters',  Icon: BarChart2, label: 'Parameters' },
  { href: '/coordinator', Icon: Settings,  label: 'Coordinator' },
];

export function BottomNav() {
  const pathname    = usePathname();
  const { current } = useWeatherContext();
  const activeColor = current ? ZONE_COLORS[current.zone].primary : '#16a34a';

  return (
    <nav
      className="fixed bottom-0 bg-white border-t border-slate-200 z-50"
      style={{ left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '32rem' }}
    >
      <div className="flex" style={{ height: 60 }}>
        {TABS.map(({ href, Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex-1 flex flex-col items-center justify-center"
              aria-label={label}
            >
              <Icon size={22} color={active ? activeColor : '#94a3b8'} />
              {active && (
                <div style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: activeColor, marginTop: 3 }} />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
