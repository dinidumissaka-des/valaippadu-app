'use client';
import { AlertTriangle } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

export function AlertBanner() {
  const { t } = useLanguage();
  return (
    <div className="mx-4 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5 flex items-center gap-2">
      <AlertTriangle size={16} color="#dc2626" className="shrink-0" />
      <div>
        <p style={{ fontSize: 12, fontFamily: 'var(--font-manrope)', fontWeight: 600, color: '#dc2626', margin: 0 }}>
          {t('do_not_cultivate')}
        </p>
        <p style={{ fontFamily: 'var(--font-noto-tamil)', fontSize: 10, color: '#dc2626', margin: '2px 0 0' }}>
          இன்று பயிரிட வேண்டாம்
        </p>
      </div>
    </div>
  );
}
