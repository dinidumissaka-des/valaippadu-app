'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, BarChart2, Settings } from 'lucide-react';
import { useWeatherContext } from '../context/WeatherContext';
import { ZONE_COLORS } from '../constants/Colors';

const TABS = [
  { href: '/',            Icon: Home,      label: 'Home' },
  { href: '/forecast',    Icon: Calendar,  label: 'Forecast' },
  { href: '/parameters',  Icon: BarChart2, label: 'Readings' },
  { href: '/coordinator', Icon: Settings,  label: 'Settings' },
];

export function BottomNav() {
  const pathname    = usePathname();
  const { current } = useWeatherContext();
  const activeColor = current ? ZONE_COLORS[current.zone].primary : '#FF385C';

  return (
    <nav
      className="fixed bottom-0 bg-white z-50"
      style={{
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '32rem',
        borderTop: '1px solid #EEEEEE',
        boxShadow: '0 -1px 0 rgba(0,0,0,0.05)',
      }}
    >
      <div className="flex" style={{ height: 68, paddingBottom: 8 }}>
        {TABS.map(({ href, Icon, label }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className="flex-1 flex flex-col items-center justify-center gap-0.5"
              aria-label={label}
            >
              <Icon
                size={22}
                color={active ? activeColor : '#B0B0B0'}
                strokeWidth={active ? 2.5 : 1.8}
              />
              <span style={{
                fontSize: 10,
                fontFamily: 'var(--font-manrope)',
                fontWeight: active ? 600 : 400,
                color: active ? activeColor : '#B0B0B0',
                letterSpacing: '0.1px',
              }}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
